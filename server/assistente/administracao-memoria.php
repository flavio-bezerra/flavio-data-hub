<?php
declare(strict_types=1);
function administrarMemoria(PDO $db,int $accountId,array $body): array {
 exigirAdministrador($db,$accountId);$action=$body['action']??'';
 if($action==='read'){
  $versions=$db->query('SELECT id,behavior_text,knowledge_text,examples_text,created_at FROM assistant_memory_versions ORDER BY id DESC LIMIT 30')->fetchAll();
  $publication=$db->query('SELECT memory_version_id,revision,published_at FROM assistant_publication WHERE id=1')->fetch();
  return ['ok'=>true,'versions'=>$versions,'publication'=>$publication];
 }
 if($action==='save'){
  foreach(['behavior','knowledge','examples'] as $key)if(!is_string($body[$key]??null)||strlen($body[$key])>10000)throw new FalhaDeAcesso(422,'Texto inválido ou muito longo.');
  $stmt=$db->prepare('INSERT INTO assistant_memory_versions (behavior_text,knowledge_text,examples_text,created_by) VALUES (?,?,?,?)');$stmt->execute([$body['behavior'],$body['knowledge'],$body['examples'],$accountId]);return ['ok'=>true,'version'=>(int)$db->lastInsertId()];
 }
 if($action==='publish'){
  $version=$body['version']??null;$revision=$body['revision']??null;if(!is_int($version)||!is_int($revision))throw new FalhaDeAcesso(422,'Versão inválida.');
  $db->beginTransaction();try{
   $stmt=$db->prepare('SELECT id FROM assistant_memory_versions WHERE id=?');$stmt->execute([$version]);if(!$stmt->fetch())throw new FalhaDeAcesso(404,'Versão ausente.');
   $stmt=$db->prepare('UPDATE assistant_publication SET memory_version_id=?,revision=revision+1,published_by=?,published_at=UTC_TIMESTAMP() WHERE id=1 AND revision=?');$stmt->execute([$version,$accountId,$revision]);if($stmt->rowCount()!==1)throw new FalhaDeAcesso(409,'Publicação mudou. Recarregue.');
   $stmt=$db->prepare("INSERT INTO audit_events (actor_account_id,action,entity_type,entity_id) VALUES (?,'publish_memory','assistant_memory',?)");$stmt->execute([$accountId,$version]);$db->commit();return ['ok'=>true];
  }catch(Throwable $e){$db->rollBack();throw $e;}
 }
 throw new FalhaDeAcesso(400,'Ação indisponível.');
}
