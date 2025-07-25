console.log('🔍 COMPREHENSIVE OAUTH CONFIGURATION TEST');
console.log('='.repeat(60));
console.log('');

// Found multiple client secrets and redirect URIs in your files
const configurations = [
    {
        name: 'Config A: .env file settings',
        clientId: 'vGVyI0IRv6si45iKO_qIw',
        clientSecret: 'qL0UeGFWeQM2Csu1Z1G2J4RAZt4QGzi6',
        redirectUri: 'http://localhost:3000/auth/zoom/callback'
    },
    {
        name: 'Config B: .env client secret + GitHub Pages redirect',
        clientId: 'vGVyI0IRv6si45iKO_qIw',
        clientSecret: 'qL0UeGFWeQM2Csu1Z1G2J4RAZt4QGzi6',
        redirectUri: 'https://pupfr.github.io/Nebulosa/zoom-callback.html'
    },
    {
        name: 'Config C: Bot hardcoded (current running)',
        clientId: 'vGVyI0IRv6si45iKO_qIw',
        clientSecret: 'Gb9JmLsI1brv4bPdAPB9CSknQV4GiFB',
        redirectUri: 'https://pupfr.github.io/Nebulosa/zoom-callback.html'
    },
    {
        name: 'Config D: Bot hardcoded + pupfrisky.com',
        clientId: 'vGVyI0IRv6si45iKO_qIw',
        clientSecret: 'Gb9JmLsI1brv4bPdAPB9CSknQV4GiFB',
        redirectUri: 'https://pupfrisky.com/zoom-callback'
    },
    {
        name: 'Config E: Old client ID + .env secret',
        clientId: 'K3t8Sd3rSZOSKfkyMftDXg',
        clientSecret: 'qL0UeGFWeQM2Csu1Z1G2J4RAZt4QGzi6',
        redirectUri: 'https://pupfr.github.io/Nebulosa/zoom-callback.html'
    },
    {
        name: 'Config F: Old client ID + bot secret',
        clientId: 'K3t8Sd3rSZOSKfkyMftDXg',
        clientSecret: 'Gb9JmLsI1brv4bPdAPB9CSknQV4GiFB',
        redirectUri: 'https://pupfr.github.io/Nebulosa/zoom-callback.html'
    }
];

console.log('🎯 TEST THESE URLs IN YOUR BROWSER:');
console.log('(Copy each URL and check which one does NOT give 4700 error)');
console.log('');

configurations.forEach((config, index) => {
    const authUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&state=test${String.fromCharCode(65 + index)}&scope=meeting:read meeting:write user:read`;

    console.log(`${String.fromCharCode(65 + index)}️⃣ ${config.name}`);
    console.log(`   Client ID: ${config.clientId}`);
    console.log(`   Client Secret: ${config.clientSecret}`);
    console.log(`   Redirect: ${config.redirectUri}`);
    console.log(`   URL: ${authUrl}`);
    console.log('');
});

console.log('🚨 IMPORTANT DISCOVERY:');
console.log('Your .env file has DIFFERENT credentials than your bot!');
console.log('');
console.log('📂 .env file has:');
console.log('   Client Secret: qL0UeGFWeQM2Csu1Z1G2J4RAZt4QGzi6');
console.log('   Redirect URI: http://localhost:3000/auth/zoom/callback');
console.log('');
console.log('🤖 streamlined-bot.js has:');
console.log('   Client Secret: Gb9JmLsI1brv4bPdAPB9CSknQV4GiFB');
console.log('   Redirect URI: https://pupfr.github.io/Nebulosa/zoom-callback.html');
console.log('');
console.log('💡 The working configuration will tell us which Zoom app is correct!');
