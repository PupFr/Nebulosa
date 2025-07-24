#!/usr/bin/env node

require('dotenv').config();
const axios = require('axios');

console.log('🔧 VERIFICADOR DE CREDENCIALES ZOOM');
console.log('===================================\n');

async function testCredentials(clientId, clientSecret, description) {
  console.log(`🧪 Probando: ${description}`);
  console.log(`Client ID: ${clientId ? clientId.substring(0, 8) + '...' : 'Missing'}`);
  console.log(`Client Secret: ${clientSecret ? 'Present' : 'Missing'}`);
  
  if (!clientId || !clientSecret) {
    console.log('❌ Credenciales incompletas\n');
    return false;
  }
  
  try {
    const response = await axios.post('https://zoom.us/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        code: 'test_invalid_code', // Esperamos que falle con invalid_grant, no invalid_client
        redirect_uri: 'https://pupfr.github.io/Nebulosa/zoom-callback.html',
        client_id: clientId,
        client_secret: clientSecret
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      timeout: 10000,
      validateStatus: () => true
    });
    
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, response.data);
    
    if (response.data.error === 'invalid_grant') {
      console.log('✅ Credenciales VÁLIDAS (error esperado: código inválido)');
      return true;
    } else if (response.data.error === 'invalid_client') {
      console.log('❌ Credenciales INVÁLIDAS');
      return false;
    } else {
      console.log('⚠️ Respuesta inesperada');
      return false;
    }
    
  } catch (error) {
    console.log('❌ Error de red:', error.message);
    return false;
  } finally {
    console.log('-'.repeat(50) + '\n');
  }
}

async function runCredentialTests() {
  console.log('Probando todas las combinaciones de credenciales disponibles...\n');
  
  const tests = [
    {
      clientId: process.env.ZOOM_USER_CLIENT_ID,
      clientSecret: process.env.ZOOM_USER_CLIENT_SECRET,
      description: 'ZOOM_USER_* credentials'
    },
    {
      clientId: process.env.ZOOM_CLIENT_ID,
      clientSecret: process.env.ZOOM_CLIENT_SECRET,
      description: 'ZOOM_* credentials'
    },
    {
      clientId: process.env.ZOOM_USER_CLIENT_ID,
      clientSecret: process.env.ZOOM_CLIENT_SECRET,
      description: 'Mixed: USER_CLIENT_ID + CLIENT_SECRET'
    },
    {
      clientId: process.env.ZOOM_CLIENT_ID,
      clientSecret: process.env.ZOOM_USER_CLIENT_SECRET,
      description: 'Mixed: CLIENT_ID + USER_CLIENT_SECRET'
    }
  ];
  
  const validCredentials = [];
  
  for (const test of tests) {
    const isValid = await testCredentials(test.clientId, test.clientSecret, test.description);
    if (isValid) {
      validCredentials.push(test);
    }
  }
  
  console.log('🎯 RESULTADOS FINALES:');
  console.log('='.repeat(30));
  
  if (validCredentials.length > 0) {
    console.log('✅ Credenciales válidas encontradas:');
    validCredentials.forEach((cred, index) => {
      console.log(`${index + 1}. ${cred.description}`);
      console.log(`   Client ID: ${cred.clientId}`);
      console.log(`   Client Secret: ${cred.clientSecret ? cred.clientSecret.substring(0, 8) + '...' : 'Missing'}`);
    });
    
    console.log('\n💡 Recomendación:');
    console.log(`Usar las credenciales: ${validCredentials[0].description}`);
    
    // Generar URL de prueba con credenciales válidas
    const bestCred = validCredentials[0];
    const testUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${bestCred.clientId}&redirect_uri=${encodeURIComponent('https://pupfr.github.io/Nebulosa/zoom-callback.html')}&scope=${encodeURIComponent('meeting:read meeting:write user:read')}&state=test123`;
    
    console.log('\n🔗 URL de prueba recomendada:');
    console.log(testUrl);
    
  } else {
    console.log('❌ NINGUNA credencial es válida');
    console.log('\n🔍 Posibles causas:');
    console.log('1. Client ID o Secret incorrectos en .env');
    console.log('2. Aplicación de Zoom deshabilitada o eliminada');
    console.log('3. Credenciales de tipo incorrecto (Server-to-Server vs User OAuth)');
    console.log('4. Problemas de permisos en la cuenta de Zoom');
    
    console.log('\n💡 Soluciones:');
    console.log('1. Verificar credenciales en Zoom Marketplace');
    console.log('2. Crear nueva aplicación OAuth de tipo "User-managed"');
    console.log('3. Revisar que la aplicación esté publicada/aprobada');
  }
}

runCredentialTests().catch(console.error);
