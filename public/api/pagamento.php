<?php
declare(strict_types=1);
/**
 * Ponte same-origin do site (HostGator) para as funções de pagamento na Vercel.
 * Rotas: pix, boleto, cartao (POST) e status (GET).
 * O token do Asaas permanece apenas na Vercel; nada de segredo neste arquivo.
 * Espelha as regras de origem, método e tamanho de corpo de server/ponte/gateway.php.
 */
function respostaPagamento(int $status, array $dados) {
 http_response_code($status);header('Content-Type: application/json; charset=utf-8');header('Cache-Control: no-store');header('X-Content-Type-Options: nosniff');
 echo json_encode($dados,JSON_UNESCAPED_UNICODE);exit;
}
$rota=isset($_GET['rota'])&&is_string($_GET['rota'])?$_GET['rota']:'';
if(!in_array($rota,['pix','boleto','cartao','status'],true))respostaPagamento(404,['ok'=>false,'message'=>'Rota indisponível.']);
$metodo=$_SERVER['REQUEST_METHOD']??'GET';
$esperado=$rota==='status'?'GET':'POST';
if($metodo!==$esperado){header('Allow: '.$esperado);respostaPagamento(405,['ok'=>false,'message'=>'Método não permitido.']);}
$corpo='';
if($metodo==='POST'){
 $origem=$_SERVER['HTTP_ORIGIN']??'';
 $permitidas=['https://casamento-flavio-victoria.com.br','https://www.casamento-flavio-victoria.com.br'];
 if(!in_array($origem,$permitidas,true))respostaPagamento(403,['ok'=>false,'message'=>'Origem inválida.']);
 if(strtolower(explode(';',$_SERVER['CONTENT_TYPE']??'')[0])!=='application/json')respostaPagamento(415,['ok'=>false,'message'=>'Envie JSON.']);
 $corpo=file_get_contents('php://input',false,null,0,65537);
 if(strlen($corpo)>65536)respostaPagamento(413,['ok'=>false,'message'=>'Solicitação muito grande.']);
 if($corpo!==''&&json_decode($corpo)===null)respostaPagamento(422,['ok'=>false,'message'=>'Corpo inválido.']);
}
$query=$_GET;unset($query['rota']);
$alvo='https://flavio-data-hub-backend.vercel.app/api/pagamento/'.$rota;
if($query)$alvo.='?'.http_build_query($query,'','&');
$headers=['Accept: application/json'];if($metodo==='POST')$headers[]='Content-Type: application/json';
$curl=curl_init($alvo);
curl_setopt_array($curl,[CURLOPT_CUSTOMREQUEST=>$metodo,CURLOPT_HTTPHEADER=>$headers,CURLOPT_RETURNTRANSFER=>true,CURLOPT_CONNECTTIMEOUT=>10,CURLOPT_TIMEOUT=>60,CURLOPT_SSL_VERIFYPEER=>true,CURLOPT_SSL_VERIFYHOST=>2,CURLOPT_FOLLOWLOCATION=>false]);
if($metodo==='POST')curl_setopt($curl,CURLOPT_POSTFIELDS,$corpo);
$bruto=curl_exec($curl);$status=(int)curl_getinfo($curl,CURLINFO_HTTP_CODE);curl_close($curl);
if($bruto===false||$status<200||$status>=600||strlen($bruto)>300000)respostaPagamento(502,['ok'=>false,'message'=>'Pagamento indisponível no momento.']);
$payload=json_decode($bruto,true);
if(!is_array($payload))respostaPagamento(502,['ok'=>false,'message'=>'Pagamento indisponível no momento.']);
header('Content-Type: application/json; charset=utf-8');header('Cache-Control: no-store');header('X-Content-Type-Options: nosniff');
http_response_code($status);echo json_encode($payload,JSON_UNESCAPED_UNICODE);exit;
