<?php
require_once __DIR__ . '/oauth/zoomOAuth.php';
require_once __DIR__ . '/oauth/telegramNotifier.php';

// === ZOOM APP CREDENTIALS (from Nebulosa Zoom OAuth App) ===
<<<<<<< HEAD
$client_id = 'Ws4TzKUQQ4u64Zd52XqZ3A';
$client_secret = 'eJSxTUMYTif59Xz8cUyRKRbbI7TSyD5Q';
=======
$client_id = 'K3t8Sd3rSZOSKfkyMftDXg';
$client_secret = 'Gb9JmLsI1brv4bPdAPB9CSknQV4GiFB';
>>>>>>> origin/main
$redirect_uri = 'https://pupfrisky.com/zoom-callback.php';

// === GET CODE FROM ZOOM ===
$code = $_GET['code'] ?? null;

if (!$code) {
    notifyTelegram("⚠️ Error: Zoom did not return an authorization code.");
    header("Location: /oauth-error.html");
    exit;
}

// === PROCESS ZOOM TOKEN ===
$zoom = new ZoomOAuth($client_id, $client_secret, $redirect_uri);
$result = $zoom->getAccessToken($code);

if (!isset($result['access_token'])) {
    notifyTelegram("🚨 Zoom OAuth failed: access token not received.");
    header("Location: /oauth-error.html");
    exit;
}

// === GET USER EMAIL ===
$email = $zoom->getUserEmail($result['access_token']);
notifyTelegram("🔐 Zoom OAuth authorized: `$email`");

// === REDIRECT TO SUCCESS PAGE ===
header("Location: /oauth-success.html");
exit;
?>

