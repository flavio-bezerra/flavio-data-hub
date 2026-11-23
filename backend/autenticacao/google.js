import {OAuth2Client} from 'google-auth-library';
import {FalhaDaApi} from '../banco/ponte-hostgator.js';
export async function verificarGoogle(credential,nonce){
 const audience=process.env.GOOGLE_CLIENT_ID;
 if(!audience)throw new FalhaDaApi(503,'Google ainda não configurado.');
 if(typeof credential!=='string'||credential.length>12000)throw new FalhaDaApi(422,'Credencial inválida.');
 try{
  const ticket=await new OAuth2Client(audience).verifyIdToken({idToken:credential,audience});const claims=ticket.getPayload();
  if(!claims||!claims.sub||claims.nonce!==nonce||claims.email_verified!==true||!['accounts.google.com','https://accounts.google.com'].includes(claims.iss))throw Error('claims');
  return {subject:claims.sub,email:claims.email,name:claims.name||'Convidado',hostedDomain:typeof claims.hd==='string'?claims.hd:''};
 }catch{throw new FalhaDaApi(401,'Não foi possível verificar o acesso Google.');}
}
