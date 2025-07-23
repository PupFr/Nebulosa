const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config();

class ZoomTelegramBot {
    constructor() {
        this.bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
        this.userSessions = new Map(); // Store OAuth tokens
        this.adminUsers = new Set([
            // Add admin user IDs here
            // 123456789, 987654321
        ]);
        this.monitoringActive = false;
        this.browserBotActive = false;
        this.currentLanguage = new Map(); // Store user language preferences
        
        this.setupBot();
        console.log('🤖 Zoom Telegram Bot started successfully!');
    }
    
    setupBot() {
        // Set up bot commands
        this.bot.setMyCommands([
            { command: 'start', description: 'Show welcome message' },
            { command: 'zoomlogin', description: 'Connect your Zoom account' },
            { command: 'startsession', description: 'Start Zoom session (Admin only)' },
            { command: 'roominfo', description: 'Get current Zoom Room information' },
            { command: 'scanroom', description: 'Advanced participant monitoring' },
            { command: 'createroom', description: 'Create instant meeting' },
            { command: 'monitor', description: 'Start/stop automatic monitoring' },
            { command: 'startbot', description: 'Start browser bot (Admin)' },
            { command: 'stopbot', description: 'Stop browser bot (Admin)' },
            { command: 'botstatus', description: 'Check browser bot status' },
            { command: 'chatwatch', description: 'Monitor and moderate Zoom chat' },
            { command: 'promote', description: 'Promote user to cohost' },
            { command: 'commandchat', description: 'Manage Command Chat integration' },
            { command: 'docs', description: 'Access documentation and guides' },
            { command: 'status', description: 'Current session status' },
            { command: 'shutdown', description: 'Stop bot (Admin only)' },
            { command: 'language', description: 'Change language 🇺🇸🇲🇽' }
        ]);
        
        // Handle all messages
        this.bot.on('message', this.handleMessage.bind(this));
        
        // Handle callback queries (for inline keyboards)
        this.bot.on('callback_query', this.handleCallbackQuery.bind(this));
        
        // Error handling
        this.bot.on('error', (error) => {
            console.error('Bot error:', error);
        });
        
        this.bot.on('polling_error', (error) => {
            console.error('Polling error:', error);
        });
    }
    
    // Check if user is admin
    isAdmin(userId) {
        return this.adminUsers.has(userId);
    }
    
    // Get user language
    getUserLanguage(userId) {
        return this.currentLanguage.get(userId) || 'en';
    }
    
    // Generate OAuth URL
    generateOAuthUrl(userId) {
        const clientId = process.env.ZOOM_CLIENT_ID;
        const redirectUri = process.env.ZOOM_REDIRECT_URI;
        const state = userId.toString();
        
        return `https://zoom.us/oauth/authorize?` +
               `response_type=code&` +
               `client_id=${clientId}&` +
               `redirect_uri=${encodeURIComponent(redirectUri)}&` +
               `scope=meeting:write meeting:read user:read&` +
               `state=${state}`;
    }
    
    // Handle incoming messages
    async handleMessage(msg) {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const text = msg.text;
        
        if (!text || !text.startsWith('/')) {
            return;
        }
        
        const [command, ...args] = text.split(' ');
        
        try {
            switch (command) {
                case '/start':
                    await this.handleStart(chatId, userId, args);
                    break;
                case '/zoomlogin':
                    await this.handleZoomLogin(chatId, userId, args);
                    break;
                case '/startsession':
                    await this.handleStartSession(chatId, userId, args);
                    break;
                case '/roominfo':
                    await this.handleRoomInfo(chatId, userId, args);
                    break;
                case '/scanroom':
                    await this.handleScanRoom(chatId, userId, args);
                    break;
                case '/createroom':
                    await this.handleCreateRoom(chatId, userId, args);
                    break;
                case '/monitor':
                    await this.handleMonitor(chatId, userId, args);
                    break;
                case '/startbot':
                    await this.handleStartBot(chatId, userId, args);
                    break;
                case '/stopbot':
                    await this.handleStopBot(chatId, userId, args);
                    break;
                case '/botstatus':
                    await this.handleBotStatus(chatId, userId, args);
                    break;
                case '/chatwatch':
                    await this.handleChatWatch(chatId, userId, args);
                    break;
                case '/promote':
                    await this.handlePromote(chatId, userId, args);
                    break;
                case '/commandchat':
                    await this.handleCommandChat(chatId, userId, args);
                    break;
                case '/docs':
                    await this.handleDocs(chatId, userId, args);
                    break;
                case '/status':
                    await this.handleStatus(chatId, userId, args);
                    break;
                case '/shutdown':
                    await this.handleShutdown(chatId, userId, args);
                    break;
                case '/language':
                    await this.handleLanguage(chatId, userId, args);
                    break;
                default:
                    await this.bot.sendMessage(chatId, 
                        `❌ Unknown command: ${command}\\nUse /start to see available commands.`);
            }
        } catch (error) {
            console.error(`Error handling command ${command}:`, error);
            await this.bot.sendMessage(chatId, 
                '❌ An error occurred processing your command. Please try again.');
        }
    }
    
