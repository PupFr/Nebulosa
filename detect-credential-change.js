#!/usr/bin/env node

console.log('🚨 DETECTADO CAMBIO DE CREDENCIALES');
console.log('===================================\n');

console.log('⚠️  CAMBIOS CRÍTICOS DETECTADOS:');
console.log('=================================');
console.log('URL ANTERIOR que usabas:');
console.log('• Client ID: vGVyI0IRv6si45iKO_qIw');
console.log('• Redirect: https://pupfr.github.io/Nebulosa/zoom-callback.html');
console.log('');
console.log('URL NUEVA que probaste:');
console.log('• Client ID: K3t8Sd3rSZOSKfkyMftDXg ← NUEVO');
console.log('• Redirect: https://pupfrisky.com/zoom-callback ← NUEVO');
console.log('');

console.log('🤔 POSIBLES ESCENARIOS:');
console.log('=======================');
console.log('ESCENARIO A: Creaste nueva app Zoom');
console.log('   → Tienes 2 apps ahora');
console.log('   → La nueva puede estar en Development mode');
console.log('   → Por eso funciona mejor\n');

console.log('ESCENARIO B: Cambiaste credenciales');
console.log('   → Actualizaste la app existente');
console.log('   → Nuevas credenciales, nuevo dominio');
console.log('   → pupfrisky.com es tu dominio personal\n');

console.log('ESCENARIO C: Probando diferentes configs');
console.log('   → Experimentando con múltiples setups');
console.log('   → Buscando cuál funciona\n');

console.log('🎯 ACCIONES RECOMENDADAS:');
console.log('=========================\n');

console.log('1. 🔍 ACLARAR SITUACIÓN:');
console.log('   → ¿Creaste nueva app o cambiaste la existente?');
console.log('   → ¿pupfrisky.com es tu dominio?');
console.log('   → ¿Necesitas actualizar .env con nuevas credenciales?\n');

console.log('2. 📝 ACTUALIZAR .ENV SI ES NECESARIO:');
console.log('   Si usas nuevas credenciales, actualiza:');
console.log('   ZOOM_CLIENT_ID=K3t8Sd3rSZOSKfkyMftDXg');
console.log('   ZOOM_REDIRECT_URI=https://pupfrisky.com/zoom-callback\n');

console.log('3. 🌐 VERIFICAR CALLBACK PÁGINA:');
console.log('   → ¿Existe https://pupfrisky.com/zoom-callback?');
console.log('   → ¿Está configurada para manejar OAuth?');
console.log('   → ¿O necesitas crear esta página?\n');

console.log('4. 🔧 CONFIGURAR REDIRECT URI:');
console.log('   En tu nueva app Zoom, agrega:');
console.log('   https://pupfrisky.com/zoom-callback');
console.log('   (sin URL encoding en la configuración)\n');

console.log('🚀 PRÓXIMOS PASOS:');
console.log('==================');
console.log('1. Confirma qué setup quieres usar');
console.log('2. Actualiza .env si cambió');
console.log('3. Verifica callback URL existe');
console.log('4. Prueba OAuth con nuevas credenciales');

console.log('\n💡 Si la nueva app funciona mejor, úsala.');
console.log('Si no, podemos volver a la configuración anterior.');
