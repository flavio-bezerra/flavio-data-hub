import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import useSessaoDeAcesso from '../autenticacao/SessaoDeAcesso';
import ContextoDaFesta from './ContextoDaFesta';

const versao = z.object({ id: z.coerce.number(), behavior_text: z.string(), knowledge_text: z.string(), examples_text: z.string(), created_at: z.string() });
const schema = z.object({ ok: z.literal(true), versions: z.array(versao), publication: z.object({ memory_version_id: z.coerce.number().nullable(), revision: z.coerce.number(), published_at: z.string().nullable() }) });
const campos = [
  { key: 'knowledge', titulo: 'Informações da festa', ajuda: 'Inclua informações confirmadas, como horários, endereço e traje. Não inclua dados dos convidados.' },
  { key: 'behavior', titulo: 'Como responder', ajuda: 'Defina o tom e o que fazer quando faltar informação.' },
  { key: 'examples', titulo: 'Exemplos de resposta', ajuda: 'Use perguntas e respostas fictícias para orientar o assistente.' },
] as const;
const vazio = { knowledge: '', behavior: '', examples: '' };
const editar = (v?: z.infer<typeof versao>) => v ? { knowledge: v.knowledge_text, behavior: v.behavior_text, examples: v.examples_text } : vazio;

async function pedirAoPainel(rota: 'memoria' | 'contexto' | 'assistente', csrf: string, payload: object, signal?: AbortSignal) {
  const response = await fetch(`/api/${rota}.php`, { method: 'POST', credentials: 'same-origin', signal, headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf }, body: JSON.stringify(payload) });
  const result = await response.json().catch(() => null);
  if (!response.ok || result?.ok !== true) throw Error(result?.message || 'Serviço indisponível.');
  return result;
}

export default function MemoriaDoAssistente() {
  const { session, loading } = useSessaoDeAcesso();
  if (loading) return <main className="admin-assistente" role="status">Carregando…</main>;
  if (!session?.account?.administrator) return <main className="admin-assistente"><h1>Acesso administrativo</h1><p>Entre com uma conta administrativa autorizada.</p><Link to="/acesso">Entrar</Link></main>;
  return <Editor key={session.account.id} csrf={session.csrf} />;
}

