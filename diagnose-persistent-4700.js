#!/usr/bin/env node

console.log('🔴 ERROR 4.700 PERSISTENTE - DIAGNÓSTICO AVANZADO');
console.log('===============================================\n');

console.log('❌ SITUACIÓN ACTUAL:');
console.log('===================');
console.log('• Agregaste la URL a OAuth Allow Lists ✅');
console.log('• Pero aún recibes error 4.700 ❌');
console.log('• Esto indica que algo no está sincronizado\n');

console.log('🔍 POSIBLES CAUSAS:');
console.log('===================');
console.log('1. Cambios no propagados (necesita más tiempo)');
console.log('2. URL no guardada correctamente');
console.log('3. Diferencia entre Development/Production');
console.log('4. Cache de Zoom no actualizado');
console.log('5. URL con formato incorrecto\n');

console.log('🛠️  SOLUCIONES A PROBAR:');
console.log('========================\n');

console.log('🕐 SOLUCIÓN 1: Esperar más tiempo');
console.log('   → Espera 10-15 minutos adicionales');
console.log('   → Zoom puede tardar en sincronizar cambios');
console.log('   → Prueba la URL de nuevo después\n');

console.log('🔄 SOLUCIÓN 2: Verificar que se guardó');
console.log('   → Regresa a tu app en Zoom Marketplace');
console.log('   → Ve a la sección OAuth Allow Lists');
console.log('   → Confirma que aparece: https://pupfr.github.io/Nebulosa/zoom-callback.html');
console.log('   → Si no aparece, agrégala de nuevo\n');

console.log('🚀 SOLUCIÓN 3: Cambiar a Development mode');
console.log('   → En tu app, busca "Development" vs "Production"');
console.log('   → Cambia a "Development" temporalmente');
console.log('   → Prueba OAuth en modo desarrollo');
console.log('   → Si funciona, publica a producción después\n');

console.log('🧹 SOLUCIÓN 4: Limpiar cache');
console.log('   → Usa navegador en modo incógnito/privado');
console.log('   → O borra cookies/cache de zoom.us');
console.log('   → Prueba la URL OAuth de nuevo\n');

console.log('📝 SOLUCIÓN 5: Verificar formato exacto');
console.log('   → La URL debe ser EXACTAMENTE:');
console.log('     https://pupfr.github.io/Nebulosa/zoom-callback.html');
console.log('   → Sin espacios, sin "/" al final');
console.log('   → Copia y pega exactamente\n');

console.log('🔧 SOLUCIÓN 6: Usar localhost temporalmente');
console.log('   → Agrega también: http://localhost:3000/auth/zoom/callback');
console.log('   → Inicia el servidor local: node oauth-callback-only.js');
console.log('   → Usa localhost para probar si el problema es la URL\n');

console.log('🎯 URLs PARA PROBAR:');
console.log('====================');
console.log('GitHub Pages:');
console.log('https://zoom.us/oauth/authorize?response_type=code&client_id=vGVyI0IRv6si45iKO_qIw&redirect_uri=https%3A%2F%2Fpupfr.github.io%2FNebulosa%2Fzoom-callback.html&scope=meeting%3Aread+meeting%3Awrite+user%3Aread&state=test');
console.log('');
console.log('Localhost (como alternativa):');
console.log('https://zoom.us/oauth/authorize?response_type=code&client_id=vGVyI0IRv6si45iKO_qIw&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fzoom%2Fcallback&scope=meeting%3Aread+meeting%3Awrite+user%3Aread&state=test');
console.log('');

console.log('📞 SOLUCIÓN 7: Contactar soporte Zoom');
console.log('   Si nada funciona, contacta soporte con:');
console.log('   • App Name: NEBULOSA BOT for Zoom meeting manage...');
console.log('   • Client ID: vGVyI0IRv6si45iKO_qIw');
console.log('   • Error: 4.700 persiste después de agregar redirect URI');
console.log('   • Redirect URI: https://pupfr.github.io/Nebulosa/zoom-callback.html');
console.log('');

console.log('🔍 DIAGNÓSTICO RECOMENDADO:');
console.log('===========================');
console.log('1. Espera 15 minutos más');
console.log('2. Verifica en modo incógnito');
console.log('3. Confirma que la URL está guardada en Zoom');
console.log('4. Prueba localhost como alternativa');
console.log('5. Si todo falla, contacta soporte Zoom');

console.log('\n⏰ NOTA: Los cambios de OAuth en Zoom pueden tardar 5-30 minutos en aplicarse completamente.');
