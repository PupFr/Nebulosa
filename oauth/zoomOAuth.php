<?php
class ZoomOAuth {
    private $client_id;
    private $client_secret;
    private $redirect_uri;

    public function __construct($client_id, $client_secret, $redirect_uri) {
        $this->client_id = $client_id;
        $this->client_secret = $client_secret;
        $this->redirect_uri = $redirect_uri;
    }

    public function getAccessToken($code) {
        $token_url = 'https://zoom.us/oauth/token';
        $headers = [
            'Authorization: Basic ' . base64_encode("{$this->client_id}:{$this->client_secret}"),
            'Content-Type: application/x-www-form-urlencoded'
        ];

        $data = http_build_query([
            'grant_type' => 'authorization_code',
            'code' => $code,
            'redirect_uri' => $this->redirect_uri
        ]);

        $options = [
            'http' => [
                'method' => 'POST',
                'header' => implode("\r\n", $headers),
                'content' => $data
            ]
        ];

        $context = stream_context_create($options);
        $response = file_get_contents($token_url, false, $context);
        return json_decode($response, true);
    }

    public function getUserEmail($access_token) {
        $user_info = file_get_contents("https://api.zoom.us/v2/users/me", false, stream_context_create([
            'http' => [
                'method' => 'GET',
                'header' => "Authorization: Bearer $access_token"
            ]
        ]));

        $user = json_decode($user_info, true);
        return $user['email'] ?? 'unknown';
    }
}

