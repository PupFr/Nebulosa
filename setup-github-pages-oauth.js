#!/usr/bin/env node

require('dotenv').config();

console.log('🚀 Configurando OAuth para GitHub Pages');
console.log('=====================================\n');

// Get client credentials
function getClientId() {
  return process.env.ZOOM_USER_CLIENT_ID || process.env.ZOOM_CLIENT_ID;
}

const clientId = getClientId();

console.log('📋 Configuración Actual:');
console.log('Client ID:', clientId ? `${clientId.substring(0, 8)}...` : '❌ Missing');
console.log('Redirect URI actual:', process.env.ZOOM_REDIRECT_URI || '❌ No configurada');
console.log();

console.log('🔧 PASO 1: Configurar tu aplicación de Zoom');
console.log('===========================================');
console.log('1. Ve a: https://marketplace.zoom.us/develop/apps');
console.log('2. Busca tu aplicación con Client ID:', clientId);
console.log('3. En la sección "OAuth", agrega esta Redirect URI EXACTA:');
console.log();
console.log('   https://pupfr.github.io/Nebulosa/zoom-callback.html');
console.log();
console.log('4. Asegúrate de que tengas estos scopes:');
console.log('   - meeting:read');
console.log('   - meeting:write');
console.log('   - user:read');
console.log();
console.log('5. Guarda los cambios y espera 2-3 minutos');
console.log();

console.log('🔧 PASO 2: URLs de OAuth generadas');
console.log('==================================');

if (clientId) {
  const scopes = 'meeting:read meeting:write user:read';
  const state = 'github_pages_test';
  const redirectUri = 'https://pupfr.github.io/Nebulosa/zoom-callback.html';
  
  const oauthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&state=${state}`;
  
  console.log('URL de autorización para GitHub Pages:');
  console.log(oauthUrl);
  console.log();
} else {
  console.log('❌ No se puede generar URL sin Client ID');
}

console.log('🔧 PASO 3: Actualizar variables de entorno');
console.log('=========================================');
console.log('Agrega esta línea a tu archivo .env:');
console.log();
console.log('ZOOM_REDIRECT_URI=https://pupfr.github.io/Nebulosa/zoom-callback.html');
console.log();

console.log('🔧 PASO 4: Verificar callback en GitHub Pages');
console.log('=============================================');
console.log('Asegúrate de que este archivo exista y esté funcionando:');
console.log('https://pupfr.github.io/Nebulosa/zoom-callback.html');
console.log();

console.log('🧪 PASO 5: Probar OAuth');
console.log('=======================');
console.log('1. Configura tu app de Zoom (Paso 1)');
console.log('2. Actualiza .env (Paso 3)');
console.log('3. Reinicia tu bot');
console.log('4. Usa /zoomlogin en Telegram');
console.log();

console.log('💡 Ventajas de GitHub Pages:');
console.log('- ✅ Funciona en producción');
console.log('- ✅ HTTPS automático');
console.log('- ✅ No necesita servidor local');
console.log('- ✅ Siempre disponible');
console.log();

console.log('🔍 Si necesitas depurar, usa:');
console.log('node diagnose-oauth-error.js');
