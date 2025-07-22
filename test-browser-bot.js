const { ZoomBrowserBot } = require('./zoomBrowserBot.js');

async function testBrowserBot() {
  console.log('🧪 Starting ZoomBrowserBot tests...\n');
  
  // Test 1: Constructor
  console.log('Test 1: Constructor');
  try {
    const meetingData = {
      meetingId: 'test123',
      link: 'https://zoom.us/j/test123',
      passcode: 'testpass'
    };
    
    const bot = new ZoomBrowserBot(meetingData);
    console.log('✅ ZoomBrowserBot constructor works');
    console.log(`   Meeting ID: ${bot.meetingId}`);
    console.log(`   Bot Name: ${bot.botName}`);
    console.log(`   Is User Session: ${bot.isUserSession}`);
  } catch (error) {
    console.log('❌ Constructor failed:', error.message);
    return;
  }
  
  // Test 2: Constructor with user token
  console.log('\nTest 2: Constructor with user token');
  try {
    const meetingData = {
      meetingId: 'test456',
      link: 'https://zoom.us/j/test456',
      passcode: 'testpass'
    };
    
    const botWithToken = new ZoomBrowserBot(meetingData, 'fake_token');
    console.log('✅ ZoomBrowserBot constructor with token works');
    console.log(`   Bot Name: ${botWithToken.botName}`);
    console.log(`   Is User Session: ${botWithToken.isUserSession}`);
  } catch (error) {
    console.log('❌ Constructor with token failed:', error.message);
  }
  
  // Test 3: Method availability
  console.log('\nTest 3: Method availability');
  const meetingData = {
    meetingId: 'test789',
    link: 'https://zoom.us/j/test789',
    passcode: 'testpass'
  };
  
  const bot = new ZoomBrowserBot(meetingData);
  const methods = ['start', 'multipinUser', 'unpinUser', 'getMultipinnedUsers', 'cleanup', 'isReady'];
  
  for (const method of methods) {
    if (typeof bot[method] === 'function') {
      console.log(`✅ Method ${method} exists`);
    } else {
      console.log(`❌ Method ${method} missing`);
    }
  }
  
  // Test 4: Initial state
  console.log('\nTest 4: Initial state');
  console.log(`   Is Connected: ${bot.isConnected}`);
  console.log(`   Is Ready: ${bot.isReady()}`);
  const multipinnedUsers = await bot.getMultipinnedUsers();
  console.log(`   Multipinned Users: ${multipinnedUsers.length}`);
  
  // Test 5: Test environment check
  console.log('\nTest 5: Environment check');
  try {
    const puppeteer = require('puppeteer');
    console.log('✅ Puppeteer is available');
    
    // Get browser version
    const executablePath = puppeteer.executablePath();
    console.log(`   Executable path exists: ${require('fs').existsSync(executablePath)}`);
  } catch (error) {
    console.log('❌ Puppeteer not available:', error.message);
  }
  
  console.log('\n🧪 ZoomBrowserBot tests completed!');
}

// Run tests
testBrowserBot().catch(console.error);
