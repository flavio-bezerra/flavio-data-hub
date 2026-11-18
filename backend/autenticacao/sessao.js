import {randomBytes, timingSafeEqual} from 'node:crypto';
import {chamarOperacao,FalhaDaApi} from '../banco/ponte-hostgator.js';
export const novoToken=()=>randomBytes(32).toString('hex');
export function compararSegredo(expected,received){
 if(typeof expected!=='string'||typeof received!=='string'||!expected||expected.length>4096||received.length>4096)return false;
 const a=Buffer.from(expected),b=Buffer.from(received);return a.length===b.length&&timingSafeEqual(a,b);
}
export function exigirGateway(req){
 if(process.env.ACCESS_ENABLED!=='true')throw new FalhaDaApi(503,'Acesso ainda não habilitado.');
 if(!compararSegredo(process.env.HOSTGATOR_BRIDGE_TOKEN,req.headers['x-gateway-token']))throw new FalhaDaApi(401,'Não autorizado.');
 if(!['GET','POST'].includes(req.method))throw new FalhaDaApi(405,'Método não permitido.');
 const origin=process.env.APP_ORIGIN||'https://casamento-flavio-victoria.com.br';
 if(req.method==='POST'&&req.headers['x-site-origin']!==origin)throw new FalhaDaApi(403,'Origem inválida.');
 const bucket=req.headers['x-client-bucket'];if(typeof bucket!=='string'||!/^[a-f0-9]{64}$/.test(bucket))throw new FalhaDaApi(403,'Origem do gateway inválida.');
 if(req.method==='POST'&&(!req.body||typeof req.body!=='object'||Array.isArray(req.body)||Buffer.byteLength(JSON.stringify(req.body))>49152))throw new FalhaDaApi(422,'Corpo inválido.');
}
export function tokenDaSessao(req){const token=req.headers['x-site-session'];return typeof token==='string'&&/^[a-f0-9]{64}$/.test(token)?token:'';}
export function escreverCookie(res,token){res.setHeader('Set-Cookie',`casamento_access=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=7200`);}
export async function lerSessao(req,{anonymous=false}={}){
 let token=tokenDaSessao(req);let result=await chamarOperacao('session.read',token);
 if(!result.session){
  if(!anonymous)throw new FalhaDaApi(401,'Entre novamente.');
  token=novoToken();result=await chamarOperacao('session.create','',{token,csrf:novoToken(),nonce:novoToken()});
 }
 const session=result.session;
 if(req.method==='POST'&&!compararSegredo(session.csrf,req.headers['x-site-csrf']))throw new FalhaDaApi(403,'Sessão inválida. Recarregue.');
 if(!anonymous&&!session.account)throw new FalhaDaApi(401,'Entre na sua conta.');
 return {token,...session};
}
export async function limitarUso(req,domain,token=''){await chamarOperacao('rate.limit',token,{domain},req.headers['x-client-bucket']);}
export function responderFalha(res,error){return res.status(error instanceof FalhaDaApi?error.status:503).json({ok:false,message:error instanceof FalhaDaApi?error.message:'Serviço indisponível. Tente mais tarde.'});}
