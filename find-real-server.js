#!/usr/bin/env node

/**
 * 🔍 Script para encontrar el servidor real detrás de Cloudflare/Short.io
 * y generar URLs directas para OAuth
 */

const https = require('https');
const http = require('http');

console.log('🔍 BUSCANDO SERVIDOR REAL PARA OAUTH');
console.log('='.repeat(50));

async function testDirectAccess() {
    const testHosts = [
        'pupfrisky.com',
        'www.pupfrisky.com', 
        'direct.pupfrisky.com',
        'server.pupfrisky.com',
        'api.pupfrisky.com'
    ];

    console.log('\n🧪 Probando hosts alternativos...');
    
    for (const host of testHosts) {
        await testHost(host);
    }
}

async function testHost(hostname) {
    return new Promise((resolve) => {
        const options = {
            hostname: hostname,
            port: 443,
            path: '/zoom-callback.php',
            method: 'HEAD',
            timeout: 5000,
            headers: {
                'User-Agent': 'LA NUBE BOT OAuth Test',
                'Host': hostname
            }
        };

        const req = https.request(options, (res) => {
            const server = res.headers.server || 'Unknown';
            const powered = res.headers['x-powered-by'] || 'Unknown';
            const location = res.headers.location;
            
            let emoji = '❓';
            let status = '';
            
            if (powered.includes('Short.io')) {
                emoji = '❌';
                status = 'Short.io intercept';
            } else if (res.statusCode === 200) {
                emoji = '✅';
                status = 'Direct server access';
            } else if (res.statusCode === 404) {
                emoji = '🎯';
                status = 'Server accessible (404 expected)';
            } else if (location) {
                emoji = '↗️';
                status = `Redirect: ${location}`;
            } else {
                emoji = '⚠️';
                status = `Status: ${res.statusCode}`;
            }
            
            console.log(`${emoji} https://${hostname}/zoom-callback.php`);
            console.log(`   Status: ${res.statusCode} - ${status}`);
            console.log(`   Server: ${server}`);
            if (powered !== 'Unknown') {
                console.log(`   Powered: ${powered}`);
            }
            console.log('');
            
            resolve();
        });

        req.on('error', (err) => {
            console.log(`❌ https://${hostname}/zoom-callback.php`);
            console.log(`   Error: ${err.message}`);
            console.log('');
            resolve();
        });

        req.on('timeout', () => {
            req.destroy();
            console.log(`⏰ https://${hostname}/zoom-callback.php`);
            console.log(`   Timeout`);
            console.log('');
            resolve();
        });

        req.end();
    });
}

async function generateAlternatives() {
    console.log('\n💡 ALTERNATIVAS PARA OAUTH:');
    console.log('='.repeat(50));
    
    console.log('\n🎯 OPCIÓN A: Bypass Cloudflare/Short.io');
    console.log('   1. Buscar record A original en hosting provider');
    console.log('   2. Usar IP directa: http://[IP]:80/zoom-callback.php');
    console.log('   3. Configurar subdomain sin Short.io');
    
    console.log('\n🌐 OPCIÓN B: Subdomain dedicado');
    console.log('   1. Crear: auth.pupfrisky.com');
    console.log('   2. Apuntar DIRECTAMENTE al servidor (no Short.io)');
    console.log('   3. URL: https://auth.pupfrisky.com/zoom-callback.php');
    
    console.log('\n🔧 OPCIÓN C: Puerto alternativo');
    console.log('   Si tienes acceso al servidor:');
    console.log('   1. Configurar puerto 8080, 3000, etc.');
    console.log('   2. URL: https://pupfrisky.com:8080/zoom-callback.php');
    
    console.log('\n⚙️ OPCIÓN D: Desactivar Short.io catch-all');
    console.log('   1. Login en https://app.short.io/');
    console.log('   2. Domains → pupfrisky.com → Settings');
    console.log('   3. Desactivar "Catch all unmatched requests"');
    console.log('   4. O cambiar default redirect');
    
    console.log('\n🚀 OPCIÓN E: Usar servicio diferente');
    console.log('   Dominios gratuitos para OAuth:');
    console.log('   - GitHub Pages: username.github.io');
    console.log('   - Netlify: project.netlify.app');
    console.log('   - Vercel: project.vercel.app');
    console.log('   - Heroku: app.herokuapp.com');
}

async function generateQuickFix() {
    console.log('\n⚡ QUICK FIX IMMEDIATO:');
    console.log('='.repeat(50));
    
    console.log('\n1️⃣ Crear subdomain auth.pupfrisky.com:');
    console.log('   • Login en Cloudflare');
    console.log('   • DNS → Add record');
    console.log('   • Type: A, Name: auth, Value: [IP_SERVIDOR_REAL]');
    console.log('   • ⚠️ Proxy OFF (gris, no naranja)');
    
    console.log('\n2️⃣ URL para Zoom OAuth:');
    console.log('   ✅ https://auth.pupfrisky.com/zoom-callback.php');
    
    console.log('\n3️⃣ Subir archivos al subdomain:');
    console.log('   • rsync zoom-callback.php user@server:/home/user/auth.pupfrisky.com/');
    
    console.log('\n4️⃣ Test inmediato:');
    console.log('   • curl -I https://auth.pupfrisky.com/zoom-callback.php');
    console.log('   • Debe mostrar tu servidor, NO Short.io');
}

async function main() {
    await testDirectAccess();
    await generateAlternatives();
    await generateQuickFix();
    
    console.log('\n' + '='.repeat(50));
    console.log('🎯 RECOMENDACIÓN: Crear auth.pupfrisky.com');
    console.log('⚡ QUICK WIN: Desactivar catch-all en Short.io');
    console.log('🔧 BACKUP: Usar GitHub Pages o Netlify');
}

main().catch(console.error);
