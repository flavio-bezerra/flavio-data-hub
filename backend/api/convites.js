import {chamarOperacao,FalhaDaApi} from '../banco/ponte-hostgator.js';
import {exigirGateway,lerSessao,limitarUso,responderFalha} from '../autenticacao/sessao.js';
import {operarComunicados} from '../autenticacao/comunicados.js';
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 try{exigirGateway(req);if(req.method!=='POST')throw new FalhaDaApi(405,'Método não permitido.');const session=await lerSessao(req);await limitarUso(req,'convites',session.token);
 const action=req.body?.action;
 if(action==='admin_email_preview'||action==='admin_email_send')return res.status(200).json(await operarComunicados(session.token,req.body));
 if(typeof action==='string'&&action.startsWith('admin_email_'))throw new FalhaDaApi(400,'Ação indisponível.');
 const result=await chamarOperacao('invitation.dispatch',session.token,req.body);return res.status(200).json(result);
 }catch(error){return responderFalha(res,error);}
}
