<?php
declare(strict_types=1);
final class FalhaDeAcesso extends RuntimeException {
    public function __construct(public readonly int $status, string $message) { parent::__construct($message); }
}
function iniciarSessao(array $config): void {
    $secure = parse_url($config['app_origin'], PHP_URL_SCHEME) === 'https';
    if (!$secure && !in_array(parse_url($config['app_origin'], PHP_URL_HOST), ['localhost','127.0.0.1'], true)) {
        throw new RuntimeException('Origem deve usar HTTPS.');
    }
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    session_name('casamento_session');
    session_set_cookie_params(['lifetime'=>0,'path'=>'/','secure'=>$secure,'httponly'=>true,'samesite'=>'Lax']);
    session_start();
    if (isset($_SESSION['expires_at']) && $_SESSION['expires_at'] < time()) $_SESSION = [];
    $_SESSION['csrf'] ??= bin2hex(random_bytes(32));
    $_SESSION['google_nonce'] ??= bin2hex(random_bytes(32));
}
function validarMutacao(array $config): array {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') throw new FalhaDeAcesso(405,'Método não permitido.');
    if (($_SERVER['HTTP_ORIGIN'] ?? '') !== $config['app_origin']) throw new FalhaDeAcesso(403,'Origem inválida.');
    if (!hash_equals($_SESSION['csrf'], $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '')) throw new FalhaDeAcesso(403,'Sessão inválida. Recarregue a página.');
    if (strtolower(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0]) !== 'application/json') throw new FalhaDeAcesso(415,'Envie JSON.');
    $raw = file_get_contents('php://input', false, null, 0, 16385);
    if (strlen($raw) > 16384) throw new FalhaDeAcesso(413,'Solicitação muito grande.');
    try { $body = json_decode($raw, true, 16, JSON_THROW_ON_ERROR); }
    catch (JsonException) { throw new FalhaDeAcesso(400,'JSON inválido.'); }
    if (!is_array($body) || array_is_list($body)) throw new FalhaDeAcesso(400,'Objeto JSON esperado.');
    return $body;
}
function limitarTentativas(PDO $db, array $config, string $action): void {
    $key = hash_hmac('sha256', $action . ':' . ($_SERVER['REMOTE_ADDR'] ?? ''), $config['rate_limit_key']);
    $window = intdiv(time(), 900);
    $stmt = $db->prepare('INSERT INTO access_rate_limits (bucket_hash, window_id, attempts) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE attempts = attempts + 1');
    $stmt->execute([$key, $window]);
    $stmt = $db->prepare('SELECT attempts FROM access_rate_limits WHERE bucket_hash = ? AND window_id = ?');
    $stmt->execute([$key, $window]);
    if ((int)$stmt->fetchColumn() > 30) throw new FalhaDeAcesso(429,'Muitas tentativas. Tente novamente em 15 minutos.');
}
function exigirConta(PDO $db): array {
    if (!isset($_SESSION['account_id'])) throw new FalhaDeAcesso(401,'Entre na sua conta.');
    $stmt = $db->prepare('SELECT id, email, display_name, email_verified_at, session_version FROM accounts WHERE id = ? AND disabled_at IS NULL');
    $stmt->execute([$_SESSION['account_id']]);
    $account = $stmt->fetch();
    if (!$account || (int)$account['session_version'] !== ($_SESSION['session_version'] ?? -1)) {
        $_SESSION = []; throw new FalhaDeAcesso(401,'Sessão encerrada. Entre novamente.');
    }
    if (!$account['email_verified_at']) throw new FalhaDeAcesso(403,'Verifique seu e-mail antes de continuar.');
    return $account;
}
function abrirSessao(array $account): void {
    session_regenerate_id(true);
    $_SESSION = ['account_id'=>(int)$account['id'], 'session_version'=>(int)$account['session_version'],
        'csrf'=>bin2hex(random_bytes(32)), 'google_nonce'=>bin2hex(random_bytes(32)), 'expires_at'=>time()+7200];
}
function validarEmail(string $email): string {
    $email = strtolower(trim($email));
    if (strlen($email)>254 || !filter_var($email,FILTER_VALIDATE_EMAIL)) throw new FalhaDeAcesso(422,'Informe um e-mail válido.');
    return $email;
}
function validarSenha(string $password): void {
    if (strlen($password)<12 || strlen($password)>128) throw new FalhaDeAcesso(422,'Use uma senha entre 12 e 128 caracteres.');
}
function processarAutenticacao(PDO $db, array $config, array $body): array {
    $action = $body['action'] ?? '';
    if (!is_string($action)) throw new FalhaDeAcesso(400,'Ação inválida.');
    limitarTentativas($db,$config,'auth');
    if ($action === 'logout') { $_SESSION=[]; session_regenerate_id(true); return ['ok'=>true]; }
    if ($action === 'google') {
        $credential = $body['credential'] ?? null;
        if (!is_string($credential) || strlen($credential)>12000 || $config['google_client_id']==='') throw new FalhaDeAcesso(503,'Google ainda não configurado.');
        $client = new Google\Client(['client_id'=>$config['google_client_id']]);
        try { $claims = $client->verifyIdToken($credential); }
        catch (Throwable) { throw new FalhaDeAcesso(401,'Não foi possível verificar o acesso Google.'); }
        if (!$claims || !isset($claims['sub'],$claims['nonce']) || !hash_equals($_SESSION['google_nonce'],(string)$claims['nonce']) || ($claims['email_verified'] ?? false)!==true) throw new FalhaDeAcesso(401,'Acesso Google inválido.');
        $email=validarEmail((string)$claims['email']);
        $stmt=$db->prepare('SELECT * FROM accounts WHERE google_subject = ?'); $stmt->execute([$claims['sub']]); $account=$stmt->fetch();
        if (!$account) {
            $stmt=$db->prepare('SELECT id FROM accounts WHERE email = ?');$stmt->execute([$email]);
            if ($stmt->fetch()) throw new FalhaDeAcesso(409,'Use o acesso por senha dessa conta. Vinculação Google requer verificação separada.');
            $stmt=$db->prepare('INSERT INTO accounts (email,display_name,google_subject,email_verified_at) VALUES (?,?,?,UTC_TIMESTAMP())');
            $stmt->execute([$email,substr((string)($claims['name'] ?? 'Convidado'),0,160),$claims['sub']]);
            $account=['id'=>(int)$db->lastInsertId(),'session_version'=>0,'disabled_at'=>null];
        }
        if ($account['disabled_at']!==null) throw new FalhaDeAcesso(403,'Conta indisponível.');
        abrirSessao($account);return ['ok'=>true];
    }
    if ($action==='login') {
        $email=validarEmail((string)($body['email']??'')); $password=(string)($body['password']??'');
        $stmt=$db->prepare('SELECT * FROM accounts WHERE email = ?');$stmt->execute([$email]);$account=$stmt->fetch();
        // Mesmo custo de hash para conta inexistente, sem armazenar a senha.
        $hash=$account['password_hash'] ?? '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.';
        $valid=password_verify($password,$hash);
        if (!$account || !$valid || $account['disabled_at']!==null) throw new FalhaDeAcesso(401,'E-mail ou senha inválidos.');
        if (!$account['email_verified_at']) throw new FalhaDeAcesso(403,'Verifique seu e-mail para entrar.');
        if (password_needs_rehash($hash,PASSWORD_DEFAULT)) { $stmt=$db->prepare('UPDATE accounts SET password_hash=? WHERE id=?');$stmt->execute([password_hash($password,PASSWORD_DEFAULT),$account['id']]); }
        abrirSessao($account); return ['ok'=>true];
    }
    if (in_array($action,['register','reset_request'],true)) {
        if ($config['smtp']['host']==='') throw new FalhaDeAcesso(503,'Envio de e-mail ainda não configurado.');
        $email=validarEmail((string)($body['email']??''));
        $stmt=$db->prepare('SELECT * FROM accounts WHERE email=?');$stmt->execute([$email]);$account=$stmt->fetch();
        if ($action==='register' && !$account) {
            $password=(string)($body['password']??'');validarSenha($password);
            $name=trim((string)($body['name']??''));if(strlen($name)<2||strlen($name)>160)throw new FalhaDeAcesso(422,'Informe seu nome.');
            $stmt=$db->prepare('INSERT INTO accounts (email,display_name,password_hash) VALUES (?,?,?)');$stmt->execute([$email,$name,password_hash($password,PASSWORD_DEFAULT)]);
            $account=['id'=>(int)$db->lastInsertId(),'email_verified_at'=>null];
        }
        $purpose=$action==='register'?'verify_email':'reset_password';
        if ($account && ($purpose==='reset_password'||!$account['email_verified_at'])) {
            $token=bin2hex(random_bytes(32));
            $stmt=$db->prepare('INSERT INTO account_action_tokens (account_id,purpose,token_hash,expires_at) VALUES (?,?,?,DATE_ADD(UTC_TIMESTAMP(), INTERVAL 30 MINUTE))');
            $stmt->execute([$account['id'],$purpose,hash('sha256',$token)]);
            enviarLinkDeConta($config,$email,$purpose,$token);
        }
        return ['ok'=>true,'message'=>'Se aplicável, você receberá um link por e-mail.'];
    }
    if (in_array($action,['verify_email','reset_password'],true)) {
        $token=$body['token']??'';if(!is_string($token)||!preg_match('/^[a-f0-9]{64}$/D',$token))throw new FalhaDeAcesso(400,'Link inválido.');
        if($action==='reset_password')validarSenha((string)($body['password']??''));
        $db->beginTransaction();
        try {
            $stmt=$db->prepare('SELECT * FROM account_action_tokens WHERE token_hash=? AND purpose=? AND consumed_at IS NULL AND expires_at>UTC_TIMESTAMP() FOR UPDATE');
            $stmt->execute([hash('sha256',$token),$action]);$row=$stmt->fetch();if(!$row)throw new FalhaDeAcesso(400,'Link inválido ou expirado.');
            if($action==='verify_email') { $stmt=$db->prepare('UPDATE accounts SET email_verified_at=UTC_TIMESTAMP() WHERE id=?');$stmt->execute([$row['account_id']]); }
            else { $stmt=$db->prepare('UPDATE accounts SET password_hash=?,session_version=session_version+1 WHERE id=?');$stmt->execute([password_hash($body['password'],PASSWORD_DEFAULT),$row['account_id']]); }
            $stmt=$db->prepare('UPDATE account_action_tokens SET consumed_at=UTC_TIMESTAMP() WHERE account_id=? AND purpose=? AND consumed_at IS NULL');$stmt->execute([$row['account_id'],$action]);
            $db->commit();return ['ok'=>true];
        } catch(Throwable $e) { $db->rollBack();throw $e; }
    }
    throw new FalhaDeAcesso(400,'Ação inválida.');
}
