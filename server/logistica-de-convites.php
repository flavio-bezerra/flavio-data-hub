<?php
declare(strict_types=1);

function salvarLogisticaDoConvite(PDO $db,int $accountId,array $body): array {
    $id=$body['group_id']??null;
    $hotel=$body['hotel_name']??'';
    $lodging=$body['lodging_intent']??null;
    $transport=$body['arrival_mode']??null;
    $overrides=$body['overrides']??null;
    $modes=['undecided','car','app','van'];
    if(!is_int($id)||$id<1||!is_string($hotel)||mb_strlen($hotel)>160||preg_match('/[\p{C}]/u',$hotel)!==0||!in_array($lodging,['undecided','no','yes'],true)||!in_array($transport,$modes,true)||!is_array($overrides)||!array_is_list($overrides)||count($overrides)>100)throw new FalhaDeAcesso(422,'Revise hospedagem e transporte.');
    $db->beginTransaction();
    try {
        $stmt=$db->prepare('SELECT registration_receipt FROM invitation_groups WHERE id=? AND responsible_account_id=? AND revoked_at IS NULL FOR UPDATE');
        $stmt->execute([$id,$accountId]);$group=$stmt->fetch();
        if(!$group)throw new FalhaDeAcesso(404,'Convite indisponível.');
        $stmt=$db->prepare("SELECT id FROM guests WHERE invitation_group_id=? AND attendance='yes'");$stmt->execute([$id]);$presentes=array_map('intval',$stmt->fetchAll(PDO::FETCH_COLUMN));
        if($group['registration_receipt']===null||!$presentes)throw new FalhaDeAcesso(409,'Confirme a presença antes de informar a logística.');
        $vistos=[];
        foreach($overrides as $item){
            $guest=is_array($item)?($item['guest_id']??null):null;
            if(!is_int($guest)||!in_array($guest,$presentes,true)||isset($vistos[$guest])||!in_array($item['mode']??null,$modes,true))throw new FalhaDeAcesso(422,'Revise as exceções de transporte.');
            $vistos[$guest]=$item['mode'];
        }
        $db->prepare('UPDATE invitation_groups SET lodging_intent=?,hotel_name=?,arrival_mode=? WHERE id=?')->execute([$lodging,$lodging==='yes'&&trim($hotel)!==''?trim($hotel):null,$transport,$id]);
        $db->prepare('UPDATE guests SET arrival_override=NULL WHERE invitation_group_id=?')->execute([$id]);
        $stmt=$db->prepare('UPDATE guests SET arrival_override=? WHERE invitation_group_id=? AND id=?');
        foreach($vistos as $guest=>$mode)$stmt->execute([$mode,$id,$guest]);
        $db->commit();return ['ok'=>true];
    }catch(Throwable $e){if($db->inTransaction())$db->rollBack();throw $e;}
}

function administrarMesaDoConvite(PDO $db,int $actor,array $body): array {
    exigirAdministrador($db,$actor);
    $id=$body['group_id']??null;$mesa=$body['table_number']??null;$visivel=$body['table_visible']??null;
    if(!is_int($id)||$id<1||($mesa!==null&&(!is_int($mesa)||$mesa<1||$mesa>999))||!is_bool($visivel)||($visivel&&$mesa===null))throw new FalhaDeAcesso(422,'Informe uma mesa válida para divulgar.');
    $db->beginTransaction();
    try {
        $stmt=$db->prepare('SELECT id FROM invitation_groups WHERE id=? AND revoked_at IS NULL FOR UPDATE');$stmt->execute([$id]);
        if(!$stmt->fetchColumn())throw new FalhaDeAcesso(404,'Convite indisponível.');
        $db->prepare('UPDATE invitation_groups SET table_number=?,table_visible=? WHERE id=?')->execute([$mesa,(int)$visivel,$id]);
        $db->prepare("INSERT INTO audit_events(actor_account_id,action,entity_type,entity_id) VALUES (?,'update_table','invitation_group',?)")->execute([$actor,$id]);
        $db->commit();return ['ok'=>true];
    }catch(Throwable $e){if($db->inTransaction())$db->rollBack();throw $e;}
}

function resumirLogisticaDosConvites(PDO $db,int $actor): array {
    exigirAdministrador($db,$actor);
    $rows=$db->query("SELECT i.table_number,i.lodging_intent,i.hotel_name,COALESCE(g.arrival_override,i.arrival_mode) AS mode,COUNT(*) AS n FROM guests g JOIN invitation_groups i ON i.id=g.invitation_group_id WHERE i.revoked_at IS NULL AND i.registration_receipt IS NOT NULL AND g.attendance='yes' GROUP BY i.table_number,i.lodging_intent,i.hotel_name,COALESCE(g.arrival_override,i.arrival_mode)")->fetchAll();
    $modes=['car'=>0,'app'=>0,'van'=>0,'undecided'=>0];$hotels=[];$tables=[];$lodging=0;$unassigned=0;
    foreach($rows as $row){$n=(int)$row['n'];$modes[$row['mode']]+=$n;if($row['lodging_intent']==='yes'){$lodging+=$n;$hotel=$row['hotel_name']??'Hotel não informado';$hotels[$hotel]=($hotels[$hotel]??0)+$n;}if($row['table_number']===null)$unassigned+=$n;else {$mesa=(int)$row['table_number'];$tables[$mesa]=($tables[$mesa]??0)+$n;}}
    ksort($tables);arsort($hotels);
    return ['ok'=>true,'transport'=>$modes,'lodging'=>$lodging,'unassigned'=>$unassigned,'hotels'=>array_map(static fn($name,$count)=>['name'=>(string)$name,'count'=>$count],array_keys($hotels),array_values($hotels)),'tables'=>array_map(static fn($number,$count)=>['number'=>$number,'count'=>$count],array_keys($tables),array_values($tables))];
}
