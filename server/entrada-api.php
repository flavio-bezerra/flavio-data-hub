<?php
declare(strict_types=1);
function executarApi(string $domain): never {
    header('Content-Type: application/json; charset=utf-8');header('Cache-Control: no-store');header('X-Content-Type-Options: nosniff');
    try {
        throw new FalhaDeAcesso(503,'Endpoint PHP de acesso substituído pelo gateway Vercel.');
        $config=require __DIR__.'/config.private.php';
        if(($config['registration_enabled']??false)!==true)throw new FalhaDeAcesso(503,'Cadastro ainda não habilitado.');
        if(strlen((string)($config['rate_limit_key']??''))<32)throw new FalhaDeAcesso(503,'Configuração privada incompleta.');
        if(!is_file(__DIR__.'/vendor/autoload.php'))throw new FalhaDeAcesso(503,'Serviço ainda em configuração.');
        require_once __DIR__.'/vendor/autoload.php';require_once __DIR__.'/banco.php';require_once __DIR__.'/email.php';require_once __DIR__.'/convites.php';require_once __DIR__.'/administracao.php';
        require_once __DIR__.'/assistente/contexto-da-festa.php';require_once __DIR__.'/assistente/openrouter.php';require_once __DIR__.'/assistente/administracao-memoria.php';require_once __DIR__.'/assistente/administracao-contexto.php';
        iniciarSessao($config);$db=conectarBanco($config);
        if($domain==='auth' && $_SERVER['REQUEST_METHOD']==='GET'){
            $account=null;
            if(isset($_SESSION['account_id'])){try{$row=exigirConta($db);$stmt=$db->prepare('SELECT account_id FROM administrators WHERE account_id=?');$stmt->execute([$row['id']]);$account=['id'=>(int)$row['id'],'name'=>$row['display_name'],'administrator'=>(bool)$stmt->fetchColumn()];}catch(FalhaDeAcesso){$account=null;}}
            $result=['ok'=>true,'account'=>$account,'csrf'=>$_SESSION['csrf'],'google_client_id'=>$config['google_client_id'],'google_nonce'=>$_SESSION['google_nonce']];
        }else {
            $body=validarMutacao($config);
            if($domain==='auth')$result=processarAutenticacao($db,$config,$body);
            else {
                $account=exigirConta($db);limitarTentativas($db,$config,$domain);
                if($domain==='convites' && ($body['action']??'')==='claim')$result=vincularConvite($db,(int)$account['id'],(string)($body['token']??''));
                elseif($domain==='convites' && ($body['action']??'')==='read')$result=lerGrupo($db,(int)$account['id'],(int)($body['group_id']??0));
                elseif($domain==='assistente')$result=processarAssistente($db,$config,(int)$account['id'],$body);
                elseif($domain==='memoria')$result=administrarMemoria($db,(int)$account['id'],$body);
                elseif($domain==='contexto')$result=administrarContexto($db,(int)$account['id'],$body);
                elseif($domain==='confirmacoes')$result=salvarConfirmacao($db,(int)$account['id'],$body);
                else throw new FalhaDeAcesso(400,'Ação indisponível.');
            }
        }
        echo json_encode($result,JSON_THROW_ON_ERROR|JSON_UNESCAPED_UNICODE);
    }catch(FalhaDeAcesso $e){http_response_code($e->status);echo json_encode(['ok'=>false,'message'=>$e->getMessage()]);}
    catch(Throwable){http_response_code(503);echo json_encode(['ok'=>false,'message'=>'Serviço indisponível. Tente mais tarde.']);}
    exit;
}
