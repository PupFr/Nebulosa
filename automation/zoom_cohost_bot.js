/**
 * Zoom Co-Host Automation Bot
 * 
 * This bot automatically joins Zoom meetings using OAuth authentication,
 * requests co-host status when needed, and manages multipin functionality
 * for participants who raise their hands.
 * 
 * Features:
 * - OAuth authentication (no manual login)
 * - Automatic co-host status request
 * - Hand raise monitoring every 10 seconds
 * - Automatic multipin/unpin of non-host participants
 * - Comprehensive logging and error handling
 */

// Handle puppeteer import gracefully
let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch (error) {
  console.log('⚠️ Puppeteer not installed. Run "npm install puppeteer" to use the bot.');
  puppeteer = null;
}

const { getValidAccessToken } = require('./zoom_oauth_utils');

/**
 * Zoom Web UI Selectors
 * 
 * ⚠️ IMPORTANT: These selectors may change when Zoom updates their web interface.
 * Update these selectors if the automation stops working after Zoom UI changes.
 */
const ZOOM_SELECTORS = {
  // Authentication and joining
  NAME_INPUT: 'input[placeholder*="name" i], input[aria-label*="name" i], #inputname',
  PASSCODE_INPUT: 'input[placeholder*="passcode" i], input[aria-label*="passcode" i], #inputpasscode',
  JOIN_BUTTON: 'button:has-text("Join"), button[aria-label*="join" i], #joinBtn, .join-meeting-btn',
  
  // Meeting interface
  PARTICIPANTS_PANEL: '.participants-panel, .participant-list, [data-testid="participants"], .participants-list-container',
  PARTICIPANTS_BUTTON: 'button[aria-label*="participants" i], [data-testid="participants-button"], .participants-button',
  PARTICIPANTS_LIST: '.participants-list, [data-testid="participants-list"], .participant-list-content',
  
  // Participant elements
  PARTICIPANT_ITEM: '.participant-item, [data-testid="participant-item"], .participant-list-item',
  HAND_RAISED_INDICATOR: '.hand-raised, [data-testid="hand-raised"], .raised-hand-icon, [title*="hand" i]',
  PARTICIPANT_NAME: '.participant-name, [data-testid="participant-name"], .name-label',
  PARTICIPANT_VIDEO: '.participant-video, [data-testid="participant-video"], .video-container',
  
  // Co-host elements
  COHOST_INDICATOR: '.cohost-indicator, [data-testid*="cohost"], .host-controls, [title*="co-host" i]',
  HOST_CONTROLS: '.host-controls, [data-testid="host-controls"], .meeting-controls-host',
  MORE_BUTTON: 'button[aria-label*="more" i], [data-testid="more-button"], .more-button',
  
  // Chat elements
  CHAT_BUTTON: 'button[aria-label*="chat" i], [data-testid="chat-button"], .chat-button',
  CHAT_INPUT: '.chat-input, [data-testid="chat-input"], textarea[placeholder*="message" i]',
  CHAT_SEND_BUTTON: 'button[aria-label*="send" i], [data-testid="send-button"], .send-button',
  
  // Context menu and actions
  CONTEXT_MENU: '.context-menu, [role="menu"], .dropdown-menu, .participant-menu',
  PIN_OPTION: 'li:has-text("Pin"), li:has-text("Multi-pin"), [role="menuitem"]:has-text("Pin"), [data-testid*="pin"]',
  UNPIN_OPTION: 'li:has-text("Unpin"), [role="menuitem"]:has-text("Unpin"), [data-testid*="unpin"]',
  
  // Pinned videos
  PINNED_VIDEO: '.pinned-video, [data-testid="pinned-video"], .video-pinned, .multi-pinned',
  
  // Loading and status
  LOADING_INDICATOR: '.loading, [data-testid="loading"], .spinner, .loading-spinner',
  CONNECTION_STATUS: '.connection-status, [data-testid="connection-status"], .network-status'
};

