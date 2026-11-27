<?php
declare(strict_types=1);
if(PHP_SAPI!=='cli')exit(1);
$acao=$argv[1]??'';
if(!in_array($acao,['--confirmar','--gerar-link-de-configuracao'],true)) { fwrite(STDERR,"Use --confirmar após configurar email privado de uma conta já verificada.
");exit(1); }
$private='/home2/hg8dcc78/casamento-private';
$config=require '/home2/hg8dcc78/public_html/server/application.php';
$environment=$config['access_environment']??'event';
if($environment!=='event')throw new RuntimeException('Bootstrap administrativo disponível somente no ambiente do evento.');
$database=require $private.'/database.php';
$db=new PDO(sprintf('mysql:host=%s;port=%d;dbname=%s;charset=%s',$database['host'],(int)$database['port'],$database['database'],$database['charset']),$database['username'],$database['password'],[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
$email=strtolower(trim((string)($config['bootstrap_admin_email']??'')));
if($email===''&&PHP_SAPI==='cli'){
    fwrite(STDERR,"E-mail verificado do administrador (entrada nao armazenada no repositorio): ");
    $entrada=fgets(STDIN);
    if($entrada!==false)$email=strtolower(trim($entrada));
}
if(!filter_var($email,FILTER_VALIDATE_EMAIL))throw new RuntimeException('Configuração privada inválida.');
$db->beginTransaction();
try {
    $db->query('SELECT id FROM event_settings WHERE id=1 FOR UPDATE')->fetch();
    if((int)$db->query('SELECT COUNT(*) FROM administrators')->fetchColumn()!==0)throw new RuntimeException('Bootstrap já encerrado. Use administração autenticada.');
    $label='[Interno] Configuração inicial da organização';
    if($acao==='--gerar-link-de-configuracao'){
        $revoke=$db->prepare('UPDATE invitation_groups SET revoked_at=UTC_TIMESTAMP() WHERE label=? AND revoked_at IS NULL');$revoke->execute([$label]);
        $token=bin2hex(random_bytes(32));
        $insert=$db->prepare('INSERT INTO invitation_groups(label,invitation_token_hash) VALUES (?,?)');$insert->execute([$label,hash('sha256',$token)]);
        $db->commit();echo '/meu-convite#codigo='.$token.PHP_EOL;exit(0);
    }
    $stmt=$db->prepare('SELECT id FROM accounts WHERE email=? AND email_verified_at IS NOT NULL AND disabled_at IS NULL');$stmt->execute([$email]);$accountId=$stmt->fetchColumn();
    if(!$accountId)throw new RuntimeException('Cadastre e verifique a conta antes do bootstrap.');
    $stmt=$db->prepare('INSERT INTO administrators (account_id,can_manage_administrators,can_read_food_data) VALUES (?,1,0)');$stmt->execute([$accountId]);
    if($environment==='event'){$revoke=$db->prepare('UPDATE invitation_groups SET revoked_at=UTC_TIMESTAMP() WHERE label=? AND revoked_at IS NULL');$revoke->execute([$label]);}
    $db->commit();echo "Administrador inicial configurado.
";
}catch(Throwable $e){$db->rollBack();throw $e;}
