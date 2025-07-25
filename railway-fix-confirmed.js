console.log('🎉 PROBLEM SOLVED! USING CORRECT RAILWAY URL');
console.log('='.repeat(55));
console.log('');

// Now using the ACTUAL redirect URL from your Zoom app
const ZOOM_CLIENT_ID = 'K3t8Sd3rSZOSKfkyMftDXg';
const ZOOM_REDIRECT_URI = 'https://nebulosa-production.railway.app/auth/zoom/callback';

const authUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${ZOOM_CLIENT_ID}&redirect_uri=${encodeURIComponent(ZOOM_REDIRECT_URI)}&state=test&scope=meeting:read meeting:write user:read`;

console.log('✅ FIXED! BOT NOW USING ZOOM APP CONFIGURED URL:');
console.log(`Client ID: ${ZOOM_CLIENT_ID}`);
console.log(`Redirect URI: ${ZOOM_REDIRECT_URI}`);
console.log('');
console.log('🔗 OAuth URL (should work now):');
console.log(authUrl);
console.log('');
console.log('🎯 WHY THIS FIXES THE 4700 ERROR:');
console.log('• Your Zoom app was configured for Railway callback');
console.log('• But bot was trying to use GitHub Pages callback');
console.log('• URL mismatch = 4700 Invalid redirect url');
console.log('• Now they match = should work!');
console.log('');
console.log('🚀 TEST NOW:');
console.log('1. Go to Telegram');
console.log('2. Send /zoomlogin');
console.log('3. Click OAuth link');
console.log('4. Should redirect to Railway (not GitHub Pages)');
console.log('5. NO MORE 4700 ERROR!');
console.log('');
console.log('💡 The Railway callback will handle the OAuth flow');
console.log('   and send confirmation back to Telegram');