class ZoomCohostBot {
  constructor(meetingUrl, botName = 'Co-Host Assistant Bot') {
    this.meetingUrl = meetingUrl;
    this.botName = botName;
    
    // Browser and page instances
    this.browser = null;
    this.page = null;
    
    // Bot state
    this.isConnected = false;
    this.isCohost = false;
    this.accessToken = null;
    this.monitoringInterval = null;
    
    // Participant tracking
    this.raisedHandUsers = new Set();
    this.pinnedUsers = new Set();
    this.allParticipants = new Map(); // userId -> participant data
    
    // Configuration
    this.MONITORING_INTERVAL = 10000; // 10 seconds
    this.REQUEST_COHOST_DELAY = 15000; // Wait 15 seconds before requesting co-host
    this.MAX_RETRY_ATTEMPTS = 3;
    
    console.log(`🤖 Zoom Co-Host Bot initialized for meeting: ${meetingUrl}`);
  }

  /**
   * Start the bot and join the meeting
   */
  async start() {
    try {
      console.log('🚀 Starting Zoom Co-Host Bot...');
      
      // Get OAuth access token
      console.log('🔐 Obtaining OAuth access token...');
      this.accessToken = await getValidAccessToken();
      
      if (!this.accessToken) {
        throw new Error('Failed to obtain valid OAuth access token. Please complete OAuth authentication first.');
      }
      
      // Launch browser
      console.log('🌐 Launching browser...');
      await this.launchBrowser();
      
      // Join meeting
      console.log('🔗 Joining meeting...');
      await this.joinMeeting();
      
      // Wait for meeting interface to load
      console.log('⏳ Waiting for meeting interface to load...');
      await this.waitForMeetingInterface();
      
      // Check if already co-host
      console.log('👑 Checking co-host status...');
      const alreadyCohost = await this.checkCohostStatus();
      
      if (alreadyCohost) {
        console.log('✅ Already have co-host privileges!');
        this.isCohost = true;
      } else {
        console.log('📝 Not co-host, will request privileges...');
        // Start monitoring and request co-host after delay
        setTimeout(async () => {
          await this.requestCohostStatus();
        }, this.REQUEST_COHOST_DELAY);
      }
      
      // Start participant monitoring
      console.log('👥 Starting participant monitoring...');
      await this.startMonitoring();
      
      this.isConnected = true;
      console.log('🎉 Zoom Co-Host Bot successfully started and monitoring!');
      
      return true;
      
    } catch (error) {
      console.error('❌ Failed to start Zoom Co-Host Bot:', error);
      await this.cleanup();
      throw error;
    }
  }

  /**
   * Launch Puppeteer browser with appropriate settings
   */
  async launchBrowser() {
    if (!puppeteer) {
      throw new Error('Puppeteer is not installed. Run "npm install puppeteer" to use this bot.');
    }
    
    this.browser = await puppeteer.launch({
      headless: true, // Set to false for debugging
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--use-fake-ui-for-media-stream',
        '--use-fake-device-for-media-stream',
        '--allow-running-insecure-content',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    });

    this.page = await this.browser.newPage();
    
    // Set user agent
    await this.page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );
    
    // Configure media permissions
    await this.page.evaluateOnNewDocument(() => {
      // Mock media devices for headless operation
      navigator.mediaDevices.getUserMedia = () =>
        Promise.resolve({
          getTracks: () => [],
          getVideoTracks: () => [],
          getAudioTracks: () => []
        });
    });
    
    // Inject OAuth token for authenticated requests
    await this.page.evaluateOnNewDocument((token) => {
      window.ZOOM_ACCESS_TOKEN = token;
      
      // Override fetch to include authorization header
      const originalFetch = window.fetch;
      window.fetch = function(url, options = {}) {
        if (url.includes('zoom.us') || url.includes('zoom')) {
          options.headers = options.headers || {};
          options.headers['Authorization'] = `Bearer ${token}`;
        }
        return originalFetch(url, options);
      };
    }, this.accessToken);
    
