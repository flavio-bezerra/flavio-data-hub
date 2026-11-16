<?php
declare(strict_types=1);
// Instalar server/ como pasta irmã de public_html (fora da raiz pública).
$privateServer=dirname(__DIR__,3).'/server';
if(!is_file($privateServer.'/entrada-api.php')) {
    http_response_code(503);header('Content-Type: application/json; charset=utf-8');header('Cache-Control: no-store');
    echo json_encode(['ok'=>false,'message'=>'Serviço ainda não configurado.']);exit;
}
require_once $privateServer.'/autenticacao.php';
require_once $privateServer.'/entrada-api.php';
executarApi('auth');
