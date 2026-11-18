import {scrypt as scryptCallback,randomBytes,timingSafeEqual} from 'node:crypto';
import {promisify} from 'node:util';
import bcrypt from 'bcryptjs';
import {chamarOperacao,FalhaDaApi} from '../banco/ponte-hostgator.js';
import {exigirGateway,lerSessao,escreverCookie,novoToken,limitarUso,responderFalha} from '../autenticacao/sessao.js';
import {verificarGoogle} from '../autenticacao/google.js';
import {exigirSmtp,enviarLink} from '../autenticacao/email.js';
const scrypt=promisify(scryptCallback);
export async function hashSenha(password){const salt=randomBytes(16).toString('hex');const key=await scrypt(password,salt,64);return 'scrypt$'+salt+'$'+key.toString('hex');}
export async function conferirSenha(password,hash){
 if(typeof password!=='string'||Buffer.byteLength(password)>128)return false;
 if(typeof hash==='string'&&/^\$2[aby]\$/.test(hash))return bcrypt.compare(password,hash.replace(/^\$2y\$/,'$2b$'));
 const parts=typeof hash==='string'?hash.split('$'):[];
 const valid=parts.length===3&&parts[0]==='scrypt'&&/^[a-f0-9]{32}$/.test(parts[1])&&/^[a-f0-9]{128}$/.test(parts[2]);
 const key=await scrypt(password,valid?parts[1]:'00000000000000000000000000000000',64);
 return valid&&timingSafeEqual(key,Buffer.from(parts[2],'hex'));
}
function validarEmail(value){if(typeof value!=='string'||value.length>254||!/^\S+@[^@\s]+\.[^@\s]+$/.test(value))throw new FalhaDaApi(422,'Informe um e-mail válido.');return value.trim().toLowerCase();}
function validarSenha(value){if(typeof value!=='string'||Buffer.byteLength(value)<12||Buffer.byteLength(value)>128)throw new FalhaDaApi(422,'Use uma senha entre 12 e 128 bytes.');return value;}
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 try{
  exigirGateway(req);await limitarUso(req,'auth');const session=await lerSessao(req,{anonymous:true});
  if(req.method==='GET'){escreverCookie(res,session.token);return res.status(200).json({ok:true,account:session.account,csrf:session.csrf,google_nonce:session.nonce,google_client_id:process.env.GOOGLE_CLIENT_ID||''});}
  const body=req.body;let account=null;
  if(body.action==='logout'){await chamarOperacao('session.revoke',session.token);escreverCookie(res,'');return res.status(200).json({ok:true});}
  if(body.action==='login'){
   const result=await chamarOperacao('account.lookup',session.token,{email:validarEmail(body.email)});
   const valid=await conferirSenha(body.password,result.account?.password_hash);
   if(!valid||!result.account||result.account.disabled_at)throw new FalhaDaApi(401,'E-mail ou senha inválidos.');
   if(!result.account.email_verified_at)throw new FalhaDaApi(403,'Verifique seu e-mail para entrar.');
   account=result.account;
  }else if(body.action==='google'){
   const claims=await verificarGoogle(body.credential,session.nonce);
   const result=await chamarOperacao('account.google',session.token,{subject:claims.subject,email:validarEmail(claims.email),name:claims.name.slice(0,160)});account=result.account;
  }else if(['register','reset_request'].includes(body.action)){
   exigirSmtp();const email=validarEmail(body.email);let result;
   if(body.action==='register'){
    validarSenha(body.password);if(typeof body.name!=='string'||body.name.trim().length<2||Buffer.byteLength(body.name)>160)throw new FalhaDaApi(422,'Informe seu nome.');
    result=await chamarOperacao('account.register',session.token,{email,name:body.name.trim(),password_hash:await hashSenha(body.password)});
   }else result=await chamarOperacao('account.lookup',session.token,{email});
   const purpose=body.action==='register'?'verify_email':'reset_password';
   if(result.account&&!result.account.disabled_at&&(purpose==='reset_password'||!result.account.email_verified_at)){
    const token=novoToken();await chamarOperacao('account.token',session.token,{account_id:Number(result.account.id),purpose,token});await enviarLink(email,purpose,token);
   }
   return res.status(200).json({ok:true,message:'Se aplicável, você receberá um link por e-mail.'});
  }else if(['verify_email','reset_password'].includes(body.action)){
   if(typeof body.token!=='string'||!/^[a-f0-9]{64}$/.test(body.token))throw new FalhaDaApi(400,'Link inválido.');
   const payload={purpose:body.action,token:body.token};if(body.action==='reset_password')payload.password_hash=await hashSenha(validarSenha(body.password));
   await chamarOperacao('account.consume_token',session.token,payload);return res.status(200).json({ok:true});
  }else throw new FalhaDaApi(400,'Ação indisponível.');
  const token=novoToken();await chamarOperacao('session.rotate',session.token,{token,csrf:novoToken(),nonce:novoToken(),account_id:Number(account.id),session_version:Number(account.session_version)});
  escreverCookie(res,token);return res.status(200).json({ok:true});
 }catch(error){return responderFalha(res,error);}
}
