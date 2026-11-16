<?php
declare(strict_types=1);
if(PHP_SAPI!=='cli')exit(1);
if(($argv[1]??'')!=='--confirmar') { fwrite(STDERR,"Use --confirmar após configurar email privado de uma conta já verificada.
");exit(1); }
$config=require __DIR__.'/config.private.php';
require __DIR__.'/banco.php';
$db=conectarBanco($config);
$email=strtolower(trim($config['bootstrap_admin_email']));
if(!filter_var($email,FILTER_VALIDATE_EMAIL))throw new RuntimeException('Configuração privada inválida.');
$db->beginTransaction();
try {
    $db->query('SELECT id FROM event_settings WHERE id=1 FOR UPDATE')->fetch();
    if((int)$db->query('SELECT COUNT(*) FROM administrators')->fetchColumn()!==0)throw new RuntimeException('Bootstrap já encerrado. Use administração autenticada.');
    $stmt=$db->prepare('SELECT id FROM accounts WHERE email=? AND email_verified_at IS NOT NULL AND disabled_at IS NULL');$stmt->execute([$email]);$accountId=$stmt->fetchColumn();
    if(!$accountId)throw new RuntimeException('Cadastre e verifique a conta antes do bootstrap.');
    $stmt=$db->prepare('INSERT INTO administrators (account_id,can_manage_administrators,can_read_food_data) VALUES (?,1,1)');$stmt->execute([$accountId]);
    $db->commit();echo "Administrador inicial configurado.
";
}catch(Throwable $e){$db->rollBack();throw $e;}
