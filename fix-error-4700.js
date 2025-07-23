#!/usr/bin/env node

console.log('🚨 SOLUCIÓN ERROR 4.700 - Invalid Redirect URI');
console.log('==============================================\n');

console.log('❌ Error que estás viendo:');
console.log('   "¡Vaya! No hemos podido completar su solicitud. Inténtelo de nuevo. (4.700)"');
console.log('');

console.log('🔍 CAUSA DEL PROBLEMA:');
console.log('   El redirect URI no está configurado en tu aplicación de Zoom.');
console.log('   Zoom rechaza cualquier redirect URI que no esté pre-autorizado.');
console.log('');

console.log('✅ SOLUCIÓN PASO A PASO:');
console.log('========================\n');

console.log('📱 PASO 1: Accede a Zoom Marketplace');
console.log('   → Abre: https://marketplace.zoom.us/develop/apps');
console.log('   → Inicia sesión con tu cuenta de Zoom');
console.log('');

console.log('🔍 PASO 2: Encuentra tu aplicación');
console.log('   → Busca la app con Client ID: vGVyI0IRv6si45iKO_qIw');
console.log('   → Haz clic en el nombre de tu aplicación');
console.log('');

console.log('⚙️  PASO 3: Ir a configuración OAuth');
console.log('   → En el menú lateral, busca "OAuth" o "App Credentials"');
console.log('   → Busca la sección "Redirect URL for OAuth" o similar');
console.log('');

console.log('✏️  PASO 4: Agregar Redirect URI');
console.log('   → Agrega EXACTAMENTE esta URL (copia y pega):');
console.log('');
console.log('      https://pupfr.github.io/Nebulosa/zoom-callback.html');
console.log('');
console.log('   ⚠️  IMPORTANTE: Debe ser EXACTA, sin espacios extra');
console.log('');

console.log('💾 PASO 5: Guardar cambios');
console.log('   → Haz clic en "Save" o "Update"');
console.log('   → Espera 2-3 minutos para que se aplique el cambio');
console.log('');

console.log('🧪 PASO 6: Probar de nuevo');
console.log('   → Usa esta URL para probar:');
console.log('');
console.log('https://zoom.us/oauth/authorize?response_type=code&client_id=vGVyI0IRv6si45iKO_qIw&redirect_uri=https%3A%2F%2Fpupfr.github.io%2FNebulosa%2Fzoom-callback.html&scope=meeting%3Aread%20meeting%3Awrite%20user%3Aread&state=test123');
console.log('');

console.log('🎯 VERIFICACIONES:');
console.log('================');
console.log('✅ Client ID correcto: vGVyI0IRv6si45iKO_qIw');
console.log('✅ Callback URL funciona: https://pupfr.github.io/Nebulosa/zoom-callback.html');
console.log('✅ Configuración .env actualizada');
console.log('❓ Redirect URI en Zoom app: PENDIENTE ← Este es el problema');
console.log('');

console.log('💡 TIPS ADICIONALES:');
console.log('===================');
console.log('• Si no encuentras la sección OAuth, busca "App Credentials"');
console.log('• Puede llamarse "Redirect URL", "Callback URL" o "Redirect URI"');
console.log('• Algunos apps de Zoom permiten múltiples redirect URIs');
console.log('• NO uses HTTP, solo HTTPS (GitHub Pages ya usa HTTPS)');
console.log('');

console.log('🆘 SI SIGUES TENIENDO PROBLEMAS:');
console.log('================================');
console.log('1. Verifica que tu app de Zoom esté "Published" o "Enabled"');
console.log('2. Confirma que tienes permisos de administrador en la app');
console.log('3. Intenta crear una nueva app de Zoom si es necesaria');
console.log('4. Asegúrate de estar usando la app correcta (Client ID correcto)');
console.log('');

console.log('📞 CONTACTO DE SOPORTE:');
console.log('   Si el problema persiste, contacta soporte de Zoom con:');
console.log('   • Client ID: vGVyI0IRv6si45iKO_qIw');
console.log('   • Error: 4.700 Invalid Redirect URI');
console.log('   • Redirect URI deseada: https://pupfr.github.io/Nebulosa/zoom-callback.html');
