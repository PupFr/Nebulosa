console.log('🚨 EMERGENCY OAUTH CHECK');
console.log('='.repeat(50));
console.log('');

// Let's decode the URL from the screenshot to see what's happening
const screenshotUrl = "zoom.us/oauth/signin?_rnd=1753458829942&client_id=vGVyI0IRv6si45iKO_qIw&redirect_uri=https%3A%2F%2Fpupfr.github.io%2F";

console.log('🔍 ANALYZING SCREENSHOT URL:');
console.log('Raw URL:', screenshotUrl);
console.log('');

// Decode the redirect_uri
const params = new URLSearchParams(screenshotUrl.split('?')[1]);
const clientId = params.get('client_id');
const redirectUri = params.get('redirect_uri');

console.log('📋 EXTRACTED PARAMETERS:');
console.log('Client ID:', clientId);
console.log('Redirect URI:', redirectUri);
console.log('Decoded Redirect:', decodeURIComponent(redirectUri));
console.log('');

// Check if this matches what we expect
const expectedClientId = 'vGVyI0IRv6si45iKO_qIw';
const expectedRedirectUri = 'https://pupfr.github.io/Nebulosa/zoom-callback.html';

console.log('✅ EXPECTED VALUES:');
console.log('Expected Client ID:', expectedClientId);
console.log('Expected Redirect URI:', expectedRedirectUri);
console.log('');

console.log('🔍 COMPARISON:');
console.log('Client ID matches:', clientId === expectedClientId);
console.log('Redirect URI matches:', decodeURIComponent(redirectUri) === expectedRedirectUri);
console.log('');

if (decodeURIComponent(redirectUri) !== expectedRedirectUri) {
    console.log('❌ PROBLEM FOUND:');
    console.log('The redirect URI is wrong!');
    console.log('Expected:', expectedRedirectUri);
    console.log('Got:', decodeURIComponent(redirectUri));
    console.log('');
    console.log('🔧 This means either:');
    console.log('1. The bot is generating the wrong URL');
    console.log('2. You clicked an old/cached URL');
    console.log('3. Multiple bot instances are running');
}

console.log('');
console.log('🎯 NEXT STEPS:');
console.log('1. Stop ALL bot instances');
console.log('2. Start fresh bot');
console.log('3. Get new /zoomlogin URL');
console.log('4. Test the new URL');
