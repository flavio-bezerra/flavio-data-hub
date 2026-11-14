<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $status, array $payload): void {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

$privateDir = '/home2/hg8dcc78/casamento-private';

try {
    $bridgeConfig = require $privateDir . '/bridge.php';

    $token = is_array($bridgeConfig)
        ? ($bridgeConfig['token'] ?? '')
        : '';

    if (!is_string($token) || trim($token) === '') {
        throw new RuntimeException('Configuração inválida');
    }
} catch (Throwable $exception) {
    respond(503, [
        'ok' => false,
        'message' => 'Configuração da ponte indisponível'
    ]);
}

$received = $_SERVER['HTTP_X_BRIDGE_TOKEN'] ?? '';

if (
    !is_string($received) ||
    $received === '' ||
    !hash_equals($token, $received)
) {
    respond(401, [
        'ok' => false,
        'message' => 'Não autorizado'
    ]);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');

    respond(405, [
        'ok' => false,
        'message' => 'Método não permitido'
    ]);
}

$raw = file_get_contents('php://input');
$body = json_decode($raw ?: '', true);

if (!is_array($body)) {
    respond(400, [
        'ok' => false,
        'message' => 'Corpo inválido'
    ]);
}

$sql = $body['sql'] ?? '';

if (!is_string($sql) || trim($sql) === '') {
    respond(400, [
        'ok' => false,
        'message' => 'Informe a consulta SQL'
    ]);
}

$normalized = strtolower(
    (string) preg_replace('/\s+/', ' ', trim($sql))
);

if ($normalized !== 'select 1 as teste') {
    respond(400, [
        'ok' => false,
        'message' => 'Somente a consulta de diagnóstico está habilitada'
    ]);
}

try {
    $dbConfig = require $privateDir . '/database.php';

    if (!is_array($dbConfig)) {
        throw new RuntimeException('Configuração inválida');
    }

    foreach (
        ['host', 'port', 'database', 'username', 'password', 'charset']
        as $key
    ) {
        if (!array_key_exists($key, $dbConfig)) {
            throw new RuntimeException('Configuração incompleta');
        }
    }
} catch (Throwable $exception) {
    respond(503, [
        'ok' => false,
        'message' => 'Configuração do banco indisponível'
    ]);
}

try {
    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=%s',
        $dbConfig['host'],
        (int) $dbConfig['port'],
        $dbConfig['database'],
        $dbConfig['charset']
    );

    $pdo = new PDO(
        $dsn,
        $dbConfig['username'],
        $dbConfig['password'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );

    $statement = $pdo->query('SELECT 1 AS teste');
    $rows = $statement->fetchAll();

    respond(200, [
        'ok' => true,
        'rows' => $rows
    ]);
} catch (Throwable $exception) {
    respond(500, [
        'ok' => false,
        'message' => 'Falha ao executar a consulta'
    ]);
}