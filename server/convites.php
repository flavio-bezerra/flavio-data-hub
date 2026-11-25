<?php
declare(strict_types=1);
function vincularConvite(PDO $db,int $accountId,string $token): array {
    if(!preg_match('/^[a-f0-9]{64}$/D',$token))throw new FalhaDeAcesso(404,'Convite indisponível.');
    $db->beginTransaction();
    try {
        $stmt=$db->prepare('SELECT id,responsible_account_id FROM invitation_groups WHERE invitation_token_hash=? AND revoked_at IS NULL FOR UPDATE');
        $stmt->execute([hash('sha256',$token)]);$group=$stmt->fetch();
        if(!$group)throw new FalhaDeAcesso(404,'Convite indisponível.');
        if($group['responsible_account_id']!==null && (int)$group['responsible_account_id']!==$accountId)throw new FalhaDeAcesso(409,'Este convite já tem um responsável.');
        if($group['responsible_account_id']===null) {
            $stmt=$db->prepare('UPDATE invitation_groups SET responsible_account_id=?,claimed_at=UTC_TIMESTAMP() WHERE id=? AND responsible_account_id IS NULL');
            $stmt->execute([$accountId,$group['id']]);if($stmt->rowCount()!==1)throw new FalhaDeAcesso(409,'Convite já vinculado.');
            $stmt=$db->prepare("INSERT INTO audit_events (actor_account_id,action,entity_type,entity_id) VALUES (?,'claim_invitation','invitation_group',?)");$stmt->execute([$accountId,$group['id']]);
        }
        $db->commit();return ['ok'=>true,'group_id'=>(int)$group['id']];
    } catch(Throwable $e){$db->rollBack();throw $e;}
}
function listarMeusConvites(PDO $db,int $accountId): array {
    $stmt=$db->prepare('SELECT id,label FROM invitation_groups WHERE responsible_account_id=? AND revoked_at IS NULL ORDER BY id');
    $stmt->execute([$accountId]);
    return ['ok'=>true,'groups'=>$stmt->fetchAll()];
}
function lerGrupo(PDO $db,int $accountId,int $groupId,bool $admin=false): array {
    if($admin)exigirAdministrador($db,$accountId);
    $stmt=$db->prepare('SELECT i.id AS group_id,i.label,i.external_invitation_id,i.contact_phone AS group_phone,i.registration_receipt,i.registration_confirmed_at,a.email AS responsible_email,s.response_deadline,g.id,g.display_name,g.contact_phone,g.is_minor,g.attendance,g.revision FROM invitation_groups i LEFT JOIN guests g ON g.invitation_group_id=i.id LEFT JOIN accounts a ON a.id=i.responsible_account_id LEFT JOIN event_settings s ON s.id=1 WHERE i.id=? AND i.revoked_at IS NULL'.($admin?'':' AND i.responsible_account_id=?').' ORDER BY g.id');
    $stmt->execute($admin?[$groupId]:[$groupId,$accountId]);$rows=$stmt->fetchAll();
    if(!$rows)throw new FalhaDeAcesso(404,'Convite indisponível.');
    $first=$rows[0];$utc=static fn(?string $v): ?string=>$v===null?null:str_replace(' ','T',$v).'Z';
    $group=['id'=>(int)$first['group_id'],'label'=>$first['label'],'external_id'=>$first['external_invitation_id'],'contact_phone'=>$first['group_phone'],'responsible_email'=>$first['responsible_email'],'deadline'=>$utc($first['response_deadline']),'receipt'=>$first['registration_receipt']===null?null:['protocol'=>$first['registration_receipt'],'confirmed_at'=>$utc($first['registration_confirmed_at'])]];
    $guests=[];foreach($rows as $row)if($row['id']!==null)$guests[]=array_intersect_key($row,array_flip(['id','display_name','contact_phone','is_minor','attendance','revision']));
    return ['group'=>$group,'guests'=>$guests];
}

function nomeDoConvidado(mixed $name,bool $full): string {
    if(!is_string($name)||!preg_match('/^[^\p{C}\p{Zl}\p{Zp}]+$/u',$name)||mb_strlen(trim($name))>160)throw new FalhaDeAcesso(422,'Nome inválido.');
    $name=trim(preg_replace('/\s+/u',' ',$name));
    if($name===''||($full&&!str_contains($name,' ')))throw new FalhaDeAcesso(422,'Informe o nome completo de cada pessoa.');
    return $name;
}

