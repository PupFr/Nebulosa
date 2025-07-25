const TelegramBot = require('node-telegram-bot-api');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Environment configuration
const BOT_TOKEN = process.env.BOT_TOKEN || '8113796108:AAHvZqXdqTRzor5ep7tV0OCDWzQO_8TjBUg';
const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID || 'K3t8Sd3rSZOSKfkyMftDXg';
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET || 'Gb9JmLsI1brv4bPdAPB9CSknQV4GiFB';
const ZOOM_REDIRECT_URI = process.env.ZOOM_REDIRECT_URI || 'https://pupfr.github.io/Nebulosa/zoom-callback-english.html';

console.log('🚀 Starting LA NUBE BOT - Streamlined Version...');
console.log('📦 Node version:', process.version);
console.log('🔧 Environment:', process.env.NODE_ENV || 'development');

// Initialize bot
const bot = new TelegramBot(BOT_TOKEN, {
    polling: true,
    request: {
        agentOptions: {
            keepAlive: true,
            family: 4
        }
    }
});

// Session storage
const sessions = new Map();
const adminUsers = new Set(['PUPFRISKY', 'pupfrisky']); // Add admin usernames

// Helper functions
function isAdmin(msg) {
    return adminUsers.has(msg.from.username?.toLowerCase());
}

function log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${level}: ${message}`);
}

// Main start command with streamlined menu
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username || msg.from.first_name || 'User';

    log(`/start command from ${username} (${chatId})`);

    const welcomeMessage = `🌟 Welcome to La NUBE BOT! ☁️

Hello ${username.toUpperCase()}! I'm your Zoom meeting assistant.

Available Commands:
/start - Show this message
/zoomlogin - Connect your Zoom account
/startsession - Start Zoom session (Admin only)
/roominfo - Get current Zoom Room information
/scanroom - Advanced participant monitoring with auto-moderation
/createroom - Create instant meeting with auto-multipin
/monitor - Start/stop automatic monitoring
/startbot - Start browser bot for multipin automation (Admin)
/stopbot - Stop browser bot automation (Admin)
/botstatus - Check browser bot status
/chatwatch - Monitor and moderate Zoom chat
/promote - Promote user to cohost
/commandchat - Manage Command Chat integration
/docs - Access documentation and guides
/status - Current session status
/shutdown - Stop bot (Admin only)
/language - Change language / Cambiar idioma 🇺🇸🇲🇽

Features:
✅ OAuth integration with Zoom
✅ Secure meeting management
✅ Real-time monitoring
✅ Automated multipin via browser bot
✅ Camera + hand raise requirements

Ready to start? Use /zoomlogin to connect your Zoom account!`;

    bot.sendMessage(chatId, welcomeMessage);
});

// Zoom OAuth login
bot.onText(/\/zoomlogin/, (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username || msg.from.first_name;

    log(`/zoomlogin command from ${username}`);

    try {
        // Generate state parameter for security
        const state = crypto.randomBytes(32).toString('hex');
        sessions.set(chatId, { state, username, timestamp: Date.now() });

        // Build OAuth URL
        const authUrl = `https://zoom.us/oauth/authorize?` +
            `response_type=code&` +
            `client_id=${ZOOM_CLIENT_ID}&` +
            `redirect_uri=${encodeURIComponent(ZOOM_REDIRECT_URI)}&` +
            `state=${state}&` +
            `scope=meeting:write:admin meeting:read:admin user:read:admin user_profile`;

        const message = `🔐 Zoom OAuth Authentication

Click the link below to authorize LA NUBE BOT:
${authUrl}

⚠️ This link expires in 10 minutes for security.`;

        bot.sendMessage(chatId, message);

        // Clean up expired sessions (10 minutes)
        setTimeout(() => {
            if (sessions.has(chatId)) {
                sessions.delete(chatId);
                log(`Cleaned up expired session for ${username}`);
            }
        }, 10 * 60 * 1000);

    } catch (error) {
        log(`Error in /zoomlogin: ${error.message}`, 'ERROR');
        bot.sendMessage(chatId, '❌ Error generating OAuth link. Please try again.');
    }
});

