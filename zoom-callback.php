<?php
header('Content-Type: text/html; charset=UTF-8');

// Configuración
$BOT_WEBHOOK_URL = 'https://api.telegram.org/bot8113796108:AAHEK9UdLgsR46-ctyLaivtxIp6kWV1zr74/sendMessage';
$DOCS_URL = 'https://github.com/PupFr/Nebulosa/tree/main/docs';

// Obtener parámetros de Zoom OAuth
$code = isset($_GET['code']) ? $_GET['code'] : null;
$state = isset($_GET['state']) ? $_GET['state'] : null;
$error = isset($_GET['error']) ? $_GET['error'] : null;

// Si no hay parámetros OAuth, redireccionar a documentación
if (!$code && !$state && !$error) {
    ?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🤖 LA NUBE BOT - Documentación</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
                margin: 0; padding: 20px; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; min-height: 100vh; display: flex; align-items: center;
            }
            .container { 
                max-width: 600px; margin: 0 auto; 
                background: rgba(255,255,255,0.1); 
                padding: 40px; border-radius: 20px; text-align: center; 
                backdrop-filter: blur(10px);
            }
            h1 { font-size: 2.5em; margin-bottom: 20px; }
            .redirect-info { background: rgba(255,255,255,0.2); padding: 20px; border-radius: 10px; margin: 20px 0; }
            .countdown { font-size: 1.5em; color: #f39c12; font-weight: bold; }
            .manual-link { 
                display: inline-block; 
                background: #2ecc71; 
                color: white; 
                padding: 15px 30px; 
                border-radius: 10px; 
                text-decoration: none; 
                font-weight: bold; 
                margin: 20px 0;
                transition: background 0.3s;
            }
            .manual-link:hover { background: #27ae60; }
        </style>
        <script>
            let countdown = 5;
            function updateCountdown() {
                document.getElementById('countdown').textContent = countdown;
                countdown--;
                if (countdown < 0) {
                    window.location.href = '<?php echo $DOCS_URL; ?>';
                }
            }
            setInterval(updateCountdown, 1000);
            window.onload = updateCountdown;
        </script>
    </head>
    <body>
        <div class="container">
            <h1>📚 Documentación LA NUBE BOT</h1>
            <div class="redirect-info">
                <p>Redirigiendo a la documentación completa...</p>
                <p class="countdown">Redirección en <span id="countdown">5</span> segundos</p>
            </div>
            <a href="<?php echo $DOCS_URL; ?>" class="manual-link">
                📖 Ir a Documentación Ahora
            </a>
            <p style="margin-top: 30px; font-size: 0.9em; opacity: 0.8;">
                🤖 LA NUBE BOT - Bot de Telegram para automatización de Zoom<br>
                <strong>OAuth Endpoint:</strong> Este enlace también sirve como callback para autenticación Zoom
            </p>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// Log para debugging
error_log("Zoom OAuth Callback - Code: " . ($code ? 'Present' : 'Missing') . ", State: $state, Error: $error");

if ($error) {
    // Error en OAuth
    ?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>❌ Error de Autorización</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
            .container { max-width: 500px; margin: 50px auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
            h1 { color: #e74c3c; margin-bottom: 20px; }
            p { color: #666; line-height: 1.6; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>❌ Error de Autorización</h1>
            <p>Error: <?php echo htmlspecialchars($error); ?></p>
            <p>Por favor, intenta el comando /zoomlogin nuevamente en Telegram.</p>
        </div>
    </body>
    </html>
    <?php
    exit;
}

if (!$code || !$state) {
    // Faltan parámetros
    ?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>❌ Error de OAuth</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
            .container { max-width: 500px; margin: 50px auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
            h1 { color: #e74c3c; margin-bottom: 20px; }
            p { color: #666; line-height: 1.6; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>❌ Error de OAuth</h1>
            <p>No se recibió el código de autorización de Zoom.</p>
            <p>Por favor, intenta el comando /zoomlogin nuevamente en Telegram.</p>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// Intercambiar código por tokens
$token_url = 'https://zoom.us/oauth/token';
$post_data = array(
    'grant_type' => 'authorization_code',
    'code' => $code,
    'redirect_uri' => 'https://pupfrisky.com/zoom-callback',
    'client_id' => 'K3t8Sd3rSZOSKfkyMftDXg',
    'client_secret' => 'Gb9JmLsI1brv4bPdAPB9CSknQV4GiFB'
);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $token_url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post_data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code === 200) {
    $token_data = json_decode($response, true);
    
    // Notificar al bot via Telegram
    $message = "✅ OAuth exitoso para usuario $state\n" .
               "Access Token: " . substr($token_data['access_token'], 0, 20) . "...\n" .
               "Expires in: " . $token_data['expires_in'] . " segundos";
    
    $telegram_data = array(
        'chat_id' => $state,
        'text' => $message
    );
    
    $ch2 = curl_init();
    curl_setopt($ch2, CURLOPT_URL, $BOT_WEBHOOK_URL);
    curl_setopt($ch2, CURLOPT_POST, true);
    curl_setopt($ch2, CURLOPT_POSTFIELDS, $telegram_data);
    curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
    curl_exec($ch2);
    curl_close($ch2);
    
    // Mostrar página de éxito
    ?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🎉 ¡Zoom Conectado!</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
                margin: 0; padding: 20px; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; min-height: 100vh;
            }
            .container { 
                max-width: 600px; margin: 50px auto; 
                background: rgba(255,255,255,0.1); 
                padding: 40px; border-radius: 20px; text-align: center; 
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
    <?php
} else {
    // Error en intercambio de tokens
    error_log("Error intercambiando tokens: HTTP $http_code - $response");
    ?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>❌ Error de OAuth</title>
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
            <h1>❌ Error de OAuth</h1>
            <p>No se pudo procesar la autorización de Zoom.</p>
            <div class="error">
                <strong>Error HTTP:</strong> <?php echo $http_code; ?>
            </div>
            <p>Por favor, intenta el comando /zoomlogin nuevamente en Telegram.</p>
        </div>
    </body>
    </html>
    <?php
}
?>
