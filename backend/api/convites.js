import {chamarOperacao,FalhaDaApi} from '../banco/ponte-hostgator.js';
import {exigirGateway,lerSessao,limitarUso,responderFalha} from '../autenticacao/sessao.js';
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 try{exigirGateway(req);if(req.method!=='POST')throw new FalhaDaApi(405,'Método não permitido.');const session=await lerSessao(req);await limitarUso(req,'convites',session.token);
 const result=await chamarOperacao('invitation.dispatch',session.token,req.body);return res.status(200).json(result);
 }catch(error){return responderFalha(res,error);}
}