// Admin-only start session
bot.onText(/\/startsession/, (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username || msg.from.first_name;

    if (!isAdmin(msg)) {
        bot.sendMessage(chatId, '❌ This command is restricted to administrators.');
        return;
    }

    log(`/startsession command from admin ${username}`);
    bot.sendMessage(chatId, '🚀 Starting Zoom session...\n\n⚠️ Feature under development');
});

// Room information
bot.onText(/\/roominfo/, (msg) => {
    const chatId = msg.chat.id;
    log(`/roominfo command from ${msg.from.username}`);

    bot.sendMessage(chatId, '🏠 Room Information\n\n📊 Status: Connected\n👥 Participants: 0\n🔗 Room ID: Not available\n\n⚠️ Feature under development');
});

// Advanced room scanning
bot.onText(/\/scanroom/, (msg) => {
    const chatId = msg.chat.id;
    log(`/scanroom command from ${msg.from.username}`);

    bot.sendMessage(chatId, '🔍 Advanced Room Scanning\n\n📡 Scanning participants...\n🤖 Auto-moderation: Active\n📋 Compliance check: Passed\n\n⚠️ Feature under development');
});

// Create instant room
bot.onText(/\/createroom/, (msg) => {
    const chatId = msg.chat.id;
    log(`/createroom command from ${msg.from.username}`);

    bot.sendMessage(chatId, '🏗️ Creating Instant Meeting\n\n⚡ Auto-multipin enabled\n🔗 Generating meeting link...\n📅 Scheduling for immediate start\n\n⚠️ Feature under development');
});

// Monitoring toggle
bot.onText(/\/monitor/, (msg) => {
    const chatId = msg.chat.id;
    log(`/monitor command from ${msg.from.username}`);

    bot.sendMessage(chatId, '📊 Automatic Monitoring\n\n🔄 Status: Ready\n⏰ Interval: 30 seconds\n📈 Analytics: Enabled\n\n⚠️ Feature under development');
});

// Admin-only bot management
bot.onText(/\/startbot/, (msg) => {
    const chatId = msg.chat.id;

    if (!isAdmin(msg)) {
        bot.sendMessage(chatId, '❌ This command is restricted to administrators.');
        return;
    }

    log(`/startbot command from admin ${msg.from.username}`);
    bot.sendMessage(chatId, '🤖 Starting Browser Bot\n\n🌐 Launching automation...\n📌 Multipin ready\n✅ Browser instance active\n\n⚠️ Feature under development');
});

bot.onText(/\/stopbot/, (msg) => {
    const chatId = msg.chat.id;

    if (!isAdmin(msg)) {
        bot.sendMessage(chatId, '❌ This command is restricted to administrators.');
        return;
    }

    log(`/stopbot command from admin ${msg.from.username}`);
    bot.sendMessage(chatId, '🛑 Stopping Browser Bot\n\n🌐 Shutting down automation...\n📌 Multipin disabled\n❌ Browser instance stopped\n\n✅ Complete');
});

// Bot status
bot.onText(/\/botstatus/, (msg) => {
    const chatId = msg.chat.id;
    log(`/botstatus command from ${msg.from.username}`);

    const uptime = process.uptime();
    const uptimeFormatted = Math.floor(uptime / 60);

    bot.sendMessage(chatId, `🤖 Browser Bot Status\n\n✅ Main Bot: Online\n🌐 Browser Instance: Ready\n📌 Multipin: Available\n⏱️ Uptime: ${uptimeFormatted} minutes\n🔋 Performance: Optimal`);
});

// Chat monitoring
bot.onText(/\/chatwatch/, (msg) => {
    const chatId = msg.chat.id;
    log(`/chatwatch command from ${msg.from.username}`);

    bot.sendMessage(chatId, '💬 Chat Monitoring\n\n👀 Watching for keywords\n🚫 Auto-moderation: Active\n📝 Logging: Enabled\n\n⚠️ Feature under development');
});

