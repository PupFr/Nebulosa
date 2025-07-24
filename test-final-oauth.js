#!/usr/bin/env node

const axios = require('axios');
require('dotenv').config();

console.log('🎯 PROBANDO OAUTH CON CREDENCIALES CORRECTAS');
console.log('============================================\n');

const clientId = process.env.ZOOM_USER_CLIENT_ID || process.env.ZOOM_CLIENT_ID;
const clientSecret = process.env.ZOOM_USER_CLIENT_SECRET || process.env.ZOOM_CLIENT_SECRET;
const redirectUri = process.env.ZOOM_REDIRECT_URI;
const secretToken = process.env.ZOOM_SECRET_TOKEN;

console.log('📋 CREDENCIALES FINALES:');
console.log('========================');
console.log('Client ID:', clientId);
console.log('Client Secret:', clientSecret ? `${clientSecret.substring(0, 8)}...${clientSecret.substring(-4)}` : '❌ Missing');
console.log('Redirect URI:', redirectUri);
console.log('Secret Token (webhooks):', secretToken ? `${secretToken.substring(0, 8)}...` : '❌ Missing');
console.log('');

console.log('✅ DIFERENCIA CLARIFICADA:');
console.log('===========================');
console.log('• Client Secret (OAuth):', clientSecret ? '✅ Configurado' : '❌ Faltante');
console.log('• Secret Token (Webhooks):', secretToken ? '✅ Configurado' : '❌ Faltante');
console.log('');

// Test GitHub Pages callback
async function testCallback() {
  console.log('🌐 Probando GitHub Pages callback...');
  try {
    const response = await axios.get(redirectUri, { timeout: 10000 });
    console.log(`✅ Callback accesible (HTTP ${response.status})`);
    return true;
  } catch (error) {
    console.log(`❌ Error en callback: ${error.message}`);
    return false;
  }
}

// Generate OAuth URL
function generateOAuthURL() {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'meeting:write meeting:read user:read',
    state: 'test_final'
  });
  
  return `https://zoom.us/oauth/authorize?${params.toString()}`;
}

async function main() {
  console.log('🧪 PRUEBAS FINALES:');
  console.log('===================');
  
  // Test callback
  const callbackWorking = await testCallback();
  
  if (clientId && clientSecret && redirectUri && callbackWorking) {
    console.log('✅ CONFIGURACIÓN COMPLETA Y LISTA!');
    console.log('');
    console.log('🔗 URL DE PRUEBA OAUTH:');
    console.log('=======================');
    const oauthUrl = generateOAuthURL();
    console.log(oauthUrl);
    console.log('');
    
    console.log('📝 PASOS FINALES:');
    console.log('================');
    console.log('1. ✅ Client Secret correcto configurado');
    console.log('2. ✅ GitHub Pages callback funcionando');
    console.log('3. ⚠️  FALTA: Agregar redirect URI en Zoom app');
    console.log('   → Ve a: https://marketplace.zoom.us/develop/apps');
    console.log('   → Encuentra tu app: vGVyI0IRv6si45iKO_qIw');
    console.log('   → Agrega: https://pupfr.github.io/Nebulosa/zoom-callback.html');
    console.log('4. 🧪 Probar la URL de arriba');
    console.log('');
    
    console.log('🎉 DESPUÉS DE CONFIGURAR EL REDIRECT URI:');
    console.log('=========================================');
    console.log('• El error 4.700 debería desaparecer');
    console.log('• OAuth debería funcionar perfectamente');
    console.log('• Podrás usar /zoomlogin en tu bot');
    
  } else {
    console.log('❌ Configuración incompleta');
    if (!callbackWorking) console.log('   → Callback no accesible');
    if (!clientId) console.log('   → Client ID faltante');
    if (!clientSecret) console.log('   → Client Secret faltante');
    if (!redirectUri) console.log('   → Redirect URI faltante');
  }
}

main().catch(console.error);
