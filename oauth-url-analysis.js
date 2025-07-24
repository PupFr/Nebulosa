#!/usr/bin/env node

console.log('🔍 ANÁLISIS OAUTH URL - DIAGNÓSTICO COMPLETO');
console.log('============================================\n');

console.log('📋 URL QUE PROBASTE:');
console.log('====================');
console.log('https://zoom.us/oauth/authorize?response_type=code&client_id=vGVyI0IRv6si45iKO_qIw&redirect_uri=https://pupfr.github.io/Nebulosa/zoom-callback.html');
console.log('');

console.log('⚠️  PROBLEMA DETECTADO:');
console.log('=======================');
console.log('• Tu URL NO está URL-encoded ❌');
console.log('• Zoom requiere redirect_uri URL-encoded');
console.log('• Esto puede causar el error 4.700\n');

console.log('✅ URLs CORRECTAS PARA PROBAR:');
console.log('==============================\n');

console.log('🌐 GITHUB PAGES (URL-encoded correcta):');
console.log('https://zoom.us/oauth/authorize?response_type=code&client_id=vGVyI0IRv6si45iKO_qIw&redirect_uri=https%3A%2F%2Fpupfr.github.io%2FNebulosa%2Fzoom-callback.html&scope=meeting%3Aread+meeting%3Awrite+user%3Aread&state=test');
console.log('');

console.log('🏠 LOCALHOST (servidor ya corriendo):');
console.log('https://zoom.us/oauth/authorize?response_type=code&client_id=vGVyI0IRv6si45iKO_qIw&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fzoom%2Fcallback&scope=meeting%3Aread+meeting%3Awrite+user%3Aread&state=test');
console.log('');

console.log('🔧 DIFERENCIAS CLAVE:');
console.log('=====================');
console.log('Tu URL:      https://pupfr.github.io/Nebulosa/zoom-callback.html');
console.log('URL-encoded: https%3A%2F%2Fpupfr.github.io%2FNebulosa%2Fzoom-callback.html');
console.log('             ⬆️ Los : y / deben estar encoded\n');

console.log('🎯 PRUEBAS RECOMENDADAS:');
console.log('========================');
console.log('1. 🏠 PRIMERO: Prueba localhost URL (arriba)');
console.log('   → Servidor ya está corriendo en puerto 3000');
console.log('   → Debería funcionar si el problema es la URL');
console.log('   → Verifica logs en la terminal\n');

console.log('2. 🌐 SEGUNDO: Prueba GitHub Pages URL-encoded (arriba)');
console.log('   → Usa la versión con %3A%2F%2F');
console.log('   → Si TDD está completo, debería funcionar');
console.log('   → Si no, el problema es que app no está activa\n');

console.log('📊 RESULTADOS ESPERADOS:');
console.log('========================');
console.log('• Localhost funciona ✅ = OAuth OK, problema en GitHub Pages config');
console.log('• Localhost falla ❌ = App no está activa, problema en Zoom');
console.log('• GitHub Pages funciona ✅ = ¡Todo resuelto!');
console.log('• Ambos fallan ❌ = App necesita más tiempo o contactar soporte\n');

console.log('⚡ ACCIÓN INMEDIATA:');
console.log('===================');
console.log('Copia y prueba la URL de LOCALHOST primero:');
console.log('https://zoom.us/oauth/authorize?response_type=code&client_id=vGVyI0IRv6si45iKO_qIw&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fzoom%2Fcallback&scope=meeting%3Aread+meeting%3Awrite+user%3Aread&state=test');

console.log('\n💡 Si localhost funciona, el problema es la configuración de redirect URI en tu app Zoom.');
