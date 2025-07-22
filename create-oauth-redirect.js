#!/usr/bin/env node

/**
 * Script para crear el enlace OAuth correcto
 * Usa un slug específico para evitar conflictos
 */

const fs = require('fs');
const https = require('https');

const SHORTIO_API_KEY = 'sk_9uHbW34AHTAbBUZl';
const DOMAIN = 'pupfrisky.com';

console.log('🔑 Creando enlace OAuth correcto...');

function makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const response = JSON.parse(body);
                    resolve({ status: res.statusCode, data: response });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', reject);
        
        if (data) {
            req.write(data);
        }
        
        req.end();
    });
}

async function createOAuthRedirect() {
    console.log('📤 Creando enlace OAuth redirect...');
    
    const svgContent = fs.readFileSync('./favicon.svg', 'utf8');
    const base64Content = Buffer.from(svgContent).toString('base64');
    
    const data = JSON.stringify({
        originalURL: 'https://pupfrisky.com/zoom-callback.php',
        domain: DOMAIN,
        path: 'auth', // Usar 'auth' en lugar de 'oauth'
        allowDuplicates: false,
        favicon: `data:image/svg+xml;base64,${base64Content}`,
        title: '🔑 Zoom OAuth Redirect - LA NUBE BOT',
        tags: ['oauth', 'zoom', 'redirect', 'auth', 'callback']
    });

    const options = {
        hostname: 'api.short.io',
        port: 443,
        path: '/links',
        method: 'POST',
        headers: {
            'Authorization': SHORTIO_API_KEY,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    try {
        const response = await makeRequest(options, data);
        
        if (response.status === 200 || response.status === 201) {
            const shortUrl = response.data.secureShortURL || response.data.shortURL;
            console.log(`✅ Enlace OAuth creado: ${shortUrl}`);
            console.log(`📄 Título: ${response.data.title}`);
            console.log(`📍 Destino: ${response.data.originalURL}`);
            console.log(`🆔 Link ID: ${response.data.id}`);
            return response.data;
        } else if (response.status === 409) {
            console.log(`⚠️  El enlace /auth ya existe`);
            return null;
        } else {
            console.error(`❌ Error: ${response.status}`);
            console.error(`📄 Respuesta:`, response.data);
            return null;
        }
    } catch (error) {
        console.error(`❌ Error de conexión: ${error.message}`);
        return null;
    }
}

async function createZoomCallback() {
    console.log('📤 Creando enlace zoom-auth...');
    
    const svgContent = fs.readFileSync('./favicon.svg', 'utf8');
    const base64Content = Buffer.from(svgContent).toString('base64');
    
    const data = JSON.stringify({
        originalURL: 'https://pupfrisky.com/zoom-callback.php',
        domain: DOMAIN,
        path: 'zoom-auth',
        allowDuplicates: false,
        favicon: `data:image/svg+xml;base64,${base64Content}`,
        title: '🔑 Zoom Authentication - LA NUBE BOT',
        tags: ['zoom', 'auth', 'oauth', 'callback', 'redirect']
    });

    const options = {
        hostname: 'api.short.io',
        port: 443,
        path: '/links',
        method: 'POST',
        headers: {
            'Authorization': SHORTIO_API_KEY,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    try {
        const response = await makeRequest(options, data);
        
        if (response.status === 200 || response.status === 201) {
            const shortUrl = response.data.secureShortURL || response.data.shortURL;
            console.log(`✅ Enlace Zoom Auth creado: ${shortUrl}`);
            console.log(`📄 Título: ${response.data.title}`);
            console.log(`📍 Destino: ${response.data.originalURL}`);
            console.log(`🆔 Link ID: ${response.data.id}`);
            return response.data;
        } else if (response.status === 409) {
            console.log(`⚠️  El enlace /zoom-auth ya existe`);
            return null;
        } else {
            console.error(`❌ Error: ${response.status}`);
            console.error(`📄 Respuesta:`, response.data);
            return null;
        }
    } catch (error) {
        console.error(`❌ Error de conexión: ${error.message}`);
        return null;
    }
}

async function main() {
    console.log('📋 Configuración:');
    console.log(`   API Key: ✅ Configurado`);
    console.log(`   Dominio: ${DOMAIN}`);
    console.log(`   Destino: https://pupfrisky.com/zoom-callback.php`);
    console.log('');

    // Crear enlaces OAuth alternativos
    const authLink = await createOAuthRedirect();
    console.log('');
    
    const zoomAuthLink = await createZoomCallback();
    console.log('');

    if (authLink || zoomAuthLink) {
        console.log('🎉 ¡Enlaces OAuth creados exitosamente!');
        console.log('');
        console.log('📋 URLs para usar como Redirect URI en Zoom:');
        
        if (authLink) {
            console.log(`   🔗 Opción 1: ${authLink.secureShortURL || authLink.shortURL}`);
        }
        
        if (zoomAuthLink) {
            console.log(`   🔗 Opción 2: ${zoomAuthLink.secureShortURL || zoomAuthLink.shortURL}`);
        }
        
        console.log('');
        console.log('✅ Usa cualquiera de estos enlaces como Redirect URI');
        console.log('   en la configuración de tu aplicación Zoom OAuth!');
        
        // Guardar información
        const oauthInfo = {
            created_at: new Date().toISOString(),
            auth_link: authLink,
            zoom_auth_link: zoomAuthLink,
            destination: 'https://pupfrisky.com/zoom-callback.php'
        };
        
        fs.writeFileSync('./oauth-redirect-links.json', JSON.stringify(oauthInfo, null, 2));
        console.log('💾 Información guardada en oauth-redirect-links.json');
    } else {
        console.log('⚠️  Los enlaces ya existen o hubo errores al crearlos');
    }
}

main().catch(console.error);
