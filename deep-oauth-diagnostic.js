#!/usr/bin/env node

require('dotenv').config();
const axios = require('axios');

console.log('🔍 DIAGNÓSTICO PROFUNDO DE OAUTH');
console.log('==================================\n');

// 1. Verificar variables de entorno
console.log('📋 1. VARIABLES DE ENTORNO:');
console.log('-'.repeat(40));
const envVars = {
  'BOT_TOKEN': process.env.BOT_TOKEN,
  'ZOOM_USER_CLIENT_ID': process.env.ZOOM_USER_CLIENT_ID,
  'ZOOM_USER_CLIENT_SECRET': process.env.ZOOM_USER_CLIENT_SECRET,
  'ZOOM_CLIENT_ID': process.env.ZOOM_CLIENT_ID,
  'ZOOM_CLIENT_SECRET': process.env.ZOOM_CLIENT_SECRET,
  'ZOOM_REDIRECT_URI': process.env.ZOOM_REDIRECT_URI,
  'AUTHORIZED_GROUP_ID': process.env.AUTHORIZED_GROUP_ID
};

for (const [key, value] of Object.entries(envVars)) {
  if (value) {
    if (key.includes('SECRET') || key.includes('TOKEN')) {
      console.log(`${key}: ✅ Present (${value.substring(0, 8)}...)`);
    } else {
      console.log(`${key}: ✅ ${value}`);
    }
  } else {
    console.log(`${key}: ❌ Missing or empty`);
  }
}

// 2. Determinar credenciales activas
console.log('\n📊 2. CREDENCIALES ACTIVAS:');
console.log('-'.repeat(40));
const activeClientId = process.env.ZOOM_USER_CLIENT_ID || process.env.ZOOM_CLIENT_ID;
const activeClientSecret = process.env.ZOOM_USER_CLIENT_SECRET || process.env.ZOOM_CLIENT_SECRET;
const activeRedirectUri = process.env.ZOOM_REDIRECT_URI || 'http://localhost:3000/auth/zoom/callback';

console.log(`Active Client ID: ${activeClientId || '❌ None'}`);
console.log(`Active Client Secret: ${activeClientSecret ? '✅ Present' : '❌ Missing'}`);
console.log(`Active Redirect URI: ${activeRedirectUri}`);

// 3. Verificar conectividad con Zoom API
console.log('\n🌐 3. CONECTIVIDAD CON ZOOM API:');
console.log('-'.repeat(40));

async function testZoomConnectivity() {
  try {
    console.log('Probando conectividad con zoom.us...');
    const response = await axios.get('https://zoom.us', { timeout: 10000 });
    console.log('✅ Zoom.us accesible (Status:', response.status, ')');
  } catch (error) {
    console.log('❌ Error conectando a zoom.us:', error.message);
  }
  
  try {
    console.log('Probando API de Zoom OAuth...');
    const response = await axios.post('https://zoom.us/oauth/token', 'invalid=test', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 10000,
      validateStatus: () => true // Accept any status
    });
    console.log('✅ Zoom OAuth endpoint accesible (Status:', response.status, ')');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Error conectando a Zoom OAuth API:', error.message);
  }
}

// 4. Generar URLs de prueba
console.log('\n🔗 4. URLs DE PRUEBA GENERADAS:');
console.log('-'.repeat(40));

function generateTestUrls() {
  if (!activeClientId) {
    console.log('❌ No se puede generar URLs sin Client ID');
    return;
  }
  
  const baseUrl = 'https://zoom.us/oauth/authorize';
  const scopes = 'meeting:read meeting:write user:read';
  const state = 'diagnostic_test';
  
  // URL para localhost
  const localhostUri = 'http://localhost:3000/auth/zoom/callback';
  const localhostUrl = `${baseUrl}?response_type=code&client_id=${activeClientId}&redirect_uri=${encodeURIComponent(localhostUri)}&scope=${encodeURIComponent(scopes)}&state=${state}`;
  
  // URL para GitHub Pages
  const githubUri = 'https://pupfr.github.io/Nebulosa/zoom-callback.html';
  const githubUrl = `${baseUrl}?response_type=code&client_id=${activeClientId}&redirect_uri=${encodeURIComponent(githubUri)}&scope=${encodeURIComponent(scopes)}&state=${state}`;
  
  console.log('🏠 URL para LOCALHOST:');
  console.log(localhostUrl);
  console.log('\n📄 URL para GITHUB PAGES:');
  console.log(githubUrl);
  
  return { localhostUrl, githubUrl };
}

