// Real-time OAuth URL generator to match bot exactly
const ZOOM_CLIENT_ID = 'vGVyI0IRv6si45iKO_qIw';
const ZOOM_CLIENT_SECRET = 'Gb9JmLsI1brv4bPdAPB9CSknQV4GiFB';
const ZOOM_REDIRECT_URI = 'https://pupfr.github.io/Nebulosa/zoom-callback-english.html';

console.log('🔍 REAL-TIME BOT URL GENERATION TEST');
console.log('='.repeat(50));
console.log('');

// Exactly what the bot generates
const chatId = '123456789'; // Example chat ID
const authUrl = 'https://zoom.us/oauth/authorize?' +
    `response_type=code&` +
    `client_id=${ZOOM_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(ZOOM_REDIRECT_URI)}&` +
    `state=${chatId}&` +
    `scope=meeting:read meeting:write user:read`;

console.log('🤖 CURRENT BOT CONFIGURATION:');
console.log(`Client ID: ${ZOOM_CLIENT_ID}`);
console.log(`Client Secret: ${ZOOM_CLIENT_SECRET}`);
console.log(`Redirect URI: ${ZOOM_REDIRECT_URI}`);
console.log('');
console.log('🔗 URL bot is generating:');
console.log(authUrl);
console.log('');
console.log('🚨 If this still gives 4700 error, the issue might be:');
console.log('1. GitHub Pages file not deployed yet');
console.log('2. Zoom app needs the new redirect URI added');
console.log('3. Cache/browser issue');
console.log('');
console.log('💡 IMMEDIATE FIXES:');
console.log('1. Try the original callback: zoom-callback.html');
console.log('2. Clear browser cache');
console.log('3. Check Zoom app OAuth Allow List');

// Test with original callback
const originalAuthUrl = 'https://zoom.us/oauth/authorize?' +
    `response_type=code&` +
    `client_id=${ZOOM_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent('https://pupfr.github.io/Nebulosa/zoom-callback.html')}&` +
    `state=${chatId}&` +
    `scope=meeting:read meeting:write user:read`;

console.log('');
console.log('🔄 FALLBACK URL (original callback):');
console.log(originalAuthUrl);
console.log('');
console.log('📋 TEST BOTH URLs:');
console.log('Try the fallback URL first - it might work!');
