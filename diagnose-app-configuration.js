#!/usr/bin/env node

console.log('🚨 DIAGNÓSTICO CRÍTICO - ERROR 4.700 CON LOCALHOST');
console.log('==================================================\n');

console.log('❌ SITUACIÓN CONFIRMADA:');
console.log('========================');
console.log('• Error 4.700 ocurre incluso con localhost');
console.log('• No hay solicitudes llegando al servidor local');
console.log('• Esto significa que el error NO es del redirect URI');
console.log('• El problema está en la configuración básica de la app\n');

console.log('🔍 ANÁLISIS DEL PROBLEMA:');
console.log('=========================');
console.log('Si Zoom rechaza con 4.700 incluso localhost, significa:');
console.log('1. ❌ La app NO está publicada/activa');
console.log('2. ❌ Los scopes no están configurados');
console.log('3. ❌ La app está en modo incorrecto');
console.log('4. ❌ Client ID incorrecto o inválido\n');

console.log('🎯 VERIFICACIONES URGENTES:');
console.log('===========================\n');

console.log('✅ VERIFICACIÓN 1: Estado de la app');
console.log('   → Ve a tu app en Zoom Marketplace');
console.log('   → Busca "App Status" o "Status"');
console.log('   → Debe decir "Published", "Active" o "Live"');
console.log('   → Si dice "Draft" o "Unpublished", publícala\n');

console.log('✅ VERIFICACIÓN 2: Modo de la app');
console.log('   → Busca "Development" vs "Production"');
console.log('   → Si está en "Production", cambia a "Development"');
console.log('   → Las apps en desarrollo son más permisivas\n');

console.log('✅ VERIFICACIÓN 3: Scopes configurados');
console.log('   → Ve a "Scopes" en tu app');
console.log('   → Debe tener al menos:');
console.log('     - meeting:read');
console.log('     - meeting:write');
console.log('     - user:read');
console.log('   → Si no están, agrégalos y guarda\n');

console.log('✅ VERIFICACIÓN 4: Tipo de app');
console.log('   → Confirma que es "OAuth App" o "User-managed app"');
console.log('   → NO debe ser "Account-level app" o "Server-to-Server"\n');

console.log('🚀 SOLUCIONES INMEDIATAS:');
console.log('=========================\n');

console.log('🔄 SOLUCIÓN A: Activar/Publicar app');
console.log('   1. Ve a tu app en Zoom Marketplace');
console.log('   2. Busca botón "Publish", "Activate" o "Enable"');
console.log('   3. Haz clic para activar la app');
console.log('   4. Espera confirmación');
console.log('   5. Prueba OAuth de nuevo\n');

console.log('🔧 SOLUCIÓN B: Cambiar a Development');
console.log('   1. En tu app, busca "App Type" o "Mode"');
console.log('   2. Cambia de "Production" a "Development"');
console.log('   3. Guarda cambios');
console.log('   4. Prueba OAuth de nuevo\n');

console.log('📝 SOLUCIÓN C: Revisar scopes');
console.log('   1. Ve a "Scopes" en tu app');
console.log('   2. Agrega: meeting:read, meeting:write, user:read');
console.log('   3. Guarda cambios');
console.log('   4. Publica/activa la app');
console.log('   5. Prueba OAuth de nuevo\n');

console.log('🆘 SOLUCIÓN D: Crear nueva app');
console.log('   Si nada funciona:');
console.log('   1. Crea una nueva app OAuth en Zoom');
console.log('   2. Tipo: "User-managed app"');
console.log('   3. Configura scopes correctos');
console.log('   4. Agrega redirect URIs');
console.log('   5. Publica la app');
console.log('   6. Usa las nuevas credenciales\n');

console.log('🔍 INFORMACIÓN PARA SOPORTE:');
console.log('============================');
console.log('Si contactas soporte de Zoom, menciona:');
console.log('• Error 4.700 persiste incluso con localhost');
console.log('• Client ID: vGVyI0IRv6si45iKO_qIw');
console.log('• App Name: NEBULOSA BOT for Zoom meeting manage...');
console.log('• Problema: App parece no estar activa/publicada');
console.log('• URLs probadas: localhost y GitHub Pages (ambas fallan)\n');

console.log('⚡ ACCIÓN INMEDIATA:');
console.log('===================');
console.log('1. Ve a tu app en Zoom Marketplace');
console.log('2. Busca el estado: ¿dice "Published" o "Draft"?');
console.log('3. Si dice "Draft", publícala');
console.log('4. Verifica que los scopes estén configurados');
console.log('5. Prueba OAuth de nuevo');
console.log('');
console.log('📊 El hecho de que localhost también falle confirma');
console.log('que el problema NO es el redirect URI, sino la app misma.');
console.log('');
console.log('🎯 PRÓXIMO PASO: Verifica el estado de publicación de tu app!');
