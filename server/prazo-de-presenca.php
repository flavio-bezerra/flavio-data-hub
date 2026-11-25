<?php
declare(strict_types=1);

// O chamador já exige conta administrativa. Datas persistidas em UTC.
function administrarPrazoDePresenca(PDO $db, int $actor, array $body): array {
    $salvar=$body['action']==='admin_deadline_update';
    if($salvar)$db->beginTransaction();
    try {
        $row=$db->query('SELECT response_deadline,event_at,revision FROM event_settings WHERE id=1'.($salvar?' FOR UPDATE':''))->fetch();
        if(!$row)throw new FalhaDeAcesso(503,'Configurações do evento indisponíveis.');
        $sp=new DateTimeZone('America/Sao_Paulo');
        $utc=new DateTimeZone('UTC');
        $revision=(int)$row['revision'];
        $deadline=$row['response_deadline'];
        if($salvar){
            if(($body['revision']??null)!==$revision)throw new FalhaDeAcesso(409,'O prazo mudou. Recarregue antes de salvar.');
            $local=$body['deadline']??null;
            if(!array_key_exists('deadline',$body)||($local!==null&&(!is_string($local)||!preg_match('/^20[0-9]{2}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}$/D',$local))))throw new FalhaDeAcesso(422,'Informe um prazo válido.');
            if($local!==null){
                $date=DateTimeImmutable::createFromFormat('!Y-m-d\TH:i',$local,$sp);
                if(!$date||$date->format('Y-m-d\TH:i')!==$local)throw new FalhaDeAcesso(422,'Informe uma data e hora válidas.');
                $deadline=$date->setTimezone($utc)->format('Y-m-d H:i:s');
                if($deadline>$row['event_at'])throw new FalhaDeAcesso(422,'O prazo não pode ser posterior à cerimônia.');
            } else $deadline=null;
            $stmt=$db->prepare('UPDATE event_settings SET response_deadline=?,revision=revision+1 WHERE id=1');$stmt->execute([$deadline]);
            $stmt=$db->prepare("INSERT INTO audit_events(actor_account_id,action,entity_type,entity_id) VALUES (?,'change_response_deadline','event_settings',1)");$stmt->execute([$actor]);
            $db->commit();$revision++;
        }
        return ['ok'=>true,'revision'=>$revision,'deadline'=>$deadline===null?null:(new DateTimeImmutable($deadline,$utc))->setTimezone($sp)->format('Y-m-d\TH:i')];
    }catch(Throwable $e){if($salvar&&$db->inTransaction())$db->rollBack();throw $e;}
}
