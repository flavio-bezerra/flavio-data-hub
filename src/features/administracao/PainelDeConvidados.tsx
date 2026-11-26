import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import useSessaoDeAcesso from '@/features/autenticacao/SessaoDeAcesso';
import { grupoDoConvite, idDoConvite, numeroDeConvites, pedirAoConvite } from '@/features/presenca/apiDeConvites';
import ImportacaoDeConvites from './ImportacaoDeConvites';
import DetalheDoGrupo from './DetalheDoGrupo';

const gruposDaAdministracao = z.object({ ok: z.literal(true), groups: z.array(grupoDoConvite.extend({ responsible_account_id: idDoConvite.nullable(), responsible_name: z.string().nullable(), whatsapp_contacted_at:z.string().nullish(), external_id: z.string().nullable(), has_receipt: z.boolean(), total: numeroDeConvites, confirmed: numeroDeConvites, declined: numeroDeConvites })), next: idDoConvite.nullable() });
const operacaoConcluida = z.object({ ok: z.literal(true), group_id: idDoConvite, token: z.string().regex(/^[a-f0-9]{64}$/).nullable() });

export default function PainelDeConvidados() {
  const { session, loading } = useSessaoDeAcesso();
  return <main className="caderno-da-organizacao mx-auto max-w-6xl space-y-5 px-4 py-8 sm:px-8 sm:py-12">
    <Link className="underline" to={session?.account?.administrator ? '/administracao' : '/acesso'}>{session?.account?.administrator ? 'Painel da organização' : 'Minha conta'}</Link>
    <h1 className="font-display text-5xl text-primary">Convidados</h1>
    {loading ? <p role="status">Verificando acesso…</p> : session?.account?.administrator ? <CadastroDeGrupos key={`${session.account.id}:${session.csrf}`} csrf={session.csrf} /> : <p role="alert">Entre com uma conta administrativa para acessar esta página.</p>}
  </main>;
}

