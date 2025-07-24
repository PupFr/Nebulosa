#!/usr/bin/env node

require('dotenv').config();
const axios = require('axios');

console.log('🔍 Diagnosing OAuth Error - Status Code 400');
console.log('================================================\n');

// Check environment variables
console.log('📋 Environment Variables Check:');
console.log('ZOOM_USER_CLIENT_ID:', process.env.ZOOM_USER_CLIENT_ID ? '✅ Present' : '❌ Missing');
console.log('ZOOM_USER_CLIENT_SECRET:', process.env.ZOOM_USER_CLIENT_SECRET ? '✅ Present' : '❌ Missing');
console.log('ZOOM_CLIENT_ID:', process.env.ZOOM_CLIENT_ID ? '✅ Present' : '❌ Missing');
console.log('ZOOM_CLIENT_SECRET:', process.env.ZOOM_CLIENT_SECRET ? '✅ Present' : '❌ Missing');
console.log('ZOOM_REDIRECT_URI:', process.env.ZOOM_REDIRECT_URI || '❌ Missing');
console.log('BOT_TOKEN:', process.env.BOT_TOKEN ? '✅ Present' : '❌ Missing');
console.log();

// Common OAuth 400 error causes
console.log('🔍 Common Causes of OAuth 400 Errors:');
console.log('1. ❌ Invalid or expired authorization code');
console.log('2. ❌ Incorrect redirect_uri (must match exactly in Zoom app)');
console.log('3. ❌ Invalid client_id or client_secret');
console.log('4. ❌ Authorization code already used (can only be used once)');
console.log('5. ❌ Incorrect grant_type parameter');
console.log('6. ❌ Missing or incorrect Content-Type header');
console.log('7. ❌ Code expired (usually 10 minutes)');
console.log();

// Get client credentials
function getClientId() {
  return process.env.ZOOM_USER_CLIENT_ID || process.env.ZOOM_CLIENT_ID;
}

function getClientSecret() {
  return process.env.ZOOM_USER_CLIENT_SECRET || process.env.ZOOM_CLIENT_SECRET;
}

