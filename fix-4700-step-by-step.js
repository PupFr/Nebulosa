#!/usr/bin/env node

console.log('🚨 ERROR 4.700 - GUÍA VISUAL PASO A PASO');
console.log('=======================================\n');

console.log('❌ Error actual: "¡Vaya! No hemos podido completar su solicitud. Inténtelo de nuevo. (4.700)"');
console.log('🔍 Causa: El redirect URI NO está configurado en tu app de Zoom\n');

console.log('📱 INSTRUCCIONES DETALLADAS:');
console.log('============================\n');

console.log('🌐 PASO 1: Abrir Zoom Marketplace');
console.log('   URL: https://marketplace.zoom.us/develop/apps');
console.log('   → Inicia sesión si es necesario\n');

console.log('🔍 PASO 2: Encontrar tu aplicación');
console.log('   → Busca "NEBULOSA BOT for Zoom meeting manage..."');
console.log('   → O busca por Client ID: vGVyI0IRv6si45iKO_qIw');
console.log('   → Haz clic en el NOMBRE de tu aplicación\n');

console.log('⚙️  PASO 3: Ir a OAuth Settings');
console.log('   En el menú lateral izquierdo, busca y haz clic en:');
console.log('   → "OAuth" (puede estar bajo "Features")');
console.log('   → O "App Credentials"');
console.log('   → O "Redirect URLs"\n');

console.log('✏️  PASO 4: Encontrar la sección de Redirect URLs');
console.log('   Busca una sección que diga:');
console.log('   → "Redirect URL for OAuth"');
console.log('   → "OAuth Redirect URI"');
console.log('   → "Allowed Redirect URLs"');
console.log('   → Puede tener un campo de texto y botón "Add"\n');

console.log('📝 PASO 5: Agregar el Redirect URI');
console.log('   → Copia EXACTAMENTE esta URL:');
console.log('     https://pupfr.github.io/Nebulosa/zoom-callback.html');
console.log('   → Pégala en el campo de texto');
console.log('   → Haz clic en "Add" o "Save"\n');

console.log('💾 PASO 6: Guardar cambios');
console.log('   → Busca un botón "Save" o "Update" en la página');
console.log('   → Haz clic para guardar');
console.log('   → Espera confirmación de que se guardó\n');

console.log('⏱️  PASO 7: Esperar propagación');
console.log('   → Espera 2-3 minutos para que se aplique el cambio');
console.log('   → Zoom necesita tiempo para actualizar la configuración\n');

console.log('🧪 PASO 8: Probar de nuevo');
console.log('   Usa esta URL para probar:');
console.log('   https://zoom.us/oauth/authorize?response_type=code&client_id=vGVyI0IRv6si45iKO_qIw&redirect_uri=https%3A%2F%2Fpupfr.github.io%2FNebulosa%2Fzoom-callback.html&scope=meeting%3Awrite+meeting%3Aread+user%3Aread&state=test\n');

console.log('🔍 SECCIONES DONDE PUEDE ESTAR:');
console.log('===============================');
console.log('En diferentes versiones de Zoom Marketplace, puede estar en:');
console.log('• "OAuth" → "Redirect URLs"');
console.log('• "App Credentials" → "OAuth Redirect URI"');
console.log('• "Features" → "OAuth" → "Redirect URLs"');
console.log('• "Build" → "OAuth" → "Allowed Redirect URLs"\n');

console.log('⚠️  IMPORTANTE:');
console.log('==============');
console.log('• La URL debe ser EXACTA (sin espacios)');
console.log('• Debe usar HTTPS (no HTTP)');
console.log('• No agregues "/" al final');
console.log('• Copia y pega, no escribas manualmente\n');

console.log('🆘 SI NO ENCUENTRAS LA SECCIÓN:');
console.log('===============================');
console.log('1. Busca en TODAS las pestañas del menú lateral');
console.log('2. Usa Ctrl+F para buscar "redirect" en la página');
console.log('3. Verifica que estés en la app correcta');
console.log('4. Asegúrate de tener permisos de administrador\n');

console.log('✅ CÓMO SABER SI FUNCIONÓ:');
console.log('=========================');
console.log('• El error 4.700 desaparecerá');
console.log('• Zoom te pedirá autorización');
console.log('• Te redirigirá a GitHub Pages');
console.log('• Verás "¡Conexión Exitosa!" en la página');

console.log('\n🎯 URL EXACTA PARA AGREGAR:');
console.log('===========================');
console.log('https://pupfr.github.io/Nebulosa/zoom-callback.html');
console.log('\n(¡Copia esta línea exacta!)');
