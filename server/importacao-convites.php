<?php
declare(strict_types=1);

function importarConvites(PDO $db,int $actor,array $body): array {
    exigirAdministrador($db,$actor);
    $apply=$body['action']==='import_apply';
    if($apply)$db->beginTransaction();
    try {
        $rows=array_key_exists('csv',$body)?lerCsvDeConvites($body['csv']):$db->query('SELECT row_id,id_convite,grupo_familia,nome,id_pessoa FROM invitation_import_stage ORDER BY row_id LIMIT 251'.($apply?' FOR UPDATE':''))->fetchAll();
        if(count($rows)>250)throw new FalhaDeAcesso(422,'Limite de 250 pessoas por lote. Divida a lista sem separar famílias.');
        $groups=[];$invalid=[];
        foreach($rows as $row){
            $key=trim($row['id_convite']);$label=trim($row['grupo_familia']);$name=trim($row['nome']);$person=trim($row['id_pessoa']??'');
            if(!preg_match('/^[A-Za-z0-9._-]{1,80}$/D',$key)){$invalid[]=(int)$row['row_id'];continue;}
            $groups[$key]??=['id'=>$key,'label'=>$label,'names'=>[],'people'=>[],'names_seen'=>[],'issues'=>[]];
            $group=&$groups[$key];$folded=mb_strtolower($name,'UTF-8');
            if($label===''||$name===''||mb_strlen($label,'UTF-8')>160||mb_strlen($name,'UTF-8')>160||$label!==$group['label']||($person!==''&&!preg_match('/^[A-Za-z0-9._-]{1,80}$/D',$person)))$group['issues']['inconsistente']='Nome, grupo ou identificador inconsistente.';
            if(($person!==''&&isset($group['people'][$person]))||(isset($group['names_seen'][$folded])&&($person===''||$group['names_seen'][$folded]===false)))$group['issues']['duplicado']='Pessoa duplicada; para homônimos use IDs de pessoa distintos.';
            if($person!=='')$group['people'][$person]=true;
            $group['names_seen'][$folded]=($group['names_seen'][$folded]??true)&&$person!=='';
            $group['names'][]=[$person,$name];unset($group);
        }
        $find=$db->prepare('SELECT import_fingerprint FROM invitation_groups WHERE external_invitation_id=?');
        $preview=[];$new=[];
        foreach($groups as $group){
            sort($group['names']);
            $fingerprint=hash('sha256',json_encode([$group['label'],$group['names']],JSON_THROW_ON_ERROR));
            $find->execute([$group['id']]);$existing=$find->fetch();
            if(count($group['names'])>100)$group['issues']['limite']='Acima de 100 pessoas no grupo.';
            $status=$group['issues']?'invalid':($existing?($existing['import_fingerprint']===$fingerprint?'unchanged':'conflict'):'new');
            $preview[]=['id'=>$group['id'],'label'=>$group['label'],'count'=>count($group['names']),'status'=>$status,'issues'=>array_values($group['issues'])];
            if($status==='new')$new[]=[$group,$fingerprint];
        }
        $digest=hash('sha256',json_encode([$rows,$preview],JSON_THROW_ON_ERROR));
        if(!$apply)return ['ok'=>true,'groups'=>$preview,'invalid_rows'=>$invalid,'digest'=>$digest];
        if(!is_string($body['digest']??null)||!hash_equals($digest,$body['digest']))throw new FalhaDeAcesso(409,'A lista mudou. Atualize a prévia.');
        $insertGroup=$db->prepare('INSERT INTO invitation_groups(label,invitation_token_hash,external_invitation_id,import_fingerprint) VALUES (?,?,?,?)');
        $insertGuest=$db->prepare('INSERT INTO guests(invitation_group_id,display_name) VALUES (?,?)');
        $audit=$db->prepare("INSERT INTO audit_events(actor_account_id,action,entity_type,entity_id) VALUES (?,'import_invitation','invitation_group',?)");
        foreach($new as [$group,$fingerprint]){
            // O token inicial não é entregue; o painel emite o link quando solicitado.
            $insertGroup->execute([$group['label'],hash('sha256',random_bytes(32)),$group['id'],$fingerprint]);$id=(int)$db->lastInsertId();
            foreach($group['names'] as [, $name])$insertGuest->execute([$id,$name]);
            $audit->execute([$actor,$id]);
        }
        $db->commit();return ['ok'=>true,'created'=>count($new)];
    }catch(PDOException $e){
        if($apply&&$db->inTransaction())$db->rollBack();
        if($apply&&($e->errorInfo[1]??null)===1062)throw new FalhaDeAcesso(409,'Outro lote já importou um destes grupos. Atualize a prévia.');
        throw $e;
    }catch(Throwable $e){if($apply&&$db->inTransaction())$db->rollBack();throw $e;}
}

function lerCsvDeConvites(mixed $csv): array {
    if(!is_string($csv)||strlen($csv)>16384||!mb_check_encoding($csv,'UTF-8')||preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F]/',$csv))throw new FalhaDeAcesso(422,'Use um CSV UTF-8 de até 16 KiB.');
    $csv=preg_replace('/^\xEF\xBB\xBF/','',$csv);
    $lines=preg_split('/\r\n|\n|\r/',$csv);
    $header=array_shift($lines);
    $delimiter=str_contains($header,';')?';':',';
    $columns=array_map('trim',str_getcsv($header,$delimiter,'"',''));
    $mandatory=['id_convite','grupo_familia','nome'];
    if($columns!==$mandatory&&$columns!==[...$mandatory,'id_pessoa'])throw new FalhaDeAcesso(422,'Use as colunas do modelo: id_convite, grupo_familia, nome e id_pessoa opcional.');
    $cell='(?:"(?:[^"\r\n]|"")*"|[^"'.$delimiter.'\r\n]*)';
    $pattern='/^'.$cell.'(?:'.$delimiter.$cell.')*$/D';
    $rows=[];
    foreach($lines as $i=>$line){
        if(trim($line)==='')continue;
        $number=$i+2;
        if(!preg_match($pattern,$line))throw new FalhaDeAcesso(422,"CSV inválido na linha $number. Não use quebras de linha dentro dos campos.");
        $cells=str_getcsv($line,$delimiter,'"','');
        if(count($cells)!==count($columns))throw new FalhaDeAcesso(422,"Número de colunas incorreto na linha $number.");
        $rows[]=['row_id'=>$number]+array_combine($columns,$cells);
        if(count($rows)>250)throw new FalhaDeAcesso(422,'Limite de 250 pessoas por lote. Divida a lista sem separar famílias.');
    }
    if(!$rows)throw new FalhaDeAcesso(422,'O arquivo não contém convidados.');
    return $rows;
}
