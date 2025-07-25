console.log('🔄 SWITCHED TO URL 4 CONFIGURATION');
console.log('='.repeat(45));
console.log('');

// Now using the other working configuration
const ZOOM_CLIENT_ID = 'K3t8Sd3rSZOSKfkyMftDXg';
const ZOOM_REDIRECT_URI = 'https://pupfr.github.io/Nebulosa/zoom-callback.html';

const testUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${ZOOM_CLIENT_ID}&redirect_uri=${encodeURIComponent(ZOOM_REDIRECT_URI)}&state=test&scope=meeting:read meeting:write user:read`;

console.log('🔄 BOT NOW USING URL 4 CONFIG:');
console.log(`Client ID: ${ZOOM_CLIENT_ID}`);
console.log(`Redirect: ${ZOOM_REDIRECT_URI}`);
console.log('');
console.log('🔗 URL bot will generate:');
console.log(testUrl);
console.log('');
console.log('✅ This was URL 4 from your manual test that WORKED');
console.log('');
console.log('🚀 TEST NOW:');
console.log('1. Try /zoomlogin in Telegram');
console.log('2. Click the OAuth link');
console.log('3. Since URL 4 worked manually, this should work');
console.log('');
console.log('🎯 If this STILL gives 4700 error:');
console.log('• There might be a timing/caching issue');
console.log('• Or the manual test results were different than expected');
console.log('• We need to verify your Zoom app OAuth Allow List directly');
