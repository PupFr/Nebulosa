#!/usr/bin/env node

const axios = require('axios');
require('dotenv').config();

console.log('🔐 Testing New Zoom Secret Token');
console.log('=================================\n');

const clientId = process.env.ZOOM_USER_CLIENT_ID || process.env.ZOOM_CLIENT_ID;
const clientSecret = process.env.ZOOM_USER_CLIENT_SECRET || process.env.ZOOM_CLIENT_SECRET;
const redirectUri = process.env.ZOOM_REDIRECT_URI;

console.log('📋 Current Configuration:');
console.log(`Client ID: ${clientId}`);
console.log(`Client Secret: ${clientSecret ? clientSecret.substring(0, 8) + '...' : 'Missing'}`);
console.log(`Redirect URI: ${redirectUri}`);
console.log();

// Test the credentials by attempting a token exchange with a fake code
async function testCredentials() {
  console.log('🧪 Testing credentials validity...');
  
  try {
    // This will fail with invalid_grant (expected) but we can check if credentials are valid
    await axios.post('https://zoom.us/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        code: 'fake_code_for_testing',
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      timeout: 10000
    });
    
  } catch (error) {
    if (error.response?.status === 400) {
      const errorData = error.response.data;
      
      if (errorData.error === 'invalid_grant') {
        console.log('✅ Credentials are VALID!');
        console.log('   (Got expected invalid_grant error with fake code)');
        return true;
      } else if (errorData.error === 'invalid_client') {
        console.log('❌ Credentials are INVALID!');
        console.log('   Error: Invalid client credentials');
        return false;
      } else {
        console.log('⚠️  Unexpected error:', errorData.error);
        return false;
      }
    } else {
      console.log('⚠️  Network or other error:', error.message);
      return false;
    }
  }
}

// Generate OAuth URL with new credentials
function generateOAuthURL() {
  const scopes = 'meeting:read meeting:write user:read';
  const state = 'test_new_secret';
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes,
    state: state
  });
  
  return `https://zoom.us/oauth/authorize?${params.toString()}`;
}

async function main() {
  const credentialsValid = await testCredentials();
  
  console.log();
  if (credentialsValid) {
    console.log('🚀 Ready to test OAuth with new secret!');
    console.log();
    console.log('🔗 New OAuth URL:');
    console.log(generateOAuthURL());
    console.log();
    console.log('📝 Next steps:');
    console.log('1. ✅ Secret token updated');
    console.log('2. ⚠️  Still need to add redirect URI to Zoom app');
    console.log('3. 🧪 Test OAuth flow with URL above');
  } else {
    console.log('❌ Credentials issue - please verify the secret token');
  }
  
  console.log('\n💡 Remember: You still need to add this redirect URI to your Zoom app:');
  console.log(`   ${redirectUri}`);
  console.log('   Go to: https://marketplace.zoom.us/develop/apps');
}

main().catch(console.error);
