const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

console.log('🚀 OAuth Callback Server iniciando...');
console.log('📍 Solo para manejar callbacks de Zoom OAuth');

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'OAuth Callback Server is running',
    timestamp: new Date().toISOString()
  });
});

// Enhanced OAuth callback handler with better error handling
app.get('/auth/zoom/callback', async (req, res) => {
  const { code, state, error, error_description } = req.query;
  
  console.log('\n🔗 ===== OAUTH CALLBACK RECIBIDO =====');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Code:', code ? `${code.substring(0, 15)}...` : '❌ Missing');
  console.log('State (User ID):', state);
  console.log('Error:', error);
  console.log('Error Description:', error_description);
  console.log('Full Query:', req.query);
  console.log('==========================================\n');
  
  // Handle OAuth errors from Zoom
  if (error) {
    console.error('❌ OAuth error from Zoom:', error, error_description);
    res.status(400).send(`
      <html>
        <head>
          <title>❌ OAuth Error</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
            .container { background: white; padding: 30px; border-radius: 10px; max-width: 500px; margin: auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .error { color: #dc3545; }
            .code { background: #f8f9fa; padding: 10px; border-radius: 5px; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>❌ OAuth Error</h1>
            <p class="error">Zoom returned an error: <strong>${error}</strong></p>
            ${error_description ? `<p>${error_description}</p>` : ''}
            <p>Common solutions:</p>
            <ul style="text-align: left;">
              <li>Try the authorization again</li>
              <li>Check if your Zoom app is properly configured</li>
              <li>Verify redirect URI matches exactly</li>
            </ul>
            <p><a href="#" onclick="window.close()">Close this window</a></p>
          </div>
        </body>
      </html>
    `);
    return;
  }
  
  // Check for missing authorization code
  if (!code) {
    console.error('❌ Authorization code missing');
    res.status(400).send(`
      <html>
        <head>
          <title>❌ OAuth Error</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
            .container { background: white; padding: 30px; border-radius: 10px; max-width: 500px; margin: auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .error { color: #dc3545; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>❌ OAuth Error</h1>
            <p class="error">Authorization code not received from Zoom.</p>
            <p>This usually means:</p>
            <ul style="text-align: left;">
              <li>The authorization was cancelled</li>
              <li>There was a network error</li>
              <li>The redirect URI is misconfigured</li>
            </ul>
            <p>Please try again</p>
            <p><a href="#" onclick="window.close()">Close this window</a></p>
          </div>
        </body>
      </html>
    `);
    return;
  }
  
  console.log('✅ Authorization code received, attempting token exchange...');
  
  try {
    // Get credentials from environment
    require('dotenv').config();
    const clientId = process.env.ZOOM_USER_CLIENT_ID || process.env.ZOOM_CLIENT_ID;
    const clientSecret = process.env.ZOOM_USER_CLIENT_SECRET || process.env.ZOOM_CLIENT_SECRET;
    const redirectUri = process.env.ZOOM_REDIRECT_URI || 'http://localhost:3000/auth/zoom/callback';
    
    console.log('🔧 Using credentials:');
    console.log('Client ID:', clientId ? `${clientId.substring(0, 8)}...` : '❌ Missing');
    console.log('Client Secret:', clientSecret ? '✅ Present' : '❌ Missing');
    console.log('Redirect URI:', redirectUri);
    
    if (!clientId || !clientSecret) {
      throw new Error('Missing Zoom client credentials');
    }
    
    // Try token exchange
    console.log('🔄 Attempting token exchange...');
    const tokenResponse = await axios.post('https://zoom.us/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      timeout: 30000
    });
    
    const tokenData = tokenResponse.data;
    console.log('✅ Token exchange successful!');
    console.log('Access token:', tokenData.access_token ? 'Received' : 'Missing');
    console.log('Refresh token:', tokenData.refresh_token ? 'Received' : 'Missing');
    console.log('Expires in:', tokenData.expires_in, 'seconds');
    
    res.send(`
      <html>
        <head>
          <title>🎉 OAuth Success!</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
            .container { background: rgba(255,255,255,0.1); padding: 40px; border-radius: 20px; max-width: 600px; margin: auto; }
            h1 { font-size: 2.5em; margin-bottom: 20px; }
            p { font-size: 1.2em; line-height: 1.6; }
            .success { color: #4CAF50; font-weight: bold; }
            .token-info { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin: 20px 0; text-align: left; }
            .close-btn { background: rgba(255,255,255,0.2); border: none; color: white; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🎉 ¡OAuth Exitoso!</h1>
            <p class="success">✅ Token de acceso obtenido correctamente</p>
            
            <div class="token-info">
              <strong>Información del Token:</strong><br>
              • Access Token: ${tokenData.access_token ? 'Recibido ✅' : 'Faltante ❌'}<br>
              • Refresh Token: ${tokenData.refresh_token ? 'Recibido ✅' : 'Faltante ❌'}<br>
              • Expira en: ${tokenData.expires_in} segundos<br>
              • Usuario ID: ${state || 'No especificado'}
            </div>
            
            <p><strong>¡Configuración OAuth funcionando correctamente!</strong></p>
            <p>Ahora puedes integrar este flujo con tu bot de Telegram.</p>
            
            <button class="close-btn" onclick="window.close()">Cerrar Ventana</button>
          </div>
        </body>
      </html>
    `);
    
  } catch (error) {
    console.error('❌ Token exchange failed:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Error Data:', error.response?.data);
    console.error('Error Message:', error.message);
    
    let errorDetails = 'Unknown error';
    let suggestions = '<li>Check server logs for details</li>';
    
    if (error.response?.status === 400) {
      const errorData = error.response.data;
      
      if (errorData.error === 'invalid_grant') {
        errorDetails = 'Invalid or expired authorization code';
        suggestions = `
          <li>The authorization code has expired (10 minute limit)</li>
          <li>The authorization code was already used</li>
          <li>Get a fresh authorization code and try again</li>
        `;
      } else if (errorData.error === 'invalid_client') {
        errorDetails = 'Invalid client credentials';
        suggestions = `
          <li>Check your Zoom app Client ID and Secret</li>
          <li>Ensure you're using the correct OAuth app</li>
          <li>Verify the app is published/enabled</li>
        `;
      } else if (errorData.error === 'invalid_request') {
        errorDetails = 'Invalid request format';
        suggestions = `
          <li>Check that redirect_uri matches exactly in your Zoom app</li>
          <li>Verify the request format is correct</li>
        `;
      } else {
        errorDetails = `Zoom API error: ${errorData.error || 'Unknown'}`;
      }
    }
    
    res.status(500).send(`
      <html>
        <head>
          <title>❌ Token Exchange Failed</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
            .container { background: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .error { color: #dc3545; }
            .code { background: #f8f9fa; padding: 10px; border-radius: 5px; font-family: monospace; margin: 10px 0; }
            ul { text-align: left; }
            .close-btn { background: #dc3545; border: none; color: white; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>❌ Error en Token Exchange</h1>
            <p class="error">Failed to exchange authorization code for access token.</p>
            <div class="code">Error: ${errorDetails}</div>
            <p><strong>Possible solutions:</strong></p>
            <ul>${suggestions}</ul>
            <p><strong>Debug Information:</strong></p>
            <ul style="text-align: left;">
              <li>HTTP Status: ${error.response?.status || 'N/A'}</li>
              <li>Authorization Code: ${code ? 'Present' : 'Missing'}</li>
              <li>State: ${state || 'Not provided'}</li>
            </ul>
            <button class="close-btn" onclick="window.close()">Close Window</button>
          </div>
        </body>
      </html>
    `);
  }
});

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>🔗 OAuth Callback Server</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
          .container { background: white; padding: 30px; border-radius: 10px; max-width: 500px; margin: auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .status { color: #28a745; font-weight: bold; }
          .code { background: #f8f9fa; padding: 10px; border-radius: 5px; font-family: monospace; margin: 10px 0; }
          .info { background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🔗 OAuth Callback Server</h1>
          <p class="status">✅ Server running on port ${PORT}</p>
          
          <div class="info">
            <strong>📋 Configuration:</strong><br>
            Callback URL: <code>http://localhost:${PORT}/auth/zoom/callback</code>
          </div>
          
          <p><strong>⚡ Ready to handle OAuth callbacks!</strong></p>
          <p><em>Add the callback URL to your Zoom app's redirect URIs.</em></p>
        </div>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`✅ OAuth callback server running on http://localhost:${PORT}`);
  console.log(`📱 Callback URL: http://localhost:${PORT}/auth/zoom/callback`);
  console.log('\n📋 Next steps:');
  console.log('1. Add this URL to your Zoom app redirect URIs');
  console.log('2. Test OAuth flow');
  console.log('3. Check this terminal for detailed logs');
});

module.exports = app;
