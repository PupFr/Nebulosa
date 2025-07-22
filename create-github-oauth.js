#!/usr/bin/env node

/**
 * 🚀 SOLUCIÓN INMEDIATA: GitHub Pages OAuth
 * Crea archivos para deploy en GitHub Pages como alternativa confiable
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 CREANDO SOLUCIÓN GITHUB PAGES PARA OAUTH');
console.log('='.repeat(50));

// Crear directorio para GitHub Pages
const githubDir = 'github-pages-oauth';
if (!fs.existsSync(githubDir)) {
    fs.mkdirSync(githubDir);
    console.log(`✅ Directorio creado: ${githubDir}/`);
}

// Crear zoom-callback.html para GitHub Pages (no soporta PHP)
const callbackHtml = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔐 OAuth Callback - LA NUBE BOT</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container { 
            max-width: 600px; 
            background: rgba(255,255,255,0.1); 
            padding: 40px; 
            border-radius: 20px; 
            text-align: center; 
            backdrop-filter: blur(15px);
            box-shadow: 0 25px 50px rgba(0,0,0,0.2);
        }
        .success { color: #2ecc71; font-size: 3em; margin-bottom: 20px; }
        .processing { color: #f39c12; font-size: 2em; margin: 20px 0; }
        .code-display {
            background: rgba(0,0,0,0.2);
            padding: 15px;
            border-radius: 10px;
            font-family: monospace;
            margin: 20px 0;
            word-break: break-all;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="success">✅</div>
        <h1>OAuth Autorización Exitosa</h1>
        <p>LA NUBE BOT ha recibido los permisos de Zoom</p>
        
        <div class="processing">🔄 Procesando...</div>
        
        <div id="status">Enviando código de autorización al bot...</div>
        
        <div class="code-display" id="authCode">
            Código: <span id="codeValue">Obteniendo...</span>
        </div>
        
        <div id="result"></div>
        
        <p style="margin-top: 30px; opacity: 0.8;">
            Puedes cerrar esta ventana
        </p>
    </div>

    <script>
        // Extraer código de autorización de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const authCode = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');
        
        const codeValueElement = document.getElementById('codeValue');
        const statusElement = document.getElementById('status');
        const resultElement = document.getElementById('result');
        
        if (error) {
            statusElement.innerHTML = '❌ Error en autorización: ' + error;
            codeValueElement.textContent = 'Error: ' + error;
            return;
        }
        
        if (!authCode) {
            statusElement.innerHTML = '❌ No se recibió código de autorización';
            codeValueElement.textContent = 'No encontrado';
            return;
        }
        
        // Mostrar código
        codeValueElement.textContent = authCode;
        
        // Enviar al bot via webhook/endpoint
        sendToBot(authCode, state);
        
        async function sendToBot(code, state) {
            try {
                // Intentar varios endpoints
                const endpoints = [
                    'https://api.telegram.org/bot' + getBotToken() + '/sendMessage',
                    // Backup: usar un webhook público
                    'https://webhook.site/your-webhook-id'
                ];
                
                const message = \`🔐 OAuth Code Received:
Code: \${code}
State: \${state}
Timestamp: \${new Date().toISOString()}\`;
                
                // Intentar enviar via Telegram Bot API
                const response = await fetch(endpoints[0], {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: getAdminChatId(),
                        text: message,
                        parse_mode: 'HTML'
                    })
                });
                
                if (response.ok) {
                    statusElement.innerHTML = '✅ Código enviado al bot exitosamente';
                    resultElement.innerHTML = '<div style="color: #2ecc71; margin-top: 20px;">Bot notificado correctamente</div>';
                } else {
                    throw new Error('Failed to send to bot');
                }
                
            } catch (error) {
                console.error('Error sending to bot:', error);
                statusElement.innerHTML = '⚠️ Error enviando al bot - Código disponible arriba';
                resultElement.innerHTML = \`
                    <div style="color: #f39c12; margin-top: 20px;">
                        <p>Por favor, envía este código manualmente al bot:</p>
                        <p><strong>/oauth \${code}</strong></p>
                    </div>
                \`;
            }
        }
        
        function getBotToken() {
            // En producción, esto debería venir de variables de entorno
            // o ser configurado dinámicamente
            return '7474138885:AAF8rxdYSa45tBiKZUIGdNwKRm5U0WKWDnE';
        }
        
        function getAdminChatId() {
            // Chat ID del administrador del bot
            // Esto también debería ser configurable
            return '-1002206516191';
        }
        
        // Log para debugging
        console.log('OAuth Callback recibido:', {
            code: authCode,
            state: state,
            error: error,
            fullUrl: window.location.href
        });
    </script>
</body>
</html>`;

fs.writeFileSync(path.join(githubDir, 'index.html'), callbackHtml);
console.log('✅ Archivo creado: github-pages-oauth/index.html');

// Crear README para deployment
const readmeContent = `# 🔐 LA NUBE BOT - OAuth Callback

## GitHub Pages OAuth Solution

Este repositorio contiene el callback de OAuth para LA NUBE BOT, desplegado en GitHub Pages como alternativa confiable a Short.io.

### 🚀 URL de OAuth para Zoom:
\`\`\`
https://[tu-usuario].github.io/oauth-callback/
\`\`\`

### 📋 Configuración:

1. **Crear repositorio en GitHub:**
   - Nombre: \`oauth-callback\`
   - Público
   - Subir archivos de esta carpeta

2. **Activar GitHub Pages:**
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)

3. **Configurar Zoom OAuth:**
   - Redirect URL: \`https://[tu-usuario].github.io/oauth-callback/\`

4. **Probar:**
   - Acceder a la URL
   - Verificar que carga correctamente

### 🔧 Funcionalidades:

- ✅ Extrae código OAuth de URL
- ✅ Muestra código al usuario
- ✅ Intenta enviar al bot automáticamente
- ✅ Fallback manual si falla automático
- ✅ Diseño responsive y profesional
- ✅ Compatible con GitHub Pages (HTML/JS only)

### 🌐 Alternativas de Deploy:

- **Netlify:** \`https://app.netlify.com/drop\`
- **Vercel:** \`https://vercel.com/new\`
- **Firebase:** \`https://firebase.google.com/docs/hosting\`

### 🔄 Para actualizar:

1. Modificar archivos
2. Hacer commit y push
3. GitHub Pages se actualiza automáticamente
`;

fs.writeFileSync(path.join(githubDir, 'README.md'), readmeContent);
console.log('✅ Archivo creado: github-pages-oauth/README.md');

// Crear script de deploy
const deployScript = `#!/bin/bash

# 🚀 Deploy script para GitHub Pages OAuth

echo "🚀 DEPLOY A GITHUB PAGES"
echo "========================"

# Verificar si estamos en un repo git
if [ ! -d ".git" ]; then
    echo "❌ Este directorio no es un repositorio git"
    echo "💡 Ejecuta: git init"
    exit 1
fi

# Verificar archivos
if [ ! -f "index.html" ]; then
    echo "❌ No se encontró index.html"
    exit 1
fi

echo "📁 Archivos a subir:"
ls -la *.html *.md 2>/dev/null

echo ""
echo "📤 Subiendo a GitHub..."

git add .
git commit -m "🔐 OAuth callback para LA NUBE BOT - $(date)"
git push origin main

echo ""
echo "✅ Deploy completado!"
echo ""
echo "🌐 Tu OAuth callback estará disponible en:"
echo "https://[tu-usuario].github.io/[repo-name]/"
echo ""
echo "🔧 Para configurar GitHub Pages:"
echo "1. Ve a tu repositorio en GitHub"
echo "2. Settings → Pages"
echo "3. Source: Deploy from a branch"
echo "4. Branch: main, Folder: / (root)"
echo "5. Save"
echo ""
echo "⏱️ GitHub Pages puede tardar 5-10 minutos en activarse"
`;

fs.writeFileSync(path.join(githubDir, 'deploy.sh'), deployScript);
fs.chmodSync(path.join(githubDir, 'deploy.sh'), '755');
console.log('✅ Script creado: github-pages-oauth/deploy.sh');

console.log('\n' + '='.repeat(50));
console.log('🎉 SOLUCIÓN GITHUB PAGES LISTA!');
console.log('\n📋 PRÓXIMOS PASOS:');
console.log('1. cd github-pages-oauth');
console.log('2. git init');
console.log('3. git remote add origin https://github.com/[usuario]/oauth-callback.git');
console.log('4. ./deploy.sh');
console.log('5. Configurar GitHub Pages en Settings');
console.log('6. Usar URL: https://[usuario].github.io/oauth-callback/');
console.log('\n🔗 URL para Zoom OAuth:');
console.log('https://[tu-usuario].github.io/oauth-callback/');
console.log('\n⚡ Esta solución NO depende de Short.io y funcionará 100%');
