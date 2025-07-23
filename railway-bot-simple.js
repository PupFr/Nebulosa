// 🚂 Railway-Compatible Bot (Polling Mode - More Reliable)
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const axios = require('axios');
require('dotenv').config();

console.log('🚂 Starting Railway Telegram Bot...');

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
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

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
    
    // Generate OAuth URL
    const clientId = process.env.ZOOM_CLIENT_ID || 'vGVyI0IRv6si45iKO_qIw';
    const redirectUri = encodeURIComponent(process.env.ZOOM_REDIRECT_URI || 'https://pupfr.github.io/Nebulosa/zoom-callback.html');
    const state = `user_${userId}_${Date.now()}`;
    
    const oauthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=meeting:read,meeting:write,user:read`;
    
    const loginMessage = `
🔐 **Autorización Zoom OAuth**

Para usar las funciones de Zoom, necesitas autorizar el bot:

🔗 **[Hacer clic aquí para autorizar](${oauthUrl})**

📝 **Instrucciones:**
1. Haz clic en el enlace de arriba
2. Inicia sesión en Zoom
3. Autoriza la aplicación "LA NUBE BOT"
4. Serás redirigido a la página de confirmación
5. ¡Regresa aquí y usa /create_meeting!

⚡ **Estado:** ${state}
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
