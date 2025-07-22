#!/usr/bin/env node

/**
 * Script avanzado para encontrar y actualizar el enlace /oauth
 * Usa diferentes métodos de la API de Short.io
 */

const fs = require('fs');
const https = require('https');

const SHORTIO_API_KEY = 'sk_9uHbW34AHTAbBUZl';
const DOMAIN = 'pupfrisky.com';

console.log('🔍 Buscando y actualizando enlace /oauth...');

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

// Método 1: Buscar en todos los enlaces
async function findOAuthLink() {
    console.log('📋 Método 1: Listando todos los enlaces...');
    
    const options = {
        hostname: 'api.short.io',
        port: 443,
        path: '/links',
        method: 'GET',
        headers: {
            'Authorization': SHORTIO_API_KEY,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await makeRequest(options);
        
        if (response.status === 200 && response.data) {
            console.log(`✅ Encontrados ${response.data.length || 0} enlaces`);
            
            if (Array.isArray(response.data)) {
                // Buscar el enlace que termine en /oauth
                const oauthLink = response.data.find(link => 
                    link.path === 'oauth' || 
                    link.shortURL?.includes('/oauth') ||
                    link.secureShortURL?.includes('/oauth')
                );
                
                if (oauthLink) {
                    console.log('🎯 Enlace /oauth encontrado:');
                    console.log(`   🔗 URL: ${oauthLink.secureShortURL || oauthLink.shortURL}`);
                    console.log(`   📍 Destino: ${oauthLink.originalURL}`);
                    console.log(`   🆔 ID: ${oauthLink.idString || oauthLink.id}`);
                    return oauthLink;
                }
            }
            
            console.log('⚠️  No se encontró enlace /oauth en la lista');
            return null;
        } else {
            console.log('⚠️  Error al listar enlaces:', response.status);
            return null;
        }
    } catch (error) {
        console.log('⚠️  Error:', error.message);
        return null;
    }
}

// Método 2: Buscar por dominio específico
async function findOAuthByDomain() {
    console.log('📋 Método 2: Buscando por dominio...');
    
    const options = {
        hostname: 'api.short.io',
        port: 443,
        path: `/links?domain=${DOMAIN}`,
        method: 'GET',
        headers: {
            'Authorization': SHORTIO_API_KEY,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await makeRequest(options);
        
        if (response.status === 200) {
            console.log('✅ Búsqueda por dominio exitosa');
            
            if (response.data && Array.isArray(response.data)) {
                const oauthLink = response.data.find(link => 
                    link.path === 'oauth'
                );
                
                if (oauthLink) {
                    console.log('🎯 Enlace /oauth encontrado por dominio:');
                    console.log(`   🔗 URL: ${oauthLink.secureShortURL || oauthLink.shortURL}`);
                    console.log(`   📍 Destino: ${oauthLink.originalURL}`);
                    console.log(`   🆔 ID: ${oauthLink.idString || oauthLink.id}`);
                    return oauthLink;
                }
            }
            
            console.log('⚠️  No se encontró /oauth en búsqueda por dominio');
            return null;
        } else {
            console.log('⚠️  Error en búsqueda por dominio:', response.status);
            return null;
        }
    } catch (error) {
        console.log('⚠️  Error:', error.message);
        return null;
    }
}

// Actualizar el enlace OAuth
async function updateOAuthLink(linkData) {
    console.log('📝 Actualizando enlace OAuth...');
    
    const linkId = linkData.idString || linkData.id;
    
    if (!linkId) {
        console.error('❌ No se pudo obtener el ID del enlace');
        return false;
    }
    
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
            console.log('✅ ¡Enlace OAuth actualizado exitosamente!');
            console.log(`   🔗 URL: ${response.data.secureShortURL || response.data.shortURL}`);
            console.log(`   📍 Nuevo destino: ${response.data.originalURL}`);
            console.log(`   📄 Título: ${response.data.title}`);
            return response.data;
        } else {
            console.error('❌ Error al actualizar:', response.status);
            console.error('📄 Respuesta:', JSON.stringify(response.data, null, 2));
            return false;
        }
    } catch (error) {
        console.error('❌ Error durante actualización:', error.message);
        return false;
    }
}

// Método alternativo: usar PUT
async function updateOAuthLinkPUT(linkData) {
    console.log('📝 Intentando actualización con método PUT...');
    
    const linkId = linkData.idString || linkData.id;
    
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
        method: 'PUT',
        headers: {
            'Authorization': SHORTIO_API_KEY,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    try {
        const response = await makeRequest(options, data);
        
        if (response.status === 200) {
            console.log('✅ ¡Enlace OAuth actualizado con PUT!');
            console.log(`   🔗 URL: ${response.data.secureShortURL || response.data.shortURL}`);
            console.log(`   📍 Nuevo destino: ${response.data.originalURL}`);
            return response.data;
        } else {
            console.error('❌ Error con PUT:', response.status);
            console.error('📄 Respuesta:', JSON.stringify(response.data, null, 2));
            return false;
        }
    } catch (error) {
        console.error('❌ Error con PUT:', error.message);
        return false;
    }
}

async function main() {
    console.log('📋 Configuración:');
    console.log(`   API Key: ✅ Configurado`);
    console.log(`   Dominio: ${DOMAIN}`);
    console.log(`   Objetivo: Actualizar /oauth → zoom-callback.php`);
    console.log('');

    // Intentar encontrar el enlace OAuth
    let oauthLink = await findOAuthLink();
    
    if (!oauthLink) {
        console.log('');
        oauthLink = await findOAuthByDomain();
    }
    
    if (oauthLink) {
        console.log('');
        console.log('🎯 Enlace OAuth encontrado! Intentando actualizar...');
        
        // Intentar actualización con POST
        let result = await updateOAuthLink(oauthLink);
        
        if (!result) {
            console.log('');
            console.log('🔄 Intentando con método PUT...');
            result = await updateOAuthLinkPUT(oauthLink);
        }
        
        if (result) {
            console.log('');
            console.log('🎉 ¡Enlace /oauth actualizado exitosamente!');
            console.log('');
            console.log('✅ Ahora puedes usar https://Pupfrisky.com/oauth');
            console.log('   como Redirect URI en Zoom OAuth!');
            
            // Guardar información
            const updateInfo = {
                updated_at: new Date().toISOString(),
                method: 'API_UPDATE',
                link_id: oauthLink.idString || oauthLink.id,
                old_url: oauthLink.originalURL,
                new_url: result.originalURL,
                short_url: result.secureShortURL || result.shortURL
            };
            
            fs.writeFileSync('./oauth-update-success.json', JSON.stringify(updateInfo, null, 2));
            console.log('💾 Actualización guardada en oauth-update-success.json');
        } else {
            console.log('');
            console.log('❌ No se pudo actualizar el enlace /oauth');
            console.log('');
            console.log('💡 Alternativas disponibles:');
            console.log('   🔗 https://Pupfrisky.com/auth');
            console.log('   🔗 https://Pupfrisky.com/zoom-auth');
        }
    } else {
        console.log('');
        console.log('❌ No se pudo encontrar el enlace /oauth');
        console.log('');
        console.log('💡 Usa estas alternativas en Zoom OAuth:');
        console.log('   🔗 https://Pupfrisky.com/auth');
        console.log('   🔗 https://Pupfrisky.com/zoom-auth');
    }
}

main().catch(console.error);
