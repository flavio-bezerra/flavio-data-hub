<?php
declare(strict_types=1);
function exigirAdministrador(PDO $db,int $accountId,bool $manage=false,bool $food=false): array {
    $stmt=$db->prepare('SELECT can_manage_administrators,can_read_food_data FROM administrators WHERE account_id=?');$stmt->execute([$accountId]);$admin=$stmt->fetch();
    if(!$admin||($manage&&!$admin['can_manage_administrators'])||($food&&!$admin['can_read_food_data']))throw new FalhaDeAcesso(403,'Acesso administrativo não autorizado.');
    return $admin;
}

function administrarConvites(PDO $db,int $accountId,array $body): array {
    $action=$body['action'];
    if($action==='admin_overview') {
        $groups=$db->query('SELECT COUNT(*) AS total, COUNT(CASE WHEN responsible_account_id IS NULL THEN 1 END) AS unclaimed, COUNT(CASE WHEN registration_receipt IS NOT NULL THEN 1 END) AS complete FROM invitation_groups WHERE revoked_at IS NULL')->fetch();
        $confirmed=$db->query("SELECT COUNT(*) FROM guests g JOIN invitation_groups i ON i.id=g.invitation_group_id WHERE i.revoked_at IS NULL AND i.registration_receipt IS NOT NULL AND g.attendance='yes'")->fetchColumn();
        return ['ok'=>true,'total'=>(int)$groups['total'],'unclaimed'=>(int)$groups['unclaimed'],'awaiting'=>(int)$groups['total']-(int)$groups['complete'],'complete'=>(int)$groups['complete'],'confirmed'=>(int)$confirmed];
    }
    if($action==='admin_deadline_read'||$action==='admin_deadline_update')return administrarPrazoDePresenca($db,$accountId,$body);
    if($action==='admin_detail') {
        $id=$body['group_id']??null;
        if(!is_int($id)||$id<1)throw new FalhaDeAcesso(422,'Grupo inválido.');
        return ['ok'=>true]+lerGrupo($db,$accountId,$id,true);
    }
    if($action==='admin_list') {
        exigirAdministrador($db,$accountId);
        $after=$body['after']??0;
        if(!is_int($after)||$after<0)throw new FalhaDeAcesso(422,'Página inválida.');
        $search=$body['search']??'';$status=$body['status']??'all';
        if(!is_string($search)||mb_strlen($search)>160||!in_array($status,['all','pending','partial','complete','unclaimed','awaiting'],true))throw new FalhaDeAcesso(422,'Filtro inválido.');
        $q='%'.strtr(trim($search),['!'=>'!!','%'=>'!%','_'=>'!_']).'%';
        $filter=match($status){
             'complete'=>' AND i.registration_receipt IS NOT NULL',
             'unclaimed'=>' AND i.responsible_account_id IS NULL',
             'awaiting'=>' AND i.registration_receipt IS NULL',
            'pending'=>" AND i.registration_receipt IS NULL AND NOT EXISTS(SELECT 1 FROM guests x WHERE x.invitation_group_id=i.id AND x.attendance<>'pending')",
            'partial'=>" AND i.registration_receipt IS NULL AND EXISTS(SELECT 1 FROM guests x WHERE x.invitation_group_id=i.id AND x.attendance<>'pending')",
            default=>'',
        };
        $stmt=$db->prepare("SELECT i.id,i.label,i.external_invitation_id AS external_id,i.registration_receipt IS NOT NULL AS has_receipt,i.responsible_account_id,a.display_name AS responsible_name,
            (SELECT COUNT(*) FROM guests g WHERE g.invitation_group_id=i.id) AS total,
            (SELECT COUNT(*) FROM guests g WHERE g.invitation_group_id=i.id AND g.attendance='yes') AS confirmed,
            (SELECT COUNT(*) FROM guests g WHERE g.invitation_group_id=i.id AND g.attendance='no') AS declined
            FROM invitation_groups i LEFT JOIN accounts a ON a.id=i.responsible_account_id
            WHERE i.revoked_at IS NULL AND i.id>? AND (i.label LIKE ? ESCAPE '!' OR i.external_invitation_id LIKE ? ESCAPE '!' OR CAST(i.id AS CHAR) LIKE ? ESCAPE '!' OR EXISTS(SELECT 1 FROM guests m WHERE m.invitation_group_id=i.id AND m.display_name LIKE ? ESCAPE '!'))".$filter.' ORDER BY i.id LIMIT 26');
        $stmt->execute([$after,$q,$q,$q,$q]);$groups=$stmt->fetchAll();
        foreach($groups as &$record)$record['has_receipt']=(bool)$record['has_receipt'];unset($record);
        $hasMore=count($groups)>25;if($hasMore)array_pop($groups);
        return ['ok'=>true,'groups'=>$groups,'next'=>$hasMore?(int)$groups[24]['id']:null];
    }
    $db->beginTransaction();
    try {
        exigirAdministrador($db,$accountId);
        $token=bin2hex(random_bytes(32));$hash=hash('sha256',$token);
        if($action==='admin_create') {
            $label=$body['label']??null;$guests=$body['guests']??null;
            if(!is_string($label)||trim($label)===''||mb_strlen(trim($label))>160||!is_array($guests)||!array_is_list($guests)||count($guests)<1||count($guests)>100)throw new FalhaDeAcesso(422,'Informe o grupo e entre 1 e 100 convidados.');
            foreach($guests as $name)if(!is_string($name)||trim($name)===''||mb_strlen(trim($name))>160)throw new FalhaDeAcesso(422,'Nome de convidado inválido.');
            $stmt=$db->prepare('INSERT INTO invitation_groups(label,invitation_token_hash) VALUES (?,?)');$stmt->execute([trim($label),$hash]);$groupId=(int)$db->lastInsertId();
            $stmt=$db->prepare('INSERT INTO guests(invitation_group_id,display_name) VALUES (?,?)');
            foreach($guests as $name)$stmt->execute([$groupId,trim($name)]);
        } else {
            $groupId=$body['group_id']??null;
            if(!is_int($groupId)||$groupId<1)throw new FalhaDeAcesso(422,'Grupo inválido.');
            $stmt=$db->prepare('SELECT responsible_account_id FROM invitation_groups WHERE id=? AND revoked_at IS NULL FOR UPDATE');$stmt->execute([$groupId]);$group=$stmt->fetch();
            if(!$group)throw new FalhaDeAcesso(404,'Convite indisponível.');
            if(in_array($action,['admin_guest_add','admin_guest_remove','admin_guest_rename'],true)){
                if(($body['acknowledge']??null)!==true)throw new FalhaDeAcesso(422,'Confirme a alteração e a necessidade de reconfirmar a presença.');
                if($action==='admin_guest_add'||$action==='admin_guest_remove'){
                    $stmt=$db->prepare('SELECT COUNT(*) FROM guests WHERE invitation_group_id=?');$stmt->execute([$groupId]);$size=(int)$stmt->fetchColumn();
                    if($action==='admin_guest_add'&&$size>=100)throw new FalhaDeAcesso(422,'O grupo já tem 100 pessoas.');
                    if($action==='admin_guest_remove'&&$size<=1)throw new FalhaDeAcesso(422,'O grupo precisa manter pelo menos uma pessoa.');
                }
                if($action==='admin_guest_add'){
                    $name=nomeDoConvidado($body['name']??null,false);
                    $stmt=$db->prepare('INSERT INTO guests(invitation_group_id,display_name,updated_by) VALUES (?,?,?)');$stmt->execute([$groupId,$name,$accountId]);
                    $auditGuestId=(int)$db->lastInsertId();
                }else{
                    $guest=$body['guest_id']??null;$revision=$body['revision']??null;
                    if(!is_int($guest)||$guest<1||!is_int($revision)||$revision<0)throw new FalhaDeAcesso(422,'Convidado inválido.');
                    if($action==='admin_guest_rename'){
                        $name=nomeDoConvidado($body['name']??null,false);
                        $stmt=$db->prepare('UPDATE guests SET display_name=?,revision=revision+1,updated_by=?,updated_at=UTC_TIMESTAMP() WHERE id=? AND invitation_group_id=? AND revision=?');
                        $stmt->execute([$name,$accountId,$guest,$groupId,$revision]);
                    }else{
                        $stmt=$db->prepare('DELETE FROM guests WHERE id=? AND invitation_group_id=? AND revision=?');
                        try{$stmt->execute([$guest,$groupId,$revision]);}catch(PDOException $e){if($e->getCode()==='23000')throw new FalhaDeAcesso(409,'Convidado tem registros relacionados; a remoção exige revisão.');throw $e;}
                    }
                    if($stmt->rowCount()!==1)throw new FalhaDeAcesso(409,'O cadastro mudou. Recarregue o grupo.');
                    $auditGuestId=$guest;
                }
                $stmt=$db->prepare('UPDATE invitation_groups SET registration_receipt=NULL,registration_confirmed_at=NULL WHERE id=?');$stmt->execute([$groupId]);
                $stmt=$db->prepare("INSERT INTO audit_events(actor_account_id,action,entity_type,entity_id) VALUES (?,?,'guest',?)");$stmt->execute([$accountId,$action,$auditGuestId]);
                $token=null;
            } elseif($action==='admin_rotate') {
                if($group['responsible_account_id']!==null)throw new FalhaDeAcesso(409,'O convite já tem responsável.');
                $stmt=$db->prepare('UPDATE invitation_groups SET invitation_token_hash=? WHERE id=?');$stmt->execute([$hash,$groupId]);
            } else {
                $email=$body['email']??null;
                if(!is_string($email)||strlen($email)>254||!filter_var(trim($email),FILTER_VALIDATE_EMAIL))throw new FalhaDeAcesso(422,'Informe o e-mail de uma conta já verificada.');
                if($group['responsible_account_id']===null)throw new FalhaDeAcesso(409,'O convite ainda não tem responsável.');
                $stmt=$db->prepare('SELECT id FROM accounts WHERE email=? AND email_verified_at IS NOT NULL AND disabled_at IS NULL FOR UPDATE');$stmt->execute([strtolower(trim($email))]);$target=$stmt->fetchColumn();
                if(!$target)throw new FalhaDeAcesso(422,'Conta verificada não encontrada.');
                if((int)$target===(int)$group['responsible_account_id'])throw new FalhaDeAcesso(409,'Esta conta já é a responsável.');
                $stmt=$db->prepare('UPDATE invitation_groups SET responsible_account_id=?,invitation_token_hash=?,claimed_at=UTC_TIMESTAMP(),contact_phone=NULL,registration_receipt=NULL,registration_confirmed_at=NULL WHERE id=?');$stmt->execute([$target,$hash,$groupId]);
                $token=null;
            }
        }
        $stmt=$db->prepare("INSERT INTO audit_events(actor_account_id,action,entity_type,entity_id) VALUES (?,?,'invitation_group',?)");$stmt->execute([$accountId,$action,$groupId]);
        $db->commit();
        return ['ok'=>true,'group_id'=>$groupId,'token'=>$token];
    } catch(Throwable $e){if($db->inTransaction())$db->rollBack();throw $e;}
}
