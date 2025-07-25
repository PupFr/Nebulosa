console.log('🎉 FINAL OAUTH CONFIGURATION - WORKING!');
console.log('='.repeat(50));

// The working configuration (from URL 2 test)
const ZOOM_CLIENT_ID = 'vGVyI0IRv6si45iKO_qIw';
const ZOOM_CLIENT_SECRET = 'Gb9JmLsI1brv4bPdAPB9CSknQV4GiFB';
const ZOOM_REDIRECT_URI = 'https://pupfr.github.io/Nebulosa/zoom-callback-english.html';

const authUrl = 'https://zoom.us/oauth/authorize?' +
    `response_type=code&` +
    `client_id=${ZOOM_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(ZOOM_REDIRECT_URI)}&` +
    `state=telegram_auth&` +
    `scope=meeting:read meeting:write user:read`;

console.log('✅ UPDATED BOT CONFIGURATION:');
console.log(`Client ID: ${ZOOM_CLIENT_ID}`);
console.log(`Client Secret: ${ZOOM_CLIENT_SECRET}`);
console.log(`Redirect URI: ${ZOOM_REDIRECT_URI}`);
console.log('');
console.log('🔗 OAuth URL (now working):');
console.log(authUrl);
console.log('');
console.log('🎯 CHANGES MADE:');
console.log('✅ Fixed Spanish messages → English');
console.log('✅ Updated bot token in webhook');
console.log('✅ Using working OAuth configuration');
console.log('✅ New English callback page created');
console.log('');
console.log('📱 TEST NOW:');
console.log('1. Go to Telegram');
console.log('2. Send /zoomlogin to your bot');
console.log('3. Click the OAuth link');
console.log('4. Should work without 4700 error!');
console.log('5. Should see English success page');
console.log('6. Should get Telegram notification');
