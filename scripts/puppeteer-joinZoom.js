require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');

(async () => {
  const ZOOM_LINK = process.env.ZOOM_LINK;
  const ZOOM_PASSCODE = process.env.ZOOM_PASSCODE;
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!ZOOM_LINK || !ZOOM_PASSCODE) {
    console.error('❌ Missing ZOOM_LINK or ZOOM_PASSCODE in .env');
    process.exit(1);
  }

  try {
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: [
        '--use-fake-ui-for-media-stream',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--allow-insecure-localhost',
        '--use-fake-device-for-media-stream'
      ]
    });

    const page = await browser.newPage();

    const timeout = setTimeout(async () => {
      console.warn('⏱ No progress after 60 seconds. Closing...');
      await page.screenshot({ path: 'zoom-fail.png' });
      await browser.close();
    }, 60000);

    await page.goto(ZOOM_LINK, { waitUntil: 'networkidle2' });
    console.log('🔗 Zoom page loaded. Waiting for passcode input...');

    await page.waitForSelector('input[type="password"], input#inputpasscode', { timeout: 20000 });
    await page.type('input[type="password"], input#inputpasscode', ZOOM_PASSCODE);
    await page.keyboard.press('Enter');

    console.log('✅ Passcode submitted. Waiting to join meeting...');
    await page.waitForTimeout(10000);

    const screenshotPath = 'zoom-session.png';
    await page.screenshot({ path: screenshotPath });
    console.log('📸 Screenshot taken.');

    clearTimeout(timeout);

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const formData = new FormData();
      formData.append('chat_id', TELEGRAM_CHAT_ID);
      formData.append('photo', fs.createReadStream(screenshotPath));

      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, formData, {
        headers: formData.getHeaders(),
      });

      console.log('🚀 Screenshot sent to Telegram bot.');
    }

    // Optional: Close browser
    // await browser.close();

  } catch (error) {
    console.error('❌ Execution error:', error);
  }
})();

process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ Unhandled Rejection at:', promise, 'reason:', reason);
});