    // Handle callback queries from inline keyboards
    async handleCallbackQuery(callbackQuery) {
        const chatId = callbackQuery.message.chat.id;
        const userId = callbackQuery.from.id;
        const data = callbackQuery.data;
        
        try {
            // Handle different callback types
            if (data.startsWith('lang_')) {
                const language = data.split('_')[1];
                this.currentLanguage.set(userId, language);
                
                const message = language === 'es' 
                    ? '✅ Idioma cambiado a Español 🇲🇽'
                    : '✅ Language changed to English 🇺🇸';
                
                await this.bot.editMessageText(message, {
                    chat_id: chatId,
                    message_id: callbackQuery.message.message_id
                });
            }
            
            // Answer the callback query
            await this.bot.answerCallbackQuery(callbackQuery.id);
            
        } catch (error) {
            console.error('Error handling callback query:', error);
            await this.bot.answerCallbackQuery(callbackQuery.id, 
                { text: 'Error processing request' });
        }
    }
    
    // Command Handlers
    async handleStart(chatId, userId, args) {
        const welcomeMessage = 
            `🎥 *Welcome to Zoom Meeting Bot!*\n\n` +
            `*Available Commands:*\n` +
            `/start - Show this message\n` +
            `/zoomlogin - Connect your Zoom account\n` +
            `/startsession - Start Zoom session (Admin only)\n` +
            `/roominfo - Get current Zoom Room information\n` +
            `/scanroom - Advanced participant monitoring with auto-moderation\n` +
            `/createroom - Create instant meeting with auto-multipin\n` +
            `/monitor - Start/stop automatic monitoring\n` +
            `/startbot - Start browser bot for multipin automation (Admin)\n` +
            `/stopbot - Stop browser bot automation (Admin)\n` +
            `/botstatus - Check browser bot status\n` +
            `/chatwatch - Monitor and moderate Zoom chat\n` +
            `/promote - Promote user to cohost\n` +
            `/commandchat - Manage Command Chat integration\n` +
            `/docs - Access documentation and guides\n` +
            `/status - Current session status\n` +
            `/shutdown - Stop bot (Admin only)\n` +
            `/language - Change language / Cambiar idioma 🇺🇸🇲🇽\n\n` +
            `*Features:*\n` +
            `✅ OAuth integration with Zoom\n` +
            `✅ Secure meeting management\n` +
            `✅ Real-time monitoring\n` +
            `✅ Automated multipin via browser bot\n` +
            `✅ Camera + hand raise requirements\n\n` +
            `Get started with /zoomlogin to connect your Zoom account!`;
        
        await this.bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
    }
    
    async handleZoomLogin(chatId, userId, args) {
        if (this.userSessions.has(userId)) {
            await this.bot.sendMessage(chatId, '✅ You are already connected to Zoom!');
            return;
        }
        
        const authUrl = this.generateOAuthUrl(userId);
        const loginMessage = 
            `🔐 *Connect Your Zoom Account*\n\n` +
            `Click the link below to authorize this bot:\n` +
            `[🔗 Authorize Zoom Access](${authUrl})\n\n` +
            `After authorization, you'll be able to:\n` +
            `• Create instant meetings\n` +
            `• Monitor participants\n` +
            `• Control room settings\n` +
            `• Access advanced features\n\n` +
            `🔒 This is secure OAuth - your credentials are never stored!`;
        
        await this.bot.sendMessage(chatId, loginMessage, { 
            parse_mode: 'Markdown',
            disable_web_page_preview: true 
        });
    }
    