// Test function to simulate token exchange
async function testTokenExchange(authCode) {
  const clientId = getClientId();
  const clientSecret = getClientSecret();
  const redirectUri = process.env.ZOOM_REDIRECT_URI || 'https://pupfrisky.com/zoom-callback';
  
  console.log('🧪 Testing Token Exchange Parameters:');
  console.log('Client ID:', clientId ? `${clientId.substring(0, 8)}...` : '❌ Missing');
  console.log('Client Secret:', clientSecret ? '✅ Present' : '❌ Missing');
  console.log('Redirect URI:', redirectUri);
  console.log('Auth Code:', authCode ? `${authCode.substring(0, 10)}...` : '❌ Missing');
  console.log();
  
  if (!clientId || !clientSecret) {
    console.error('❌ Missing client credentials. Cannot proceed with test.');
    return;
  }
  
  if (!authCode) {
    console.log('💡 To test with a real authorization code:');
    console.log('   node diagnose-oauth-error.js YOUR_AUTH_CODE');
    return;
  }
  
  try {
    // Method 1: Using axios.post with params (current implementation)
    console.log('🔄 Testing Method 1: axios.post with params...');
    const response1 = await axios.post('https://zoom.us/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    console.log('✅ Method 1 successful:', response1.data);
    
  } catch (error1) {
    console.log('❌ Method 1 failed:', error1.response?.status, error1.response?.data);
    
    try {
      // Method 2: Using Basic Auth (alternative implementation)
      console.log('🔄 Testing Method 2: Basic Auth...');
      const response2 = await axios.post('https://zoom.us/oauth/token', new URLSearchParams({
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: redirectUri
      }), {
        auth: {
          username: clientId,
          password: clientSecret
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      console.log('✅ Method 2 successful:', response2.data);
      
    } catch (error2) {
      console.log('❌ Method 2 failed:', error2.response?.status, error2.response?.data);
      
      // Detailed error analysis
      console.log('\n🔍 Detailed Error Analysis:');
      if (error2.response?.status === 400) {
        const errorData = error2.response.data;
        console.log('Error Details:', errorData);
        
        if (errorData.error === 'invalid_grant') {
          console.log('💡 Fix: Authorization code is invalid, expired, or already used');
          console.log('   - Get a fresh authorization code');
          console.log('   - Codes expire in ~10 minutes');
          console.log('   - Each code can only be used once');
        } else if (errorData.error === 'invalid_client') {
          console.log('💡 Fix: Client ID or Secret is incorrect');
          console.log('   - Verify credentials in Zoom Marketplace');
          console.log('   - Ensure you\'re using User OAuth credentials');
        } else if (errorData.error === 'invalid_request') {
          console.log('💡 Fix: Request format is incorrect');
          console.log('   - Check redirect_uri matches exactly');
          console.log('   - Verify all required parameters are present');
        }
      }
    }
  }
}

// Validate redirect URI format
function validateRedirectUri() {
  const redirectUri = process.env.ZOOM_REDIRECT_URI;
  
  console.log('🔍 Redirect URI Validation:');
  if (!redirectUri) {
    console.log('❌ ZOOM_REDIRECT_URI not set');
    return false;
  }
  
  console.log('Current URI:', redirectUri);
  
  // Check common issues
  const issues = [];
  
  if (!redirectUri.startsWith('https://') && !redirectUri.startsWith('http://localhost')) {
    issues.push('Must use HTTPS (except localhost)');
  }
  
  if (redirectUri.includes(' ')) {
    issues.push('Contains spaces');
  }
  
  if (redirectUri.endsWith('/')) {
    issues.push('Ends with slash (remove it)');
  }
  
  if (issues.length > 0) {
    console.log('❌ Issues found:');
    issues.forEach(issue => console.log(`   - ${issue}`));
    return false;
  }
  
  console.log('✅ Redirect URI format looks good');
  return true;
}

// Generate correct OAuth URL for testing
function generateOAuthUrl() {
  const clientId = getClientId();
  const redirectUri = process.env.ZOOM_REDIRECT_URI || 'https://pupfr.github.io/Nebulosa/zoom-callback.html';
  
  if (!clientId) {
    console.log('❌ Cannot generate OAuth URL: Missing client ID');
    return;
  }
  
  const scopes = 'meeting:read meeting:write user:read';
  const state = '12345'; // Test state
  
  const oauthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&state=${state}`;
  
  console.log('🔗 Generated OAuth URL (GitHub Pages):');
  console.log(oauthUrl);
  console.log();
  console.log('🔗 Generated OAuth URL (Localhost - for development):');
  const localhostUri = 'http://localhost:3000/auth/zoom/callback';
  const localhostUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(localhostUri)}&scope=${encodeURIComponent(scopes)}&state=${state}`;
  console.log(localhostUrl);
  console.log();
  console.log('💡 To test:');
  console.log('1. Add redirect URI to your Zoom app first');
  console.log('2. Open one of the URLs above in browser');
  console.log('3. Complete Zoom authorization');
  console.log('4. Copy the authorization code from callback');
  console.log('5. Run: node diagnose-oauth-error.js YOUR_CODE');
}

// Main execution
async function main() {
  validateRedirectUri();
  console.log();
  
  const authCode = process.argv[2];
  await testTokenExchange(authCode);
  
  console.log();
  generateOAuthUrl();
  
  console.log('\n📋 Quick Fixes Checklist:');
  console.log('□ Verify Zoom app redirect URI matches exactly');
  console.log('□ Use fresh authorization code (not expired/used)');
  console.log('□ Check client ID and secret are correct');
  console.log('□ Ensure Zoom app has required scopes');
  console.log('□ Try localhost redirect URI for testing');
  console.log('\n💡 If still failing, check ZOOM_OAUTH_FIX_URGENT.md');
}

main().catch(console.error);
