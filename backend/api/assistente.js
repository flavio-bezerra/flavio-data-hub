import {createHash} from 'node:crypto';
import {chamarOperacao,FalhaDaApi} from '../banco/ponte-hostgator.js';
import {exigirGateway,lerSessao,limitarUso,responderFalha} from '../autenticacao/sessao.js';
import {validarMensagens,responderOpenRouter} from '../assistente/openrouter.js';
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 try{
  exigirGateway(req);if(req.method!=='POST')throw new FalhaDaApi(405,'Método não permitido.');const session=await lerSessao(req);await limitarUso(req,'chat',session.token);
  const messages=validarMensagens(req.body.messages);const preview=req.body.preview_version;
  if(preview!==undefined&&(!Number.isSafeInteger(preview)||preview<1))throw new FalhaDaApi(422,'Versão inválida.');
  const {context}=await chamarOperacao('chat.context',session.token,preview===undefined?{}:{preview_version:preview});
  const contextKey=createHash('sha256').update(JSON.stringify(context)).digest('hex');
  // Ao mudar grupo, publicação ou logística, conversa anterior não é reenviada.
  if(messages.length>1&&req.body.context_key!==contextKey)return res.status(409).json({ok:false,code:'CONTEXT_CHANGED',message:'As informações mudaram. Inicie uma nova conversa.'});
  const result=await responderOpenRouter(context,messages);
  // Revalidar vínculo após chamada externa: revogação bloqueia a entrega da resposta.
  const fresh=await chamarOperacao('chat.context',session.token,preview===undefined?{}:{preview_version:preview});
  if(createHash('sha256').update(JSON.stringify(fresh.context)).digest('hex')!==contextKey)throw new FalhaDaApi(409,'As informações mudaram. Inicie uma nova conversa.');
  return res.status(200).json({...result,context_key:contextKey});
 }catch(error){return responderFalha(res,error);}
}
