/**
 * Example Usage of Zoom Co-Host Bot
 * 
 * This file demonstrates how to use the Zoom Co-Host Bot
 * for automated meeting management.
 */

const { ZoomCohostBot } = require('./automation/zoom_cohost_bot');

async function runCohostBot() {
  // Example meeting URL (replace with actual meeting URL)
  const meetingUrl = 'https://zoom.us/j/1234567890?pwd=abcd1234';
  const botName = 'Co-Host Assistant Bot';
  
  // Create bot instance
  const bot = new ZoomCohostBot(meetingUrl, botName);
  
  try {
    console.log('🚀 Starting Zoom Co-Host Bot...');
    
    // Start the bot
    await bot.start();
    
    // Bot will run continuously, monitoring participants
    console.log('✅ Bot is now running and monitoring participants!');
    
    // Check status periodically
    setInterval(() => {
      const status = bot.getStatus();
      console.log('📊 Bot Status:', {
        connected: status.isConnected,
        cohost: status.isCohost,
        raisedHands: status.raisedHandUsers.length,
        pinnedUsers: status.pinnedUsers.length
      });
    }, 30000); // Every 30 seconds
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down bot...');
      await bot.stop();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      console.log('\n🛑 Shutting down bot...');
      await bot.stop();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Bot failed to start:', error);
    
    // Cleanup on error
    await bot.stop();
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  runCohostBot();
}

module.exports = { runCohostBot };

/**
 * SETUP INSTRUCTIONS:
 * 
 * 1. Install dependencies:
 *    npm install puppeteer
 * 
 * 2. Set up OAuth in automation/zoom_oauth_utils.js:
 *    - Implement getStoredAccessToken()
 *    - Implement storeOAuthTokens()
 *    - Implement validateAccessToken()
 *    - Implement refreshOAuthToken()
 *    - Set up OAuth callback handling
 * 
 * 3. Configure environment variables:
 *    ZOOM_CLIENT_ID=your_zoom_client_id
 *    ZOOM_CLIENT_SECRET=your_zoom_client_secret
 *    ZOOM_REDIRECT_URI=your_redirect_uri
 * 
 * 4. Run OAuth flow to get initial tokens:
 *    - Use getAuthorizationUrl() to generate auth URL
 *    - Direct user to authorization URL
 *    - Handle callback with exchangeCodeForToken()
 * 
 * 5. Run the bot:
 *    node example_usage.js
 * 
 * FEATURES:
 * - Automatic OAuth login (no manual username/password)
 * - Requests co-host status if not already granted
 * - Monitors participants every 10 seconds
 * - Automatically pins users who raise hands (non-hosts only)
 * - Automatically unpins users when they lower hands
 * - Comprehensive logging and error handling
 * 
 * TROUBLESHOOTING:
 * - If selectors don't work, update ZOOM_SELECTORS in zoom_cohost_bot.js
 * - For debugging, set headless: false in launchBrowser()
 * - Check browser console for Zoom-specific errors
 * - Ensure OAuth token has proper scopes (meeting:write, meeting:read)
 */