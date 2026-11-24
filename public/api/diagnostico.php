<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

/**
 * Diagnóstico TEMPORÁRIO do piloto de login Google.
 *
 * Devolve apenas booleanos, nomes de chaves e versões — nunca tokens,
 * senhas, e-mails ou qualquer valor de configuração.
 *
 * REMOVER após a homologação.
 */

$private = '/home2/hg8dcc78/casamento-private';

$out = [
    'php' => PHP_VERSION,
    'private' => $private,
    'private_existe' => is_dir($private),
    'private_legivel' => is_readable($private),
];

/* ---- application.php ---- */
$app = $private . '/application.php';
$out['application_existe'] = is_file($app);
$out['application_legivel'] = is_readable($app);
$out['application_tipo'] = null;
$out['application_chaves'] = null;
$out['gateway_enabled'] = null;
$out['gateway_enabled_estrito'] = null;
$out['access_enabled'] = null;
$out['application_erro'] = null;

if ($out['application_existe']) {
    try {
        $settings = require $app;
        $out['application_tipo'] = gettype($settings);
        if (is_array($settings)) {
            $out['application_chaves'] = array_keys($settings);
            $out['gateway_enabled'] = $settings['gateway_enabled'] ?? null;
            $out['gateway_enabled_estrito'] = ($settings['gateway_enabled'] ?? false) === true;
            $out['access_enabled'] = $settings['access_enabled'] ?? null;
        }
    } catch (Throwable $e) {
        $out['application_erro'] = get_class($e);
    }
}

/* ---- bridge.php (expõe somente se o token atinge o tamanho mínimo) ---- */
$bridgeFile = $private . '/bridge.php';
$out['bridge_existe'] = is_file($bridgeFile);
$out['bridge_token_ok'] = null;
$out['bridge_erro'] = null;

if ($out['bridge_existe']) {
    try {
        $bridge = require $bridgeFile;
        $token = is_array($bridge) ? ($bridge['token'] ?? null) : null;
        $out['bridge_token_ok'] = is_string($token) && strlen($token) >= 32;
    } catch (Throwable $e) {
        $out['bridge_erro'] = get_class($e);
    }
}

/* ---- demais arquivos privados ---- */
$out['gateway_existe'] = is_file($private . '/server/ponte/gateway.php');
$out['operacoes_php_existe'] = is_file($private . '/server/ponte/operacoes.php');
$out['autenticacao_php_existe'] = is_file($private . '/server/autenticacao.php');
$out['database_pilot_existe'] = is_file($private . '/database.pilot.php');
$out['database_existe'] = is_file($private . '/database.php');

/* ---- extensões exigidas pelo gateway ---- */
$out['ext_curl'] = function_exists('curl_init');
$out['ext_pdo_mysql'] = extension_loaded('pdo_mysql');
$out['ext_mbstring'] = extension_loaded('mbstring');

/* ---- banco piloto: conexão e schema (nunca expõe host, usuário ou senha) ---- */
function classificarFalhaDeBanco(?int $driver): string
{
    return match ($driver) {
        1045 => 'usuario ou senha incorretos',
        1044 => 'usuario sem permissao neste banco',
        1049 => 'banco de dados inexistente',
        1146 => 'tabela inexistente',
        1046 => 'nenhum banco selecionado',
        2002, 2003 => 'nao foi possivel conectar ao servidor MySQL',
        default => 'outro',
    };
}

$out['banco'] = null;
$cfg = null;
$pilotConfig = $private . '/database.pilot.php';

if (is_file($pilotConfig)) {
    try {
        $cfg = require $pilotConfig;
        $out['database_pilot_chaves'] = is_array($cfg) ? array_keys($cfg) : gettype($cfg);
    } catch (Throwable $e) {
        $out['database_pilot_erro'] = get_class($e);
    }
}

if (is_array($cfg) && isset($cfg['host'], $cfg['database'], $cfg['username'])) {
    $probe = [];
    try {
        $dsn = sprintf(
            'mysql:host=%s;port=%d;dbname=%s;charset=%s',
            $cfg['host'],
            (int) ($cfg['port'] ?? 3306),
            $cfg['database'],
            $cfg['charset'] ?? 'utf8mb4'
        );
        $pdo = new PDO($dsn, $cfg['username'], (string) ($cfg['password'] ?? ''), [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_TIMEOUT => 8,
        ]);
        $probe['conexao'] = true;
        $probe['versao_mysql'] = $pdo->query('SELECT VERSION()')->fetchColumn();

        try {
            $pdo->exec("SET time_zone='+00:00'");
            $probe['timezone_utc'] = true;
        } catch (Throwable $e) {
            $probe['timezone_utc'] = false;
        }

        $esperadas = [
            'accounts', 'account_action_tokens', 'administrators', 'access_rate_limits',
            'web_access_sessions', 'guests', 'guest_food_information', 'invitation_groups',
            'food_authorizations', 'event_settings', 'event_logistics_versions',
            'assistant_memory_versions', 'assistant_publication', 'assistant_account_usage',
            'audit_events',
        ];
        $existentes = $pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
        $probe['tabelas_total'] = count($existentes);
        $probe['tabelas_faltando'] = array_values(array_diff($esperadas, $existentes));

        foreach (['web_access_sessions', 'accounts', 'access_rate_limits'] as $tabela) {
            try {
                $pdo->query('SELECT 1 FROM `' . $tabela . '` LIMIT 1');
                $probe['leitura_' . $tabela] = true;
            } catch (Throwable $e) {
                $probe['leitura_' . $tabela] = false;
            }
        }

        foreach (['web_access_sessions' => ['token_hash', 'expires_at', 'revoked_at'], 'accounts' => ['id', 'session_version']] as $tabela => $colunas) {
            try {
                $pdo->query('SELECT `' . implode('`,`', $colunas) . '` FROM `' . $tabela . '` LIMIT 1');
                $probe['colunas_' . $tabela] = true;
            } catch (Throwable $e) {
                $probe['colunas_' . $tabela] = false;
            }
        }
    } catch (Throwable $e) {
        $probe['conexao'] = false;
        $probe['sqlstate'] = (string) $e->getCode();
        $driver = ($e instanceof PDOException && is_array($e->errorInfo)) ? (int) ($e->errorInfo[1] ?? 0) : null;
        $probe['driver_codigo'] = $driver;
        $probe['classificacao'] = classificarFalhaDeBanco($driver);
    }
    $out['banco'] = $probe;
}

/* ---- veredito da linha 8 do gateway.php ---- */
$out['gateway_passaria'] = ($out['gateway_enabled_estrito'] === true)
    && ($out['bridge_token_ok'] === true)
    && ($out['gateway_existe'] === true);

/* ---- teste opcional de saída HTTPS até a Vercel (?upstream=1) ---- */
$out['upstream'] = null;
if ($out['ext_curl'] && ($_GET['upstream'] ?? '') === '1') {
    $ch = curl_init('https://flavio-data-hub-backend.vercel.app/api/health');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 8,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
        CURLOPT_FOLLOWLOCATION => false,
    ]);
    $raw = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $errno = curl_errno($ch);
    curl_close($ch);
    $out['upstream'] = [
        'status' => $status,
        'curl_errno' => $errno,
        'resposta_json' => is_string($raw) && json_decode($raw, true) !== null,
    ];
}

echo json_encode($out, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), "\n";
