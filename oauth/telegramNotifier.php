<?php
function notifyTelegram($message) {
    $token = getenv('BOT_TOKEN');
    $chat_id = getenv('LOG_CHANNEL_ID');
    $url = "https://api.telegram.org/bot$token/sendMessage";
    $data = ['chat_id' => $chat_id, 'text' => $message];
    @file_get_contents($url . '?' . http_build_query($data));
}