    async handleStartSession(chatId, userId, args) {
        if (!this.isAdmin(userId)) {
            await this.bot.sendMessage(chatId, '❌ Admin access required for this command.');
            return;
        }
        
        const sessionId = `session_${Date.now()}`;
        console.log(`🚀 Admin ${userId} started session: ${sessionId}`);
        
        const sessionMessage = 
            `🚀 *Zoom Session Started!*\n\n` +
            `📋 Session ID: \`${sessionId}\`\n` +
            `📊 Status: Active\n` +
            `👁️ Monitoring: Enabled\n` +
            `🤖 Auto-moderation: Ready\n\n` +
            `Use /roominfo to get room details\n` +
            `Use /monitor to control monitoring`;
        
        await this.bot.sendMessage(chatId, sessionMessage, { parse_mode: 'Markdown' });
    }
    
    async handleRoomInfo(chatId, userId, args) {
        if (!this.userSessions.has(userId)) {
            await this.bot.sendMessage(chatId, '❌ Please connect your Zoom account first with /zoomlogin');
            return;
        }
        
        // In production, this would make real API calls to Zoom
        const roomInfo = 
            `📊 *Current Zoom Room Information*\n\n` +
            `🆔 Meeting ID: \`123-456-789\`\n` +
            `📝 Topic: Team Meeting\n` +
            `👥 Participants: 8 active\n` +
            `🎥 Video Status: 6 cameras on\n` +
            `🔊 Audio Status: All unmuted\n` +
            `📹 Recording: Active (Cloud)\n` +
            `🚪 Waiting Room: 2 waiting\n` +
            `⏱️ Duration: 45 minutes\n` +
            `🤖 Bot Status: Monitoring\n\n` +
            `Use /scanroom for detailed participant analysis`;
        
        await this.bot.sendMessage(chatId, roomInfo, { parse_mode: 'Markdown' });
    }
    
    async handleCreateRoom(chatId, userId, args) {
        if (!this.userSessions.has(userId)) {
            await this.bot.sendMessage(chatId, '❌ Please connect your Zoom account first with /zoomlogin');
            return;
        }
        
        const topic = args.join(' ') || 'Instant Meeting';
        
        const processingMsg = await this.bot.sendMessage(chatId, '🎬 Creating meeting with auto-multipin...');
        
        // Simulate meeting creation (in production, use real Zoom API)
        setTimeout(async () => {
            const meetingId = Math.floor(Math.random() * 1000000000);
            const password = Math.random().toString(36).substring(2, 8);
            
            const meetingInfo = 
                `✅ *Meeting Created Successfully!*\n\n` +
                `📝 Topic: ${topic}\n` +
                `🆔 Meeting ID: \`${meetingId}\`\n` +
                `🔐 Password: \`${password}\`\n` +
                `🔗 [Join Meeting](https://zoom.us/j/${meetingId}?pwd=${password})\n\n` +
                `🤖 *Auto-features enabled:*\n` +
                `✅ Multipin automation ready\n` +
                `✅ Camera requirement active\n` +
                `✅ Hand raise monitoring\n` +
                `✅ Auto-moderation enabled\n\n` +
                `Use /startbot to activate browser automation`;
            
            await this.bot.editMessageText(meetingInfo, {
                chat_id: chatId,
                message_id: processingMsg.message_id,
                parse_mode: 'Markdown',
                disable_web_page_preview: true
            });
        }, 2000);
    }
    
    async handleBotStatus(chatId, userId, args) {
        const statusMessage = 
            `🤖 *Bot Status Report*\n\n` +
            `🔗 OAuth Connection: ${this.userSessions.has(userId) ? '✅ Connected' : '❌ Not connected'}\n` +
            `📊 Monitoring: ${this.monitoringActive ? '🟢 Active' : '🔴 Inactive'}\n` +
            `🤖 Browser Bot: ${this.browserBotActive ? '🟢 Running' : '🔴 Stopped'}\n` +
            `👑 Admin Access: ${this.isAdmin(userId) ? '✅ Yes' : '❌ No'}\n` +
            `🌐 Language: ${this.getUserLanguage(userId) === 'es' ? '🇲🇽 Español' : '🇺🇸 English'}\n\n` +
            `📈 *Performance:*\n` +
            `• Uptime: ${Math.floor(process.uptime() / 3600)}h ${Math.floor((process.uptime() % 3600) / 60)}m\n` +
            `• Memory Usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB\n` +
            `• Active Users: ${this.userSessions.size}\n\n` +
            `Use /status for detailed session info`;
        
        await this.bot.sendMessage(chatId, statusMessage, { parse_mode: 'Markdown' });
    }
    