function Editor({ csrf }: { csrf: string }) {
  const [data, setData] = useState<z.infer<typeof schema>>();
  const [draft, setDraft] = useState(vazio);
  const [original, setOriginal] = useState(vazio);
  const [selected, setSelected] = useState<number>();
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(true);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<{ version: number; question: string; text: string }>();
  const [view, setView] = useState<'memoria' | 'logistica'>('memoria');
  const dirty = campos.some(({ key }) => draft[key] !== original[key]);
  const publicada = data?.publication.memory_version_id;

  useEffect(() => {
    const controller = new AbortController();
    void pedirAoPainel('memoria', csrf, { action: 'read' }, controller.signal).then(raw => {
      const atual = schema.parse(raw);
      const v = atual.versions.find(item => item.id === atual.publication.memory_version_id) ?? atual.versions[0];
      if (controller.signal.aborted) return;
      setData(atual); setSelected(v?.id); setDraft(editar(v)); setOriginal(editar(v));
    }).catch(e => { if (!controller.signal.aborted) setError(e.message); })
      .finally(() => { if (!controller.signal.aborted) setBusy(false); });
    return () => controller.abort();
  }, [csrf]);

  useEffect(() => {
    if (!dirty) return;
    const aviso = (evento: BeforeUnloadEvent) => { evento.preventDefault(); evento.returnValue = ''; };
    window.addEventListener('beforeunload', aviso);
    return () => window.removeEventListener('beforeunload', aviso);
  }, [dirty]);

  async function executar(acao: 'save' | 'publish' | 'preview' | 'read') {
    setBusy(true); setError(''); setNotice('');
    try {
      if (acao === 'preview' && selected) {
        setAnswer(undefined);
        const result = await pedirAoPainel('assistente', csrf, { preview_version: selected, messages: [{ role: 'user', content: question.trim() }] });
        setAnswer({ version: selected, question: question.trim(), text: z.string().parse(result.answer) });
        return;
      }
      if (acao === 'save') {
        const result = await pedirAoPainel('memoria', csrf, { action: 'save', ...draft });
        setSelected(z.coerce.number().int().positive().parse(result.version)); setOriginal(draft); setAnswer(undefined);
        setNotice('Rascunho salvo. O conteúdo publicado não mudou.');
      }
      if (acao === 'publish' && selected && data) {
        await pedirAoPainel('memoria', csrf, { action: 'publish', version: selected, revision: data.publication.revision });
        setNotice(`Versão ${selected} publicada.`);
      }
      setData(schema.parse(await pedirAoPainel('memoria', csrf, { action: 'read' })));
    } catch (e) { setError(e instanceof Error ? e.message : 'Operação indisponível.'); }
    finally { setBusy(false); }
  }

  return <main className="admin-assistente space-y-5">
    <Link to="/administracao" className="underline" onClick={e => { if (dirty && !window.confirm('Sair sem salvar as alterações da memória?')) e.preventDefault(); }}>← Painel da organização</Link>
    <header><h1>Memória e logística</h1><p>Controle o que o assistente pode consultar. Publicar conteúdo não ativa o chat.</p></header>
    <nav aria-label="Memória e logística" className="flex flex-wrap gap-2">
      <button type="button" aria-pressed={view === 'memoria'} onClick={() => setView('memoria')}>Memória do assistente</button>
      <button type="button" aria-pressed={view === 'logistica'} onClick={() => setView('logistica')}>Logística da festa</button>
    </nav>
    <div hidden={view !== 'memoria'}>
      <div className="rounded border bg-slate-50 p-4"><strong>{publicada ? `Em uso: versão ${publicada}` : data ? 'Nenhuma versão publicada' : 'Publicação não consultada'}</strong>{dirty && <p role="status">Há alterações não salvas. Salve um rascunho antes de testar ou publicar.</p>}</div>
      {error && <p role="alert" className="mt-3 text-destructive">{error} <button type="button" disabled={busy} onClick={() => void executar('read')}>Atualizar versões</button></p>}
      {notice && <p role="status" className="mt-3">{notice}</p>}
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section aria-labelledby="editor-memoria">
          <h2 id="editor-memoria">Editar memória</h2>
          <label>Histórico de versões<select value={selected ?? ''} disabled={busy} onChange={e => {
            if (dirty && !window.confirm('Descartar as alterações não salvas?')) return;
            const v = data?.versions.find(item => item.id === Number(e.target.value));
            setSelected(v?.id); setDraft(editar(v)); setOriginal(editar(v)); setAnswer(undefined); setNotice('');
          }}><option value="">Começar em branco</option>{data?.versions.map(v => <option key={v.id} value={v.id}>Versão {v.id} · {v.id === publicada ? 'Publicada' : v.created_at}</option>)}</select></label>
          <form onSubmit={e => { e.preventDefault(); if (dirty && !busy) void executar('save'); }}>
            {campos.map(({ key, titulo, ajuda }) => <label key={key}><strong>{titulo}</strong><span className="block text-sm">{ajuda}</span><textarea maxLength={10000} value={draft[key]} disabled={busy} onChange={e => setDraft({ ...draft, [key]: e.target.value })}/><span className="text-xs">{draft[key].length.toLocaleString('pt-BR')} / 10.000</span></label>)}
            <button disabled={busy || !dirty}>Salvar rascunho</button>
          </form>
        </section>
        <aside className="min-w-0" aria-labelledby="previa-memoria">
          <h2 id="previa-memoria">Testar e publicar</h2>
          <p>{selected ? `Versão selecionada: ${selected}` : 'Salve ou selecione uma versão.'}</p>
          <form onSubmit={e => { e.preventDefault(); if (selected && !dirty && !busy && question.trim()) void executar('preview'); }}>
            <label>Pergunta de teste<textarea value={question} maxLength={1800} onChange={e => setQuestion(e.target.value)} placeholder="Qual é o horário da cerimônia?"/></label>
            <button disabled={busy || dirty || !selected || !question.trim()}>Testar versão salva</button>
          </form>
          {answer && <div className="rounded border p-4 break-words" role="status"><strong>Prévia · versão {answer.version}</strong><p>{answer.question}</p><p className="whitespace-pre-wrap">{answer.text}</p></div>}
          <div className="mt-4 border-t pt-4"><p>Para restaurar uma versão anterior, selecione-a no histórico e publique novamente.</p><button type="button" disabled={busy || dirty || !selected || !data || selected === publicada} onClick={() => { if (window.confirm(`Publicar a versão ${selected} para os convidados?`)) void executar('publish'); }}>Publicar versão selecionada</button></div>
        </aside>
      </div>
    </div>
    {view === 'logistica' && <ContextoDaFesta csrf={csrf}/>}
  </main>;
}