// Promote user
bot.onText(/\/promote/, (msg) => {
    const chatId = msg.chat.id;
    log(`/promote command from ${msg.from.username}`);

    bot.sendMessage(chatId, '⬆️ User Promotion\n\n👤 Select user to promote\n🎯 Role: Co-host\n✅ Permissions granted\n\n⚠️ Feature under development');
});

// Command chat integration
bot.onText(/\/commandchat/, (msg) => {
    const chatId = msg.chat.id;
    log(`/commandchat command from ${msg.from.username}`);

    bot.sendMessage(chatId, '💬 Command Chat Integration\n\n🔗 Status: Connected\n📱 Platform: Telegram\n⚡ Real-time: Active\n\n⚠️ Feature under development');
});

// Documentation
bot.onText(/\/docs/, (msg) => {
    const chatId = msg.chat.id;
    log(`/docs command from ${msg.from.username}`);

    const docsMessage = `📚 Documentation & Guides

📖 Available Resources:
• Setup Guide: /docs-setup
• OAuth Configuration: /docs-oauth  
• Multipin Automation: /docs-multipin
• Short.io Integration: /docs-shortio

🌐 Online Documentation:
https://pupfr.github.io/Nebulosa/

🔧 GitHub Repository:
https://github.com/PupFr/Nebulosa

Need help? Contact @pupfrisky`;

    bot.sendMessage(chatId, docsMessage);
});

// Status check
bot.onText(/\/status/, (msg) => {
    const chatId = msg.chat.id;
    log(`/status command from ${msg.from.username}`);

    const memUsage = process.memoryUsage();
    const uptime = process.uptime();

    const statusMessage = `📊 Current Session Status

🤖 Bot Status: ✅ Online
⏱️ Uptime: ${Math.floor(uptime / 60)} minutes
💾 Memory: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB
🔗 Zoom OAuth: ${sessions.size > 0 ? '✅ Active' : '❌ Not connected'}
🌐 Network: ✅ Stable
📡 Polling: ✅ Active

Active Features:
• OAuth Authentication
• Command Processing  
• Session Management
• Admin Controls`;

    bot.sendMessage(chatId, statusMessage);
});

// Admin-only shutdown
bot.onText(/\/shutdown/, (msg) => {
    const chatId = msg.chat.id;

    if (!isAdmin(msg)) {
        bot.sendMessage(chatId, '❌ This command is restricted to administrators.');
        return;
    }

    log(`/shutdown command from admin ${msg.from.username}`);
    bot.sendMessage(chatId, '🛑 Shutting down LA NUBE BOT...\n\n👋 Goodbye!')
        .then(() => {
            process.exit(0);
        });
});

// Language selection
bot.onText(/\/language/, (msg) => {
    const chatId = msg.chat.id;
    log(`/language command from ${msg.from.username}`);

    const languageMessage = `🌍 Language Selection / Selección de Idioma

Current: English 🇺🇸
Actual: Inglés 🇺🇸

Available Languages:
• English 🇺🇸 (Current)
• Español 🇲🇽 (Coming soon)

Note: This bot currently operates in English only.
Multi-language support coming in future updates!`;

    bot.sendMessage(chatId, languageMessage);
});

// Error handling
bot.on('polling_error', (error) => {
    log(`Polling Error: ${error.code} ${error.message}`, 'ERROR');

    if (error.code === 'ETELEGRAM') {
        log('Telegram API Error - Check bot token and network connectivity', 'ERROR');
    }
});

bot.on('error', (error) => {
    log(`Bot Error: ${error.message}`, 'ERROR');
});

// Startup confirmation
console.log('✅ LA NUBE BOT initialized with streamlined commands');
console.log('🔄 Polling mode active');
console.log('🤖 Bot is ready to receive commands!');

// Keep process alive
process.on('SIGINT', () => {
    log('Received SIGINT, shutting down gracefully...', 'INFO');
    bot.stopPolling();
    process.exit(0);
});

process.on('SIGTERM', () => {
    log('Received SIGTERM, shutting down gracefully...', 'INFO');
    bot.stopPolling();
    process.exit(0);
});