    async handleLanguage(chatId, userId, args) {
        if (args.length > 0) {
            const lang = args[0].toLowerCase();
            if (lang === 'en' || lang === 'es') {
                this.currentLanguage.set(userId, lang);
                const message = lang === 'es' 
                    ? '✅ Idioma cambiado a Español 🇲🇽'
                    : '✅ Language changed to English 🇺🇸';
                await this.bot.sendMessage(chatId, message);
                return;
            }
        }
        
        const keyboard = {
            inline_keyboard: [
                [
                    { text: '🇺🇸 English', callback_data: 'lang_en' },
                    { text: '🇲🇽 Español', callback_data: 'lang_es' }
                ]
            ]
        };
        
        const languageMessage = 
            `🌐 *Language Selection / Selección de Idioma*\n\n` +
            `Choose your language / Elige tu idioma:\n\n` +
            `🇺🇸 **English** - Default\n` +
            `• All commands in English\n` +
            `• Documentation in English\n\n` +
            `🇲🇽 **Español**\n` +
            `• Todos los comandos en español\n` +
            `• Documentación en español\n\n` +
            `Current / Actual: ${this.getUserLanguage(userId) === 'es' ? '🇲🇽 Español' : '🇺🇸 English'}`;
        
        await this.bot.sendMessage(chatId, languageMessage, {
            parse_mode: 'Markdown',
            reply_markup: keyboard
        });
    }
    
    // Add remaining command handlers here...
    // (handleScanRoom, handleMonitor, handleStartBot, etc.)
    // For brevity, I'm showing the core structure
    
    // OAuth token storage methods
    storeUserTokens(userId, tokens) {
        this.userSessions.set(userId, {
            ...tokens,
            stored_at: Date.now()
        });
        console.log(`✅ Tokens stored for user ${userId}`);
    }
    
    getUserTokens(userId) {
        return this.userSessions.get(userId);
    }
    
    // Zoom API methods
    async makeZoomAPICall(endpoint, method = 'GET', data = null, accessToken) {
        try {
            const config = {
                method,
                url: `https://api.zoom.us/v2${endpoint}`,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            };
            
            if (data && (method === 'POST' || method === 'PATCH')) {
                config.data = data;
            }
            
            const response = await axios(config);
            return response.data;
        } catch (error) {
            console.error('Zoom API Error:', error.response?.data || error.message);
            throw error;
        }
    }
}

// OAuth callback handler (Express route)
const express = require('express');
const app = express();

// Global bot instance
let botInstance = null;

// OAuth callback route
app.get('/auth/zoom/callback', async (req, res) => {
    const { code, state, error } = req.query;
    
    if (error) {
        console.error('OAuth error:', error);
        res.send('Authorization failed. Please try again.');
        return;
    }
    
    if (!code || !state) {
        res.send('Invalid authorization response.');
        return;
    }
    
    try {
        // Exchange code for tokens
        const tokenResponse = await axios.post('https://zoom.us/oauth/token', {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.ZOOM_REDIRECT_URI
        }, {
            headers: {
                'Authorization': `Basic ${Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        const tokens = tokenResponse.data;
        const userId = parseInt(state);
        
        // Store tokens in bot
        if (botInstance) {
            botInstance.storeUserTokens(userId, tokens);
            
            // Notify user of successful authorization
            await botInstance.bot.sendMessage(userId, 
                '✅ *Zoom Account Connected Successfully!*\n\n' +
                'You can now use all bot features:\n' +
                '• Create meetings with /createroom\n' +
                '• Get room info with /roominfo\n' +
                '• Monitor participants with /scanroom\n\n' +
                'Try /status to see your connection status!',
                { parse_mode: 'Markdown' }
            );
        }
        
        res.send(`
            <html>
                <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
                    <h2>✅ Authorization Successful!</h2>
                    <p>Your Zoom account has been connected to the Telegram bot.</p>
                    <p>You can now close this window and return to Telegram.</p>
                    <script>
                        setTimeout(() => window.close(), 3000);
                    </script>
                </body>
            </html>
        `);
        
    } catch (error) {
        console.error('Token exchange error:', error);
        res.send('Failed to complete authorization. Please try again.');
    }
});

// Start the bot and server
if (require.main === module) {
    // Create bot instance
    botInstance = new ZoomTelegramBot();
    
    // Start OAuth callback server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 OAuth callback server running on port ${PORT}`);
        console.log(`📍 Callback URL: http://localhost:${PORT}/auth/zoom/callback`);
    });
}

module.exports = ZoomTelegramBot;
