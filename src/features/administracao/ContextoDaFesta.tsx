import { useCallback, useEffect, useState } from 'react';
import { z } from 'zod';
import { detalhesDoConvite, grupoDoConvite, idDoConvite, pedirAoConvite } from '../presenca/apiDeConvites';

const gruposSchema = z.object({ groups: z.array(grupoDoConvite), next: idDoConvite.nullable() });
const registrosSchema = z.object({ records: z.array(z.object({ id: idDoConvite, title: z.string(), topic: z.string(), details_text: z.string(), link_url: z.string().nullable(), invitation_group_id: idDoConvite.nullable(), guest_id: idDoConvite.nullable(), published_at: z.string().nullable() })) });
const categorias = { event: 'Festa', hotel: 'Hotel', van: 'Van / itinerário', table: 'Mesa' };
const semGrupo = { id: 0, label: '' };
type Grupo = z.infer<typeof grupoDoConvite>;
type Registro = z.infer<typeof registrosSchema>['records'][number];
const alcance = (grupo?: number | null, pessoa?: number | null) => pessoa ? 'Um convidado' : grupo ? 'Uma família' : 'Todos os convidados';

export default function ContextoDaFesta({ csrf }: { csrf: string }) {
  const [records, setRecords] = useState<Registro[]>([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(true);
  const [grupo, setGrupo] = useState<Grupo>(semGrupo);
  const [pessoa, setPessoa] = useState('');
  const [busca, setBusca] = useState('');
  const [resultado, setResultado] = useState<{ busca: string; pagina?: z.infer<typeof gruposSchema>; erro?: string }>();
  const [detalhe, setDetalhe] = useState<z.infer<typeof detalhesDoConvite>>();
  const [erroPessoas, setErroPessoas] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [destino, setDestino] = useState<'geral' | 'familia' | 'pessoa'>('geral');
  const request = useCallback(async (payload: object, signal?: AbortSignal) => {
    const response = await fetch('/api/contexto.php', { method: 'POST', credentials: 'same-origin', signal, headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf }, body: JSON.stringify(payload) });
    const result = await response.json().catch(() => null);
    if (!response.ok || result?.ok !== true) throw Error(result?.message || 'Logística indisponível.');
    return result;
  }, [csrf]);

  useEffect(() => {
    const controller = new AbortController();
    void request({ action: 'read' }, controller.signal).then(raw => { if (!controller.signal.aborted) setRecords(registrosSchema.parse(raw).records); })
      .catch(e => { if (!controller.signal.aborted) setError(e.message); }).finally(() => { if (!controller.signal.aborted) setBusy(false); });
    return () => controller.abort();
  }, [request]);

  const termo = busca.trim();
  useEffect(() => {
    if (destino === 'geral' || termo.length < 2) return;
    let ativo = true;
    const timer = window.setTimeout(() => {
      void pedirAoConvite('convites', csrf, { action: 'admin_list', after: 0, search: termo, status: 'all' }, gruposSchema)
        .then(pagina => { if (ativo) setResultado({ busca: termo, pagina }); })
        .catch(e => { if (ativo) setResultado({ busca: termo, erro: e.message }); });
    }, 300);
    return () => { ativo = false; window.clearTimeout(timer); };
  }, [csrf, destino, termo]);

  useEffect(() => {
    if (destino !== 'pessoa' || !grupo.id) return;
    let ativo = true;
    void pedirAoConvite('convites', csrf, { action: 'admin_detail', group_id: grupo.id }, detalhesDoConvite)
      .then(data => { if (ativo) setDetalhe(data); }).catch(e => { if (ativo) setErroPessoas(e.message); });
    return () => { ativo = false; };
  }, [csrf, destino, grupo.id]);

  async function alterar(payload: object, mensagem?: string, limpar?: () => void) {
    setBusy(true); setError(''); setNotice('');
    try {
      if (mensagem) { await request(payload); setNotice(mensagem); limpar?.(); }
      setRecords(registrosSchema.parse(await request({ action: 'read' })).records);
    } catch (e) { setError(e instanceof Error ? e.message : 'Operação indisponível.'); }
    finally { setBusy(false); }
  }

  const atual = resultado?.busca === termo ? resultado : undefined;
  const visiveis = records.filter(r => filtro === 'todos' || (filtro === 'publicados' ? !!r.published_at : !r.published_at));
  return <section aria-labelledby="logistica-festa" className="grid gap-6 md:grid-cols-2">
    <div><h2 id="logistica-festa">Novo registro de logística</h2><p>Salve como rascunho antes de publicar. Não inclua contatos ou dados sensíveis.</p>
      <form onSubmit={e => {
        e.preventDefault(); if (busy || (destino !== 'geral' && !grupo.id) || (destino === 'pessoa' && !pessoa)) return;
        const form = e.currentTarget; const values = new FormData(form);
        const url = String(values.get('url') || '').trim();
        if (url && !url.startsWith('https://')) { setError('Informe um link que comece com https://.'); return; }
        void alterar({ action: 'save', topic: values.get('topic'), title: values.get('title'), text: values.get('text'), url: url || null, group_id: destino === 'geral' ? null : grupo.id, guest_id: destino === 'pessoa' ? Number(pessoa) : null }, 'Rascunho salvo.', () => { form.reset(); setDestino('geral'); setGrupo(semGrupo); setBusca(''); setPessoa(''); });
      }}><fieldset disabled={busy}>
        <label>Categoria<select name="topic">{Object.entries(categorias).map(([valor, texto]) => <option key={valor} value={valor}>{texto}</option>)}</select></label>
        <label>Título<input name="title" required maxLength={160}/></label>
        <label>Informações<textarea name="text" required maxLength={3000}/></label>
        <label>Link HTTPS (opcional)<input name="url" type="url"/></label>
        <label>Quem pode consultar?<select value={destino} onChange={e => { setDestino(e.target.value as typeof destino); setGrupo(semGrupo); setPessoa(''); setDetalhe(undefined); setErroPessoas(''); }}><option value="geral">Todos os convidados</option><option value="familia">Uma família</option><option value="pessoa">Um convidado</option></select></label>
        {destino !== 'geral' && <>
          <label>Buscar família ou convidado<input type="search" maxLength={160} value={busca} onChange={e => setBusca(e.target.value)}/></label>
          {termo.length >= 2 && !grupo.id && <p role="status">{atual?.erro || (!atual ? 'Buscando…' : atual.pagina?.groups.length ? 'Selecione uma família nos resultados.' : 'Nenhuma família encontrada.')}</p>}
          <label>Família<select value={grupo.id || ''} onChange={e => { setGrupo(atual?.pagina?.groups.find(g => g.id === Number(e.target.value)) ?? semGrupo); setPessoa(''); setDetalhe(undefined); setErroPessoas(''); }}><option value="">Selecione uma família</option>{grupo.id !== 0 && !atual?.pagina?.groups.some(g => g.id === grupo.id) && <option value={grupo.id}>{grupo.label}</option>}{atual?.pagina?.groups.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}</select></label>
          {atual?.pagina?.next && <p>Há mais resultados. Refine a busca pelo nome.</p>}
          {destino === 'pessoa' && !!grupo.id && <label>Convidado<select value={pessoa} disabled={detalhe?.group.id !== grupo.id} onChange={e => setPessoa(e.target.value)}><option value="">Selecione um convidado</option>{detalhe?.guests.map(g => <option key={g.id} value={g.id}>{g.display_name}</option>)}</select>{erroPessoas && <span role="alert">{erroPessoas}</span>}</label>}
          {destino === 'pessoa' && <p className="text-sm">O responsável pela família poderá consultar esse registro pelo assistente.</p>}
        </>}
        <button disabled={busy || (destino !== 'geral' && !grupo.id) || (destino === 'pessoa' && !pessoa)}>Salvar rascunho</button>
      </fieldset></form>
    </div>
    <div className="min-w-0"><h2>Registros de logística</h2>
      {error && <p className="text-destructive" role="alert">{error}</p>}{notice && <p role="status">{notice}</p>}
      <label>Exibir<select value={filtro} onChange={e => setFiltro(e.target.value)}><option value="todos">Todos</option><option value="publicados">Publicados</option><option value="rascunhos">Rascunhos e retirados</option></select></label>
      <button type="button" disabled={busy} onClick={() => void alterar({ action: 'read' })}>Atualizar lista</button>
      {!visiveis.length && !busy && !error && <p>Nenhum registro neste filtro.</p>}
      {visiveis.map(r => <article key={r.id} className="break-words"><h3 className="font-semibold">{r.title}</h3><p className="text-sm">{categorias[r.topic as keyof typeof categorias] || r.topic} · {alcance(r.invitation_group_id, r.guest_id)}{r.invitation_group_id ? ` · Grupo #${r.invitation_group_id}` : ''}{r.guest_id ? ` · Convidado #${r.guest_id}` : ''}</p><p className="whitespace-pre-wrap">{r.details_text}</p><p className="text-sm">{r.published_at ? 'Publicado em ' + r.published_at : 'Não publicado'}</p>
        <button type="button" disabled={busy} onClick={() => { if (window.confirm(r.published_at ? `Retirar “${r.title}” da publicação?` : `Publicar “${r.title}”? Alcance: ${alcance(r.invitation_group_id, r.guest_id)}${r.invitation_group_id ? ` · Grupo #${r.invitation_group_id}` : ''}${r.guest_id ? ` · Convidado #${r.guest_id}` : ''}.`)) void alterar({ action: r.published_at ? 'withdraw' : 'publish', id: r.id }, r.published_at ? 'Publicação retirada.' : 'Registro publicado.'); }}>{r.published_at ? 'Retirar publicação' : 'Publicar'}</button>
      </article>)}
    </div>
  </section>;
}
