import { useCallback, useState } from 'react';
import useSessaoDeAcesso from './SessaoDeAcesso';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import EntrarComGoogle from './EntrarComGoogle';

export default function FormularioDeAcesso({ codigo }: { codigo?: string | null }) {
  const { session, loading, refresh } = useSessaoDeAcesso();
  const location = useLocation();
  const [entrouAgora, setEntrouAgora] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [modo, setModo] = useState<'login' | 'cadastro' | 'esqueci' | 'verificar' | 'redefinir'>('login');

  const submit = useCallback(async (payload: Record<string, string | number>) => {
    if (!session || busy) return;
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/auth.php', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': session.csrf },
        body: JSON.stringify(payload),
      });
      const result = z.object({ ok: z.boolean(), message: z.string().optional() }).safeParse(await response.json().catch(() => null));
      if (!response.ok || !result.success || !result.data.ok) throw Error(result.success ? result.data.message ?? 'Não foi possível concluir.' : 'Serviço indisponível.');
      window.dispatchEvent(new Event('casamento-session'));
      setEntrouAgora(true);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Serviço indisponível.');
    } finally {
      setBusy(false);
    }
  }, [session, busy, refresh]);

  const googleCredential = useCallback(async (credential: string) => { await submit({ action: 'google', credential }); }, [submit]);

  if (entrouAgora && !codigo && session?.account && !session.account.administrator) return <Navigate to="/meu-convite" replace />;

  // ---- MODO LOGIN ----
  if (modo === 'login') {
    return (
      <div className="papelaria-do-convite">
        <main className="folha-do-convite folha-do-convite--acesso space-y-6">
          <Link className="inline-flex min-h-11 items-center gap-2 text-sm text-primary underline underline-offset-4" to="/#presenca"><span aria-hidden="true">←</span> Voltar ao casamento</Link>
          <header className="cabecalho-da-folha">
            <img src="/monograma-vf.png" width="76" height="52" alt="" />
            <p className="rubrica-do-convite">Victória &amp; Flávio · 10 de outubro de 2027</p>
            <h1 className="font-display text-primary">{codigo ? 'Acesse seu convite' : 'Área do convidado'}</h1>
          </header>
          {loading && <p role="status">Carregando…</p>}
          {(error || (!loading && !session)) && <p role="alert" className="text-destructive">{error || 'O acesso está indisponível no momento. Tente novamente mais tarde.'}</p>}
          {session?.account ? (
            <>
              <p>Olá, {session.account.name}.</p>
              <section className="space-y-3 border-t py-4">
                <h2 className="font-display text-3xl">Meu convite</h2>
                <p>Consulte os convidados da sua família, confirme a presença e recupere seu comprovante.</p>
                <Button asChild><Link to="/meu-convite">Abrir meu convite</Link></Button>
              </section>
              {session.account.administrator && (
                <section className="space-y-3 border-t py-4">
                  <h2 className="font-display text-3xl">Organização</h2>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" asChild><Link to="/administracao">Abrir painel da organização</Link></Button>
                    <Button variant="outline" asChild><Link to="/administracao/assistente">Memória e logística</Link></Button>
                  </div>
                </section>
              )}
              <footer className="border-t pt-5">
                <Button type="button" variant="outline" disabled={busy} onClick={() => void submit({ action: 'logout' })}>Sair da conta</Button>
              </footer>
            </>
          ) : (
            <>
              <p>{codigo ? 'Entre na sua conta para continuar com o convite que você recebeu.' : 'Entre na sua conta para acessar seu convite e confirmar presença.'}</p>
              {session?.google_client_id && <EntrarComGoogle clientId={session.google_client_id} nonce={session.google_nonce} onCredential={googleCredential} />}
              <form className="grid max-w-sm gap-3 rounded border p-4 mt-4" onSubmit={e => {
                e.preventDefault();
                const dados = new FormData(e.currentTarget);
                void submit({ action: 'email_login', email: String(dados.get('email')).trim().toLowerCase(), senha: String(dados.get('senha')) });
              }}>
                <label className="text-sm font-medium">E-mail</label>
                <input className="block min-h-11 w-full rounded border p-2" type="email" name="email" autoComplete="username" required />
                <label className="text-sm font-medium">Senha</label>
                <input className="block min-h-11 w-full rounded border p-2" type="password" name="senha" autoComplete="current-password" required />
                <Button type="submit" disabled={busy}>Entrar</Button>
                <p className="text-sm text-center">
                  Não tem conta?{' '}
                  <button type="button" onClick={() => setModo('cadastro')} className="text-primary underline underline-offset-4 hover:underline">Criar conta</button>
                </p>
                <p className="text-sm text-center">
                  <button type="button" onClick={() => setModo('esqueci')} className="text-primary underline underline-offset-4 hover:underline">Esqueci minha senha</button>
                </p>
              </form>
            </>
          )}
        </main>
      </div>
    );
  }

  // ---- MODO CADASTRO ----
  if (modo === 'cadastro') {
    return (
      <div className="papelaria-do-convite">
        <main className="folha-do-convite folha-do-convite--acesso space-y-6">
          <Link className="inline-flex min-h-11 items-center gap-2 text-sm text-primary underline underline-offset-4" to="/acesso">← Voltar ao login</Link>
          <header className="cabecalho-da-folha">
            <h1 className="font-display text-primary">Criar conta</h1>
          </header>
          {error && <p role="alert" className="text-destructive">{error}</p>}
          <form className="grid max-w-sm gap-3 rounded border p-4" onSubmit={e => {
            e.preventDefault();
            const dados = new FormData(e.currentTarget);
            void submit({
              action: 'register',
              name: String(dados.get('name')).trim(),
              email: String(dados.get('email')).trim().toLowerCase(),
              senha: String(dados.get('senha')),
              idade: String(dados.get('idade')),
            });
          }}>
            <label className="text-sm font-medium">Nome completo</label>
            <input className="block min-h-11 w-full rounded border p-2" type="text" name="name" autoComplete="name" required />
            <label className="text-sm font-medium">E-mail</label>
            <input className="block min-h-11 w-full rounded border p-2" type="email" name="email" autoComplete="username" required />
            <label className="text-sm font-medium">Idade (opcional)</label>
            <input className="block min-h-11 w-full rounded border p-2" type="number" name="idade" min="0" max="120" />
            <label className="text-sm font-medium">Senha (mínimo 8 caracteres)</label>
            <input className="block min-h-11 w-full rounded border p-2" type="password" name="senha" autoComplete="new-password" required />
            <Button type="submit" disabled={busy}>Criar conta</Button>
          </form>
          <p className="text-sm text-center">
            Já tem conta? <button type="button" onClick={() => setModo('login')} className="text-primary underline underline-offset-4 hover:underline">Entrar</button>
          </p>
        </main>
      </div>
    );
  }

  // ---- MODO ESQUECI SENHA ----
  if (modo === 'esqueci') {
    return (
      <div className="papelaria-do-convite">
        <main className="folha-do-convite folha-do-convite--acesso space-y-6">
          <Link className="inline-flex min-h-11 items-center gap-2 text-sm text-primary underline underline-offset-4" to="/acesso">← Voltar ao login</Link>
          <header className="cabecalho-da-folha">
            <h1 className="font-display text-primary">Esqueci minha senha</h1>
          </header>
          {error && <p role="alert" className="text-destructive">{error}</p>}
          <form className="grid max-w-sm gap-3 rounded border p-4" onSubmit={e => {
            e.preventDefault();
            const dados = new FormData(e.currentTarget);
            void submit({ action: 'esqueci_senha', email: String(dados.get('email')).trim().toLowerCase() });
          }}>
            <label className="text-sm font-medium">E-mail cadastrado</label>
            <input className="block min-h-11 w-full rounded border p-2" type="email" name="email" autoComplete="username" required />
            <Button type="submit" disabled={busy}>Enviar link de recuperação</Button>
          </form>
          <p className="text-sm text-center">
            Lembrou a senha? <button type="button" onClick={() => setModo('login')} className="text-primary underline underline-offset-4 hover:underline">Entrar</button>
          </p>
        </main>
      </div>
    );
  }

  // ---- MODO VERIFICAR EMAIL ----
  if (modo === 'verificar') {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    return (
      <div className="papelaria-do-convite">
        <main className="folha-do-convite folha-do-convite--acesso space-y-6 text-center">
          <Link className="inline-flex min-h-11 items-center gap-2 text-sm text-primary underline underline-offset-4" to="/acesso">← Voltar ao login</Link>
          <header className="cabecalho-da-folha">
            <h1 className="font-display text-primary">Confirmar e-mail</h1>
          </header>
          {loading && <p role="status">Verificando…</p>}
          {!loading && token && (
            <form className="grid max-w-sm gap-3 rounded border p-4 mx-auto" onSubmit={e => {
              e.preventDefault();
              void submit({ action: 'verificar_email', token });
            }}>
              <Button type="submit" disabled={busy}>Confirmar meu e-mail</Button>
            </form>
          )}
          {!loading && !token && (
            <p className="text-destructive">Token de confirmação não encontrado.</p>
          )}
          {error && <p role="alert" className="text-destructive">{error}</p>}
          <p className="text-sm text-center">
            Já confirmou? <button type="button" onClick={() => setModo('login')} className="text-primary underline underline-offset-4 hover:underline">Entrar</button>
          </p>
        </main>
      </div>
    );
  }

  // ---- MODO REDEFINIR SENHA ----
  if (modo === 'redefinir') {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    return (
      <div className="papelaria-do-convite">
        <main className="folha-do-convite folha-do-convite--acesso space-y-6">
          <Link className="inline-flex min-h-11 items-center gap-2 text-sm text-primary underline underline-offset-4" to="/acesso">← Voltar ao login</Link>
          <header className="cabecalho-da-folha">
            <h1 className="font-display text-primary">Redefinir senha</h1>
          </header>
          {error && <p role="alert" className="text-destructive">{error}</p>}
          {!loading && token && (
            <form className="grid max-w-sm gap-3 rounded border p-4" onSubmit={e => {
              e.preventDefault();
              const dados = new FormData(e.currentTarget);
              void submit({ action: 'resetar_senha', token, senha: String(dados.get('senha')) });
            }}>
              <label className="text-sm font-medium">Nova senha (mínimo 8 caracteres)</label>
              <input className="block min-h-11 w-full rounded border p-2" type="password" name="senha" autoComplete="new-password" required />
              <Button type="submit" disabled={busy}>Redefinir senha</Button>
            </form>
          )}
          {!loading && !token && (
            <p className="text-destructive">Token de redefinição não encontrado.</p>
          )}
        </main>
      </div>
    );
  }
}
