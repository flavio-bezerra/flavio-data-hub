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
function lerGrupo(PDO $db,int $accountId,int $groupId): array {
    $stmt=$db->prepare('SELECT id,label FROM invitation_groups WHERE id=? AND responsible_account_id=? AND revoked_at IS NULL');$stmt->execute([$groupId,$accountId]);$group=$stmt->fetch();
    if(!$group)throw new FalhaDeAcesso(404,'Convite indisponível.');
    $stmt=$db->prepare('SELECT id,display_name,is_minor,attendance,revision FROM guests WHERE invitation_group_id=? ORDER BY id');$stmt->execute([$groupId]);
    return ['group'=>$group,'guests'=>$stmt->fetchAll()];
}
function salvarConfirmacao(PDO $db,int $accountId,array $body): array {
    $groupId=filter_var($body['group_id']??null,FILTER_VALIDATE_INT,['options'=>['min_range'=>1]]);
    $responses=$body['responses']??null;
    if(!$groupId||!is_array($responses)||count($responses)>100)throw new FalhaDeAcesso(422,'Respostas inválidas.');
    $db->beginTransaction();
    try {
        $stmt=$db->query('SELECT response_deadline FROM event_settings WHERE id=1 FOR UPDATE');$settings=$stmt->fetch();
        if(!$settings)throw new RuntimeException('Configuração do evento ausente.');
        if($settings['response_deadline']!==null && strtotime($settings['response_deadline'].' UTC')<time())throw new FalhaDeAcesso(403,'Prazo de confirmação encerrado.');
        $stmt=$db->prepare('SELECT id FROM invitation_groups WHERE id=? AND responsible_account_id=? AND revoked_at IS NULL FOR UPDATE');$stmt->execute([$groupId,$accountId]);if(!$stmt->fetch())throw new FalhaDeAcesso(404,'Convite indisponível.');
        $seen=[];
        foreach($responses as $response){
            if(!is_array($response)||!isset($response['id'],$response['attendance'],$response['revision'])||!is_int($response['id'])||!is_int($response['revision'])||!in_array($response['attendance'],['yes','no'],true)||isset($seen[$response['id']]))throw new FalhaDeAcesso(422,'Respostas inválidas.');
            $seen[$response['id']]=true;
            $stmt=$db->prepare('UPDATE guests SET attendance=?,revision=revision+1,updated_by=?,updated_at=UTC_TIMESTAMP() WHERE id=? AND invitation_group_id=? AND revision=?');
            $stmt->execute([$response['attendance'],$accountId,$response['id'],$groupId,$response['revision']]);
            if($stmt->rowCount()!==1)throw new FalhaDeAcesso(409,'O cadastro mudou. Recarregue antes de salvar.');
        }
        $db->commit();return ['ok'=>true];
    }catch(Throwable $e){$db->rollBack();throw $e;}
}
