<?php
declare(strict_types=1);
function enviarLinkDeConta(array $config,string $email,string $purpose,string $token): void {
    $mail=new PHPMailer\PHPMailer\PHPMailer(true);
    $mail->isSMTP();$mail->Host=$config['smtp']['host'];$mail->Port=$config['smtp']['port'];
    $mail->SMTPAuth=true;$mail->Username=$config['smtp']['username'];$mail->Password=$config['smtp']['password'];
    $mail->SMTPSecure=PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mail->CharSet='UTF-8';$mail->Timeout=15;
    $mail->setFrom($config['smtp']['from_email'],$config['smtp']['from_name']);$mail->addAddress($email);
    $mail->Subject=$purpose==='verify_email'?'Verifique seu e-mail':'Recupere seu acesso';
    $mail->Body="Acesse o link em até 30 minutos:
".$config['app_origin'].'/acesso#'.http_build_query(['action'=>$purpose,'token'=>$token]);
    $mail->send();
}
