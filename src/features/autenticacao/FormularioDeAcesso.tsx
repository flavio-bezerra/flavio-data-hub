import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import EntrarComGoogle from "./EntrarComGoogle";

const sessionSchema = z.object({ ok: z.literal(true), account: z.object({ id: z.number(), name: z.string(), administrator: z.boolean().optional() }).nullable(), csrf: z.string(), google_client_id: z.string(), google_nonce: z.string() });
type Session = z.infer<typeof sessionSchema>;
type Action = "login" | "register" | "reset_request" | "verify_email" | "reset_password";

export default function FormularioDeAcesso() {
  const [session, setSession] = useState<Session | null>(null);
  const [action, setAction] = useState<Action>("login");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const loadSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth.php', { credentials: 'same-origin', headers: { Accept: 'application/json' }, cache: 'no-store' });
      if (!response.ok) throw new Error('Cadastro ainda não habilitado. A confirmação demonstrativa continua disponível.');
      setSession(sessionSchema.parse(await response.json()));
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Serviço indisponível.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    const fragment = new URLSearchParams(location.hash.slice(1));
    const requested = fragment.get('action');
    if (requested === 'verify_email' || requested === 'reset_password') { setAction(requested); setToken(fragment.get('token') ?? ''); history.replaceState(null, '', location.pathname); }
    void loadSession();
  }, [loadSession]);
  const submit = useCallback(async (payload: Record<string, string>) => {
    if (!session || busy) return;
    setBusy(true); setError(''); setMessage('');
    try {
      const response = await fetch('/api/auth.php', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': session.csrf }, body: JSON.stringify(payload) });
      const result = z.object({ ok: z.boolean(), message: z.string().optional() }).parse(await response.json());
      if (!response.ok || !result.ok) throw new Error(result.message ?? 'Não foi possível concluir.');
      setToken(''); setMessage(result.message ?? (payload.action === 'logout' ? 'Você saiu da conta.' : 'Operação concluída.'));
      window.dispatchEvent(new Event("casamento-session"));
      await loadSession();
      if (payload.action === 'verify_email' || payload.action === 'reset_password') setAction('login');
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Serviço indisponível.'); }
    finally { setBusy(false); }
  }, [session, busy, loadSession]);
  const googleCredential = useCallback(async (credential: string) => { await submit({ action: 'google', credential }); }, [submit]);
  return <main className="mx-auto max-w-lg px-5 py-16">
    <h1 className="font-display text-5xl text-primary">Seu acesso</h1>
    {loading && <p role="status">Carregando…</p>}
    {error && <p role="alert" className="mt-6 text-destructive">{error}</p>}
    {message && <p role="status" className="mt-6">{message}</p>}
    {session?.account ? <div className="mt-8 space-y-4"><p>Olá, {session.account.name}.</p><p>Vinculação e cadastro do grupo estão em implementação.</p>{session.account.administrator && <Link to="/administracao/assistente" className="underline">Memória do assistente</Link>}<button className="acao-principal cursor-pointer" disabled={busy} onClick={() => void submit({ action: 'logout' })}>Sair</button></div> : session && <>
      <div className="my-8"><EntrarComGoogle clientId={session.google_client_id} nonce={session.google_nonce} onCredential={googleCredential} /></div>
      <form className="grid gap-4" onSubmit={event => { event.preventDefault(); const form = event.currentTarget; const values = new FormData(form); const payload: Record<string, string> = { action, token }; for (const [key, value] of values) if (typeof value === 'string') payload[key] = value; form.reset(); void submit(payload); }}>
        <h2 className="text-2xl">{action === 'login' ? 'E-mail e senha' : action === 'register' ? 'Criar conta' : action === 'verify_email' ? 'Verificar e-mail' : 'Recuperar acesso'}</h2>
        {action === 'register' && <label>Nome<input className="mt-1 block w-full rounded border p-3" name="name" autoComplete="name" required minLength={2} maxLength={160} /></label>}
        {action !== 'verify_email' && action !== 'reset_password' && <label>E-mail<input className="mt-1 block w-full rounded border p-3" name="email" type="email" autoComplete="email" required maxLength={254} /></label>}
        {action !== 'verify_email' && action !== 'reset_request' && <label>Senha<input className="mt-1 block w-full rounded border p-3" name="password" type="password" autoComplete={action === 'login' ? 'current-password' : 'new-password'} required minLength={action === 'login' ? 1 : 12} maxLength={128} /></label>}
        <button className="acao-principal cursor-pointer" disabled={busy}>{busy ? 'Aguarde…' : action === 'login' ? 'Entrar' : action === 'register' ? 'Criar conta' : action === 'verify_email' ? 'Verificar e-mail' : action === 'reset_password' ? 'Salvar nova senha' : 'Enviar link'}</button>
      </form>
      <div className="mt-6 flex flex-wrap gap-5">{([['login','Entrar'],['register','Criar conta'],['reset_request','Esqueci minha senha']] as const).map(([value,label]) => <button className="cursor-pointer underline" key={value} disabled={busy} onClick={() => { setAction(value); setError(''); setMessage(''); }}>{label}</button>)}</div>
    </>}
    <Link className="mt-8 inline-flex min-h-11 items-center underline" to="/#presenca">Voltar ao site</Link>
  </main>;
}
