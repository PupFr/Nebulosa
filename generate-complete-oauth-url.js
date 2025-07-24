#!/usr/bin/env node

require('dotenv').config();

console.log('🔗 GENERANDO URL DE AUTORIZACIÓN COMPLETA');
console.log('========================================\n');

const clientId = process.env.ZOOM_USER_CLIENT_ID || process.env.ZOOM_CLIENT_ID;
const redirectUri = process.env.ZOOM_REDIRECT_URI;

console.log('📋 Tu URL actual:');
console.log('================');
console.log('https://zoom.us/oauth/authorize?response_type=code&client_id=vGVyI0IRv6si45iKO_qIw&redirect_uri=https://pupfr.github.io/Nebulosa/zoom-callback.html');
console.log('');

console.log('⚠️  PROBLEMA: Faltan parámetros requeridos');
console.log('==========================================');
console.log('• Falta "scope" (permisos requeridos)');
console.log('• Falta "state" (identificador único)');
console.log('• redirect_uri no está URL-encoded');
console.log('');

console.log('✅ URL COMPLETA Y CORRECTA:');
console.log('===========================');

if (clientId && redirectUri) {
  // Generate proper OAuth URL with all required parameters
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'meeting:read meeting:write user:read',
    state: 'oauth_test_' + Date.now()
  });
  
  const completeUrl = `https://zoom.us/oauth/authorize?${params.toString()}`;
  
  console.log(completeUrl);
  console.log('');
  
  console.log('📝 PARÁMETROS INCLUIDOS:');
  console.log('========================');
  console.log('• response_type: code');
  console.log('• client_id:', clientId);
  console.log('• redirect_uri:', redirectUri, '(URL-encoded)');
  console.log('• scope: meeting:read meeting:write user:read');
  console.log('• state: oauth_test_' + Date.now(), '(identificador único)');
  console.log('');
  
  console.log('🎯 INSTRUCCIONES DE USO:');
  console.log('========================');
  console.log('1. Copia la URL completa de arriba');
  console.log('2. Pégala en tu navegador');
  console.log('3. Si sale error 4.700: agrega redirect URI en Zoom app');
  console.log('4. Si funciona: te pedirá autorización de Zoom');
  console.log('5. Después te redirigirá a GitHub Pages');
  console.log('');
  
  console.log('✅ ESPERADO SI FUNCIONA:');
  console.log('========================');
  console.log('• Zoom te pide iniciar sesión');
  console.log('• Te muestra permisos a autorizar');
  console.log('• Haces clic en "Authorize"');
  console.log('• Te redirige a: https://pupfr.github.io/Nebulosa/zoom-callback.html');
  console.log('• Ves "¡Conexión Exitosa!" en la página');
  console.log('');
  
  console.log('❌ SI SIGUE ERROR 4.700:');
  console.log('========================');
  console.log('Necesitas agregar en Zoom Marketplace:');
  console.log('• App: vGVyI0IRv6si45iKO_qIw');
  console.log('• Sección: OAuth / Redirect URLs');
  console.log('• URL exacta: https://pupfr.github.io/Nebulosa/zoom-callback.html');
  
} else {
  console.log('❌ Error: Faltan credenciales en .env');
  console.log('Client ID:', clientId || 'MISSING');
  console.log('Redirect URI:', redirectUri || 'MISSING');
}

console.log('\n🔧 TAMBIÉN PUEDES PROBAR:');
console.log('=========================');
console.log('node test-final-oauth.js  # Para generar URLs de prueba');
console.log('node oauth-callback-only.js  # Para iniciar servidor local');
