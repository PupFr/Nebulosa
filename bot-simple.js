#!/usr/bin/env node

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Validate environment
if (!process.env.BOT_TOKEN) {
  console.error('❌ BOT_TOKEN not found in .env file');
  process.exit(1);
}

console.log('🚀 Starting LA NUBE BOT...');

// Create bot with robust polling configuration
const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: {
    interval: 1000,
    autoStart: true,
    params: {
      timeout: 10
    }
  }
});

// Enhanced error handling
bot.on('polling_error', (error) => {
  console.error('❌ Polling Error:', error.code, error.message);
  
  if (error.code === 'ETELEGRAM') {
    console.error('🔍 Telegram API Error Details:');
    console.error('  - Check if bot token is valid');
    console.error('  - Verify no other bot instance is running');
    console.error('  - Ensure network connectivity');
    
    // Try to restart polling after a delay
    setTimeout(() => {
      console.log('🔄 Attempting to restart polling...');
      bot.stopPolling().then(() => {
        setTimeout(() => {
          bot.startPolling();
        }, 2000);
      }).catch(console.error);
    }, 5000);
  }
});

// Basic commands
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '☁️ Welcome to LA NUBE BOT! \n\nAvailable commands:\n/roominfo - Get Zoom room details\n/help - Show help');
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `🤖 LA NUBE BOT Help

📋 Available Commands:
/start - Welcome message
/roominfo - Get Zoom room information
/help - Show this help message

⚡ This bot helps manage Zoom meetings and provides room information.
🔗 For more features, ensure your environment is properly configured.`);
});

bot.onText(/\/roominfo/, (msg) => {
  const chatId = msg.chat.id;
  
  if (process.env.ZOOM_LINK && process.env.ZOOM_ID && process.env.ZOOM_PASSCODE) {
    bot.sendMessage(chatId, `🔗 Zoom Room Information:

📱 Meeting Link: ${process.env.ZOOM_LINK}
🆔 Meeting ID: ${process.env.ZOOM_ID}
🔐 Passcode: ${process.env.ZOOM_PASSCODE}

✅ Room is active and ready for participants!`);
  } else {
    bot.sendMessage(chatId, "⚠️ LA NUBE BOT is not currently in an active session.\n\n🔧 Please configure your Zoom credentials to enable room features.");
  }
});

// Success message
bot.getMe().then((info) => {
  console.log(`✅ Bot started successfully!`);
  console.log(`📱 Bot Name: ${info.first_name}`);
  console.log(`🆔 Bot Username: @${info.username}`);
  console.log(`🔢 Bot ID: ${info.id}`);
  console.log(`🎯 Ready to receive commands!`);
}).catch(console.error);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down LA NUBE BOT...');
  bot.stopPolling().then(() => {
    console.log('✅ Bot stopped successfully. Goodbye!');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Error stopping bot:', error);
    process.exit(1);
  });
});

console.log('🎯 Bot initialization complete. Waiting for messages...');
