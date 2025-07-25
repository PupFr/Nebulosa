const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Environment variables
const ZOOM_CLIENT_ID = 'K3t8Sd3rSZOSKfkyMftDXg';
const ZOOM_CLIENT_SECRET = 'Gb9JmLsI1brv4bPdAPB9CSknQV4GiFB';
const BOT_TOKEN = '8113796108:AAHvZqXdqTRzor5ep7tV0OCDWzQO_8TjBUg';

app.get('/auth/zoom/callback', async (req, res) => {
    const { code, state } = req.query;

    console.log('🔐 OAuth callback received');
    console.log('Code:', code ? '✅ Present' : '❌ Missing');
    console.log('State:', state ? '✅ Present' : '❌ Missing');

    if (!code) {
        return res.status(400).send(`
      <html>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1>❌ OAuth Error</h1>
          <p>Authorization code missing</p>
          <a href="/">Try Again</a>
        </body>
      </html>
    `);
    }

    try {
        // Exchange code for access token
        const tokenResponse = await axios.post('https://zoom.us/oauth/token', null, {
            params: {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: 'http://localhost:3000/auth/zoom/callback',
                client_id: ZOOM_CLIENT_ID,
                client_secret: ZOOM_CLIENT_SECRET
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const { access_token, refresh_token } = tokenResponse.data;

        console.log('✅ OAuth Success - Token received');

        // Get user info
        const userResponse = await axios.get('https://api.zoom.us/v2/users/me', {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });

        const userInfo = userResponse.data;
        console.log('👤 User authenticated:', userInfo.email);

        // Send success message to Telegram (if we had chat_id from state)
        // For now, just show success page

        res.send(`
      <html>
        <head>
          <title>✅ OAuth Success - LA NUBE BOT</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
              text-align: center; 
              padding: 50px; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              margin: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: rgba(255,255,255,0.1);
              padding: 40px;
              border-radius: 20px;
              backdrop-filter: blur(10px);
            }
            .success { color: #4ade80; font-size: 4em; margin-bottom: 20px; }
            h1 { margin: 0; font-size: 2.5em; }
            .info { background: rgba(255,255,255,0.2); padding: 20px; border-radius: 10px; margin: 20px 0; }
            .token { font-family: monospace; word-break: break-all; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success">✅</div>
            <h1>OAuth Success!</h1>
            <p>LA NUBE BOT has been successfully authorized with Zoom</p>
            
            <div class="info">
              <h3>📋 Authenticated User</h3>
              <p><strong>Email:</strong> ${userInfo.email}</p>
              <p><strong>Name:</strong> ${userInfo.first_name} ${userInfo.last_name}</p>
              <p><strong>Account ID:</strong> ${userInfo.account_id}</p>
            </div>
            
            <div class="info">
              <h3>🔑 Access Token (First 20 chars)</h3>
              <div class="token">${access_token.substring(0, 20)}...</div>
            </div>
            
            <p>✅ You can now close this window and return to Telegram</p>
            <p>🤖 Your bot is ready to manage Zoom meetings!</p>
          </div>
        </body>
      </html>
    `);

    } catch (error) {
        console.error('❌ OAuth Error:', error.response?.data || error.message);

        res.status(500).send(`
      <html>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1>❌ OAuth Error</h1>
          <p>Failed to exchange authorization code</p>
          <pre>${JSON.stringify(error.response?.data || error.message, null, 2)}</pre>
          <a href="/">Try Again</a>
        </body>
      </html>
    `);
    }
});

app.get('/', (req, res) => {
    res.send(`
    <html>
      <head>
        <title>🔐 LA NUBE BOT OAuth Server</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
            text-align: center; 
            padding: 50px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <h1>🔐 LA NUBE BOT OAuth Server</h1>
        <p>✅ Server is running on port ${PORT}</p>
        <p>🔗 Ready to handle Zoom OAuth callbacks</p>
        <p>📱 Use /zoomlogin in your Telegram bot to start OAuth flow</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
    console.log(`🔐 OAuth Server running on http://localhost:${PORT}`);
    console.log(`📡 Callback URL: http://localhost:${PORT}/auth/zoom/callback`);
    console.log(`✅ Ready to handle Zoom OAuth redirects`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down OAuth server...');
    process.exit(0);
});
