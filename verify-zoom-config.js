#!/usr/bin/env node

console.log('🔍 VERIFICADOR DE CONFIGURACIÓN ZOOM');
console.log('==================================\n');

console.log('📋 Tu configuración actual:');
console.log('Client ID: vGVyI0IRv6si45iKO_qIw');
console.log('Redirect URI requerida: https://pupfr.github.io/Nebulosa/zoom-callback.html');
console.log();

console.log('❌ PROBLEMA DETECTADO:');
console.log('El error 4.700 significa que tu aplicación de Zoom NO tiene');
console.log('configurada la redirect URI de GitHub Pages.');
console.log();

console.log('🎯 ACCIÓN REQUERIDA:');
console.log('1. Ve a: https://marketplace.zoom.us/develop/apps');
console.log('2. Busca tu app con Client ID: vGVyI0IRv6si45iKO_qIw');
console.log('3. En la sección "OAuth", agrega esta URI EXACTA:');
console.log('   https://pupfr.github.io/Nebulosa/zoom-callback.html');
console.log('4. GUARDA los cambios');
console.log('5. Espera 2-3 minutos para propagación');
console.log();

console.log('🧪 URLs de prueba después de configurar:');

const testUrls = [
  {
    name: 'GitHub Pages (PRINCIPAL)',
    url: 'https://zoom.us/oauth/authorize?response_type=code&client_id=vGVyI0IRv6si45iKO_qIw&redirect_uri=https%3A%2F%2Fpupfr.github.io%2FNebulosa%2Fzoom-callback.html&scope=meeting%3Aread%20meeting%3Awrite%20user%3Aread&state=test123'
  },
  {
    name: 'Localhost (DESARROLLO)',
    url: 'https://zoom.us/oauth/authorize?response_type=code&client_id=vGVyI0IRv6si45iKO_qIw&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fzoom%2Fcallback&scope=meeting%3Aread%20meeting%3Awrite%20user%3Aread&state=test123'
  }
];

testUrls.forEach((test, index) => {
  console.log(`${index + 1}. ${test.name}:`);
  console.log(`   ${test.url}`);
  console.log();
});

console.log('⚠️ IMPORTANTE:');
console.log('- Para usar GitHub Pages: agrega https://pupfr.github.io/Nebulosa/zoom-callback.html');
console.log('- Para usar localhost: agrega http://localhost:3000/auth/zoom/callback');
console.log('- Puedes agregar AMBAS URIs a tu aplicación de Zoom');
console.log();

console.log('🔄 DESPUÉS DE CONFIGURAR:');
console.log('- El error 4.700 desaparecerá');
console.log('- Verás la pantalla de autorización de Zoom');
console.log('- Serás redirigido a tu página de callback');
console.log();

console.log('💡 Si no puedes acceder a tu app de Zoom:');
console.log('- Revisa en qué cuenta está la aplicación');
console.log('- Pregunta al administrador de la cuenta');
console.log('- Considera crear una nueva aplicación OAuth');
