const express = require('express');
const axios = require('axios');
const { handleZoomAuthSuccess } = require('./bot.cjs');

const app = express();
const PORT = 3000;

app.get('/auth/zoom/callback', async (req, res) => {
  const { code, state } = req.query;
  
  console.log('🔗 OAuth callback received:');
  console.log('Code:', code ? 'Present' : 'Missing');
  console.log('State (User ID):', state);
  
  if (!code) {
    res.status(400).send(`
      <h1>❌ OAuth Error</h1>
      <p>Authorization code not received from Zoom.</p>
      <p>Please try again.</p>
    `);
    return;
  }
  
  try {
    // Exchange code for tokens
    const tokenResponse = await axios.post('https://zoom.us/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.ZOOM_REDIRECT_URI || 'https://pupfrisky.com/zoom-callback',
        client_id: process.env.ZOOM_USER_CLIENT_ID,
        client_secret: process.env.ZOOM_USER_CLIENT_SECRET
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    const tokenData = tokenResponse.data;
    console.log('✅ Token exchange successful');
    
    // Handle success in bot
    await handleZoomAuthSuccess(state, tokenData);
    
    res.send(`
      <html>
        <head>
          <title>🎉 Zoom Connected Successfully!</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
            .container { background: rgba(255,255,255,0.1); padding: 40px; border-radius: 20px; max-width: 500px; margin: auto; }
            h1 { font-size: 2.5em; margin-bottom: 20px; }
            p { font-size: 1.2em; line-height: 1.6; }
            .success { color: #4CAF50; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🎉 ¡Conexión Exitosa!</h1>
            <p class="success">✅ Tu cuenta de Zoom ha sido conectada correctamente</p>
            <p>Regresa a Telegram para usar todos los comandos del bot:</p>
            <ul style="text-align: left; display: inline-block;">
              <li><strong>/startsession</strong> - Iniciar sesión de Zoom</li>
              <li><strong>/createroom</strong> - Crear reunión con multipin automático</li>
              <li><strong>/startbot</strong> - Iniciar automatización de browser</li>
              <li><strong>/status</strong> - Ver estado del sistema</li>
            </ul>
            <p>¡Ya puedes cerrar esta ventana y volver a Telegram!</p>
          </div>
        </body>
      </html>
    `);
    
  } catch (error) {
    console.error('❌ OAuth token exchange failed:', error.response?.data || error.message);
    res.status(500).send(`
      <h1>❌ OAuth Error</h1>
      <p>Failed to exchange authorization code for tokens.</p>
      <p>Error: ${error.message}</p>
      <p>Please try again.</p>
    `);
  }
});

app.get('/', (req, res) => {
  res.send(`
    <h1>🤖 LA NUBE BOT OAuth Server</h1>
    <p>OAuth callback server is running on port ${PORT}</p>
    <p>Use /zoomlogin in Telegram to start OAuth flow.</p>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 OAuth callback server running on http://localhost:${PORT}`);
  console.log(`📱 OAuth callback URL: http://localhost:${PORT}/auth/zoom/callback`);
});

module.exports = app;
