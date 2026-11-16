<?php
declare(strict_types=1);

// Copie para config.private.php SOMENTE na pasta privada do servidor,
// fora de public_html e do Git. Exemplos não contêm dados pessoais reais.
return [
    'app_origin' => 'https://casamento-flavio-victoria.com.br',
    'registration_enabled' => false,
    // Chave aleatória privada para pseudonimizar limite de tentativas por IP.
    'rate_limit_key' => '',
    'database' => [
        'dsn' => 'mysql:host=localhost;dbname=SUBSTITUIR;charset=utf8mb4',
        'username' => 'SUBSTITUIR',
        'password' => '',
    ],
    'google_client_id' => '',
    // Usado apenas pelo bootstrap em CLI; login público nunca cria administradores.
    'bootstrap_admin_email' => '',
    // Chave de 32 bytes codificada em base64, mantida fora do banco e do Git.
    'food_data_encryption_key' => '',
    'openrouter' => [
        'enabled' => false,
        'api_key' => '',
        'model' => 'nvidia/nemotron-3.5-lightning:free',
        'fictional_data_only' => true,
        'privacy_reviewed' => false,
    ],
    'smtp' => [
        'host' => '',
        'port' => 587,
        'username' => '',
        'password' => '',
        'from_email' => '',
        'from_name' => 'Victória & Flávio',
    ],
];
