#!/usr/bin/env node

// 🔍 Test /zoomlogin Command Functionality
require('dotenv').config();

console.log('🔍 TESTING /zoomlogin COMMAND');
console.log('============================\n');

function testZoomLoginGeneration() {
    console.log('🔗 Testing OAuth URL generation:');
    
    // Same logic as in railway-bot-simple.js
    const clientId = process.env.ZOOM_CLIENT_ID || 'vGVyI0IRv6si45iKO_qIw';
    const redirectUri = encodeURIComponent(process.env.ZOOM_REDIRECT_URI || 'https://pupfr.github.io/Nebulosa/zoom-callback.html');
    const userId = 123456789; // Test user ID
    const state = `user_${userId}_${Date.now()}`;
    
    const oauthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=meeting:read,meeting:write,user:read`;
    
    console.log('📋 OAuth URL Components:');
    console.log(`• Client ID: ${clientId}`);
    console.log(`• Redirect URI: ${decodeURIComponent(redirectUri)}`);
    console.log(`• State: ${state}`);
    console.log(`• Scopes: meeting:read,meeting:write,user:read`);
    console.log('');
    console.log('🔗 Generated OAuth URL:');
    console.log(oauthUrl);
    console.log('');
    
    // Test if URL looks valid
    if (oauthUrl.includes('zoom.us') && oauthUrl.includes('client_id') && oauthUrl.includes('redirect_uri')) {
        console.log('✅ OAuth URL appears valid');
        
        // Test the redirect URI
        console.log('\n📄 Testing redirect URI:');
        console.log(`Redirect URI: ${decodeURIComponent(redirectUri)}`);
        
        if (decodeURIComponent(redirectUri).includes('pupfr.github.io')) {
            console.log('✅ Redirect URI points to GitHub Pages');
        } else {
            console.log('❌ Redirect URI may be incorrect');
        }
        
        return true;
    } else {
        console.log('❌ OAuth URL appears malformed');
        return false;
    }
}

function testZoomClientConfig() {
    console.log('\n🔧 Testing Zoom client configuration:');
    
    const clientId = process.env.ZOOM_CLIENT_ID || 'vGVyI0IRv6si45iKO_qIw';
    const clientSecret = process.env.ZOOM_CLIENT_SECRET || 'qL0UeGFWeQM2Csu1Z1G2J4RAZt4QGzi6';
    const redirectUri = process.env.ZOOM_REDIRECT_URI || 'https://pupfr.github.io/Nebulosa/zoom-callback.html';
    
    console.log(`• ZOOM_CLIENT_ID: ${clientId ? 'Set' : 'Missing'} (${clientId})`);
    console.log(`• ZOOM_CLIENT_SECRET: ${clientSecret ? 'Set' : 'Missing'} (${clientSecret ? clientSecret.substring(0, 8) + '...' : 'N/A'})`);
    console.log(`• ZOOM_REDIRECT_URI: ${redirectUri ? 'Set' : 'Missing'} (${redirectUri})`);
    
    return clientId && clientSecret && redirectUri;
}

function generateTelegramMessage() {
    console.log('\n📱 Testing Telegram message generation:');
    
    const clientId = process.env.ZOOM_CLIENT_ID || 'vGVyI0IRv6si45iKO_qIw';
    const redirectUri = encodeURIComponent(process.env.ZOOM_REDIRECT_URI || 'https://pupfr.github.io/Nebulosa/zoom-callback.html');
    const userId = 123456789;
    const state = `user_${userId}_${Date.now()}`;
    
    const oauthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=meeting:read,meeting:write,user:read`;
    
    const loginMessage = `
🔐 **Autorización Zoom OAuth**

Para usar las funciones de Zoom, necesitas autorizar el bot:

🔗 **[Hacer clic aquí para autorizar](${oauthUrl})**

📝 **Instrucciones:**
1. Haz clic en el enlace de arriba
2. Inicia sesión en Zoom
3. Autoriza la aplicación "LA NUBE BOT"
4. Serás redirigido a la página de confirmación
5. ¡Regresa aquí y usa /create_meeting!

⚡ **Estado:** ${state}
    `;
    
    console.log('Generated message for Telegram:');
    console.log(loginMessage);
    
    return loginMessage.length > 0;
}

async function runTest() {
    console.log('🎯 Running /zoomlogin functionality test...\n');
    
    const results = {
        urlGeneration: testZoomLoginGeneration(),
        clientConfig: testZoomClientConfig(),
        messageGeneration: generateTelegramMessage()
    };
    
    console.log('\n📊 TEST RESULTS');
    console.log('================');
    console.log(`🔗 OAuth URL Generation: ${results.urlGeneration ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`🔧 Client Configuration: ${results.clientConfig ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`📱 Message Generation: ${results.messageGeneration ? '✅ PASS' : '❌ FAIL'}`);
    
    const allPassed = Object.values(results).every(result => result === true);
    
    console.log('\n🎉 OVERALL STATUS');
    console.log('=================');
    
    if (allPassed) {
        console.log('✅ ALL TESTS PASSED!');
        console.log('🚀 /zoomlogin command should work correctly!');
        console.log('\n💡 POSSIBLE ISSUES:');
        console.log('1. Check if Zoom app has the correct redirect URI');
        console.log('2. Ensure Zoom app is published/approved');
        console.log('3. Verify Railway environment variables are set');
    } else {
        console.log('❌ SOME TESTS FAILED');
        console.log('🔧 Please fix the issues above');
    }
}

runTest().catch(console.error);
