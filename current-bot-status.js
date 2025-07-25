console.log('🎯 CURRENT BOT STATUS CHECK');
console.log('='.repeat(40));

// Check what the bot should be generating now
const ZOOM_CLIENT_ID = 'vGVyI0IRv6si45iKO_qIw';
const ZOOM_REDIRECT_URI = 'https://pupfr.github.io/Nebulosa/zoom-callback.html';

const testUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${ZOOM_CLIENT_ID}&redirect_uri=${encodeURIComponent(ZOOM_REDIRECT_URI)}&state=test&scope=meeting:read meeting:write user:read`;

console.log('✅ BOT NOW USING:');
console.log(`Client ID: ${ZOOM_CLIENT_ID}`);
console.log(`Redirect: ${ZOOM_REDIRECT_URI}`);
console.log('');
console.log('🔗 URL to test:');
console.log(testUrl);
console.log('');
console.log('🚀 NEXT STEPS:');
console.log('1. Try /zoomlogin in Telegram');
console.log('2. Click the new OAuth link');
console.log('3. Should work with original callback');
console.log('4. English messages, correct bot token');
console.log('');
console.log('💡 This should finally work!');
