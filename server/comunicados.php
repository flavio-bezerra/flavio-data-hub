<?php
declare(strict_types=1);

function prepararComunicado(PDO $db,int $actor,array $body): array {
    exigirAdministrador($db,$actor);
    $template=$body['template']??null;$audience=$body['audience']??null;$ids=$body['group_ids']??[];
    if(!in_array($template,['table','reminder','hotel','van','guide','thanks','message'],true)||!in_array($audience,['test','selected','eligible'],true)||!is_array($ids)||!array_is_list($ids)||count($ids)>1000||($template==='message'&&$audience==='eligible'))throw new FalhaDeAcesso(422,'Seleção de e-mail inválida.');
    foreach($ids as $id)if(!is_int($id)||$id<1)throw new FalhaDeAcesso(422,'Família inválida.');
    if($audience==='test'){
        $stmt=$db->prepare('SELECT email FROM accounts WHERE id=? AND email_verified_at IS NOT NULL AND disabled_at IS NULL');$stmt->execute([$actor]);$email=$stmt->fetchColumn();
        if(!$email)throw new FalhaDeAcesso(422,'A conta administrativa precisa de um e-mail verificado.');
        return ['ok'=>true,'skipped'=>0,'recipients'=>[['group_id'=>0,'label'=>'Família Exemplo','table_number'=>12,'email'=>$email]]];
    }
    $confirmed=" AND i.registration_receipt IS NOT NULL AND EXISTS(SELECT 1 FROM guests g WHERE g.invitation_group_id=i.id AND g.attendance='yes')";
    $filter=$template==='table'?' AND i.table_number IS NOT NULL AND i.table_visible=1 AND i.registration_receipt IS NOT NULL AND EXISTS(SELECT 1 FROM guests g WHERE g.invitation_group_id=i.id AND g.attendance=\'yes\')':($template==='reminder'?' AND i.registration_receipt IS NULL':'');
    if(in_array($template,['guide','hotel','van','thanks'],true))$filter=$confirmed;
    if($template==='hotel')$filter.=" AND i.lodging_intent='yes'";
    if($template==='van')$filter.=" AND EXISTS(SELECT 1 FROM guests g WHERE g.invitation_group_id=i.id AND g.attendance='yes' AND COALESCE(g.arrival_override,i.arrival_mode)='van')";
    $rows=$db->query('SELECT i.id AS group_id,i.label,CASE WHEN i.table_visible=1 THEN i.table_number ELSE NULL END AS table_number,a.email FROM invitation_groups i LEFT JOIN accounts a ON a.id=i.responsible_account_id AND a.email_verified_at IS NOT NULL AND a.disabled_at IS NULL WHERE i.revoked_at IS NULL'.$filter.' ORDER BY i.id')->fetchAll();
    $recipients=[];$eligible=0;
    foreach($rows as $row){$id=(int)$row['group_id'];if($audience==='selected'&&!in_array($id,$ids,true))continue;$eligible++;if(!filter_var($row['email'],FILTER_VALIDATE_EMAIL))continue;$row['group_id']=$id;$row['table_number']=$row['table_number']===null?null:(int)$row['table_number'];$recipients[]=$row;}
    return ['ok'=>true,'recipients'=>$recipients,'skipped'=>($audience==='selected'?count(array_unique($ids)):$eligible)-count($recipients)];
}

function registrarEnvioDeComunicado(PDO $db,int $actor,array $body): array {
    exigirAdministrador($db,$actor);
    $id=$body['dispatch_id']??null;$count=$body['count']??null;$phase=$body['phase']??null;
    if(!is_string($id)||!preg_match('/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/D',$id)||!is_int($count)||$count<0||$count>10)throw new FalhaDeAcesso(422,'Lote inválido.');
    if($phase==='reserve'&&$count>0){
        try{$db->prepare('INSERT INTO event_email_dispatches(dispatch_id,actor_account_id,recipient_count) VALUES (?,?,?)')->execute([$id,$actor,$count]);}
        catch(PDOException $e){if($e->getCode()==='23000')throw new FalhaDeAcesso(409,'Este lote já foi registrado. Consulte o resultado antes de repetir.');throw $e;}
    }elseif($phase==='finish'){
        $db->prepare("UPDATE event_email_dispatches SET state=IF(recipient_count=?,'completed','partial'),accepted_count=? WHERE dispatch_id=? AND actor_account_id=? AND state='reserved' AND recipient_count>=?")->execute([$count,$count,$id,$actor,$count]);
    }else throw new FalhaDeAcesso(422,'Lote inválido.');
    return ['ok'=>true];
}
