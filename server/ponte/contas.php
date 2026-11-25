<?php
declare(strict_types=1);
function operacaoDeConta(PDO $db,string $operation,array $p): array {
 if(in_array($operation,['account.lookup','account.register'],true)){
  $email=$p['email']??null;if(!is_string($email)||strlen($email)>254||!filter_var($email,FILTER_VALIDATE_EMAIL))throw new FalhaDeAcesso(422,'E-mail inválido.');
  if($operation==='account.register'){
   if(!is_string($p['name']??null)||strlen($p['name'])>160||strlen($p['name'])<2||!is_string($p['password_hash']??null)||!preg_match('/^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/D',$p['password_hash']))throw new FalhaDeAcesso(422,'Cadastro inválido.');
   $stmt=$db->prepare('INSERT INTO accounts (email,display_name,password_hash) VALUES (?,?,?) ON DUPLICATE KEY UPDATE id=id');$stmt->execute([$email,$p['name'],$p['password_hash']]);
  }
  $stmt=$db->prepare('SELECT id,password_hash,email_verified_at,disabled_at,session_version FROM accounts WHERE email=?');$stmt->execute([$email]);return ['ok'=>true,'account'=>$stmt->fetch()?:null];
 }
 if(in_array($operation,['account.google','account.google_invite'],true)){
  $subject=$p['subject']??null;$email=$p['email']??null;$name=$p['name']??null;
  if(!is_string($subject)||strlen($subject)<1||strlen($subject)>255||!is_string($email)||!filter_var($email,FILTER_VALIDATE_EMAIL)||strlen($email)>254||!is_string($name)||strlen($name)>640)throw new FalhaDeAcesso(422,'Conta inválida.');
  $stmt=$db->prepare('SELECT id,session_version,disabled_at FROM accounts WHERE google_subject=?');$stmt->execute([$subject]);$account=$stmt->fetch();
   if(!$account){
     // A identidade Google pode entrar sem convite. O vínculo é autorizado em vincularConvite.
   $stmt=$db->prepare('SELECT id FROM accounts WHERE email=?');$stmt->execute([$email]);if($stmt->fetch())throw new FalhaDeAcesso(409,'Use a senha da conta. Vinculação Google exige verificação separada.');
   try{$stmt=$db->prepare('INSERT INTO accounts (email,display_name,google_subject,email_verified_at) VALUES (?,?,?,UTC_TIMESTAMP())');$stmt->execute([$email,mb_substr($name,0,160),$subject]);}
   catch(PDOException $e){if($e->getCode()==='23000')throw new FalhaDeAcesso(409,'Conta já cadastrada. Entre novamente.');throw $e;}
   $account=['id'=>(int)$db->lastInsertId(),'session_version'=>0,'disabled_at'=>null];
  }
  if($account['disabled_at']!==null)throw new FalhaDeAcesso(403,'Conta indisponível.');return ['ok'=>true,'account'=>$account];
 }
 if($operation==='account.token'){
  if(!is_int($p['account_id']??null)||!in_array($p['purpose']??null,['verify_email','reset_password'],true)||!is_string($p['token']??null)||!preg_match('/^[a-f0-9]{64}$/D',$p['token']))throw new FalhaDeAcesso(422,'Token inválido.');
  $stmt=$db->prepare('INSERT INTO account_action_tokens(account_id,purpose,token_hash,expires_at) VALUES (?,?,?,DATE_ADD(UTC_TIMESTAMP(),INTERVAL 30 MINUTE))');$stmt->execute([$p['account_id'],$p['purpose'],hash('sha256',$p['token'])]);return ['ok'=>true];
 }
 if($operation==='account.consume_token'){
  if(!in_array($p['purpose']??null,['verify_email','reset_password'],true)||!is_string($p['token']??null)||!preg_match('/^[a-f0-9]{64}$/D',$p['token']))throw new FalhaDeAcesso(400,'Link inválido.');
  if($p['purpose']==='reset_password'&&(!is_string($p['password_hash']??null)||!preg_match('/^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/D',$p['password_hash'])))throw new FalhaDeAcesso(422,'Senha inválida.');
  $db->beginTransaction();try{
   $stmt=$db->prepare('SELECT account_id FROM account_action_tokens WHERE token_hash=? AND purpose=? AND consumed_at IS NULL AND expires_at>UTC_TIMESTAMP() FOR UPDATE');$stmt->execute([hash('sha256',$p['token']),$p['purpose']]);$id=$stmt->fetchColumn();if(!$id)throw new FalhaDeAcesso(400,'Link inválido ou expirado.');
   $stmt=$db->prepare('SELECT id FROM accounts WHERE id=? AND disabled_at IS NULL FOR UPDATE');$stmt->execute([$id]);if(!$stmt->fetch())throw new FalhaDeAcesso(400,'Link inválido.');
   if($p['purpose']==='verify_email'){$stmt=$db->prepare('UPDATE accounts SET email_verified_at=UTC_TIMESTAMP() WHERE id=?');$stmt->execute([$id]);}
   else{$stmt=$db->prepare('UPDATE accounts SET password_hash=?,session_version=session_version+1 WHERE id=?');$stmt->execute([$p['password_hash'],$id]);$stmt=$db->prepare('UPDATE web_access_sessions SET revoked_at=UTC_TIMESTAMP() WHERE account_id=?');$stmt->execute([$id]);}
   $stmt=$db->prepare('UPDATE account_action_tokens SET consumed_at=UTC_TIMESTAMP() WHERE account_id=? AND purpose=? AND consumed_at IS NULL');$stmt->execute([$id,$p['purpose']]);$db->commit();return ['ok'=>true];
  }catch(Throwable $e){$db->rollBack();throw $e;}
 }
 throw new FalhaDeAcesso(400,'Operação indisponível.');
}
