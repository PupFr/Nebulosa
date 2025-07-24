const axios = require('axios');
require('dotenv').config();

async function notifyTelegram(msg) {
  const token = process.env.BOT_TOKEN;
  const chatId = process.env.ADMIN_CHAT_ID;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  await axios.post(url, {
    chat_id: chatId,
    text: msg,
    parse_mode: 'Markdown'
  });
}

module.exports = notifyTelegram;