function CadastroDeGrupos({ csrf }: { csrf: string }) {
  const [pagina, setPagina] = useState<z.output<typeof gruposDaAdministracao>>();
  const [cursores, setCursores] = useState([0]);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [codigoPrivado, setCodigoPrivado] = useState('');
  const link = codigoPrivado ? `${window.location.origin}/meu-convite#codigo=${codigoPrivado}` : '';
  const [acao, setAcao] = useState<{ id: number; tipo: 'admin_rotate' | 'admin_transfer' }>();
  const [params] = useSearchParams();
  const [filtro, setFiltro] = useState(() => {
    const situacao = params.get('situacao') ?? 'all';
    const mesa = params.get('mesa') ?? '';
    return { search: '', status: ['unclaimed', 'awaiting', 'complete', 'no_email', 'whatsapp_pending'].includes(situacao) ? situacao : 'all', mesa: /^(none|[1-9]\d{0,2})$/.test(mesa) ? mesa : '' }; 
  });
  const [detalhe, setDetalhe] = useState<number>();
  const botaoDoGrupo = useRef<HTMLButtonElement>(null);
  const grupo = pagina?.groups.find(item => item.id === detalhe);
  const [versao, setVersao] = useState(0);
  const cursor = cursores[cursores.length - 1];
  const buscar = useCallback((after: number) => pedirAoConvite('convites', csrf, { action: 'admin_list', after, search:filtro.search, status:filtro.status, table: filtro.mesa === 'none' ? 'none' : filtro.mesa ? Number(filtro.mesa) : 'all' }, gruposDaAdministracao), [csrf, filtro]);
  useEffect(() => {
    let ativo = true;
    void buscar(cursor).then(resultado => { if (ativo) setPagina(resultado); }).catch((e: Error) => { if (ativo) setErro(e.message); });
    return () => { ativo = false; };
  }, [buscar, cursor, versao]);
  async function alterar(dados: object, limpar?: () => void) {
    setOcupado(true); setErro(''); setMensagem(''); setCodigoPrivado('');
    try {
      const resultado = await pedirAoConvite('convites', csrf, dados, operacaoConcluida);
      if (resultado.token) setCodigoPrivado(resultado.token);
      setMensagem(resultado.token ? 'Acesso gerado. Guarde o link ou o código agora; não serão exibidos novamente.' : 'Responsabilidade transferida. O responsável anterior perdeu acesso ao grupo.');
      limpar?.(); setAcao(undefined);
      setVersao(v => v + 1);
    } catch (e) { setErro(e instanceof Error ? e.message : 'Não foi possível concluir.'); }
    finally { setOcupado(false); }
  }
  const acessoGerado = codigoPrivado && <section className="space-y-3 border-y py-4" aria-label="Acesso privado gerado">
    <p className="text-sm">Envie em privado um dos formatos. Eles dão acesso ao mesmo convite.</p>
    {([{ nome: 'Link', valor: link }, { nome: 'Código', valor: codigoPrivado }] as const).map(({ nome, valor }) => <div key={nome} className="flex flex-wrap items-end gap-2">
      <label className="min-w-0 grow basis-40">{nome} do convite<input readOnly value={valor} onFocus={e => e.currentTarget.select()} className="block min-h-11 w-full rounded border p-2" /></label>
      <Button type="button" variant="outline" onClick={async () => {
        try { await navigator.clipboard.writeText(valor); setMensagem(`${nome} copiado.`); }
        catch { setMensagem('Selecione o campo para copiar manualmente.'); }
      }}>Copiar {nome.toLowerCase()}</Button>
    </div>)}
  </section>;
  return <>
    <p className="text-muted-foreground">Busque qualquer pessoa e gerencie o convite da família em um só lugar.</p>
    <ImportacaoDeConvites csrf={csrf} aoImportar={() => { setCursores([0]); setVersao(v => v + 1); }} />
    <details className="rounded border p-4"><summary className="min-h-10 cursor-pointer font-medium">Criar grupo manualmente</summary>
    <form className="space-y-4" onSubmit={e => {
      e.preventDefault(); const form = e.currentTarget; const dados = new FormData(form);
      const guests = String(dados.get('guests') ?? '').split(/\r?\n/).map(nome => nome.trim()).filter(Boolean);
      void alterar({ action: 'admin_create', label: String(dados.get('label') ?? '').trim(), guests }, () => form.reset());
    }}>

      <label className="block">Nome do grupo<input name="label" required maxLength={160} className="mt-1 block w-full rounded border p-2" /></label>
      <label className="block">Convidados, um por linha<textarea name="guests" required maxLength={16100} rows={4} className="mt-1 block w-full rounded border p-2" /></label>
      <Button disabled={ocupado}>Criar grupo e gerar acesso</Button>
    </form></details>
    {!grupo && <>{mensagem && <p role="status">{mensagem}</p>}{acessoGerado}{erro && <p role="alert" className="text-destructive">{erro}</p>}</>}
    <section className="space-y-4">
      <h2 className="font-display text-3xl">Grupos cadastrados</h2>
      <form className="grid items-end gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]" onSubmit={e => {
        e.preventDefault(); const dados = new FormData(e.currentTarget);
        setFiltro({ search: String(dados.get('busca') ?? '').trim(), status: String(dados.get('situacao') ?? 'all'), mesa: dados.has('sem-mesa') ? 'none' : String(dados.get('mesa') ?? '') });
        setCursores([0]); setPagina(undefined); setAcao(undefined); setDetalhe(undefined); setErro('');
      }}>
        <label className="min-w-0 flex-1">Família, convidado ou ID<input name="busca" type="search" maxLength={160} className="mt-1 block min-h-11 w-full rounded border p-2" /></label>
        <label>Mesa<input name="mesa" className="mt-1 block min-h-11 w-24 rounded border p-2" type="number" min={1} max={999} step={1} defaultValue={filtro.mesa==='none'?'':filtro.mesa}/></label><label className="flex min-h-11 items-center gap-2"><input name="sem-mesa" type="checkbox" defaultChecked={filtro.mesa==='none'}/> Sem mesa</label>
      <label>Situação<select name="situacao" defaultValue={filtro.status} className="mt-1 block min-h-11 rounded border p-2"><option value="all">Todas</option><option value="unclaimed">Sem responsável</option><option value="no_email">Sem e-mail disponível</option><option value="whatsapp_pending">Sem resposta e sem contato por WhatsApp</option><option value="awaiting">Sem comprovante</option><option value="pending">Pendentes</option><option value="partial">Em andamento</option><option value="complete">Com comprovante</option></select></label>
        <Button variant="outline" disabled={ocupado}>Buscar</Button>
      </form>
      {!pagina && !erro && <p role="status">Carregando grupos…</p>}
      {pagina?.groups.length === 0 && <p>Nenhum grupo nesta página.</p>}
      {!!pagina?.groups.length && <table className="lista-de-convidados w-full table-fixed border-y text-left">
        <caption className="sr-only">Grupos de convidados, responsáveis e situação de presença</caption>
        <colgroup><col className="w-[55%] md:w-[34%]" /><col className="hidden w-[23%] md:table-column" /><col className="hidden w-[18%] md:table-column" /><col /></colgroup>
        <thead><tr><th scope="col">Família</th><th scope="col" className="hidden md:table-cell">Responsável</th><th scope="col" className="hidden md:table-cell">Confirmados</th><th scope="col">Situação</th></tr></thead>
        <tbody>{pagina.groups.map(item => <tr key={item.id}>
          <th scope="row"><button type="button" aria-haspopup="dialog" className="block min-h-11 w-full break-words text-left font-semibold text-primary underline decoration-transparent underline-offset-4 hover:decoration-current focus-visible:decoration-current" onClick={e => { botaoDoGrupo.current = e.currentTarget; setErro(''); setMensagem(''); setCodigoPrivado(''); setDetalhe(item.id); }}>{item.label}<span className="block break-all text-xs font-normal text-muted-foreground">Convite {item.external_id ?? item.id}</span></button></th>
          <td className="hidden break-words md:table-cell">{item.responsible_name ?? '—'}</td>
          <td className="hidden tabular-nums md:table-cell">{item.confirmed} / {item.total}</td>
          <td><span className={item.has_receipt ? 'situacao-convite situacao-convite--confirmado' : 'situacao-convite'}>{item.has_receipt ? 'Com comprovante' : !item.responsible_account_id ? 'Sem responsável' : item.confirmed + item.declined ? 'Em andamento' : 'Aguardando resposta'}</span><span className="mt-1 block text-xs text-muted-foreground md:hidden">{item.confirmed}/{item.total} confirmados</span></td>
        </tr>)}</tbody>
      </table>}
      <Sheet open={!!grupo} onOpenChange={aberto => { if (!aberto && !ocupado) { setDetalhe(undefined); setAcao(undefined); setCodigoPrivado(''); setMensagem(''); setErro(''); } }}>
      {grupo && <SheetContent className="painel-do-grupo w-full overflow-y-auto bg-white px-5 py-7 sm:max-w-xl sm:px-8" onCloseAutoFocus={e => { e.preventDefault(); botaoDoGrupo.current?.focus(); }}>
        <SheetTitle className="break-words pr-9 font-display text-3xl text-primary">{grupo.label}</SheetTitle>
        <SheetDescription className="break-words">Convite {grupo.external_id ?? grupo.id} · {grupo.confirmed} confirmados de {grupo.total}</SheetDescription>
        {mensagem && <p role="status">{mensagem}</p>}{erro && <p role="alert" className="text-destructive">{erro}</p>}{acessoGerado}
        <div className="border-y py-4">
        {acao?.id === grupo.id ? <form className="space-y-3" onSubmit={e => {
          e.preventDefault(); const email = new FormData(e.currentTarget).get('email');
          void alterar({ action: acao.tipo, group_id: grupo.id, ...(acao.tipo === 'admin_transfer' ? { email } : {}) });
        }}>
          <p>{acao.tipo === 'admin_transfer' ? 'A conta anterior perderá acesso, e o link anterior será invalidado.' : 'O link e o código anteriores deixarão de funcionar.'}</p>
          {acao.tipo === 'admin_transfer' && <label className="block">E-mail da nova conta verificada<input type="email" name="email" required maxLength={254} className="block w-full rounded border p-2" /></label>}
          <div className="flex flex-wrap gap-2"><Button disabled={ocupado}>Confirmar</Button><Button disabled={ocupado} type="button" variant="outline" onClick={() => setAcao(undefined)}>Cancelar</Button></div>
        </form> : <Button disabled={ocupado} variant="outline" onClick={() => setAcao({ id: grupo.id, tipo: grupo.responsible_account_id === null ? 'admin_rotate' : 'admin_transfer' })}>{grupo.responsible_account_id === null ? 'Gerar acesso' : 'Transferir responsabilidade'}</Button>}
        </div>
        <section className="space-y-2 rounded border p-3" aria-label="Acompanhamento por WhatsApp">
           <h3 className="font-semibold">Contato por WhatsApp</h3>
           <p className="text-sm">{grupo.whatsapp_contacted_at ? 'Contato registrado manualmente.' : 'Nenhum contato registrado.'}</p>
           <div className="flex flex-wrap gap-2"><Button type="button" variant="outline" onClick={async()=>{try{await navigator.clipboard.writeText(`Olá, ${grupo.label}! Passando para lembrar do nosso casamento. Se ainda não responderam, abram o convite que enviamos ou acessem ${window.location.origin}/meu-convite. Qualquer dúvida, falem com a gente! Victória e Flávio`);setMensagem('Recado copiado. Nenhuma mensagem foi enviada.');}catch{setErro('Não foi possível copiar o recado.');}}}>Copiar lembrete</Button>
           <Button type="button" variant="outline" disabled={ocupado} onClick={async()=>{setOcupado(true);setErro('');try{await pedirAoConvite('convites',csrf,{action:'admin_whatsapp_contact',group_id:grupo.id,contacted:!grupo.whatsapp_contacted_at},z.object({ok:z.literal(true)}));setMensagem(grupo.whatsapp_contacted_at?'Registro desfeito.':'Contato registrado.');setVersao(v=>v+1);}catch(e){setErro(e instanceof Error?e.message:'Não foi possível atualizar o contato.');}finally{setOcupado(false);}}}>{grupo.whatsapp_contacted_at?'Desfazer registro':'Registrar contato feito'}</Button></div>
         </section>
         <DetalheDoGrupo key={grupo.id} id={grupo.id} csrf={csrf} aoAlterar={() => setVersao(v => v + 1)} />
      </SheetContent>}
      </Sheet>
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-auto text-sm text-muted-foreground" aria-live="polite">Página {cursores.length}{pagina ? ` · ${pagina.groups.length} grupos` : ''}</span>
        <Button variant="outline" disabled={ocupado || cursores.length === 1} onClick={() => { setPagina(undefined); setAcao(undefined); setDetalhe(undefined); setErro(''); setCursores(cursores.slice(0, -1)); }}>Anterior</Button>
        <Button variant="outline" disabled={ocupado || !pagina?.next} onClick={() => { const next = pagina?.next; if (next) { setPagina(undefined); setAcao(undefined); setDetalhe(undefined); setErro(''); setCursores([...cursores, next]); } }}>Próxima</Button>
      </div>
    </section>
  </>;
}
