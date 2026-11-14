<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $status, array $payload): void {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

$token = getenv('HOSTGATOR_BRIDGE_TOKEN');

if ($token === false || trim($token) === '') {
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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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

$normalized = strtolower(preg_replace('/\s+/', ' ', trim($sql)));

if (
    !str_starts_with($normalized, 'select ') ||
    str_contains($normalized, ';') ||
    str_contains($normalized, 'into outfile') ||
    str_contains($normalized, 'into dumpfile') ||
    str_contains($normalized, 'load_file')
) {
    respond(400, [
        'ok' => false,
        'message' => 'Apenas SELECT simples é permitido'
    ]);
}

$host = getenv('DB_HOST');
$db = getenv('DB_NAME');
$user = getenv('DB_USER');
$pass = getenv('DB_PASS');

if (
    $host === false ||
    $db === false ||
    $user === false ||
    $pass === false
) {
    respond(503, [
        'ok' => false,
        'message' => 'Configuração do banco indisponível'
    ]);
}

try {
    $pdo = new PDO(
        'mysql:host=' . $host . ';dbname=' . $db . ';charset=utf8mb4',
        $user,
        $pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );

    $statement = $pdo->prepare($sql);
    $statement->execute();

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