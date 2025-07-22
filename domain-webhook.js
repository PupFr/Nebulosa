const express = require('express');
const axios = require('axios');

const app = express();

// Middleware to parse URL-encoded bodies (for webhook data)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Zoom OAuth callback handler
app.get('/zoom-callback', async (req, res) => {
  const { code, state } = req.query;
  
  console.log('🔗 Zoom OAuth callback received:');
  console.log('Code:', code ? 'Present' : 'Missing');
  console.log('State (User ID):', state);
  
  if (!code) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>❌ OAuth Error</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
            .container { max-width: 500px; margin: 50px auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
            h1 { color: #e74c3c; margin-bottom: 20px; }
            p { color: #666; line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>❌ OAuth Error</h1>
            <p>Authorization code not received from Zoom.</p>
            <p>Please try the /zoomlogin command again in Telegram.</p>
          </div>
        </body>
      </html>
    `);
  }
  
  try {
    // Forward the OAuth callback to your local bot server
    // You'll need to replace this URL with your actual bot server endpoint
    const botServerUrl = 'YOUR_BOT_SERVER_URL'; // e.g., your server IP or ngrok URL
    
    const response = await axios.post(`${botServerUrl}/oauth-callback`, {
      code,
      state,
      timestamp: new Date().toISOString()
    });
    
    console.log('✅ OAuth callback forwarded to bot server');
    
    // Show success page
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>🎉 Zoom Connected!</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; 
              min-height: 100vh;
            }
            .container { 
              max-width: 600px; 
              margin: 50px auto; 
              background: rgba(255,255,255,0.1); 
              padding: 40px; 
              border-radius: 20px; 
              text-align: center; 
              backdrop-filter: blur(10px);
            }
            h1 { font-size: 2.5em; margin-bottom: 20px; }
            .success { color: #2ecc71; font-weight: bold; font-size: 1.3em; }
            ul { text-align: left; display: inline-block; margin: 20px 0; }
            li { margin: 10px 0; font-size: 1.1em; }
            .highlight { background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🎉 ¡Conexión Exitosa!</h1>
            <p class="success">✅ Tu cuenta de Zoom ha sido conectada correctamente</p>
            <p>Regresa a Telegram para usar todos los comandos del bot:</p>
            <ul>
              <li><span class="highlight">/startsession</span> - Iniciar sesión de Zoom</li>
              <li><span class="highlight">/createroom</span> - Crear reunión con multipin automático</li>
              <li><span class="highlight">/startbot</span> - Iniciar automatización de browser</li>
              <li><span class="highlight">/botstatus</span> - Estado del sistema de automatización</li>
              <li><span class="highlight">/status</span> - Ver estado completo del sistema</li>
            </ul>
            <p><strong>¡Ya puedes cerrar esta ventana y volver a Telegram!</strong></p>
            <p style="margin-top: 30px; font-size: 0.9em; opacity: 0.8;">
              🤖 LA NUBE BOT - Automatización completa para Zoom
            </p>
          </div>
        </body>
      </html>
    `);
    
  } catch (error) {
    console.error('❌ Error forwarding OAuth callback:', error.message);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>❌ OAuth Error</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
            .container { max-width: 500px; margin: 50px auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
            h1 { color: #e74c3c; margin-bottom: 20px; }
            p { color: #666; line-height: 1.6; }
            .error { background: #fff5f5; border: 1px solid #fed7d7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>❌ OAuth Error</h1>
            <p>Failed to process the Zoom authorization.</p>
            <div class="error">
              <strong>Error:</strong> ${error.message}
            </div>
            <p>Please try the /zoomlogin command again in Telegram.</p>
          </div>
        </body>
      </html>
    `);
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>🤖 LA NUBE BOT - OAuth Handler</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f8f9fa; }
          .container { max-width: 600px; margin: 50px auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
          h1 { color: #2c3e50; margin-bottom: 20px; }
          .status { color: #27ae60; font-weight: bold; }
          .info { background: #e3f2fd; padding: 20px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🤖 LA NUBE BOT</h1>
          <p class="status">✅ OAuth Handler Active</p>
          <div class="info">
            <h3>📋 OAuth Configuration</h3>
            <p><strong>Callback URL:</strong> https://pupfrisky.com/zoom-callback</p>
            <p><strong>Status:</strong> Ready to receive Zoom OAuth callbacks</p>
            <p><strong>Last Updated:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p>This endpoint handles Zoom OAuth callbacks for the LA NUBE BOT.</p>
          <p>Use <strong>/zoomlogin</strong> in Telegram to start the OAuth flow.</p>
        </div>
      </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 OAuth webhook handler running on port ${PORT}`);
  console.log(`📱 Callback URL: https://pupfrisky.com/zoom-callback`);
});

module.exports = app;
