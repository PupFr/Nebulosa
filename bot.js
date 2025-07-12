const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const config = require('./config');

const bot = new TelegramBot(config.BOT_TOKEN, { polling: true });

// Log helper
function logInteraction(msg, command) {
  const logEntry = {
    user: msg.from.username || msg.from.id,
    name: `${msg.from.first_name || ''} ${msg.from.last_name || ''}`.trim(),
    command,
    date: new Date().toISOString(),
    chatType: msg.chat.type
  };
  const logs = fs.existsSync('./logs.json') ? JSON.parse(fs.readFileSync('./logs.json')) : [];
  logs.push(logEntry);
  fs.writeFileSync('./logs.json', JSON.stringify(logs, null, 2));
}

// Comandos
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "☁️ Welcome to La NUBE BOT. Type /roominfo to get Zoom Room data.");
  logInteraction(msg, "/start");
});

bot.onText(/\/roominfo/, (msg) => {
  if (config.ZOOM_LINK && config.ZOOM_ID && config.ZOOM_PASSCODE) {
    bot.sendMessage(msg.chat.id, `🔗 Zoom Room:
Link: ${config.ZOOM_LINK}
ID: ${config.ZOOM_ID}
Passcode: ${config.ZOOM_PASSCODE}`);
  } else {
    bot.sendMessage(msg.chat.id, "⚠️ La NUBE BOT is not currently in session.");
  }
  logInteraction(msg, "/roominfo");
});
