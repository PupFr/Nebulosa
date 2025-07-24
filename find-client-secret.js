#!/usr/bin/env node

console.log('🔑 DIFERENCIA ENTRE TOKENS DE ZOOM');
console.log('==================================\n');

console.log('📋 TOKENS QUE VEO EN TU SCREENSHOT:');
console.log('==================================');
console.log('Client ID: vGVyI0IRv6si45iKO_qIw');
console.log('Client Secret: ••••••••••  ← NECESITAMOS ESTE PARA OAUTH');
console.log('Secret Token: 8yf0TomZRhywR46LqmpuPw  ← Este es para webhooks');
console.log('');

console.log('🔍 EXPLICACIÓN:');
console.log('===============');
console.log('• Client Secret: Para OAuth flow (intercambiar códigos por tokens)');
console.log('• Secret Token: Para verificar webhooks de Zoom');
console.log('');

console.log('❌ PROBLEMA ACTUAL:');
console.log('===================');
console.log('En tu .env tienes el Secret Token como Client Secret');
console.log('Necesitamos encontrar el verdadero Client Secret');
console.log('');

console.log('✅ SOLUCIÓN:');
console.log('============');
console.log('1. En tu screenshot de Zoom Marketplace');
console.log('2. Busca la sección "Client Secret" (no "Secret Token")');
console.log('3. Debería haber un botón "Copy" o "Show" junto a ••••••••••');
console.log('4. Copia el Client Secret real');
console.log('5. Reemplaza en .env:');
console.log('');
console.log('   ZOOM_CLIENT_SECRET=EL_CLIENT_SECRET_REAL');
console.log('   ZOOM_USER_CLIENT_SECRET=EL_CLIENT_SECRET_REAL');
console.log('');

console.log('📱 PASOS EN EL MARKETPLACE:');
console.log('===========================');
console.log('1. Ve a la sección "App Credentials"');
console.log('2. Encuentra "Client Secret" (diferente de "Secret Token")');
console.log('3. Haz clic en "Copy" o el icono 👁️ para mostrar');
console.log('4. Copia ese valor (será diferente de 8yf0TomZRhywR46LqmpuPw)');
console.log('');

console.log('🎯 TAMBIÉN AGREGA EL REDIRECT URI:');
console.log('==================================');
console.log('Mientras estés ahí, también agrega:');
console.log('https://pupfr.github.io/Nebulosa/zoom-callback.html');
console.log('En la sección "Redirect URL for OAuth"');
console.log('');

console.log('💡 TRUCO:');
console.log('=========');
console.log('El Client Secret suele ser más largo que el Secret Token');
console.log('Format típico: letras + números + símbolos, ~40+ caracteres');
