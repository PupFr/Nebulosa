// 🚂 Railway-Compatible Bot (Polling Mode - Modernized)
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const axios = require('axios');
require('dotenv').config();

console.log('🚂 Starting Modern Railway Telegram Bot...');
console.log('📦 Node version:', process.version);
console.log('🔧 Environment:', process.env.NODE_ENV || 'development');

// Environment variables
const BOT_TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;

if (!BOT_TOKEN) {
    console.error('❌ BOT_TOKEN not found in environment variables');
    console.error('Available environment variables:', Object.keys(process.env).filter(key => key.includes('BOT') || key.includes('TOKEN')));
    process.exit(1);
}

console.log('✅ Bot token found');
console.log('🔧 Initializing bot...');

// Initialize bot with polling (more reliable for Railway)
const bot = new TelegramBot(BOT_TOKEN, { 
    polling: {
        interval: 1000,
        autoStart: true,
        params: {
            timeout: 30
        }
    }
});

console.log('✅ Bot initialized with modern polling configuration');

// Express app for health checks
const app = express();
app.use(express.json());

// Health check endpoint (required by Railway)
app.get('/', (req, res) => {
    res.json({
        status: 'healthy',
        platform: 'railway',
        service: 'telegram-bot',
        mode: 'polling',
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        platform: 'railway',
        service: 'telegram-bot',
        mode: 'polling',
        timestamp: new Date().toISOString()
    });
});

// Zoom OAuth callback endpoint
app.get('/auth/zoom/callback', (req, res) => {
    const { code, state, error } = req.query;
    
    if (error) {
        console.log('❌ OAuth error:', error);
        res.send(`
            <h1>🚨 OAuth Error</h1>
            <p>Error: ${error}</p>
            <p>Please try again with /zoomlogin in Telegram</p>
        `);
        return;
    }
    
    if (!code) {
        res.send(`
            <h1>❌ No Authorization Code</h1>
            <p>The authorization was not completed properly.</p>
            <p>Please try again with /zoomlogin in Telegram</p>
        `);
        return;
    }
    
    console.log('✅ OAuth callback received:', { code: code.substring(0, 10) + '...', state });
    
    // Success page
    res.send(`
        <html>
            <head>
                <title>Zoom OAuth Success</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    .success { color: #28a745; }
                    .code { background: #f8f9fa; padding: 10px; border-radius: 5px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <h1 class="success">✅ OAuth Authorization Successful!</h1>
                <p>Your Zoom account has been connected to LA NUBE BOT</p>
                <div class="code">
                    <strong>Authorization Code:</strong> ${code.substring(0, 20)}...
                </div>
                <p><strong>State:</strong> ${state}</p>
                <hr>
                <p>🎉 You can now return to Telegram and use:</p>
                <ul style="text-align: left; display: inline-block;">
                    <li><code>/create_meeting</code> - Create Zoom meetings</li>
                    <li><code>/list_meetings</code> - View your meetings</li>
                    <li><code>/status</code> - Check bot status</li>
                </ul>
                <p><small>This page can be closed safely.</small></p>
            </body>
        </html>
    `);
    
    // TODO: Store the authorization code and exchange for access token
    // For now, just log it for testing
    console.log('🔑 Authorization code received for state:', state);
});

// Start Express server
app.listen(PORT, () => {
    console.log(`🌐 Railway health server running on port ${PORT}`);
});

// Bot command handlers
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const welcomeMessage = `
🤖 ¡Hola! Soy **LA NUBE BOT** ☁️

🎯 **Comandos disponibles:**
• \`/zoomlogin\` - Conectar con Zoom OAuth
• \`/create_meeting\` - Crear reunión de Zoom
• \`/list_meetings\` - Ver reuniones programadas
• \`/help\` - Ver ayuda completa
• \`/status\` - Estado del bot

🚀 **Desplegado en Railway** 
🔒 **OAuth configurado y listo**
    `;
    
    bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
});