    console.log('✅ Browser launched and configured');
  }

  /**
   * Join the Zoom meeting using OAuth authentication
   */
  async joinMeeting() {
    console.log(`🔗 Navigating to meeting: ${this.meetingUrl}`);
    
    try {
      // Navigate to meeting URL
      await this.page.goto(this.meetingUrl, { 
        waitUntil: 'networkidle2', 
        timeout: 60000 
      });
      
      // Try to join directly with OAuth (may skip manual entry)
      const directJoinSuccess = await this.attemptDirectJoin();
      
      if (!directJoinSuccess) {
        // Fall back to manual joining
        console.log('🔄 Attempting manual join process...');
        await this.manualJoinProcess();
      }
      
      console.log('✅ Successfully joined meeting');
      
    } catch (error) {
      console.error('❌ Failed to join meeting:', error);
      throw error;
    }
  }

  /**
   * Attempt direct join using OAuth token (may skip name entry)
   */
  async attemptDirectJoin() {
    try {
      // Wait briefly to see if we're automatically joined
      await this.page.waitForTimeout(3000);
      
      // Check if already in meeting interface
      const meetingInterface = await this.page.$(ZOOM_SELECTORS.PARTICIPANTS_PANEL);
      if (meetingInterface) {
        console.log('✅ Directly joined with OAuth authentication');
        return true;
      }
      
      // Look for join button and click it
      const joinButton = await this.page.$(ZOOM_SELECTORS.JOIN_BUTTON);
      if (joinButton) {
        await joinButton.click();
        console.log('🔗 Clicked join button');
        
        // Wait to see if we joined successfully
        await this.page.waitForTimeout(5000);
        const postJoinInterface = await this.page.$(ZOOM_SELECTORS.PARTICIPANTS_PANEL);
        
        return !!postJoinInterface;
      }
      
      return false;
      
    } catch (error) {
      console.log('ℹ️ Direct join not available, proceeding with manual join');
      return false;
    }
  }

  /**
   * Manual join process (enter name, passcode, etc.)
   */
  async manualJoinProcess() {
    // Wait for join interface
    await this.page.waitForSelector(ZOOM_SELECTORS.NAME_INPUT, { timeout: 30000 });
    
    // Enter bot name
    console.log(`📝 Entering bot name: ${this.botName}`);
    const nameInput = await this.page.$(ZOOM_SELECTORS.NAME_INPUT);
    if (nameInput) {
      await nameInput.click({ clickCount: 3 }); // Select all existing text
      await nameInput.type(this.botName);
    }
    
    // Check for passcode requirement (implementation depends on meeting URL format)
    const passcodeInput = await this.page.$(ZOOM_SELECTORS.PASSCODE_INPUT);
    if (passcodeInput) {
      console.log('🔐 Passcode input detected - may require manual entry');
      // If passcode is in URL or available, enter it
      // For now, leave empty as OAuth should handle authentication
    }
    
    // Join meeting
    const joinButton = await this.page.$(ZOOM_SELECTORS.JOIN_BUTTON);
    if (joinButton) {
      await joinButton.click();
      console.log('🔗 Clicked join meeting button');
    } else {
      throw new Error('Join button not found');
    }
  }

  /**
   * Wait for meeting interface to fully load
   */
  async waitForMeetingInterface() {
    try {
      // Wait for participants panel to be available
      await this.page.waitForSelector(ZOOM_SELECTORS.PARTICIPANTS_PANEL, { 
        timeout: 60000 
      });
      
      // Additional wait for interface to stabilize
      await this.page.waitForTimeout(5000);
      
      console.log('✅ Meeting interface loaded');
      
    } catch (error) {
      console.error('❌ Meeting interface failed to load:', error);
      throw error;
    }
  }

  /**
   * Check if bot currently has co-host status
   */
  async checkCohostStatus() {
    try {
      const cohostIndicators = await this.page.$$(ZOOM_SELECTORS.COHOST_INDICATOR);
      const hostControls = await this.page.$$(ZOOM_SELECTORS.HOST_CONTROLS);
      
      return cohostIndicators.length > 0 || hostControls.length > 0;
      
    } catch (error) {
      console.log('⚠️ Could not determine co-host status:', error);
      return false;
    }
  }

  /**
   * Request co-host status from meeting host via chat
   */
  async requestCohostStatus() {
    try {
      console.log('📢 Requesting co-host status from meeting host...');
      
      const message = `Hello! I'm the Co-Host Assistant Bot. Could you please grant me co-host privileges so I can help manage participant multipin for raised hands? Thank you!`;
      
      const chatSent = await this.sendChatMessage(message);
      
      if (chatSent) {
        console.log('✅ Co-host request sent via chat');
        
        // Start checking for co-host promotion
        await this.waitForCohostPromotion();
      } else {
        console.log('⚠️ Could not send chat message, co-host request failed');
      }
      
    } catch (error) {
      console.error('❌ Failed to request co-host status:', error);
    }
  }

  /**
   * Send a message in meeting chat
   */
  async sendChatMessage(message) {
    try {
      // Open chat panel
      const chatButton = await this.page.$(ZOOM_SELECTORS.CHAT_BUTTON);
      if (chatButton) {
        await chatButton.click();
        await this.page.waitForTimeout(2000);
      }
      
      // Find chat input and send message
      const chatInput = await this.page.$(ZOOM_SELECTORS.CHAT_INPUT);
      if (chatInput) {
        await chatInput.type(message);
        
        // Send message
        const sendButton = await this.page.$(ZOOM_SELECTORS.CHAT_SEND_BUTTON);
        if (sendButton) {
          await sendButton.click();
          console.log('💬 Chat message sent successfully');
          return true;
        } else {
          // Try pressing Enter if no send button
          await chatInput.press('Enter');
          console.log('💬 Chat message sent via Enter key');
          return true;
        }
      }
      
      return false;
      
    } catch (error) {
      console.error('❌ Failed to send chat message:', error);
      return false;
    }
  }

  /**
   * Wait for co-host promotion (monitor for co-host indicators)
   */
  async waitForCohostPromotion() {
    const maxWaitTime = 300000; // 5 minutes
    const checkInterval = 10000; // 10 seconds
    const maxChecks = maxWaitTime / checkInterval;
    
    console.log('⏳ Waiting for co-host promotion (up to 5 minutes)...');
    
    for (let i = 0; i < maxChecks; i++) {
      await this.page.waitForTimeout(checkInterval);
      
      const isCohost = await this.checkCohostStatus();
      
      if (isCohost) {
        this.isCohost = true;
        console.log('🎉 Successfully promoted to co-host!');
        return true;
      }
      
      console.log(`⏳ Still waiting for co-host promotion... (${i + 1}/${maxChecks})`);
    }
    
    console.log('⚠️ Co-host promotion timeout - continuing without co-host privileges');
    return false;
  }

  /**
   * Start monitoring participants for raised hands
   */
  async startMonitoring() {
    console.log(`👥 Starting participant monitoring (every ${this.MONITORING_INTERVAL / 1000} seconds)...`);
    
    // Initial scan
    await this.scanParticipants();
    
    // Set up recurring monitoring
    this.monitoringInterval = setInterval(async () => {
      try {
        await this.scanParticipants();
      } catch (error) {
        console.error('❌ Error during participant monitoring:', error);
      }
    }, this.MONITORING_INTERVAL);
  }

  /**
   * Scan participants and manage multipin based on raised hands
   */
  async scanParticipants() {
    try {
      console.log('🔍 Scanning participants...');
      
      // Ensure participants panel is open
      await this.ensureParticipantsPanelOpen();
      
      // Get current participants
      const participants = await this.getCurrentParticipants();
      
      if (participants.length === 0) {
        console.log('ℹ️ No participants found');
        return;
      }
      
      console.log(`👥 Found ${participants.length} participants`);
      
      // Process each participant
      for (const participant of participants) {
        await this.processParticipant(participant);
      }
      
      // Clean up users who are no longer in meeting
      await this.cleanupMissingParticipants(participants);
      
    } catch (error) {
      console.error('❌ Error scanning participants:', error);
    }
  }

  /**
   * Ensure participants panel is open and visible
   */
  async ensureParticipantsPanelOpen() {
    try {
      // Check if participants panel is visible
      const panel = await this.page.$(ZOOM_SELECTORS.PARTICIPANTS_PANEL);
      
      if (!panel) {
        // Try to open participants panel
        const participantsButton = await this.page.$(ZOOM_SELECTORS.PARTICIPANTS_BUTTON);
        if (participantsButton) {
          await participantsButton.click();
          await this.page.waitForTimeout(2000);
        }
      }
    } catch (error) {
      console.log('⚠️ Could not ensure participants panel is open:', error);
    }
  }

  /**
   * Get current participants from the meeting
   */
  async getCurrentParticipants() {
    try {
      const participantElements = await this.page.$$(ZOOM_SELECTORS.PARTICIPANT_ITEM);
      const participants = [];
      
      for (const element of participantElements) {
        try {
          // Get participant name
          const nameElement = await element.$(ZOOM_SELECTORS.PARTICIPANT_NAME);
          const name = nameElement ? await nameElement.innerText() : 'Unknown';
          
          // Check if hand is raised
          const handRaisedElement = await element.$(ZOOM_SELECTORS.HAND_RAISED_INDICATOR);
          const hasRaisedHand = !!handRaisedElement;
          
          // Check if user is host/co-host (these users should not be pinned)
          const isHostOrCohost = await this.isUserHostOrCohost(element);
          
          participants.push({
            element,
            name: name.trim(),
            hasRaisedHand,
            isHostOrCohost
          });
          
        } catch (error) {
          console.log('⚠️ Error processing participant element:', error);
        }
      }
      
      return participants;
      
    } catch (error) {
      console.error('❌ Error getting participants:', error);
      return [];
    }
  }

  /**
   * Check if a participant is host or co-host
   */
  async isUserHostOrCohost(participantElement) {
    try {
      // Look for host/co-host indicators in the participant element
      const hostIndicators = await participantElement.$$('.host, .cohost, [title*="host" i], [aria-label*="host" i]');
      return hostIndicators.length > 0;
    } catch (error) {
      return false; // Assume not host/cohost if we can't determine
    }
  }

  /**
   * Process individual participant for multipin management
   */
  async processParticipant(participant) {
    const { name, hasRaisedHand, isHostOrCohost } = participant;
    
    // Skip hosts and co-hosts
    if (isHostOrCohost) {
      console.log(`👑 Skipping host/co-host: ${name}`);
      return;
    }
    
    // Check if we have co-host privileges for pinning
    if (!this.isCohost) {
      if (hasRaisedHand) {
        console.log(`🙋 ${name} has raised hand, but bot lacks co-host privileges for pinning`);
      }
      return;
    }
    
    const wasRaisedBefore = this.raisedHandUsers.has(name);
    const isPinned = this.pinnedUsers.has(name);
    
    if (hasRaisedHand && !wasRaisedBefore) {
      // New raised hand
      console.log(`🙋 NEW RAISED HAND: ${name}`);
      this.raisedHandUsers.add(name);
      
      if (!isPinned) {
        await this.multipinUser(participant);
      }
      
    } else if (!hasRaisedHand && wasRaisedBefore) {
      // Hand lowered
      console.log(`👋 HAND LOWERED: ${name}`);
      this.raisedHandUsers.delete(name);
      
      if (isPinned) {
        await this.unpinUser(participant);
      }
      
    } else if (hasRaisedHand && wasRaisedBefore) {
      // Hand still raised
      console.log(`🙋 Hand still raised: ${name} (already pinned: ${isPinned})`);
      
      if (!isPinned) {
        // Re-attempt pinning if it failed before
        await this.multipinUser(participant);
      }
    }
  }

  /**
   * Multipin a user's video
   */
  async multipinUser(participant) {
    const { name, element } = participant;
    
    try {
      console.log(`📌 Attempting to multipin: ${name}`);
      
      // Find the user's video element for right-click
      const videoElement = await element.$(ZOOM_SELECTORS.PARTICIPANT_VIDEO) || element;
      
      // Right-click to open context menu
      await videoElement.click({ button: 'right' });
      await this.page.waitForTimeout(1000);
      
      // Wait for context menu
      const contextMenu = await this.page.waitForSelector(ZOOM_SELECTORS.CONTEXT_MENU, { 
        timeout: 5000 
      });
      
      if (contextMenu) {
        // Look for pin option
        const pinOption = await this.page.$(ZOOM_SELECTORS.PIN_OPTION);
        
        if (pinOption) {
          await pinOption.click();
          await this.page.waitForTimeout(1000);
          
          this.pinnedUsers.add(name);
          console.log(`✅ Successfully multipinned: ${name}`);
          
        } else {
          console.log(`⚠️ Pin option not found for: ${name}`);
        }
      } else {
        console.log(`⚠️ Context menu not found for: ${name}`);
      }
      
    } catch (error) {
      console.error(`❌ Failed to multipin ${name}:`, error);
    }
  }

  /**
   * Unpin a user's video
   */
  async unpinUser(participant) {
    const { name } = participant;
    
    try {
      console.log(`🔄 Attempting to unpin: ${name}`);
      
      // Find pinned video element
      const pinnedElements = await this.page.$$(ZOOM_SELECTORS.PINNED_VIDEO);
      
      let targetPinnedElement = null;
      
      // Look for the specific user's pinned video
      for (const pinnedElement of pinnedElements) {
        try {
          const titleText = await pinnedElement.getAttribute('title') || '';
          const ariaLabel = await pinnedElement.getAttribute('aria-label') || '';
          
          if (titleText.includes(name) || ariaLabel.includes(name)) {
            targetPinnedElement = pinnedElement;
            break;
          }
        } catch (error) {
          // Continue searching
        }
      }
      
      if (!targetPinnedElement && pinnedElements.length > 0) {
        // If we can't find specific user, try the first pinned element
        // This might unpin the wrong user, but it's better than no action
        console.log(`⚠️ Could not find specific pinned video for ${name}, using first available`);
        targetPinnedElement = pinnedElements[0];
      }
      
      if (targetPinnedElement) {
        // Right-click on pinned video
        await targetPinnedElement.click({ button: 'right' });
        await this.page.waitForTimeout(1000);
        
        // Wait for context menu
        const contextMenu = await this.page.waitForSelector(ZOOM_SELECTORS.CONTEXT_MENU, { 
          timeout: 5000 
        });
        
        if (contextMenu) {
          // Look for unpin option
          const unpinOption = await this.page.$(ZOOM_SELECTORS.UNPIN_OPTION);
          
          if (unpinOption) {
            await unpinOption.click();
            await this.page.waitForTimeout(1000);
            
            this.pinnedUsers.delete(name);
            console.log(`✅ Successfully unpinned: ${name}`);
            
          } else {
            console.log(`⚠️ Unpin option not found for: ${name}`);
          }
        }
      } else {
        console.log(`⚠️ Could not find pinned video to unpin for: ${name}`);
      }
      
    } catch (error) {
      console.error(`❌ Failed to unpin ${name}:`, error);
    }
  }

  /**
   * Clean up tracking for participants who left the meeting
   */
  async cleanupMissingParticipants(currentParticipants) {
    const currentNames = new Set(currentParticipants.map(p => p.name));
    
    // Clean up raised hand tracking
    for (const name of this.raisedHandUsers) {
      if (!currentNames.has(name)) {
        this.raisedHandUsers.delete(name);
        console.log(`🚪 Removed ${name} from raised hand tracking (left meeting)`);
      }
    }
    
    // Clean up pinned user tracking
    for (const name of this.pinnedUsers) {
      if (!currentNames.has(name)) {
        this.pinnedUsers.delete(name);
        console.log(`🚪 Removed ${name} from pinned user tracking (left meeting)`);
      }
    }
  }

  /**
   * Get current bot status and statistics
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      isCohost: this.isCohost,
      raisedHandUsers: Array.from(this.raisedHandUsers),
      pinnedUsers: Array.from(this.pinnedUsers),
      monitoringActive: !!this.monitoringInterval,
      meetingUrl: this.meetingUrl,
      botName: this.botName
    };
  }

  /**
   * Stop monitoring and clean up resources
   */
  async stop() {
    console.log('🛑 Stopping Zoom Co-Host Bot...');
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('✅ Monitoring stopped');
    }
    
    await this.cleanup();
    console.log('✅ Zoom Co-Host Bot stopped');
  }

  /**
   * Clean up browser resources
   */
  async cleanup() {
    try {
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
        this.page = null;
        console.log('🔚 Browser session ended');
      }
      
      this.isConnected = false;
      this.isCohost = false;
      
    } catch (error) {
      console.error('❌ Error during cleanup:', error);
    }
  }
}

