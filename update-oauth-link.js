#!/usr/bin/env node

/**
 * Script para actualizar el enlace OAuth existente
 * Para que redirija correctamente al callback PHP
 */

const fs = require('fs');
const https = require('https');

const SHORTIO_API_KEY = 'sk_9uHbW34AHTAbBUZl';
const DOMAIN = 'pupfrisky.com';
const OAUTH_SLUG = 'oauth';

console.log('🔄 Actualizando enlace OAuth existente...');

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

// Primero obtener información del enlace existente
async function getLinkInfo() {
    console.log('🔍 Buscando enlace OAuth existente...');
    
    const options = {
        hostname: 'api.short.io',
        port: 443,
        path: `/links?domain=${DOMAIN}&path=${OAUTH_SLUG}`,
        method: 'GET',
        headers: {
            'Authorization': SHORTIO_API_KEY,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await makeRequest(options);
        
        if (response.status === 200 && response.data && response.data.length > 0) {
            const link = response.data[0];
            console.log(`✅ Enlace encontrado: ${link.shortURL}`);
            console.log(`📄 URL actual: ${link.originalURL}`);
            console.log(`🆔 Link ID: ${link.idString}`);
            return link;
        } else {
            console.error('❌ No se encontró el enlace OAuth');
            return null;
        }
    } catch (error) {
        console.error('❌ Error al buscar enlace:', error.message);
        return null;
    }
}

// Actualizar el enlace existente
async function updateOAuthLink(linkId) {
    console.log('📝 Actualizando enlace OAuth...');
    
    const svgContent = fs.readFileSync('./favicon.svg', 'utf8');
    const base64Content = Buffer.from(svgContent).toString('base64');
    
    const data = JSON.stringify({
        originalURL: 'https://pupfrisky.com/zoom-callback.php',
        title: '🔑 OAuth Zoom Redirect - LA NUBE BOT',
        favicon: `data:image/svg+xml;base64,${base64Content}`,
        tags: ['oauth', 'zoom', 'redirect', 'auth']
    });

    const options = {
        hostname: 'api.short.io',
        port: 443,
        path: `/links/${linkId}`,
        method: 'POST',
        headers: {
            'Authorization': SHORTIO_API_KEY,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    try {
        const response = await makeRequest(options, data);
        
        if (response.status === 200) {
            console.log('✅ Enlace OAuth actualizado exitosamente!');
            console.log('📄 Nueva configuración:');
            console.log(`   🔗 URL: ${response.data.secureShortURL || response.data.shortURL}`);
            console.log(`   📍 Destino: ${response.data.originalURL}`);
            console.log(`   📄 Título: ${response.data.title}`);
            return response.data;
        } else {
            console.error('❌ Error al actualizar enlace:', response.status);
            console.error('📄 Respuesta:', response.data);
            return null;
        }
    } catch (error) {
        console.error('❌ Error durante la actualización:', error.message);
        return null;
    }
}

async function main() {
    console.log('📋 Configuración:');
    console.log(`   API Key: ✅ Configurado`);
    console.log(`   Dominio: ${DOMAIN}`);
    console.log(`   Slug: /${OAUTH_SLUG}`);
    console.log(`   Nuevo destino: https://pupfrisky.com/zoom-callback.php`);
    console.log('');

    // Paso 1: Buscar el enlace existente
    const existingLink = await getLinkInfo();
    if (!existingLink) {
        console.error('❌ No se pudo encontrar el enlace OAuth para actualizar');
        process.exit(1);
    }

    console.log('');

    // Paso 2: Actualizar el enlace
    const updatedLink = await updateOAuthLink(existingLink.idString);
    
    if (updatedLink) {
        console.log('');
        console.log('🎉 ¡Enlace OAuth actualizado exitosamente!');
        console.log('');
        console.log('📋 Configuración OAuth para Zoom:');
        console.log('   🔗 Redirect URI: https://Pupfrisky.com/oauth');
        console.log('   📍 Destino real: https://pupfrisky.com/zoom-callback.php');
        console.log('   🎨 Favicon: ✅ Personalizado');
        console.log('');
        console.log('✅ Ahora puedes usar https://Pupfrisky.com/oauth');
        console.log('   como Redirect URI en tu aplicación Zoom!');
        
        // Guardar información actualizada
        const updateInfo = {
            updated_at: new Date().toISOString(),
            link_id: existingLink.idString,
            old_url: existingLink.originalURL,
            new_url: updatedLink.originalURL,
            short_url: updatedLink.secureShortURL || updatedLink.shortURL
        };
        
        fs.writeFileSync('./oauth-link-update.json', JSON.stringify(updateInfo, null, 2));
        console.log('💾 Información de actualización guardada en oauth-link-update.json');
    } else {
        console.error('❌ Error al actualizar el enlace OAuth');
        process.exit(1);
    }
}

main().catch(console.error);
