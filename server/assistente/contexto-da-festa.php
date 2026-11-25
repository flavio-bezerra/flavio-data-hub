<?php
declare(strict_types=1);
function montarContextoDaFesta(PDO $db,int $accountId,?int $previewVersion=null): array {
 if($previewVersion!==null){exigirAdministrador($db,$accountId);$stmt=$db->prepare('SELECT * FROM assistant_memory_versions WHERE id=?');$stmt->execute([$previewVersion]);}
  else{
   $convite=$db->prepare('SELECT 1 FROM invitation_groups WHERE responsible_account_id=? AND revoked_at IS NULL LIMIT 1');$convite->execute([$accountId]);
   if(!$convite->fetchColumn())throw new FalhaDeAcesso(403,'Vincule um convite para usar o assistente.');
   $stmt=$db->query('SELECT m.* FROM assistant_publication p JOIN assistant_memory_versions m ON m.id=p.memory_version_id WHERE p.id=1');
  }
 $memory=$stmt->fetch();
 $stmt=$db->prepare('SELECT l.id,l.topic,l.title,l.details_text,l.link_url,l.published_at FROM event_logistics_versions l LEFT JOIN invitation_groups g ON g.id=l.invitation_group_id WHERE l.published_at IS NOT NULL AND ((l.invitation_group_id IS NULL AND l.guest_id IS NULL) OR (g.responsible_account_id=? AND g.revoked_at IS NULL AND (l.guest_id IS NULL OR EXISTS (SELECT 1 FROM guests guest WHERE guest.id=l.guest_id AND guest.invitation_group_id=g.id)))) ORDER BY l.id DESC LIMIT 60');
 $stmt->execute([$accountId]);$records=[];
 foreach($stmt->fetchAll() as $row){$records[]=['id'=>'logistica-'.$row['id'],'topic'=>$row['topic'],'title'=>$row['title'],'text'=>$row['details_text'],'url'=>$row['link_url'],'updated_at'=>$row['published_at']];}
 $stmt=$db->prepare('SELECT guest.id,guest.display_name,guest.attendance FROM guests guest JOIN invitation_groups g ON g.id=guest.invitation_group_id WHERE g.responsible_account_id=? AND g.revoked_at IS NULL ORDER BY guest.id LIMIT 100');$stmt->execute([$accountId]);
 foreach($stmt->fetchAll() as $row){$records[]=['id'=>'convidado-'.$row['id'],'title'=>$row['display_name'],'text'=>'Presença: '.$row['attendance'],'url'=>null];}
 return ['version'=>$memory?(int)$memory['id']:null,'memory'=>$memory?['behavior'=>$memory['behavior_text'],'knowledge'=>$memory['knowledge_text'],'examples'=>$memory['examples_text']]:null,'records'=>$records];
}
