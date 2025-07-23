#!/usr/bin/env node

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

console.log('🔍 Testing Telegram Bot Connection...');
console.log('Bot Token:', process.env.BOT_TOKEN ? 'Found' : 'Missing');

if (!process.env.BOT_TOKEN) {
  console.error('❌ BOT_TOKEN not found in environment variables');
  process.exit(1);
}

// Test with minimal polling configuration
const bot = new TelegramBot(process.env.BOT_TOKEN, { 
  polling: {
    interval: 1000,
    autoStart: false
  }
});

// Enhanced error handling
bot.on('polling_error', (error) => {
  console.error('❌ Polling Error Details:');
  console.error('Code:', error.code);
  console.error('Message:', error.message);
  console.error('Response:', error.response?.body);
  
  if (error.code === 'ETELEGRAM') {
    console.error('🔍 This is a Telegram API error. Common causes:');
    console.error('  - Invalid or revoked bot token');
    console.error('  - Bot was deleted by @BotFather');
    console.error('  - Network connectivity issues');
    console.error('  - Another instance of the bot is running');
  }
  
  process.exit(1);
});

bot.on('message', (msg) => {
  console.log('✅ Message received:', msg.text);
});

// Test API first
console.log('🔍 Testing API connection...');
bot.getMe().then((info) => {
  console.log('✅ Bot info retrieved successfully:');
  console.log('  Name:', info.first_name);
  console.log('  Username:', info.username);
  console.log('  ID:', info.id);
  
  console.log('🚀 Starting polling...');
  bot.startPolling();
  
  console.log('✅ Bot is running! Send a message to test.');
  console.log('Press Ctrl+C to stop.');
  
}).catch((error) => {
  console.error('❌ Failed to get bot info:');
  console.error('Error:', error.message);
  console.error('Response:', error.response?.body);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping bot...');
  bot.stopPolling().then(() => {
    console.log('✅ Bot stopped successfully');
    process.exit(0);
  });
});
