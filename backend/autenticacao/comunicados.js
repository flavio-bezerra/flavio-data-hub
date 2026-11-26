import { createHash } from 'node:crypto';
import { chamarOperacao, FalhaDaApi } from '../banco/ponte-hostgator.js';
import { criarTransporteSmtp } from './email.js';
import { montarComunicado } from './modelo-de-comunicado.js';

export async function operarComunicados(token, body) {
  const { template, audience } = body;
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
  if (message.length > 3000 || subject.length > 140 || /[\x00-\x1f\x7f]/.test(subject) || (template === 'message' && !subject) || (['message','hotel','van','guide','thanks'].includes(template) && !message)) throw new FalhaDaApi(422,'Revise o assunto e a mensagem.');
  const origin = new URL(process.env.APP_ORIGIN || 'https://casamento-flavio-victoria.com.br');
  if (origin.protocol !== 'https:') throw new FalhaDaApi(503,'Configure a URL HTTPS do site.');
  const { recipients, skipped } = await chamarOperacao('invitation.dispatch', token, { action:'admin_email_prepare', template, audience, group_ids:body.group_ids });
  const modelo = { template, subject, message };
  const sample = recipients.find(r => r.group_id === body.preview_group_id) || recipients[0] || {label:'Família Exemplo',table_number:12};
  const fingerprint = createHash('sha256').update(JSON.stringify([origin.origin,modelo,audience,recipients,skipped])).digest('hex');
  const habilitado = process.env.EVENT_EMAIL_SEND_ENABLED === 'true';
  if (body.action === 'admin_email_preview') return { ok:true, preview:montarComunicado(modelo,sample,origin.origin), skipped, recipients:recipients.map(({group_id,label,table_number})=>({group_id,label,table_number})), fingerprint, enabled:habilitado };
  if (!habilitado) throw new FalhaDaApi(503,'Envio de comunicados desabilitado.');
  if (!recipients.length || body.fingerprint !== fingerprint) throw new FalhaDaApi(409,'Destinatários ou conteúdo mudaram. Gere uma nova prévia.');
  const after = body.offset ?? 0;
  if (!Number.isInteger(after) || after<0 || after>=recipients.length || after%5!==0) throw new FalhaDaApi(422,'Posição do lote inválida.');
  const lote = recipients.slice(after, after+5);
  const transport = criarTransporteSmtp();
  const registro = (phase,count) => chamarOperacao('invitation.dispatch',token,{action:'admin_email_record',phase,count,dispatch_id:body.dispatch_id});
  const result = [];
  try {
    await registro('reserve',lote.length);
    for(const destinatario of lote){
      try {
        const status = await transport.sendMail({from:process.env.EMAIL_FROM,to:destinatario.email,...montarComunicado(modelo,destinatario,origin.origin)});
        result.push({group_id:destinatario.group_id,label:destinatario.label,status:status.accepted?.length?'accepted':'unknown'});
      } catch { result.push({group_id:destinatario.group_id,label:destinatario.label,status:'unknown'}); break; }
    }
    await registro('finish',result.filter(r=>r.status==='accepted').length);
    return {ok:true, results:result, next:result.length===lote.length && result.every(r=>r.status==='accepted') && after+lote.length<recipients.length ? after+lote.length : null};
  } finally {transport.close();}
}
