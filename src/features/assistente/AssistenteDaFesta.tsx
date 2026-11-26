import { useCallback, useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { MessageCircle } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useSessaoDeAcesso from '../autenticacao/SessaoDeAcesso';
import EntrarComGoogle from '../autenticacao/EntrarComGoogle';
import { grupoDoConvite, pedirAoConvite } from '../presenca/apiDeConvites';
import PainelDoChat, {type ChatMessage, type ChatSource} from './PainelDoChat';
const vinculosSchema = z.object({ ok: z.literal(true), groups: z.array(grupoDoConvite) });
const resultSchema=z.object({ok:z.literal(true),answer:z.string(),version:z.number().nullable(),context_key:z.string(),sources:z.array(z.object({id:z.string(),title:z.string(),url:z.string().nullable().optional()}))});
export default function AssistenteDaFesta(){
 const {session,loading,refresh}=useSessaoDeAcesso();const location=useLocation();const navigate=useNavigate();
 const naHome=location.pathname==='/';
 const retomando=naHome&&new URLSearchParams(location.search).get('assistente')==='1';
 const [acessoAoConvite, setAcessoAoConvite] = useState<{ conta: number; estado: 'vinculado' | 'pendente' | 'indisponivel' }>();
 const [revisao, setRevisao] = useState(0);
 const [erroLogin, setErroLogin] = useState('');
 const loginEmAndamento = useRef(false);
 const [entrando, setEntrando] = useState(false);const [open,setOpen]=useState(false);const [messages,setMessages]=useState<ChatMessage[]>([]);const [sources,setSources]=useState<ChatSource[]>([]);const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [contextKey,setContextKey]=useState('');const request=useRef<AbortController|null>(null);const owner=useRef<number|null>(null);
 useEffect(()=>{if(owner.current!==session?.account?.id){request.current?.abort();owner.current=session?.account?.id??null;setMessages([]);setSources([]);setContextKey('');setBusy(false);setError('');setAcessoAoConvite(undefined);}},[session?.account?.id]);
 useEffect(()=>{const clear=()=>{request.current?.abort();setMessages([]);setSources([]);setContextKey('');setBusy(false);setError('');setAcessoAoConvite(undefined);};window.addEventListener('casamento-session',clear);return()=>{clear();window.removeEventListener('casamento-session',clear);};},[]);
 const conta = session?.account?.id;
 const csrf = session?.csrf;
 const aberto = open || retomando;
 useEffect(() => {
   if (!aberto || !conta || !csrf) return;
   let ativo = true;
   void pedirAoConvite('convites', csrf, { action: 'mine' }, vinculosSchema)
     .then(({ groups }) => { if (ativo) setAcessoAoConvite({ conta, estado: groups.length ? 'vinculado' : 'pendente' }); })
     .catch(() => { if (ativo) setAcessoAoConvite({ conta, estado: 'indisponivel' }); });
   return () => { ativo = false; };
 }, [aberto, conta, csrf, revisao]);

 const entrar = useCallback(async (dados: { action: 'google'; credential: string } | { action: 'fixture_login'; email: string; password: string }) => {
   if (!csrf || loginEmAndamento.current) return;
   loginEmAndamento.current = true;
   setEntrando(true); setErroLogin('');
   try {
     const response = await fetch('/api/auth.php', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf }, body: JSON.stringify(dados) });
     const result = z.object({ ok: z.boolean(), message: z.string().optional() }).safeParse(await response.json().catch(() => null));
     if (!response.ok || !result.success || !result.data.ok) throw Error(result.success && result.data.message ? result.data.message : 'Não foi possível entrar. Tente novamente.');
     window.dispatchEvent(new Event('casamento-session'));
     await refresh();
   } catch (e) { setErroLogin(e instanceof Error ? e.message : 'Não foi possível entrar.'); }
   finally { loginEmAndamento.current = false; setEntrando(false); }
 }, [csrf, refresh]);
 const loginGoogle = useCallback((credential: string) => entrar({ action: 'google', credential }), [entrar]);

 const close=useCallback(()=>{
   setOpen(false);
   if(retomando){const query=new URLSearchParams(location.search);query.delete('assistente');const search=query.toString();navigate({pathname:'/',search:search?`?${search}`:'',hash:location.hash},{replace:true});}
 },[retomando,location.search,location.hash,navigate]);
 async function send(text:string){if(!session?.account||busy)return;const next:ChatMessage[]=[...messages.slice(-10),{role:'user',content:text}];setBusy(true);setError('');const accountId=session.account.id;const controller=new AbortController();request.current=controller;
 try{const response=await fetch('/api/assistente.php',{method:'POST',credentials:'same-origin',signal:controller.signal,headers:{'Content-Type':'application/json','X-CSRF-Token':session.csrf},body:JSON.stringify({messages:next,context_key:contextKey})});if(response.status===401){void refresh();throw Error('Entre novamente para continuar.');}if(!response.ok){const data=await response.json();if(response.status===403&&data.message==='Vincule um convite para usar o assistente.'){setAcessoAoConvite({ conta: accountId, estado: 'pendente' });return;}if(response.status===409){setMessages([]);setSources([]);setContextKey('');}throw Error(typeof data.message==='string'?data.message:'Assistente indisponível.');}const result=resultSchema.parse(await response.json());if(owner.current!==accountId)return;setContextKey(result.context_key);setMessages([...next,{role:'assistant',content:result.answer}]);setSources(result.sources.map(source=>({id:source.id,title:source.title,url:source.url})));}catch(e){if(!controller.signal.aborted)setError(e instanceof Error?e.message:'Serviço indisponível.');}finally{if(owner.current===accountId)setBusy(false);}}
 if(!naHome&&!session?.account)return null;
 const estado = acessoAoConvite?.conta === conta ? acessoAoConvite?.estado : undefined;
 const acesso = loading ? <p role="status">Verificando acesso…</p> : !session?.account ? (
    <div className="chat-entrada"><img src="/monograma-vf.png" width="64" height="44" alt=""/><p className="rubrica-do-convite">Victória &amp; Flávio</p><strong>Pergunte sobre a festa</strong><p>Entre para consultar horários, informações do local e transporte.</p>
      {session?.google_client_id && <EntrarComGoogle clientId={session.google_client_id} nonce={session.google_nonce} onCredential={loginGoogle} />}
      {session?.fixture_login && <form className="chat-login-form" onSubmit={e => { e.preventDefault(); const form = new FormData(e.currentTarget); void entrar({ action: 'fixture_login', email: String(form.get('email')).trim().toLowerCase(), password: String(form.get('password')) }); }}>
        <label>E-mail de teste<input name="email" type="email" autoComplete="username" required /></label><label>Senha de teste<input name="password" type="password" autoComplete="current-password" required /></label><button disabled={entrando}>Entrar</button>
      </form>}
      {entrando && <p role="status">Entrando…</p>}{erroLogin && <p role="alert">{erroLogin}</p>}
      <Link className="chat-alternativa" to="/acesso?origem=assistente" onClick={close}>{session?.google_client_id || session?.fixture_login ? 'Outras formas de entrar' : 'Entrar na minha conta'}</Link>
    </div>
  ) : estado === 'pendente' ? (
    <><p>Vincule seu convite para usar o assistente da festa.</p><Link className="chat-acesso-link" to="/meu-convite" onClick={close}>Abrir meu convite</Link></>
  ) : estado === 'indisponivel' ? (
    <><p role="alert">Não foi possível consultar seu convite.</p><button className="chat-acesso-link" onClick={() => { setAcessoAoConvite(undefined); setRevisao(x => x + 1); }}>Tentar novamente</button></>
  ) : estado === 'vinculado' ? null : <p role="status">Verificando seu convite…</p>;
 return <><button type="button" className="chat-abrir" aria-haspopup="dialog" aria-label="Abrir assistente da festa" title="Assistente da festa" onClick={()=>{setAcessoAoConvite(undefined);setRevisao(x => x + 1);setOpen(true);}}><MessageCircle size={26} aria-hidden="true" /></button>{(open||retomando)&&<PainelDoChat acesso={acesso} messages={messages} sources={sources} onSend={text=>void send(text)} onClose={close} busy={busy} error={error}/>}</>;
}
