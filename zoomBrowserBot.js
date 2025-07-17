import puppeteer from 'puppeteer';

class ZoomBrowserBot {
  constructor(meetingData, userToken = null) {
    this.meetingId = meetingData.meetingId;
    this.passcode = meetingData.passcode;
    this.meetingLink = meetingData.link;
    this.userToken = userToken; // OAuth token for authenticated user
    this.browser = null;
    this.page = null;
    this.isConnected = false;
    this.botName = userToken ? 'Auto-MP Assistant' : 'LA NUBE BOT';
    this.multipinnedUsers = new Set();
    this.isUserSession = !!userToken;
  }

  async start() {
    try {
      console.log('🤖 Starting browser bot for meeting:', this.meetingId);
      
      // Launch browser in headless mode
      this.browser = await puppeteer.launch({
        headless: true, // Change to false for debugging
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--use-fake-ui-for-media-stream',
          '--use-fake-device-for-media-stream',
          '--allow-running-insecure-content'
        ]
      });

      this.page = await this.browser.newPage();
      
      // Set user agent to avoid detection
      await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      // Allow camera and microphone
      await this.page.evaluateOnNewDocument(() => {
        navigator.mediaDevices.getUserMedia = () =>
          Promise.resolve({
            getTracks: () => [],
            getVideoTracks: () => [],
            getAudioTracks: () => []
          });
      });

      await this.joinMeeting();
      console.log('🤖 Browser bot launched and joining meeting');
      
      return true;
    } catch (error) {
      console.error('❌ Failed to start browser bot:', error);
      console.log(`❌ Browser bot failed to start: ${error.message}`);
      return false;
    }
  }

  async joinMeeting() {
    try {
      if (this.isUserSession && this.userToken) {
        console.log('🔐 Joining as authenticated user with OAuth token');
        await this.joinAsAuthenticatedUser();
      } else {
        console.log('🤖 Joining as bot participant');
        await this.joinAsBot();
      }
      
      // Wait for meeting interface
      await this.page.waitForSelector('.participants-panel, .participant-list, [data-testid="participants"]', { timeout: 60000 });
      
      this.isConnected = true;
      console.log('✅ Successfully joined meeting');
      console.log('✅ Browser bot joined meeting successfully');
      
    } catch (error) {
      console.error('❌ Failed to join meeting:', error);
      throw error;
    }
  }

  async joinAsAuthenticatedUser() {
    try {
      // Method 1: Try to establish session using API call context injection
      await this.page.evaluateOnNewDocument((token) => {
        // Inject token into page context for API calls
        window.ZOOM_ACCESS_TOKEN = token;
        
        // Override fetch to include authorization
        const originalFetch = window.fetch;
        window.fetch = function(url, options = {}) {
          if (url.includes('zoom.us') || url.includes('zoom')) {
            options.headers = options.headers || {};
            options.headers['Authorization'] = `Bearer ${token}`;
          }
          return originalFetch(url, options);
        };
      }, this.userToken);

      // Navigate directly to meeting
      console.log('🔗 Navigating to meeting as authenticated user:', this.meetingLink);
      await this.page.goto(this.meetingLink, { waitUntil: 'networkidle2', timeout: 60000 });
      
      // Try multiple selectors for join button
      const joinSelectors = [
        'button[contains(text(), "Join")]',
        'button[aria-label*="join"]', 
        '#joinBtn',
        '[data-testid="join-btn"]',
        '.join-meeting-btn',
        'button[class*="join"]',
        'a[href*="launch"]'
      ];
      
      let joinButton = null;
      for (const selector of joinSelectors) {
        try {
          joinButton = await this.page.waitForSelector(selector, { timeout: 5000 });
          if (joinButton) {
            console.log(`✅ Found join button with selector: ${selector}`);
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }
      
      if (joinButton) {
        await joinButton.click();
        console.log('🔗 Clicked join button as authenticated user');
      } else {
        console.log('⚠️ No join button found, may already be in meeting or need manual intervention');
      }
      
    } catch (error) {
      console.error('❌ Error joining as authenticated user:', error);
      // Fallback to bot mode
      console.log('🔄 Falling back to bot join mode');
      await this.joinAsBot();
    }
  }

  async joinAsBot() {
    console.log('🔗 Navigating to meeting:', this.meetingLink);
    await this.page.goto(this.meetingLink, { waitUntil: 'networkidle2' });
    
    // Wait for Zoom web client to load
    await this.page.waitForSelector('input[placeholder*="name"], input[aria-label*="name"]', { timeout: 30000 });
    
    // Enter bot name
    await this.page.type('input[placeholder*="name"], input[aria-label*="name"]', this.botName);
    
    // Enter passcode if required
    if (this.passcode && this.passcode !== 'No passcode required') {
      const passcodeInput = await this.page.$('input[placeholder*="passcode"], input[aria-label*="passcode"]');
      if (passcodeInput) {
        await passcodeInput.type(this.passcode);
      }
    }
    
    // Join meeting
    await this.page.click('button[contains(text(), "Join")], button[aria-label*="join"]');
  }

  async multipinUser(userName) {
    try {
      if (this.multipinnedUsers.has(userName)) {
        return 'ALREADY_PINNED';
      }

      console.log(`🎯 Attempting to multipin user: ${userName}`);
      
      // Find the user's video element
      const userVideoSelector = `[title*="${userName}"], [aria-label*="${userName}"], [data-testid*="${userName}"]`;
      const videoElement = await this.page.$(userVideoSelector);
      
      if (!videoElement) {
        console.log(`❌ Could not find video for user: ${userName}`);
        return 'USER_NOT_FOUND';
      }

      // Right-click on user's video
      await videoElement.click({ button: 'right' });
      
      // Wait for context menu
      await this.page.waitForSelector('.context-menu, [role="menu"]', { timeout: 5000 });
      
      // Click on "Pin" or "Multi-pin" option
      const pinOption = await this.page.$('li:contains("Pin"), li:contains("Multi-pin"), [role="menuitem"]:contains("Pin")');
      if (pinOption) {
        await pinOption.click();
        
        this.multipinnedUsers.add(userName);
        console.log(`✅ Successfully multipinned: ${userName}`);
        console.log(`🎯 MULTIPIN ACTIVATED: ${userName} - Browser bot action`);
        
        return 'MULTIPIN_GRANTED';
      } else {
        console.log(`❌ Pin option not found for: ${userName}`);
        return 'PIN_OPTION_NOT_FOUND';
      }
      
    } catch (error) {
      console.error(`❌ Failed to multipin ${userName}:`, error);
      return 'ERROR';
    }
  }

  async unpinUser(userName) {
    try {
      if (!this.multipinnedUsers.has(userName)) {
        return 'NOT_PINNED';
      }

      console.log(`🔄 Removing multipin for user: ${userName}`);
      
      // Find pinned video and right-click
      const pinnedVideoSelector = `.pinned-video[title*="${userName}"], .pinned[aria-label*="${userName}"]`;
      const pinnedElement = await this.page.$(pinnedVideoSelector);
      
      if (pinnedElement) {
        await pinnedElement.click({ button: 'right' });
        await this.page.waitForSelector('.context-menu, [role="menu"]', { timeout: 5000 });
        
        const unpinOption = await this.page.$('li:contains("Unpin"), [role="menuitem"]:contains("Unpin")');
        if (unpinOption) {
          await unpinOption.click();
          
          this.multipinnedUsers.delete(userName);
          console.log(`✅ Successfully unpinned: ${userName}`);
          console.log(`🔄 MULTIPIN REMOVED: ${userName} - Browser bot action`);
          
          return 'MULTIPIN_REMOVED';
        }
      }
      
      return 'UNPIN_FAILED';
      
    } catch (error) {
      console.error(`❌ Failed to unpin ${userName}:`, error);
      return 'ERROR';
    }
  }

  async getMultipinnedUsers() {
    return Array.from(this.multipinnedUsers);
  }

  async waitForCohostStatus(requestCallback = null) {
    try {
      console.log('⏳ Waiting for co-host promotion...');
      
      // Send promotion request after 10 seconds
      setTimeout(async () => {
        if (requestCallback) {
          await requestCallback();
        }
      }, 10000);
      
      // Wait for co-host badge/indicator
      await this.page.waitForSelector('.cohost-indicator, [data-testid*="cohost"], .host-controls', { timeout: 300000 }); // 5 minutes
      
      console.log('👑 Bot promoted to co-host! Multipin automation ready.');
      console.log('👑 Browser bot promoted to co-host - multipin automation active');
      
      return true;
    } catch (error) {
      console.log('⚠️ Co-host promotion timeout - continuing without co-host status');
      return false;
    }
  }

  async checkIfAlreadyCohost() {
    try {
      // Check if already has co-host privileges
      const cohostIndicators = await this.page.$$('.cohost-indicator, [data-testid*="cohost"], .host-controls');
      return cohostIndicators.length > 0;
    } catch (error) {
      return false;
    }
  }

  async cleanup() {
    try {
      if (this.browser) {
        await this.browser.close();
        this.isConnected = false;
        console.log('🔚 Browser bot disconnected');
        console.log('🔚 Browser bot session ended');
      }
    } catch (error) {
      console.error('❌ Error during cleanup:', error);
    }
  }

  isReady() {
    return this.isConnected && this.page;
  }
}

export { ZoomBrowserBot };