<?php
declare(strict_types=1);
function administrarContexto(PDO $db,int $accountId,array $body): array {
 exigirAdministrador($db,$accountId);$action=$body['action']??'';
 if($action==='read')return ['ok'=>true,'records'=>$db->query('SELECT id,topic,title,details_text,link_url,invitation_group_id,guest_id,published_at FROM event_logistics_versions ORDER BY id DESC LIMIT 100')->fetchAll()];
 if($action==='save'){
  if(!in_array($body['topic']??null,['event','hotel','van','table'],true)||!is_string($body['title']??null)||strlen($body['title'])<1||strlen($body['title'])>160||!is_string($body['text']??null)||strlen($body['text'])>3000)throw new FalhaDeAcesso(422,'Registro inválido.');
  $group=$body['group_id']??null;$guest=$body['guest_id']??null;
  if(($group!==null&&(!is_int($group)||$group<1))||($guest!==null&&(!is_int($guest)||$guest<1))||($guest!==null&&$group===null)||(($body['topic']==='table')&&$group===null))throw new FalhaDeAcesso(422,'Mesa e atribuições individuais exigem grupo válido.');
  if($guest!==null){$stmt=$db->prepare('SELECT id FROM guests WHERE id=? AND invitation_group_id=?');$stmt->execute([$guest,$group]);if(!$stmt->fetch())throw new FalhaDeAcesso(422,'Convidado não pertence ao grupo.');}
  $url=$body['url']??null;if($url!==null&&(!is_string($url)||strlen($url)>1000||!filter_var($url,FILTER_VALIDATE_URL)||parse_url($url,PHP_URL_SCHEME)!=='https'))throw new FalhaDeAcesso(422,'Link deve usar HTTPS.');
  $stmt=$db->prepare('INSERT INTO event_logistics_versions (topic,title,details_text,link_url,invitation_group_id,guest_id,created_by) VALUES (?,?,?,?,?,?,?)');$stmt->execute([$body['topic'],$body['title'],$body['text'],$url,$group,$guest,$accountId]);return ['ok'=>true];
 }
 if(in_array($action,['publish','withdraw'],true)){
  $id=$body['id']??null;if(!is_int($id)||$id<1)throw new FalhaDeAcesso(422,'Registro inválido.');
  $sql=$action==='publish'?'UPDATE event_logistics_versions SET published_at=UTC_TIMESTAMP() WHERE id=?':'UPDATE event_logistics_versions SET published_at=NULL WHERE id=?';$stmt=$db->prepare($sql);$stmt->execute([$id]);return ['ok'=>true];
 }
 throw new FalhaDeAcesso(400,'Ação indisponível.');
}
