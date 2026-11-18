import nodemailer from 'nodemailer';
import {FalhaDaApi} from '../banco/ponte-hostgator.js';
export function exigirSmtp(){if(!process.env.SMTP_HOST||!process.env.SMTP_USER||!process.env.SMTP_PASSWORD||!process.env.EMAIL_FROM)throw new FalhaDaApi(503,'Envio de e-mail ainda não configurado.');}
export async function enviarLink(email,purpose,token){
 exigirSmtp();const origin=process.env.APP_ORIGIN||'https://casamento-flavio-victoria.com.br';
 const link=origin+'/acesso#'+new URLSearchParams({action:purpose,token});
 const transport=nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||465),secure:process.env.SMTP_SECURE!=='false',auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD},requireTLS:true,tls:{rejectUnauthorized:true},connectionTimeout:10000,socketTimeout:15000});
 try{await transport.sendMail({from:process.env.EMAIL_FROM,to:email,subject:purpose==='verify_email'?'Verifique seu acesso ao casamento':'Recupere seu acesso ao casamento',text:`Use o link abaixo em até 30 minutos. Se não solicitou, ignore.

${link}`});}finally{transport.close();}
}
