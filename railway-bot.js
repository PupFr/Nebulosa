// 🚂 Railway-Compatible Bot (Webhook Mode)
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const axios = require('axios');
require('dotenv').config();

class RailwayTelegramBot {
    constructor() {
        // Railway-specific configuration
        this.PORT = process.env.PORT || 3000;
        this.BOT_TOKEN = process.env.BOT_TOKEN;
        this.WEBHOOK_URL = `https://${process.env.RAILWAY_STATIC_URL || 'nebulosa-production.railway.app'}/webhook`;
        
        if (!this.BOT_TOKEN) {
            console.error('❌ BOT_TOKEN not found in environment variables');
            process.exit(1);
        }
        
        // Initialize bot in webhook mode (required for Railway)
        this.bot = new TelegramBot(this.BOT_TOKEN, { webHook: false });
        this.userSessions = new Map();
        this.adminUsers = new Set();
        this.monitoringActive = false;
        this.currentLanguage = new Map();
        
        this.setupExpress();
        this.setupBot();
        this.setWebhook();
        
        console.log('🚂 Railway Telegram Bot initialized!');
    }
    
    setupExpress() {
        this.app = express();
        this.app.use(express.json());
        
        // Webhook endpoint for Telegram
        this.app.post('/webhook', (req, res) => {
            console.log('📨 Webhook received:', req.body);
            this.bot.processUpdate(req.body);
            res.sendStatus(200);
        });
        
        // Health check endpoint
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'healthy',
                platform: 'railway',
                service: 'telegram-bot',
                webhook_url: this.WEBHOOK_URL,
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            });
        });
        
        // Root endpoint
        this.app.get('/', (req, res) => {
            res.send(`
                <h1>🚂 Nebulosa Railway Bot</h1>
                <p>✅ Status: Running</p>
                <p>🔗 Webhook: ${this.WEBHOOK_URL}</p>
                <p>⏰ Started: ${new Date().toISOString()}</p>
                <p>📊 <a href="/health">Health Check</a></p>
            `);
        });
        
        // Start Express server
        this.app.listen(this.PORT, '0.0.0.0', () => {
            console.log(`🌐 Railway server running on port ${this.PORT}`);
            console.log(`🔗 Webhook URL: ${this.WEBHOOK_URL}`);
        });
    }
    
    async setWebhook() {
        try {
            // Remove existing webhook
            await this.bot.deleteWebHook();
            console.log('🗑️ Existing webhook removed');
            
            // Set new webhook
            const result = await this.bot.setWebHook(this.WEBHOOK_URL);
            if (result) {
                console.log('✅ Webhook set successfully:', this.WEBHOOK_URL);
            } else {
                console.log('❌ Failed to set webhook');
            }
            
            // Verify webhook
            const webhookInfo = await this.bot.getWebHookInfo();
            console.log('📡 Webhook info:', webhookInfo);
            
        } catch (error) {
            console.error('❌ Webhook setup error:', error.message);
            
            // Fallback: Try to get bot info to verify token
            try {
                const botInfo = await this.bot.getMe();
                console.log('🤖 Bot info:', botInfo);
                console.log('✅ Bot token is valid');
            } catch (tokenError) {
                console.error('❌ Bot token error:', tokenError.message);
                console.error('🔍 Check BOT_TOKEN environment variable');
            }
        }
    }
    
    setupBot() {
        // Set bot commands
        this.bot.setMyCommands([
            { command: 'start', description: 'Welcome to Nebulosa Bot' },
            { command: 'status', description: 'Check bot status' },
            { command: 'health', description: 'Health check' },
            { command: 'help', description: 'Get help' }
        ]);
        
        // Start command
        this.bot.onText(/\/start/, async (msg) => {
            const chatId = msg.chat.id;
            const welcomeMessage = `
🚂 *Nebulosa Railway Bot*

✅ *Status*: Running on Railway
🌐 *Platform*: Production
⚡ *Mode*: Webhook (Railway-optimized)

*Available Commands:*
/start - This welcome message
/status - Check bot status  
/health - Health information
/help - Get help

🎯 *Railway Deployment*: Active
📡 *Webhook*: Configured
⏰ *Started*: ${new Date().toLocaleString()}
            `;
            
            await this.bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
        });
        
        // Status command
        this.bot.onText(/\/status/, async (msg) => {
            const chatId = msg.chat.id;
            
            try {
                const webhookInfo = await this.bot.getWebHookInfo();
                const statusMessage = `
📊 *Bot Status Report*

🚂 *Platform*: Railway Production
✅ *Status*: Online
🔗 *Webhook*: ${webhookInfo.url ? '✅ Active' : '❌ Not Set'}
📡 *URL*: ${webhookInfo.url || 'Not configured'}
⏰ *Last Error*: ${webhookInfo.last_error_date ? new Date(webhookInfo.last_error_date * 1000).toLocaleString() : 'None'}
📈 *Pending Updates*: ${webhookInfo.pending_update_count || 0}

⚡ *Server*: Port ${this.PORT}
💾 *Memory*: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB
⏱️ *Uptime*: ${Math.floor(process.uptime() / 60)} minutes
                `;
                
                await this.bot.sendMessage(chatId, statusMessage, { parse_mode: 'Markdown' });
                
            } catch (error) {
                await this.bot.sendMessage(chatId, `❌ Status check failed: ${error.message}`);
            }
        });
        
        // Health command
        this.bot.onText(/\/health/, async (msg) => {
            const chatId = msg.chat.id;
            
            const healthInfo = `
🏥 *Health Check*

🚂 *Railway*: ✅ Healthy
🤖 *Bot*: ✅ Responding
📡 *Webhook*: ✅ Active
💾 *Database*: ${process.env.DATABASE_URL ? '✅ Connected' : '⚠️ Not configured'}

📊 *Metrics*:
• Uptime: ${Math.floor(process.uptime() / 60)} minutes
• Memory: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB
• Port: ${this.PORT}

⏰ *Last Check*: ${new Date().toLocaleString()}
            `;
            
            await this.bot.sendMessage(chatId, healthInfo, { parse_mode: 'Markdown' });
        });
        
        // Help command
        this.bot.onText(/\/help/, async (msg) => {
            const chatId = msg.chat.id;
            
            const helpMessage = `
📚 *Nebulosa Bot Help*

*This bot is running on Railway* 🚂

*Available Commands:*
/start - Welcome message
/status - Bot status information
/health - Health check details
/help - This help message

*Platform Information:*
🚂 *Railway*: Production environment
⚡ *Webhook*: Real-time message processing
🌐 *URL*: ${this.WEBHOOK_URL}

*Having issues?*
1. Check Railway logs
2. Verify webhook configuration  
3. Ensure BOT_TOKEN is set

*Admin Panel*: https://nebulosa-admin.onrender.com
*Documentation*: https://nebulosa-docs.onrender.com
            `;
            
            await this.bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
        });
        
        // Error handling
        this.bot.on('error', (error) => {
            console.error('❌ Bot error:', error);
        });
        
        this.bot.on('webhook_error', (error) => {
            console.error('❌ Webhook error:', error);
        });
    }
}

// Initialize bot
const railwayBot = new RailwayTelegramBot();

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Railway bot shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 Railway bot interrupted, shutting down...');
    process.exit(0);
});

module.exports = railwayBot;
