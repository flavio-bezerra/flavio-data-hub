import { useCallback, useState } from 'react';
import useSessaoDeAcesso from './SessaoDeAcesso';
import { Link, Navigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import EntrarComGoogle from './EntrarComGoogle';




export default function FormularioDeAcesso({ codigo }: { codigo?: string | null }) {
  const {session, loading, refresh} = useSessaoDeAcesso();
  const [entrouAgora, setEntrouAgora] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = useCallback(async (payload: Record<string, string>) => {
    if (!session || busy) return;
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/auth.php', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': session.csrf }, body: JSON.stringify(payload) });
      const result = z.object({ ok: z.boolean(), message: z.string().optional() }).safeParse(await response.json().catch(() => null));
      if (!response.ok || !result.success || !result.data.ok) throw Error(result.success ? result.data.message ?? 'Não foi possível concluir.' : 'Serviço indisponível.');
      window.dispatchEvent(new Event('casamento-session'));
      setEntrouAgora(payload.action !== 'logout');
      await refresh();
    } catch (e) { setError(e instanceof Error ? e.message : 'Serviço indisponível.'); }
    finally { setBusy(false); }
  }, [session, busy, refresh]);
  const googleCredential = useCallback(async (credential: string) => { await submit({ action: 'google', credential }); }, [submit]);
  if (entrouAgora && !codigo && session?.account && !session.account.administrator) return <Navigate to="/meu-convite" replace />;
  return <div className="papelaria-do-convite"><main className="folha-do-convite folha-do-convite--acesso space-y-6">
    <Link className="inline-flex min-h-11 items-center gap-2 text-sm text-primary underline underline-offset-4" to="/#presenca"><span aria-hidden="true">←</span> Voltar ao casamento</Link>
    <header className="cabecalho-da-folha">
      <img src="/monograma-vf.png" width="76" height="52" alt="" />
      <p className="rubrica-do-convite">Victória &amp; Flávio · 10 de outubro de 2027</p>
      <h1 className="font-display text-primary">{codigo ? 'Acesse seu convite' : 'Área do convidado'}</h1>
    </header>
    {loading && <p role="status">Carregando…</p>}
    {(error || (!loading && !session)) && <p role="alert" className="text-destructive">{error || 'O acesso está indisponível no momento. Tente novamente mais tarde.'}</p>}
    {session?.account ? <>
      <p>Olá, {session.account.name}.</p>
      <section className="space-y-3 border-t py-4"><h2 className="font-display text-3xl">Meu convite</h2><p>Consulte os convidados da sua família, confirme a presença e recupere seu comprovante.</p><Button asChild><Link to="/meu-convite">Abrir meu convite</Link></Button></section>
      {session.account.administrator && <section className="space-y-3 border-t py-4"><h2 className="font-display text-3xl">Organização</h2><div className="flex flex-wrap gap-2"><Button variant="outline" asChild><Link to="/administracao">Abrir painel da organização</Link></Button><Button variant="outline" asChild><Link to="/administracao/assistente">Memória e logística</Link></Button></div></section>}
      <footer className="border-t pt-5">
        <Button type="button" variant="outline" disabled={busy} onClick={() => void submit({ action: 'logout' })}>Sair da conta</Button>
      </footer>
    </> : session && <>
      <p>{codigo ? 'Entre na sua conta para continuar com o convite que você recebeu.' : 'Entre na sua conta para acessar seu convite e confirmar presença.'}</p>
      {session.google_client_id && <EntrarComGoogle clientId={session.google_client_id} nonce={session.google_nonce} onCredential={googleCredential} />}
      {import.meta.env.DEV && session.fixture_login && <form className="grid max-w-sm gap-3 rounded border p-4" onSubmit={e => { e.preventDefault(); const dados = new FormData(e.currentTarget); void submit({ action:'fixture_login', email:String(dados.get('email')).trim().toLowerCase(), password:String(dados.get('password')) }); }}>
        <p className="text-sm text-muted-foreground">Ambiente local · contas fictícias</p>
        <label>E-mail<input className="block min-h-11 w-full rounded border p-2" type="email" name="email" autoComplete="username" required /></label>
        <label>Senha<input className="block min-h-11 w-full rounded border p-2" type="password" name="password" autoComplete="current-password" required /></label>
        <Button disabled={busy}>Entrar</Button>
      </form>}
    </>}

  </main></div>;
}
