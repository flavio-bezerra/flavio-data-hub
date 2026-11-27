<?php
declare(strict_types=1);
header('Cache-Control: no-store');
$gateway='/home2/hg8dcc78/public_html/server/ponte/gateway.php';
if(!is_file($gateway)){http_response_code(503);header('Content-Type: application/json; charset=utf-8');echo json_encode(['ok'=>false,'message'=>'Gateway ainda não configurado.']);exit;}
require_once $gateway;executarGatewayVercel('convites');
