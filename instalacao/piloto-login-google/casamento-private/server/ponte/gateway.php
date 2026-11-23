<?php
declare(strict_types=1);
function executarGatewayVercel(string $domain): never {
 header('Content-Type: application/json; charset=utf-8');header('Cache-Control: no-store');header('X-Content-Type-Options: nosniff');
 try{
  if(!in_array($domain,['auth','assistente','memoria','contexto','convites','confirmacoes'],true))throw new RuntimeException('route');
  $private='/home2/hg8dcc78/casamento-private';$settings=require $private.'/application.php';$bridge=require $private.'/bridge.php';
  if(($settings['gateway_enabled']??false)!==true||!is_string($bridge['token']??null)||strlen($bridge['token'])<32)throw new RuntimeException('configuration');
  $method=$_SERVER['REQUEST_METHOD']??'';if(!in_array($method,['GET','POST'],true)||($method==='GET'&&$domain!=='auth')){http_response_code(405);echo json_encode(['ok'=>false,'message'=>'Método não permitido.']);exit;}
  $origin=$_SERVER['HTTP_ORIGIN']??'';
  if($method==='POST'&&$origin!=='https://casamento-flavio-victoria.com.br'){http_response_code(403);echo json_encode(['ok'=>false,'message'=>'Origem inválida.']);exit;}
  $body=$method==='POST'?file_get_contents('php://input',false,null,0,49153):'';
  if(strlen($body)>49152){http_response_code(413);echo json_encode(['ok'=>false,'message'=>'Solicitação muito grande.']);exit;}
  if($method==='POST'&&strtolower(explode(';',$_SERVER['CONTENT_TYPE']??'')[0])!=='application/json'){http_response_code(415);echo json_encode(['ok'=>false,'message'=>'Envie JSON.']);exit;}
  $session=$_COOKIE['casamento_access']??'';$csrf=$_SERVER['HTTP_X_CSRF_TOKEN']??'';
  if(!preg_match('/^[a-f0-9]{64}$/D',$session))$session='';if(!preg_match('/^[a-f0-9]{64}$/D',$csrf))$csrf='';
  $headers=['Accept: application/json','Content-Type: application/json','X-Gateway-Token: '.$bridge['token'],'X-Site-Origin: '.$origin,'X-Site-Session: '.$session,'X-Site-CSRF: '.$csrf,'X-Client-Bucket: '.hash_hmac('sha256',$_SERVER['REMOTE_ADDR']??'',$bridge['token'])];
  $cookie=null;$curl=curl_init('https://flavio-data-hub-backend.vercel.app/api/'.$domain);
  curl_setopt_array($curl,[CURLOPT_CUSTOMREQUEST=>$method,CURLOPT_HTTPHEADER=>$headers,CURLOPT_RETURNTRANSFER=>true,CURLOPT_CONNECTTIMEOUT=>10,CURLOPT_TIMEOUT=>60,CURLOPT_SSL_VERIFYPEER=>true,CURLOPT_SSL_VERIFYHOST=>2,CURLOPT_FOLLOWLOCATION=>false,CURLOPT_HEADERFUNCTION=>function($ch,$line)use(&$cookie){if(preg_match('/^Set-Cookie:\s*(casamento_access=(?:[a-f0-9]{64})?; Path=\/; HttpOnly; Secure; SameSite=Lax; Max-Age=7200)\s*$/i',$line,$m))$cookie=$m[1];return strlen($line);}]);
  if($method==='POST')curl_setopt($curl,CURLOPT_POSTFIELDS,$body);
  try{$raw=curl_exec($curl);$status=curl_getinfo($curl,CURLINFO_HTTP_CODE);if($raw===false||$status<200||$status>=600||strlen($raw)>300000)throw new RuntimeException('upstream');$payload=json_decode($raw,true,32,JSON_THROW_ON_ERROR);if(!is_array($payload)||!array_key_exists('ok',$payload))throw new RuntimeException('payload');}
  finally{curl_close($curl);}
  if($cookie!==null)header('Set-Cookie: '.$cookie,false);http_response_code($status);echo json_encode($payload,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR);
 }catch(Throwable){http_response_code(503);echo json_encode(['ok'=>false,'message'=>'Serviço ainda não configurado ou indisponível.']);}
 exit;
}
