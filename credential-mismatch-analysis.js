#!/usr/bin/env node

console.log('🔍 MISMATCHED CREDENTIALS - SAME APP');
console.log('===================================\n');

console.log('🚨 PROBLEMA IDENTIFICADO:');
console.log('=========================');
console.log('• Es la MISMA app Zoom ✅');
console.log('• Pero usas credenciales DIFERENTES ❌');
console.log('• Esto causa confusión y errores\n');

console.log('📊 COMPARACIÓN:');
console.log('===============');
console.log('EN TU .ENV (configurado):');
console.log('• Client ID: vGVyI0IRv6si45iKO_qIw');
console.log('• Redirect: https://pupfr.github.io/Nebulosa/zoom-callback.html');
console.log('');
console.log('EN TU PRUEBA (URL que usaste):');
console.log('• Client ID: K3t8Sd3rSZOSKfkyMftDXg ← DIFERENTE');
console.log('• Redirect: https://pupfrisky.com/zoom-callback ← DIFERENTE');
console.log('');

console.log('🤔 POSIBLES CAUSAS:');
console.log('==================');
console.log('CAUSA A: Client ID cambió en la app');
console.log('   → Zoom regeneró credenciales');
console.log('   → Necesitas actualizar .env');
console.log('   → Usar el nuevo Client ID\n');

console.log('CAUSA B: Múltiples redirect URIs');
console.log('   → App tiene varias URLs configuradas');
console.log('   → pupfrisky.com Y GitHub Pages');
console.log('   → Ambas deberían funcionar\n');

console.log('CAUSA C: Configuración incorrecta');
console.log('   → Copiaste mal el Client ID');
console.log('   → O estás viendo datos de otra app');
console.log('   → Necesitas verificar en Zoom Marketplace\n');

console.log('🛠️  SOLUCIÓN INMEDIATA:');
console.log('=======================');
console.log('1. 🔍 Ve a tu app en Zoom Marketplace');
console.log('2. 📝 Copia el Client ID ACTUAL');
console.log('3. ✏️  Actualiza .env con credenciales correctas');
console.log('4. 🌐 Verifica redirect URIs configuradas');
console.log('5. 🧪 Prueba OAuth con datos correctos\n');

console.log('⚡ ACCIONES CRÍTICAS:');
console.log('====================');
console.log('PASO 1: Verificar Client ID real');
console.log('   → ¿Es vGVyI0IRv6si45iKO_qIw o K3t8Sd3rSZOSKfkyMftDXg?');
console.log('');
console.log('PASO 2: Verificar redirect URIs');
console.log('   → ¿Están ambas URLs agregadas?');
console.log('   → https://pupfr.github.io/Nebulosa/zoom-callback.html');
console.log('   → https://pupfrisky.com/zoom-callback');
console.log('');
console.log('PASO 3: Usar credenciales consistentes');
console.log('   → Actualizar .env con datos reales');
console.log('   → Probar con configuración correcta');

console.log('\n🎯 NECESITAMOS SABER:');
console.log('=====================');
console.log('1. ¿Cuál es el Client ID REAL de tu app?');
console.log('2. ¿Qué redirect URIs tienes configuradas?');
console.log('3. ¿Funciona https://pupfrisky.com/zoom-callback?');
console.log('4. ¿Persiste error 4.700 con nuevas credenciales?');

console.log('\n💡 Una vez que tengamos datos correctos,');
console.log('podemos actualizar todo y hacer que funcione.');
