<?php
declare(strict_types=1);
function carregarSessaoPersistida(PDO $db,string $token): ?array {
 if(!preg_match('/^[a-f0-9]{64}$/D',$token))return null;
 $stmt=$db->prepare('SELECT s.*,a.display_name,a.email_verified_at,a.disabled_at,a.session_version FROM web_access_sessions s LEFT JOIN accounts a ON a.id=s.account_id WHERE s.token_hash=? AND s.revoked_at IS NULL AND s.expires_at>UTC_TIMESTAMP()');$stmt->execute([hash('sha256',$token)]);$row=$stmt->fetch();
 if(!$row)return null;
 $account=null;
 if($row['account_id']!==null){
  if($row['disabled_at']!==null||!$row['email_verified_at']||(int)$row['account_session_version']!==(int)$row['session_version'])return null;
  $stmt=$db->prepare('SELECT account_id FROM administrators WHERE account_id=?');$stmt->execute([$row['account_id']]);
  $account=['id'=>(int)$row['account_id'],'name'=>$row['display_name'],'administrator'=>(bool)$stmt->fetchColumn()];
 }
 return ['csrf'=>$row['csrf_token'],'nonce'=>$row['google_nonce'],'account'=>$account];
}
function inserirSessaoPersistida(PDO $db,array $payload,?int $accountId=null,?int $version=null): void {
 foreach(['token','csrf','nonce'] as $key)if(!is_string($payload[$key]??null)||!preg_match('/^[a-f0-9]{64}$/D',$payload[$key]))throw new FalhaDeAcesso(422,'Sessão inválida.');
 $stmt=$db->prepare('INSERT INTO web_access_sessions (token_hash,account_id,account_session_version,csrf_token,google_nonce,expires_at) VALUES (?,?,?,?,?,DATE_ADD(UTC_TIMESTAMP(),INTERVAL 2 HOUR))');$stmt->execute([hash('sha256',$payload['token']),$accountId,$version,$payload['csrf'],$payload['nonce']]);
}
