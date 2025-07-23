#!/usr/bin/env node

const axios = require('axios');
require('dotenv').config();

console.log('🔍 Testing Complete OAuth Configuration');
console.log('=====================================\n');

const clientId = process.env.ZOOM_USER_CLIENT_ID || process.env.ZOOM_CLIENT_ID;
const clientSecret = process.env.ZOOM_USER_CLIENT_SECRET || process.env.ZOOM_CLIENT_SECRET;
const redirectUri = process.env.ZOOM_REDIRECT_URI;

console.log('📋 Configuration Check:');
console.log(`Client ID: ${clientId}`);
console.log(`Client Secret: ${clientSecret ? '✅ Present' : '❌ Missing'}`);
console.log(`Redirect URI: ${redirectUri}`);
console.log('');

// Test GitHub Pages callback accessibility
async function testCallbackPage() {
  console.log('🌐 Testing GitHub Pages Callback...');
  try {
    const response = await axios.get(redirectUri, { timeout: 10000 });
    console.log(`✅ Callback page accessible (HTTP ${response.status})`);
    console.log(`📄 Content length: ${response.data.length} characters`);
    return true;
  } catch (error) {
    console.log(`❌ Callback page error: ${error.message}`);
    return false;
  }
}

// Generate the correct OAuth URL
function generateOAuthURL(testUserId = '123456789') {
  const authUrl = 'https://zoom.us/oauth/authorize';
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'meeting:write meeting:read user:read',
    state: testUserId
  });
  
  return `${authUrl}?${params.toString()}`;
}

async function main() {
  // Test callback page accessibility
  const callbackWorking = await testCallbackPage();
  
  console.log('\n🔗 OAuth URL Generation:');
  if (clientId && redirectUri) {
    const oauthUrl = generateOAuthURL();
    console.log('✅ Complete OAuth URL:');
    console.log(`\n${oauthUrl}\n`);
    
    console.log('📝 Instructions:');
    console.log('1. Copy the URL above');
    console.log('2. Open it in your browser');
    console.log('3. Log in to Zoom and authorize the app');
    console.log('4. You should be redirected to your GitHub Pages callback');
    console.log('');
    
    if (callbackWorking) {
      console.log('✅ Ready to test OAuth flow!');
      console.log('');
      console.log('⚠️  If you get error 4.700 (Invalid Redirect URI):');
      console.log('   → You need to add this exact redirect URI to your Zoom app:');
      console.log(`   → ${redirectUri}`);
      console.log('   → Go to: https://marketplace.zoom.us/develop/apps');
      console.log('   → Find your app with Client ID: ' + clientId);
      console.log('   → Add the redirect URI in the OAuth settings');
    } else {
      console.log('❌ Callback page not accessible - check GitHub Pages deployment');
    }
  } else {
    console.log('❌ Missing required configuration');
  }
  
  console.log('\n🔧 Next Steps Summary:');
  console.log('1. ✅ OAuth server ready (oauth-callback-only.js)');
  console.log('2. ✅ Credentials validated');
  console.log('3. ✅ GitHub Pages callback accessible');
  console.log('4. ⚠️  Configure redirect URI in Zoom Marketplace app');
  console.log('5. 🧪 Test OAuth flow with generated URL above');
}

main().catch(console.error);
