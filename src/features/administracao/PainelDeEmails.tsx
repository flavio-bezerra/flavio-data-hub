import { useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import useSessaoDeAcesso from '../autenticacao/SessaoDeAcesso';
import { grupoDoConvite, idDoConvite, pedirAoConvite } from '../presenca/apiDeConvites';

const resultadoBusca = z.object({ ok: z.literal(true), groups: z.array(grupoDoConvite), next: idDoConvite.nullable() });
const previaSchema = z.object({ ok: z.literal(true), enabled:z.boolean(), skipped:z.number(), fingerprint:z.string(), preview:z.object({subject:z.string(),html:z.string()}), recipients:z.array(z.object({group_id:z.number(),label:z.string(),table_number:z.number().nullable()})) });
const envioSchema = z.object({ ok:z.literal(true), next:z.number().nullable(), results:z.array(z.object({group_id:z.number(),label:z.string(),status:z.enum(['accepted','unknown'])})) });
const nomes = { table: 'Mesa da família', reminder: 'Lembrete de presença', hotel: 'Hospedagem', van: 'Transporte de van', guide: 'Guia final da festa', thanks: 'Agradecimento', message: 'Mensagem personalizada' };
const campo = 'mt-1 block min-h-11 w-full rounded border bg-white p-2';

export default function PainelDeEmails(){
  const { session, loading } = useSessaoDeAcesso();
  return <main className="mx-auto max-w-6xl space-y-5 px-4 py-8 sm:px-8"><Link className="underline" to="/administracao">← Painel da organização</Link><header><p className="rubrica-do-convite">Victória &amp; Flávio</p><h1 className="font-display text-5xl text-primary">E-mails aos convidados</h1></header>{loading ? <p role="status">Verificando acesso…</p> : session?.account?.administrator ? <Editor key={`${session.account.id}:${session.csrf}`} csrf={session.csrf}/> : <p role="alert">Entre com uma conta administrativa para continuar.</p>}</main>;
}

function Editor({ csrf }: { csrf: string }){
  const [modelo,setModelo] = useState<keyof typeof nomes>('table');
  const [publico,setPublico] = useState<'test'|'eligible'|'selected'>('test');
  const [selecionadas,setSelecionadas] = useState<z.output<typeof grupoDoConvite>[]>([]);
  const [encontradas,setEncontradas] = useState<z.output<typeof resultadoBusca>>();
  const [assunto,setAssunto] = useState(''); const [mensagem,setMensagem] = useState('');
  const [previa,setPrevia] = useState<z.output<typeof previaSchema>>();
  const [exemplo,setExemplo] = useState<number>();
  const [ocupado,setOcupado] = useState(false); const [erro,setErro] = useState('');
  const [retornos,setRetornos] = useState<z.output<typeof envioSchema>['results']>([]);
  const [offset,setOffset] = useState<number|null>(0);
  const [incerto,setIncerto] = useState('');
  const payload = { template:modelo, audience:publico, group_ids:selecionadas.map(f=>f.id), subject:assunto, message:mensagem };
  const invalidar = () => { setPrevia(undefined); setExemplo(undefined); setErro(''); };
  async function preparar(id?: number){
    setOcupado(true); setErro('');
    try {
      const result=await pedirAoConvite('convites',csrf,{action:'admin_email_preview',...payload,preview_group_id:id},previaSchema);
      if(previa && result.fingerprint!==previa.fingerprint){setPrevia(undefined);setErro('O público ou a mensagem mudou. Revise e gere uma nova prévia antes de enviar.');return;}
      if(!previa){setOffset(0);setRetornos([]);}
      setPrevia(result);setExemplo(id ?? result.recipients[0]?.group_id);
    }catch(e){setErro(e instanceof Error?e.message:'Prévia indisponível.');}finally{setOcupado(false);}
  }
  async function enviar(){
    if(!previa?.enabled||offset===null||!previa.recipients.length)return;
    const quantidade=Math.min(5,previa.recipients.length-offset);
    if(!window.confirm(publico==='test'?'Enviar teste para o e-mail da sua conta?':`Enviar agora para ${quantidade} ${quantidade===1?'família':'famílias'} neste lote?`))return;
    const dispatch_id=crypto.randomUUID();setOcupado(true);setErro('');
    try {
      const result=await pedirAoConvite('convites',csrf,{action:'admin_email_send',...payload,fingerprint:previa.fingerprint,offset,dispatch_id},envioSchema);
      setRetornos(anteriores=>[...anteriores,...result.results]);setOffset(result.next);
      if(result.results.some(r=>r.status==='unknown'))setIncerto(dispatch_id);
    }catch(e){setErro(e instanceof Error?e.message:'Não foi possível consultar o envio.');setOffset(null);setIncerto(dispatch_id);}finally{setOcupado(false);}
  }
  return <div className="grid min-w-0 gap-6 lg:grid-cols-2">
    <section className="space-y-4"><h2 className="font-display text-3xl text-primary">Preparar mensagem</h2>
    <fieldset disabled={ocupado || (retornos.length>0 && offset!==null)} className="grid gap-3">
      <label>Modelo<select className={campo} value={modelo} onChange={e=>{setModelo(e.target.value as keyof typeof nomes);if(e.target.value==='message'&&publico==='eligible')setPublico('test');invalidar();}}>{Object.entries(nomes).map(([v,n])=><option key={v} value={v}>{n}</option>)}</select></label>
      <label>Destinatários<select className={campo} value={publico} onChange={e=>{setPublico(e.target.value as typeof publico);invalidar();}}><option value="test">Enviar teste para mim</option><option value="selected">Escolher famílias</option>{modelo!=='message'&&<option value="eligible">Todas as famílias elegíveis para o modelo</option>}</select></label>
      {modelo==='hotel'&&<p className="text-sm">Famílias confirmadas que indicaram intenção de hospedagem.</p>}
      {modelo==='van'&&<p className="text-sm">Famílias com pelo menos uma pessoa confirmada que indicou van. Interesse não é reserva.</p>}
      {(modelo==='guide'||modelo==='thanks')&&<p className="text-sm">Famílias com presença confirmada. No guia, a mesa só aparece se estiver divulgada.</p>}
      {modelo==='table'&&<p className="text-sm">Só entram famílias com presença confirmada, conta vinculada e mesa já liberada para visualização.</p>}
      {modelo==='reminder'&&<p className="text-sm">Só entram famílias vinculadas que ainda não emitiram comprovante.</p>}
      {publico==='selected'&&<div className="space-y-2">
        <form className="flex flex-wrap items-end gap-2" onSubmit={async e=>{e.preventDefault();const search=String(new FormData(e.currentTarget).get('busca')??'').trim();setOcupado(true);setErro('');try{setEncontradas(await pedirAoConvite('convites',csrf,{action:'admin_list',search,after:0},resultadoBusca));}catch(e){setErro(e instanceof Error?e.message:'Busca indisponível.');}finally{setOcupado(false);}}}><label className="min-w-0 flex-1">Nome da família ou convidado<input className={campo} name="busca" minLength={2} maxLength={160} required type="search"/></label><Button variant="outline">Buscar</Button></form>
        {encontradas?.next&&<p className="text-sm">Há mais resultados. Refine a busca.</p>}{encontradas?.groups.length===0&&<p>Nenhuma família encontrada.</p>}
        {encontradas?.groups.map(f=><Button key={f.id} className="mr-2 max-w-full whitespace-normal" type="button" variant="outline" disabled={selecionadas.some(s=>s.id===f.id)} onClick={()=>{setSelecionadas([...selecionadas,f]);invalidar();}}>Adicionar {f.label}</Button>)}
        {selecionadas.length>0&&<div><p>{selecionadas.length} selecionada(s)</p>{selecionadas.map(f=><Button key={f.id} className="mr-2 max-w-full whitespace-normal" type="button" variant="ghost" onClick={()=>{setSelecionadas(selecionadas.filter(s=>s.id!==f.id));invalidar();}}>Remover {f.label}</Button>)}</div>}
      </div>}
      {modelo==='message'&&<label>Assunto<input className={campo} value={assunto} maxLength={140} onChange={e=>{setAssunto(e.target.value);invalidar();}}/></label>}
      <label>{modelo==='table'||modelo==='reminder'?'Recado adicional (opcional)':'Mensagem'}<textarea className={campo} rows={5} value={mensagem} maxLength={3000} onChange={e=>{setMensagem(e.target.value);invalidar();}}/></label>
      <Button type="button" onClick={()=>void preparar()} disabled={(publico==='selected'&&!selecionadas.length)||(modelo==='message'&&!assunto.trim())||(!['table','reminder'].includes(modelo)&&!mensagem.trim())}>Gerar prévia</Button>
    </fieldset>
    {erro&&<p role="alert" className="text-destructive">{erro}</p>}
    {incerto&&<p role="alert">Resultado incerto. Não reenvie antes de verificar o SMTP e o lote <code className="break-all">{incerto}</code>. <Button variant="outline" onClick={()=>{if(window.confirm('Já verificou o resultado e quer preparar outro envio?')){setIncerto('');invalidar();}}}>Já verifiquei</Button></p>}
    </section>
    <section className="min-w-0 space-y-3" aria-label="Pré-visualização do e-mail"><h2 className="font-display text-3xl text-primary">Pré-visualização</h2>
    {!previa?<p className="rounded border bg-white p-4">Escolha o modelo e gere uma prévia para conferir o e-mail antes do envio.</p>:<>
      <p><strong>Assunto:</strong> {previa.preview.subject}</p>
      <p>{previa.recipients.length} destinatário(s) · {previa.skipped} fora do envio por falta de e-mail ou por não atender aos critérios.</p>
      {previa.recipients.length>1&&<label>Exibir e-mail de<select className={campo} disabled={ocupado} value={exemplo} onChange={e=>void preparar(Number(e.target.value))}>{previa.recipients.map(f=><option key={f.group_id} value={f.group_id}>{f.label}{f.table_number&&modelo==='table'?` · Mesa ${f.table_number}`:''}</option>)}</select></label>}
      <iframe title="Prévia visual do e-mail" sandbox="" srcDoc={previa.preview.html} className="h-[29rem] w-full rounded border bg-white"/>
      {!previa.enabled&&<p className="text-sm">Envio desabilitado neste ambiente. A prévia não dispara mensagens.</p>}
      <Button type="button" disabled={ocupado||!!incerto||!previa.enabled||!previa.recipients.length||offset===null} onClick={()=>void enviar()}>{ocupado?'Aguarde…':publico==='test'?'Enviar teste para mim':offset===null?'Envio encerrado':offset===0?'Enviar primeiro lote':'Enviar próximo lote'}</Button>
      {retornos.length>0&&<ul aria-label="Resultados do envio" className="space-y-1">{retornos.map(r=><li key={r.group_id}>{r.label} · {r.status==='accepted'?'Aceito pelo SMTP':'Resultado incerto'}</li>)}</ul>}
      {offset===null&&retornos.length>0&&!incerto&&<Button variant="outline" onClick={()=>invalidar()}>Preparar outro e-mail</Button>}
      {offset!==null&&retornos.length>0&&<Button variant="outline" disabled={ocupado} onClick={()=>{if(window.confirm('Encerrar os lotes restantes? Os já enviados serão mantidos.'))setOffset(null);}}>Encerrar lotes</Button>}
    </>}
    </section>
  </div>;
}