// 5. Verificar archivos de configuración
console.log('\n📁 5. ARCHIVOS DE CONFIGURACIÓN:');
console.log('-'.repeat(40));

const fs = require('fs');
const path = require('path');

function checkConfigFiles() {
  const filesToCheck = [
    '.env',
    '.env.example',
    '.env.localhost',
    'package.json',
    'oauth-server.js',
    'bot.cjs',
    'zoom-callback.html'
  ];
  
  filesToCheck.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      console.log(`✅ ${file} (${stats.size} bytes, modified: ${stats.mtime.toLocaleDateString()})`);
    } else {
      console.log(`❌ ${file} - No encontrado`);
    }
  });
}

// 6. Probar token exchange con credenciales actuales
console.log('\n🧪 6. PRUEBA DE TOKEN EXCHANGE (SIN CÓDIGO):');
console.log('-'.repeat(40));

async function testTokenExchangeStructure() {
  if (!activeClientId || !activeClientSecret) {
    console.log('❌ No se puede probar: Faltan credenciales');
    return;
  }
  
  console.log('Probando estructura de request sin código válido...');
  
  try {
    const response = await axios.post('https://zoom.us/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        code: 'test_invalid_code',
        redirect_uri: activeRedirectUri,
        client_id: activeClientId,
        client_secret: activeClientSecret
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      timeout: 10000,
      validateStatus: () => true
    });
    
    console.log('Status:', response.status);
    console.log('Response:', response.data);
    
    if (response.status === 400 && response.data.error === 'invalid_grant') {
      console.log('✅ Estructura del request es correcta (código inválido es esperado)');
    } else if (response.status === 400 && response.data.error === 'invalid_client') {
      console.log('❌ Cliente inválido - Credenciales incorrectas');
    } else {
      console.log('⚠️ Respuesta inesperada');
    }
    
  } catch (error) {
    console.log('❌ Error en prueba:', error.message);
  }
}

// 7. Resumen y recomendaciones
function generateSummaryAndRecommendations() {
  console.log('\n📋 7. RESUMEN Y RECOMENDACIONES:');
  console.log('-'.repeat(40));
  
  const issues = [];
  const recommendations = [];
  
  if (!activeClientId) {
    issues.push('No hay Client ID configurado');
    recommendations.push('Configurar ZOOM_USER_CLIENT_ID en .env');
  }
  
  if (!activeClientSecret) {
    issues.push('No hay Client Secret configurado');
    recommendations.push('Configurar ZOOM_USER_CLIENT_SECRET en .env');
  }
  
  if (activeRedirectUri === 'http://localhost:3000/auth/zoom/callback') {
    recommendations.push('Agregar redirect URI localhost a tu aplicación de Zoom');
  }
  
  if (issues.length === 0) {
    console.log('✅ Configuración básica completa');
  } else {
    console.log('❌ Problemas encontrados:');
    issues.forEach(issue => console.log(`   - ${issue}`));
  }
  
  console.log('\n💡 Recomendaciones:');
  recommendations.forEach(rec => console.log(`   - ${rec}`));
  
  console.log('\n🎯 Próximos pasos sugeridos:');
  console.log('   1. Corregir problemas de configuración identificados');
  console.log('   2. Probar URLs generadas en navegador');
  console.log('   3. Verificar logs del servidor OAuth');
  console.log('   4. Contactar soporte de Zoom si persisten problemas');
}

// Ejecutar diagnóstico completo
async function runFullDiagnostic() {
  await testZoomConnectivity();
  console.log();
  generateTestUrls();
  console.log();
  checkConfigFiles();
  console.log();
  await testTokenExchangeStructure();
  generateSummaryAndRecommendations();
  
  console.log('\n🏁 DIAGNÓSTICO COMPLETADO');
  console.log('==========================');
}

runFullDiagnostic().catch(console.error);
