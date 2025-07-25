// Simulate exactly what the streamlined bot generates
const ZOOM_CLIENT_ID = 'vGVyI0IRv6si45iKO_qIw';
const ZOOM_REDIRECT_URI = 'https://pupfr.github.io/Nebulosa/zoom-callback.html';

const authUrl = 'https://zoom.us/oauth/authorize?' +
    `response_type=code&` +
    `client_id=${ZOOM_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(ZOOM_REDIRECT_URI)}&` +
    `state=telegram_auth&` +
    `scope=meeting:read meeting:write user:read`;

console.log('🔥 FRESH BOT OAUTH URL:');
console.log('='.repeat(50));
console.log(authUrl);
console.log('');
console.log('✅ This is what your bot should generate NOW');
console.log('');
console.log('🎯 ACTION REQUIRED:');
console.log('1. Go to Telegram');
console.log('2. Send /zoomlogin to your bot');
console.log('3. Click the NEW link (ignore any old ones)');
console.log('4. This should work without 4700 error');
