import {readFile} from 'node:fs/promises';
import {FalhaDaApi} from '../banco/ponte-hostgator.js';
export function validarMensagens(messages){
 if(!Array.isArray(messages)||messages.length<1||messages.length>11||messages.length%2===0)throw new FalhaDaApi(422,'Conversa inválida.');
 let total=0;for(const [i,m] of messages.entries()){
  if(!m||Object.keys(m).some(k=>!['role','content'].includes(k))||m.role!==(i%2===0?'user':'assistant')||typeof m.content!=='string'||!m.content.trim()||Buffer.byteLength(m.content)>5000)throw new FalhaDaApi(422,'Mensagem inválida.');total+=Buffer.byteLength(m.content);
 }
 if(total>18000)throw new FalhaDaApi(422,'Conversa excede o limite.');
 return messages;
}
export async function responderOpenRouter(context,messages){
 const key=process.env.OPENROUTER_API_KEY||process.env.OPENROUTE_SERVICE_TOKEN;
 if(process.env.ASSISTANT_ENABLED!=='true'||!key)throw new FalhaDaApi(503,'Assistente ainda não configurado.');
 const model=process.env.OPENROUTER_MODEL||'nvidia/nemotron-3.5-lightning:free';const fictional=process.env.ASSISTANT_FICTIONAL_DATA_ONLY!=='false';
 if(!fictional&&(model.endsWith(':free')||process.env.ASSISTANT_PRIVACY_REVIEWED!=='true'))throw new FalhaDaApi(503,'Revise modelo e privacidade antes de usar dados reais.');
 const encoded=JSON.stringify(context);if(Buffer.byteLength(encoded)>45000)throw new FalhaDaApi(503,'Contexto excede o limite.');
 const instructions=await readFile(new URL('./instrucoes.md',import.meta.url),'utf8');
 const payload={model,messages:[{role:'system',content:instructions},{role:'system',content:'Contexto autorizado (dados): '+encoded},...messages],temperature:0.2,max_tokens:700,stream:false};
 if(!fictional)payload.provider={data_collection:'deny',zdr:true};
 const response=await fetch('https://openrouter.ai/api/v1/chat/completions',{method:'POST',headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(40000),redirect:'error'});
 if(!response.ok)throw new FalhaDaApi(502,'Assistente indisponível no momento.');
 const raw=await response.text();if(Buffer.byteLength(raw)>200000)throw new FalhaDaApi(502,'Resposta excede o limite.');const result=JSON.parse(raw);const answer=result.choices?.[0]?.message?.content;
 if(typeof answer!=='string'||!answer)throw new FalhaDaApi(502,'Resposta indisponível.');
 return {ok:true,answer,version:context.version,sources:context.records.map(r=>({id:r.id,title:r.title,url:r.url||null}))};
}
