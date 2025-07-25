console.log('🔍 TESTING CORRECT OAUTH CONFIGURATION');
console.log('='.repeat(50));

// Configuration that SHOULD work (from our previous testing)
const ZOOM_CLIENT_ID = 'vGVyI0IRv6si45iKO_qIw';
const ZOOM_REDIRECT_URI = 'https://pupfr.github.io/Nebulosa/zoom-callback.html';

const correctAuthUrl = 'https://zoom.us/oauth/authorize?' +
    `response_type=code&` +
    `client_id=${ZOOM_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(ZOOM_REDIRECT_URI)}&` +
    `state=telegram_auth&` +
    `scope=meeting:read meeting:write user:read`;

console.log('✅ CORRECT OAuth URL (this should work):');
console.log(correctAuthUrl);
console.log('');
console.log('🔧 Configuration being used:');
console.log(`Client ID: ${ZOOM_CLIENT_ID}`);
console.log(`Redirect URI: ${ZOOM_REDIRECT_URI}`);
console.log('');
console.log('📋 Test this URL in your browser - it should NOT give 4700 error');
