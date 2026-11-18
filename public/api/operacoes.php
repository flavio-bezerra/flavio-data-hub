<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');header('Cache-Control: no-store');header('X-Content-Type-Options: nosniff');
try{
 $private='/home2/hg8dcc78/casamento-private';$bridge=require $private.'/bridge.php';
 $received=$_SERVER['HTTP_X_BRIDGE_TOKEN']??'';
 if(!is_string($bridge['token']??null)||strlen($bridge['token'])<32||!is_string($received)||!hash_equals($bridge['token'],$received)){http_response_code(401);echo json_encode(['ok'=>false,'message'=>'Não autorizado.']);exit;}
 if(($_SERVER['REQUEST_METHOD']??'')!=='POST'){http_response_code(405);echo json_encode(['ok'=>false,'message'=>'Método não permitido.']);exit;}
 $settings=require $private.'/application.php';if(($settings['access_enabled']??false)!==true)throw new RuntimeException('disabled');
 require_once $private.'/server/ponte/operacoes.php';executarOperacoesDaPonte($private);
}catch(Throwable){http_response_code(503);echo json_encode(['ok'=>false,'message'=>'Ponte indisponível.']);}