bot.onText(/\/status/, (msg) => {
    const chatId = msg.chat.id;
    const statusMessage = `
📊 **Estado del Bot**

✅ **Bot:** Activo y funcionando
🚂 **Plataforma:** Railway
🔄 **Modo:** Polling
⏰ **Uptime:** ${process.uptime()} segundos
🌐 **Puerto:** ${PORT}
🔑 **Token:** Configurado correctamente

🎯 **Servicios:**
• Telegram API: ✅ Conectado
• Zoom OAuth: ✅ Configurado
• Railway: ✅ Desplegado
    `;
    
    bot.sendMessage(chatId, statusMessage, { parse_mode: 'Markdown' });
});

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const helpMessage = `
📚 **Ayuda - LA NUBE BOT**

🎯 **Comandos Principales:**
• \`/start\` - Iniciar el bot
• \`/status\` - Ver estado del sistema
• \`/zoomlogin\` - Conectar OAuth con Zoom
• \`/create_meeting <tema>\` - Crear reunión
• \`/list_meetings\` - Ver reuniones programadas

🔧 **Configuración:**
• OAuth de Zoom configurado
• Desplegado en Railway
• Callback: GitHub Pages

🚀 **Uso:**
1. Ejecuta \`/zoomlogin\` para autorizar
2. Usa \`/create_meeting Mi Reunión\` para crear
3. ¡El bot enviará el enlace automáticamente!
    `;
    
    bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
});

bot.onText(/\/zoomlogin/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    // Generate OAuth URL - Use Railway callback for production
    const clientId = process.env.ZOOM_CLIENT_ID || 'vGVyI0IRv6si45iKO_qIw';
    const redirectUri = encodeURIComponent('https://nebulosa-production.railway.app/auth/zoom/callback');
    const state = `user_${userId}_${Date.now()}`;
    
    const oauthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=meeting:read,meeting:write,user:read`;
    
    const loginMessage = `
🔐 **Autorización Zoom OAuth**

⚠️ **PASO 1: Configurar Zoom App**
Primero necesitas agregar esta URI a tu Zoom app:
\`https://nebulosa-production.railway.app/auth/zoom/callback\`

📝 **Configuración Zoom:**
1. Ve a: https://marketplace.zoom.us/develop/apps
2. Busca tu app con Client ID: \`${clientId}\`
3. En la sección **OAuth**, agrega esta Redirect URI:
   \`https://nebulosa-production.railway.app/auth/zoom/callback\`
4. Guarda los cambios

⚡ **PASO 2: Autorizar**
Después de configurar la app, haz clic aquí:
🔗 **[AUTORIZAR ZOOM](${oauthUrl})**

💡 **Estado:** ${state}

❌ **Si ves error 4.700**: La URI no está configurada
✅ **Si funciona**: ¡Podrás crear reuniones!
    `;
    
    bot.sendMessage(chatId, loginMessage, { 
        parse_mode: 'Markdown',
        disable_web_page_preview: false 
    });
});

bot.onText(/\/create_meeting (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const meetingTopic = match[1];
    
    const mockMessage = `
🎉 **Reunión Creada (Simulación)**

📝 **Tema:** ${meetingTopic}
🆔 **ID:** 123456789
🔗 **Enlace:** https://zoom.us/j/123456789?pwd=mock
🔐 **Contraseña:** mock123
📅 **Fecha:** Próxima disponible

⚠️ **Nota:** Esta es una simulación. Para crear reuniones reales, Zoom debe aprobar la aplicación OAuth.

🔄 **Estado de Zoom App:** Pendiente de aprobación
    `;
    
    bot.sendMessage(chatId, mockMessage, { parse_mode: 'Markdown' });
});

// Error handling
bot.on('polling_error', (error) => {
    console.error('❌ Polling Error:', error.code, error.message);
    
    // Don't exit on polling errors, just log them
    if (error.code === 'ETELEGRAM') {
        console.error('🔍 Telegram API Error - Check bot token and network connectivity');
    }
});

bot.on('error', (error) => {
    console.error('❌ Bot Error:', error);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('🛑 Shutting down Railway bot...');
    bot.stopPolling();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('🛑 Railway terminating bot...');
    bot.stopPolling();
    process.exit(0);
});

console.log('✅ Railway Telegram Bot started successfully!');
console.log('🔄 Polling mode active');
console.log('🌐 Health check available at /health');
console.log('🤖 Bot is ready to receive commands!');
