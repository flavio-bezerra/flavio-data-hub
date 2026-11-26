import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import useSessaoDeAcesso from '@/features/autenticacao/SessaoDeAcesso';
import { pedirAoConvite, rotulosTransporte } from '@/features/presenca/apiDeConvites';
import ConfiguracoesDePresenca from './ConfiguracoesDePresenca';

const resumo = z.object({ ok: z.literal(true), total: z.number(), unclaimed: z.number(), awaiting: z.number(), complete: z.number(), confirmed: z.number() });
const logisticaSchema = z.object({ ok:z.literal(true), transport:z.object({car:z.number(),app:z.number(),van:z.number(),undecided:z.number()}), lodging:z.number(),unassigned:z.number(),hotels:z.array(z.object({name:z.string(),count:z.number()})),tables:z.array(z.object({number:z.number(),count:z.number()})) });
const indicadores = [
  ['total', 'Todos os grupos', 'all'], ['unclaimed', 'Sem responsável', 'unclaimed'],
  ['awaiting', 'Sem comprovante', 'awaiting'], ['complete', 'Com comprovante', 'complete'],
  ['confirmed', 'Pessoas confirmadas com comprovante', 'complete'],
] as const;

export default function PainelDaOrganizacao() {
  const { session, loading } = useSessaoDeAcesso();
  const csrf = session?.account?.administrator ? session.csrf : null;
  const [contagem, setContagem] = useState<z.output<typeof resumo>>();
  const [erro, setErro] = useState('');
  const [versao, setVersao] = useState(0);
  const [logistica,setLogistica]=useState<z.output<typeof logisticaSchema>>();
  const [erroLogistica,setErroLogistica]=useState('');
  useEffect(() => {
    if (!csrf) return;
    let ativo = true;
    void pedirAoConvite('convites', csrf, { action: 'admin_overview' }, resumo)
      .then(dados => { if (ativo) { setContagem(dados); setErro(''); } })
      .catch((e: Error) => { if (ativo) { setContagem(undefined); setErro(e.message); } });
    void pedirAoConvite('convites',csrf,{action:'admin_logistics_summary'},logisticaSchema).then(dados=>{if(ativo){setLogistica(dados);setErroLogistica('');}}).catch((e:Error)=>{if(ativo)setErroLogistica(e.message);});
    return () => { ativo = false; };
  }, [csrf, versao]);
  return <main className="caderno-da-organizacao mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-8 sm:py-12">
    <Link className="inline-flex min-h-11 items-center underline" to="/acesso">Minha conta</Link>
    <header className="cabecalho-da-organizacao"><p className="rubrica-do-convite">Victória &amp; Flávio · Gestão do casamento</p><h1 className="font-display text-5xl text-primary">Organização</h1></header>
    {loading ? <p role="status">Verificando acesso…</p> : !csrf ? <p role="alert">Entre com uma conta administrativa para continuar.</p> : <>
      <nav aria-label="Operação do casamento" className="flex flex-wrap gap-x-6 gap-y-1 border-y py-2">
        <Link className="inline-flex min-h-11 items-center bg-primary px-4 text-primary-foreground" to="/administracao/convidados">Gerenciar convidados</Link>
        <Link className="inline-flex min-h-11 items-center underline" to="/administracao/emails">E-mails aos convidados</Link>
         <Link className="inline-flex min-h-11 items-center underline" to="/administracao/convidados?situacao=whatsapp_pending">Acompanhar WhatsApp</Link>
         <Link className="inline-flex min-h-11 items-center underline" to="/administracao/convidados?situacao=no_email">Famílias sem e-mail</Link>
         <a className="inline-flex min-h-11 items-center underline" href="#prazo-de-presenca">Prazo de confirmação</a>
        <Link className="inline-flex min-h-11 items-center underline" to="/administracao/assistente">Memória e logística</Link>
      </nav>
      {erro ? <div role="alert"><p>{erro}</p><button className="min-h-11 underline" onClick={() => { setErro(''); setVersao(v => v + 1); }}>Tentar novamente</button></div> : contagem ? <section aria-label="Resumo dos convites" className="faixa-de-indicadores grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {indicadores.map(([chave, rotulo, filtro]) => <Link key={chave} className="min-w-0 border-b border-r p-3 text-primary hover:bg-secondary sm:p-5" to={`/administracao/convidados?situacao=${filtro}`}><strong className="block font-display text-3xl">{contagem[chave]}</strong>{rotulo}</Link>)}
      </section> : <p role="status">Carregando indicadores…</p>}
      <section className="grid gap-5 border-y py-5 md:grid-cols-2" aria-label="Planejamento da festa">
         <div className="min-w-0"><h2 className="font-display text-3xl text-primary">Hospedagem e transporte</h2><p className="text-sm">Intenções das pessoas confirmadas. Não são reservas.</p>
           {erroLogistica?<p role="alert">{erroLogistica}</p>:logistica?<><dl className="grid grid-cols-2 gap-3 py-3">{Object.entries(logistica.transport).map(([modo,n])=><div key={modo}><dt>{rotulosTransporte[modo as keyof typeof rotulosTransporte]}</dt><dd className="text-xl font-semibold">{n}</dd></div>)}</dl><p><strong>{logistica.lodging}</strong> com intenção de hospedagem</p><ul className="break-words">{logistica.hotels.map(h=><li key={h.name}>{h.name} · {h.count}</li>)}</ul></>:<p role="status">Carregando logística…</p>}
         </div><div><h2 className="font-display text-3xl text-primary">Mesas</h2><p className="text-sm">Pessoas confirmadas por mesa.</p>{logistica&&<ul className="mt-3 grid grid-cols-2 gap-3"><li><Link className="underline" to="/administracao/convidados?situacao=complete&mesa=none">Sem mesa · {logistica.unassigned}</Link></li>{logistica.tables.map(m=><li key={m.number}><Link className="underline" to={`/administracao/convidados?situacao=complete&mesa=${m.number}`}>Mesa {m.number} · {m.count}</Link></li>)}</ul>}</div>
       </section>
       <ConfiguracoesDePresenca key={csrf} csrf={csrf} />
    </>}
  </main>;
}