// Export the class for use in other modules
module.exports = { ZoomCohostBot, ZOOM_SELECTORS };

/**
 * Example Usage:
 * 
 * const { ZoomCohostBot } = require('./zoom_cohost_bot');
 * 
 * async function runBot() {
 *   const bot = new ZoomCohostBot(
 *     'https://zoom.us/j/1234567890?pwd=abcd1234',
 *     'My Co-Host Assistant'
 *   );
 *   
 *   try {
 *     await bot.start();
 *     
 *     // Bot will run until stopped
 *     // To stop: await bot.stop();
 *     
 *   } catch (error) {
 *     console.error('Bot failed:', error);
 *   }
 * }
 * 
 * runBot();
 */

/**
 * SELECTOR UPDATE GUIDE:
 * 
 * When Zoom updates their web interface and selectors stop working:
 * 
 * 1. Set browser headless: false in launchBrowser() for visual debugging
 * 2. Use browser developer tools to inspect the new element structure
 * 3. Update the corresponding selectors in ZOOM_SELECTORS object
 * 4. Test with headless: true again
 * 
 * Common selector patterns to look for:
 * - data-testid attributes (most stable)
 * - aria-label attributes (accessibility focused)
 * - class names (may change frequently)
 * - element text content (language dependent)
 * 
 * Priority order: data-testid > aria-label > unique class names > text content
 */