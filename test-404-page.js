#!/usr/bin/env node

/**
 * 🧪 Test script for bilingual 404 page and redirects
 * Tests different URLs to verify 404 page behavior in English and Spanish
 */

const https = require('https');
const http = require('http');

// Configuración
const BASE_URL = 'https://pupfrisky.com';
const LOCAL_URL = 'http://localhost:3000'; // Para testing local
const USE_LOCAL = process.argv.includes('--local');

const testUrls = [
    // URLs que deberían dar 404 pero redirigir inteligentemente
    '/oauth',
    '/auth', 
    '/zoom-auth',
    '/docs',
    '/setup',
    '/multipin',
    '/shortio',
    
    // URLs que no existen y deberían mostrar 404
    '/página-inexistente',
    '/random-url',
    '/bot-config',
    '/test-404',
    
    // URLs válidas que NO deberían dar 404
    '/zoom-callback.php',
    '/docs.html',
    '/docs-setup.html'
];

console.log('🧪 Testing bilingual 404 page and redirects');
console.log(`🌐 Base URL: ${USE_LOCAL ? LOCAL_URL : BASE_URL}`);
console.log('─'.repeat(60));

async function testUrl(url) {
    return new Promise((resolve) => {
        const fullUrl = (USE_LOCAL ? LOCAL_URL : BASE_URL) + url;
        const client = USE_LOCAL ? http : https;
        
        const req = client.get(fullUrl, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                const result = {
                    url: url,
                    statusCode: res.statusCode,
                    location: res.headers.location,
                    contentType: res.headers['content-type'],
                    hasRedirectScript: data.includes('redirectRules'),
                    hasCountdown: data.includes('countdown'),
                    has404Content: data.includes('404') || data.includes('Not Found') || data.includes('No Encontrada'),
                    hasLanguageToggle: data.includes('toggleLanguage'),
                    hasBothLanguages: data.includes('content-en') && data.includes('content-es'),
                    contentLength: data.length
                };
                resolve(result);
            });
        });
        
        req.on('error', (err) => {
            resolve({
                url: url,
                error: err.message,
                statusCode: 'ERROR'
            });
        });
        
        req.setTimeout(5000, () => {
            req.destroy();
            resolve({
                url: url,
                error: 'Timeout',
                statusCode: 'TIMEOUT'
            });
        });
    });
}

function formatResult(result) {
    const status = result.statusCode;
    let emoji = '❓';
    let description = '';
    
    if (result.error) {
        emoji = '❌';
        description = `Error: ${result.error}`;
    } else if (status === 200) {
        emoji = '✅';
        description = 'OK';
        if (result.has404Content) {
            emoji = '🎯';
            description = '404 page loaded correctly';
        }
    } else if (status === 301 || status === 302) {
        emoji = '↗️';
        description = `Redirect to: ${result.location}`;
    } else if (status === 404) {
        emoji = '🎯';
        description = '404 (expected)';
        if (result.has404Content) {
            description += ' - Custom 404 page';
        }
    } else {
        emoji = '⚠️';
        description = `Status: ${status}`;
    }
    
    console.log(`${emoji} ${result.url.padEnd(20)} → ${description}`);
    
    if (result.hasRedirectScript) {
        console.log(`   🤖 Smart redirect detected`);
    }
    
    if (result.hasCountdown) {
        console.log(`   ⏰ Countdown timer detected`);
    }
    
    if (result.hasLanguageToggle) {
        console.log(`   🌐 Language toggle detected`);
    }
    
    if (result.hasBothLanguages) {
        console.log(`   🔄 Bilingual support confirmed`);
    }
}

async function runTests() {
    console.log('🚀 Iniciando tests...\n');
    
    for (const url of testUrls) {
        const result = await testUrl(url);
        formatResult(result);
        
        // Pausa pequeña entre requests
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\n' + '─'.repeat(60));
    console.log('✅ Tests completados');
    console.log('\n📝 Interpretación de resultados:');
    console.log('✅ = Página carga correctamente');
    console.log('🎯 = Página 404 funciona correctamente');
    console.log('↗️ = Redirección automática (.htaccess)');
    console.log('🤖 = JavaScript de redirección inteligente detectado');
    console.log('⏰ = Contador de redirección automática detectado');
    console.log('❌ = Error de conexión');
    console.log('⚠️ = Estado inesperado');
    
    if (USE_LOCAL) {
        console.log('\n💡 Para probar en el servidor real, ejecuta:');
        console.log('node test-404-page.js');
    } else {
        console.log('\n💡 Para probar localmente, ejecuta:');
        console.log('node test-404-page.js --local');
    }
}

// Verificar dependencias
if (USE_LOCAL) {
    console.log('⚠️ Modo local activado');
    console.log('Asegúrate de tener un servidor corriendo en localhost:3000');
    console.log('Puedes usar: python3 -m http.server 3000\n');
}

runTests().catch(console.error);
