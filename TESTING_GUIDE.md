# 🧪 Multipin Puppeteer Testing Guide

## Prerequisites

### Environment Setup
1. **Create `.env` file with your credentials:**
```bash
cp .env.example .env
```

Then edit `.env` with your actual values:
```env
# Telegram Bot
BOT_TOKEN=your_telegram_bot_token_here
LOG_CHANNEL_ID=your_telegram_channel_id
ADMIN_USER_ID=your_telegram_user_id

# Zoom OAuth (Optional for testing)
ZOOM_CLIENT_ID=your_zoom_client_id
ZOOM_CLIENT_SECRET=your_zoom_client_secret
ZOOM_REDIRECT_URI=your_redirect_uri

# Command Chat (Optional)
COMMAND_CHAT_ID=your_command_chat_id
COMMAND_CHAT_LINK=your_command_chat_link
```

### 2. Install Dependencies
```bash
npm install
```

## 🔧 Testing Options

### Option 1: Run Existing Tests (Recommended to start)
```bash
# Test 1: Basic ZoomBrowserBot functionality
node test-browser-bot.js

# Test 2: Bot integration tests
node test-bot-integration.js

# Test 3: Complete multipin workflow simulation
node test-multipin-workflow.js
```

### Option 2: Start the Bot in Test Mode
```bash
# Start the bot (requires BOT_TOKEN in .env)
node bot.cjs
```

**In Telegram, test these commands:**
```
/start
/startsession
/status
/scanroom (simulated)
/botstatus
/createroom Test Meeting
```

### Option 3: Test Browser Bot Independently
Create a simple test file:

```javascript
// quick-test.js
const { ZoomBrowserBot } = require('./zoomBrowserBot.js');

async function quickTest() {
  console.log('🚀 Testing ZoomBrowserBot...');
  
  const meetingData = {
    meetingId: '123456789',
    link: 'https://zoom.us/j/123456789',
    passcode: 'test123'
  };
  
  const bot = new ZoomBrowserBot(meetingData);
  console.log('✅ Bot created successfully');
  console.log('Bot name:', bot.botName);
  console.log('Meeting ID:', bot.meetingId);
  
  // Test methods without actually starting browser
  console.log('Ready status:', bot.isReady());
  console.log('Connected:', bot.isConnected);
  console.log('Multipinned users:', await bot.getMultipinnedUsers());
}

quickTest().catch(console.error);
```

Run with: `node quick-test.js`

## 🎯 Manual Testing Scenarios

### Scenario 1: Command Testing
1. Start bot: `node bot.cjs`
2. Send `/start` in Telegram
3. Test new commands:
   - `/startbot 123456789 https://zoom.us/j/123456789`
   - `/botstatus`
   - `/stopbot 123456789`

### Scenario 2: Meeting Creation with Auto-Bot
1. Send `/createroom Test Meeting`
2. Check if browser bot starts automatically
3. Verify status with `/botstatus`

### Scenario 3: Browser Bot Functionality
```javascript
// browser-test.js
const { ZoomBrowserBot } = require('./zoomBrowserBot.js');

async function testBrowserFunctionality() {
  const bot = new ZoomBrowserBot({
    meetingId: 'test',
    link: 'https://zoom.us/j/test',
    passcode: 'none'
  });
  
  console.log('Testing multipin methods...');
  
  // These won't actually execute without a real meeting
  // but will test the method structure
  try {
    await bot.multipinUser('TestUser');
    console.log('Multipin method structure OK');
  } catch (error) {
    console.log('Expected error (no real meeting):', error.message);
  }
}

testBrowserFunctionality();
```

## 🔍 What to Test & Verify

### ✅ Basic Functionality
- [ ] Bot starts without errors
- [ ] All test files run successfully
- [ ] ZoomBrowserBot class instantiates correctly
- [ ] Methods exist and are callable

### ✅ Command Integration
- [ ] `/startbot` command exists and responds
- [ ] `/stopbot` command exists and responds  
- [ ] `/botstatus` command shows proper status
- [ ] Help commands show new documentation

### ✅ Auto-Start Integration
- [ ] `/createroom` mentions browser bot activation
- [ ] Browser bot appears in `/status` output
- [ ] Auto-cleanup on `/shutdown`

### ✅ Error Handling
- [ ] Graceful fallback when Puppeteer unavailable
- [ ] Proper error messages for invalid commands
- [ ] Resource cleanup on errors

## 🚨 Expected Behaviors

### Normal Operation
- Commands respond with bilingual messages
- Browser bot status tracking works
- Integration with existing monitoring system
- Observatory logging functionality

### Error Cases
- No real Zoom meeting = "BOT_NOT_READY" responses
- Missing permissions = admin-only messages
- Invalid meeting IDs = appropriate error messages

## 🐛 Troubleshooting

### Common Issues
1. **"Cannot find module 'puppeteer'"**
   - Run: `npm install`

2. **"BOT_TOKEN not found"**
   - Create `.env` file with valid token

3. **"Browser bot not ready"**
   - Expected without real Zoom meeting
   - Test with simulated data instead

4. **Command not recognized**
   - Check if you added the new command handlers

### Debug Mode
To see more details, add to your test files:
```javascript
console.log('Debugging browser bot...');
// Add debug logs as needed
```

## 🎮 Live Testing (Advanced)

**Only if you have real Zoom meetings:**

1. Set up real Zoom OAuth credentials
2. Create actual meeting
3. Start browser bot with real meeting link
4. Test with participants having cameras/hands raised

**Safety Note:** Test with small, controlled meetings first!

## 📊 Success Metrics

You know it's working when:
- ✅ All test files complete without errors
- ✅ Bot responds to new commands
- ✅ Status shows browser bot information
- ✅ Auto-start mentions browser bot activation
- ✅ Error handling is graceful and informative

## Next Steps After Testing

1. **Production Deployment**
   - Set up environment variables
   - Deploy to hosting platform
   - Test with real Zoom meetings

2. **Monitoring Setup**
   - Configure Observatory logging
   - Set up Command Chat integration
   - Monitor browser bot performance

Ready to test? Start with the existing test files and work your way up! 🚀