function telefoneDoConvite(mixed $phone): ?string {
    if(!is_string($phone)||strlen($phone)>32||!preg_match('/^[0-9+(). -]*$/D',$phone))throw new FalhaDeAcesso(422,'Telefone inválido.');
    $phone=trim($phone);if($phone==='')return null;
    $plus=str_starts_with($phone,'+');if(substr_count($phone,'+')!==($plus?1:0))throw new FalhaDeAcesso(422,'Telefone inválido.');
    $digits=preg_replace('/\D/','',$phone);
    if($plus? !preg_match('/^[1-9][0-9]{7,14}$/D',$digits):!preg_match('/^[1-9][0-9]{9,10}$/D',$digits))throw new FalhaDeAcesso(422,'Informe DDD + telefone, ou use +código do país.');
    return $plus?'+'.$digits:'+55'.$digits;
}
function salvarConfirmacao(PDO $db,int $accountId,array $body): array {
    $groupId=filter_var($body['group_id']??null,FILTER_VALIDATE_INT,['options'=>['min_range'=>1]]);
    $responses=$body['responses']??null;
    if(!$groupId||!is_array($responses)||!array_is_list($responses)||count($responses)<1||count($responses)>100)throw new FalhaDeAcesso(422,'Respostas inválidas.');
    $db->beginTransaction();
    try {
        $stmt=$db->query('SELECT response_deadline FROM event_settings WHERE id=1 FOR UPDATE');$settings=$stmt->fetch();
        if(!$settings)throw new RuntimeException('Configuração do evento ausente.');
        if($settings['response_deadline']!==null && strtotime($settings['response_deadline'].' UTC')<time())throw new FalhaDeAcesso(403,'Prazo de confirmação encerrado.');
        $stmt=$db->prepare('SELECT id FROM invitation_groups WHERE id=? AND responsible_account_id=? AND revoked_at IS NULL FOR UPDATE');$stmt->execute([$groupId,$accountId]);if(!$stmt->fetch())throw new FalhaDeAcesso(404,'Convite indisponível.');
        $stmt=$db->prepare('SELECT COUNT(*) FROM guests WHERE invitation_group_id=?');$stmt->execute([$groupId]);
        if((int)$stmt->fetchColumn()!==count($responses))throw new FalhaDeAcesso(409,'Responda por todas as pessoas do grupo. Se o grupo mudou, recarregue.');
        $contact=telefoneDoConvite($body['contact_phone']??'');$hasAttendance=false;
        $seen=[];
        foreach($responses as $response){
            if(!is_array($response)||!isset($response['id'],$response['attendance'],$response['revision'])||!is_int($response['id'])||!is_int($response['revision'])||!in_array($response['attendance'],['yes','no'],true)||isset($seen[$response['id']]))throw new FalhaDeAcesso(422,'Respostas inválidas.');
            $seen[$response['id']]=true;
            $name=nomeDoConvidado($response['full_name']??null,true);$phone=telefoneDoConvite($response['phone']??'');
            $hasAttendance=$hasAttendance||$response['attendance']==='yes';
            $stmt=$db->prepare('UPDATE guests SET display_name=?,contact_phone=?,attendance=?,revision=revision+1,updated_by=?,updated_at=UTC_TIMESTAMP() WHERE id=? AND invitation_group_id=? AND revision=?');
            $stmt->execute([$name,$phone,$response['attendance'],$accountId,$response['id'],$groupId,$response['revision']]);
            if($stmt->rowCount()!==1)throw new FalhaDeAcesso(409,'O cadastro mudou. Recarregue antes de salvar.');
        }
        if($hasAttendance&&$contact===null)throw new FalhaDeAcesso(422,'Informe o telefone do responsável se alguém estiver presente.');
        $protocol=bin2hex(random_bytes(16));$now=gmdate('Y-m-d H:i:s');
        $stmt=$db->prepare('UPDATE invitation_groups SET contact_phone=?,registration_receipt=?,registration_confirmed_at=? WHERE id=?');$stmt->execute([$contact,$protocol,$now,$groupId]);
        $stmt=$db->prepare("INSERT INTO audit_events(actor_account_id,action,entity_type,entity_id) VALUES (?,'confirm_registration','invitation_group',?)");$stmt->execute([$accountId,$groupId]);
        $db->commit();return ['ok'=>true,'receipt'=>['protocol'=>$protocol,'confirmed_at'=>str_replace(' ','T',$now).'Z']];
    }catch(Throwable $e){$db->rollBack();throw $e;}
}
