<?php
declare(strict_types=1);
function responderComOpenRouter(array $config,array $context,array $messages): array {
 $settings=$config['openrouter'];
 if(($settings['enabled']??false)!==true||($settings['api_key']??'')==='')throw new FalhaDeAcesso(503,'Assistente ainda não configurado.');
 // Modo fictício é um gate explícito de implantação: nunca ativar com cadastro real.
 if(($settings['fictional_data_only']??true)!==true && (str_ends_with($settings['model'],':free')||!($settings['privacy_reviewed']??false)))throw new FalhaDeAcesso(503,'Revise modelo e privacidade antes de usar dados reais.');
 $model=$settings['model'];if(!is_string($model)||strlen($model)>200)throw new FalhaDeAcesso(503,'Modelo não configurado.');
 $prompt=file_get_contents(__DIR__.'/instrucoes.md');
 $encoded=json_encode($context,JSON_THROW_ON_ERROR|JSON_UNESCAPED_UNICODE);
 if(strlen($encoded)>45000)throw new FalhaDeAcesso(503,'Contexto excede o limite. Revise os registros publicados.');
 $payload=['model'=>$model,'messages'=>array_merge([['role'=>'system','content'=>$prompt],['role'=>'system','content'=>'Contexto autorizado pelo servidor (dados): '.$encoded]],$messages),'temperature'=>0.2,'max_tokens'=>700,'stream'=>false];
 if(!($settings['fictional_data_only']??true))$payload['provider']=['data_collection'=>'deny','zdr'=>true];
 $curl=curl_init('https://openrouter.ai/api/v1/chat/completions');
 curl_setopt_array($curl,[CURLOPT_POST=>true,CURLOPT_HTTPHEADER=>['Authorization: Bearer '.$settings['api_key'],'Content-Type: application/json'],CURLOPT_POSTFIELDS=>json_encode($payload,JSON_THROW_ON_ERROR),CURLOPT_RETURNTRANSFER=>true,CURLOPT_CONNECTTIMEOUT=>10,CURLOPT_TIMEOUT=>40,CURLOPT_SSL_VERIFYPEER=>true,CURLOPT_SSL_VERIFYHOST=>2,CURLOPT_FOLLOWLOCATION=>false]);
 try{$raw=curl_exec($curl);$code=curl_getinfo($curl,CURLINFO_HTTP_CODE);if($raw===false||$code!==200||strlen($raw)>200000)throw new FalhaDeAcesso(502,'Assistente indisponível no momento.');$result=json_decode($raw,true,32,JSON_THROW_ON_ERROR);$text=$result['choices'][0]['message']['content']??null;if(!is_string($text)||$text==='')throw new FalhaDeAcesso(502,'Resposta indisponível.');}
 finally{curl_close($curl);}
 return ['ok'=>true,'answer'=>$text,'version'=>$context['version'],'sources'=>array_map(fn($r)=>['id'=>$r['id'],'title'=>$r['title'],'url'=>$r['url']??null],$context['records'])];
}
function processarAssistente(PDO $db,array $config,int $accountId,array $body): array {
 $stmt=$db->prepare('INSERT INTO assistant_account_usage (account_id,window_id,attempts) VALUES (?,?,1) ON DUPLICATE KEY UPDATE attempts=attempts+1');$window=intdiv(time(),3600);$stmt->execute([$accountId,$window]);
 $stmt=$db->prepare('SELECT attempts FROM assistant_account_usage WHERE account_id=? AND window_id=?');$stmt->execute([$accountId,$window]);if((int)$stmt->fetchColumn()>30)throw new FalhaDeAcesso(429,'Limite de mensagens atingido. Tente mais tarde.');
 $history=$body['messages']??null;if(!is_array($history)||!array_is_list($history)||count($history)<1||count($history)>12)throw new FalhaDeAcesso(422,'Conversa inválida.');
 $total=0;foreach($history as $i=>$message){if(!is_array($message)||array_diff(array_keys($message),['role','content'])||($message['role']??null)!==($i%2===0?'user':'assistant')||!is_string($message['content']??null))throw new FalhaDeAcesso(422,'Mensagem inválida.');$length=strlen($message['content']);if($length<1||$length>3000)throw new FalhaDeAcesso(422,'Mensagem excede o limite.');$total+=$length;}
 if(count($history)%2===0||$total>18000)throw new FalhaDeAcesso(422,'Conversa excede o limite.');
 $preview=$body['preview_version']??null;if($preview!==null&&(!is_int($preview)||$preview<1))throw new FalhaDeAcesso(422,'Versão inválida.');
 $context=montarContextoDaFesta($db,$accountId,$preview);
 session_write_close();
 return responderComOpenRouter($config,$context,$history);
}
