<?php
declare(strict_types=1);
require_once dirname(__DIR__).'/autenticacao.php'; // FalhaDeAcesso; funções PHP de login legado não são chamadas.
require_once dirname(__DIR__).'/administracao.php';require_once dirname(__DIR__).'/convites.php';
require_once dirname(__DIR__).'/assistente/contexto-da-festa.php';
require_once dirname(__DIR__).'/assistente/administracao-memoria.php';require_once dirname(__DIR__).'/assistente/administracao-contexto.php';
require_once __DIR__.'/sessoes.php';require_once __DIR__.'/contas.php';
function executarOperacoesDaPonte(string $private): never {
 try{
  if(strtolower(explode(';',$_SERVER['CONTENT_TYPE']??'')[0])!=='application/json')throw new FalhaDeAcesso(415,'Envie JSON.');
  $raw=file_get_contents('php://input',false,null,0,65537);if(strlen($raw)>65536)throw new FalhaDeAcesso(413,'Solicitação muito grande.');
  $body=json_decode($raw,true,32,JSON_THROW_ON_ERROR);if(!is_array($body)||array_is_list($body)||array_diff(array_keys($body),['operation','session_token','payload','client_bucket']))throw new FalhaDeAcesso(422,'Corpo inválido.');
  $allowed=['session.read','session.create','session.rotate','session.revoke','rate.limit','account.lookup','account.register','account.google','account.token','account.consume_token','chat.context','memory.dispatch','logistics.dispatch','invitation.dispatch','rsvp.save'];
  $operation=$body['operation']??null;$p=$body['payload']??null;$token=$body['session_token']??null;
  if(!in_array($operation,$allowed,true)||!is_array($p)||(!empty($p)&&array_is_list($p))||!is_string($token))throw new FalhaDeAcesso(422,'Operação inválida.');
  $config=require $private.'/database.php';$dsn=sprintf('mysql:host=%s;port=%d;dbname=%s;charset=%s',$config['host'],(int)$config['port'],$config['database'],$config['charset']);
  $db=new PDO($dsn,$config['username'],$config['password'],[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC,PDO::ATTR_EMULATE_PREPARES=>false]);$db->exec("SET time_zone='+00:00'");
  $result=despacharOperacao($db,$operation,$token,$p,$body['client_bucket']??'');
  echo json_encode($result,JSON_THROW_ON_ERROR|JSON_UNESCAPED_UNICODE);
 }catch(FalhaDeAcesso $e){http_response_code($e->status);echo json_encode(['ok'=>false,'message'=>$e->getMessage()]);}
 catch(Throwable){http_response_code(503);echo json_encode(['ok'=>false,'message'=>'Operação indisponível.']);}exit;
}
function despacharOperacao(PDO $db,string $operation,string $token,array $p,string $bucket=''): array {
 $session=carregarSessaoPersistida($db,$token);
 if($operation==='session.read')return ['ok'=>true,'session'=>$session];
 if($operation==='rate.limit'){
  $domain=$p['domain']??null;if(!is_string($domain)||!in_array($domain,['auth','chat','memoria','contexto','convites','confirmacoes'],true)||!preg_match('/^[a-f0-9]{64}$/D',$bucket))throw new FalhaDeAcesso(422,'Limite inválido.');
  $window=intdiv(time(),900);$hash=hash('sha256',$domain.':'.$bucket);$stmt=$db->prepare('INSERT INTO access_rate_limits(bucket_hash,window_id,attempts) VALUES (?,?,1) ON DUPLICATE KEY UPDATE attempts=attempts+1');$stmt->execute([$hash,$window]);$stmt=$db->prepare('SELECT attempts FROM access_rate_limits WHERE bucket_hash=? AND window_id=?');$stmt->execute([$hash,$window]);if((int)$stmt->fetchColumn()>30)throw new FalhaDeAcesso(429,'Muitas tentativas. Tente mais tarde.');
  if($domain==='chat'&&$session&&$session['account']){$id=$session['account']['id'];$window=intdiv(time(),3600);$stmt=$db->prepare('INSERT INTO assistant_account_usage(account_id,window_id,attempts) VALUES (?,?,1) ON DUPLICATE KEY UPDATE attempts=attempts+1');$stmt->execute([$id,$window]);$stmt=$db->prepare('SELECT attempts FROM assistant_account_usage WHERE account_id=? AND window_id=?');$stmt->execute([$id,$window]);if((int)$stmt->fetchColumn()>30)throw new FalhaDeAcesso(429,'Limite de mensagens atingido.');}
  return ['ok'=>true];
 }
 if($operation==='session.create'){inserirSessaoPersistida($db,$p);return ['ok'=>true,'session'=>carregarSessaoPersistida($db,$p['token'])];}
 if(!$session)throw new FalhaDeAcesso(401,'Sessão encerrada.');
 if(str_starts_with($operation,'account.'))return operacaoDeConta($db,$operation,$p);
 if($operation==='session.revoke'){$stmt=$db->prepare('UPDATE web_access_sessions SET revoked_at=UTC_TIMESTAMP() WHERE token_hash=?');$stmt->execute([hash('sha256',$token)]);return ['ok'=>true];}
 if($operation==='session.rotate'){
  if(!is_int($p['account_id']??null)||!is_int($p['session_version']??null))throw new FalhaDeAcesso(422,'Conta inválida.');
  $db->beginTransaction();try{
   $stmt=$db->prepare('SELECT token_hash FROM web_access_sessions WHERE token_hash=? AND revoked_at IS NULL AND expires_at>UTC_TIMESTAMP() FOR UPDATE');$stmt->execute([hash('sha256',$token)]);if(!$stmt->fetch())throw new FalhaDeAcesso(401,'Sessão encerrada.');
   $stmt=$db->prepare('SELECT id FROM accounts WHERE id=? AND session_version=? AND email_verified_at IS NOT NULL AND disabled_at IS NULL FOR UPDATE');$stmt->execute([$p['account_id'],$p['session_version']]);if(!$stmt->fetch())throw new FalhaDeAcesso(401,'Conta indisponível.');
   inserirSessaoPersistida($db,$p,$p['account_id'],$p['session_version']);$stmt=$db->prepare('UPDATE web_access_sessions SET revoked_at=UTC_TIMESTAMP() WHERE token_hash=?');$stmt->execute([hash('sha256',$token)]);$db->commit();return ['ok'=>true];
  }catch(Throwable $e){$db->rollBack();throw $e;}
 }
 if(!$session['account'])throw new FalhaDeAcesso(401,'Entre na sua conta.');$id=$session['account']['id'];
 if($operation==='chat.context'){
  $preview=$p['preview_version']??null;if($preview!==null&&(!is_int($preview)||$preview<1))throw new FalhaDeAcesso(422,'Versão inválida.');
  return ['ok'=>true,'context'=>montarContextoDaFesta($db,$id,$preview)];
 }
 if($operation==='memory.dispatch')return administrarMemoria($db,$id,$p);
 if($operation==='logistics.dispatch')return administrarContexto($db,$id,$p);
 if($operation==='invitation.dispatch'){
  if(($p['action']??'')==='claim')return vincularConvite($db,$id,(string)($p['token']??''));
  if(($p['action']??'')==='read')return ['ok'=>true]+lerGrupo($db,$id,(int)($p['group_id']??0));
  throw new FalhaDeAcesso(400,'Ação indisponível.');
 }
 if($operation==='rsvp.save')return salvarConfirmacao($db,$id,$p);
 throw new FalhaDeAcesso(400,'Operação indisponível.');
}
