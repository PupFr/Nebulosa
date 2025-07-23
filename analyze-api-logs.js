#!/usr/bin/env node

console.log('🔍 ANÁLISIS DE LOGS DE API - ERROR 400');
console.log('=====================================\n');

console.log('📊 LO QUE VEO EN TU SCREENSHOT:');
console.log('===============================');
console.log('• Estás en "Call logs" de tu app');
console.log('• Hay errores 400 en los logs');
console.log('• Fecha: Jul 17, 2025');
console.log('• Endpoints: /users/me/meetings y /users/me');
console.log('');

console.log('🔴 ANÁLISIS DEL ERROR 400:');
console.log('==========================');
console.log('• HTTP 400 = Bad Request');
console.log('• En OAuth, puede indicar:');
console.log('  - Redirect URI no válida');
console.log('  - Client ID incorrecto');
console.log('  - Parámetros mal formateados');
console.log('  - App no publicada/activada');
console.log('');

console.log('🎯 SOLUCIONES ESPECÍFICAS:');
console.log('==========================\n');

console.log('🚀 SOLUCIÓN INMEDIATA: Probar con localhost');
console.log('   → Agrega localhost a OAuth Allow Lists');
console.log('   → URL: http://localhost:3000/auth/zoom/callback');
console.log('   → Inicia servidor: node oauth-callback-only.js');
console.log('   → Prueba OAuth con localhost primero');
console.log('');

console.log('📝 VERIFICACIONES CRÍTICAS:');
console.log('===========================');
console.log('1. ¿Tu app está en modo "Development" o "Production"?');
console.log('2. ¿La app está "Published" o activada?');
console.log('3. ¿Los scopes están configurados correctamente?');
console.log('4. ¿El Client ID es exactamente: vGVyI0IRv6si45iKO_qIw?');
console.log('');

console.log('🔧 PLAN DE ACCIÓN PASO A PASO:');
console.log('==============================\n');

console.log('PASO 1: Agregar localhost como backup');
console.log('   → Ve a OAuth Allow Lists en tu app');
console.log('   → Agrega: http://localhost:3000/auth/zoom/callback');
console.log('   → Guarda cambios');
console.log('');

console.log('PASO 2: Iniciar servidor local');
console.log('   → Ejecuta: node oauth-callback-only.js');
console.log('   → Confirma que dice "running on port 3000"');
console.log('');

console.log('PASO 3: Probar con localhost');
console.log('   → URL de prueba:');
console.log('https://zoom.us/oauth/authorize?response_type=code&client_id=vGVyI0IRv6si45iKO_qIw&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fzoom%2Fcallback&scope=meeting%3Aread+meeting%3Awrite+user%3Aread&state=test');
console.log('');

console.log('PASO 4: Si localhost funciona');
console.log('   → El problema está en la URL de GitHub Pages');
console.log('   → Revisa formato exacto en Allow Lists');
console.log('   → Espera más tiempo para propagación');
console.log('');

console.log('PASO 5: Si localhost NO funciona');
console.log('   → El problema está en la configuración de la app');
console.log('   → Verifica que la app esté activa/publicada');
console.log('   → Contacta soporte de Zoom');
console.log('');

console.log('🎯 URLs PARA TESTING:');
console.log('=====================');
console.log('Localhost:');
console.log('https://zoom.us/oauth/authorize?response_type=code&client_id=vGVyI0IRv6si45iKO_qIw&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fzoom%2Fcallback&scope=meeting%3Aread+meeting%3Awrite+user%3Aread&state=localhost_test');
console.log('');
console.log('GitHub Pages:');
console.log('https://zoom.us/oauth/authorize?response_type=code&client_id=vGVyI0IRv6si45iKO_qIw&redirect_uri=https%3A%2F%2Fpupfr.github.io%2FNebulosa%2Fzoom-callback.html&scope=meeting%3Aread+meeting%3Awrite+user%3Aread&state=github_test');
console.log('');

console.log('💡 TEORÍA:');
console.log('==========');
console.log('Los errores 400 en los logs sugieren que hay un problema');
console.log('fundamental con la configuración de la app, no solo con');
console.log('el redirect URI. Probar localhost nos ayudará a identificar');
console.log('si el problema es específico de GitHub Pages o general.');
console.log('');

console.log('🚨 ACCIÓN INMEDIATA:');
console.log('====================');
console.log('1. Agrega localhost a Allow Lists');
console.log('2. Ejecuta: node oauth-callback-only.js');
console.log('3. Prueba URL de localhost');
console.log('4. Reporta el resultado');

console.log('\n📞 Si sigue fallando, necesitaremos revisar:');
console.log('• Estado de publicación de la app');
console.log('• Configuración de scopes');
console.log('• Modo Development vs Production');
