import { useCallback, useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import useSessaoDeAcesso from '../autenticacao/SessaoDeAcesso';
import PainelDoChat, {type ChatMessage, type ChatSource} from './PainelDoChat';
const resultSchema=z.object({ok:z.literal(true),answer:z.string(),version:z.number().nullable(),sources:z.array(z.object({id:z.string(),title:z.string(),url:z.string().nullable().optional()}))});
export default function AssistenteDaFesta(){
 const {session,refresh}=useSessaoDeAcesso();const [open,setOpen]=useState(false);const [messages,setMessages]=useState<ChatMessage[]>([]);const [sources,setSources]=useState<ChatSource[]>([]);const [busy,setBusy]=useState(false);const [error,setError]=useState('');const request=useRef<AbortController|null>(null);const owner=useRef<number|null>(null);
 useEffect(()=>{if(owner.current!==session?.account?.id){request.current?.abort();owner.current=session?.account?.id??null;setMessages([]);setSources([]);setOpen(false);setBusy(false);setError('');}},[session?.account?.id]);
 useEffect(()=>{const clear=()=>{request.current?.abort();setMessages([]);setSources([]);setOpen(false);};window.addEventListener('casamento-session',clear);return()=>{clear();window.removeEventListener('casamento-session',clear);};},[]);
 const close=useCallback(()=>setOpen(false),[]);
 async function send(text:string){if(!session?.account||busy)return;const next:ChatMessage[]=[...messages.slice(-10),{role:'user',content:text}];setBusy(true);setError('');const accountId=session.account.id;const controller=new AbortController();request.current=controller;
 try{const response=await fetch('/api/assistente.php',{method:'POST',credentials:'same-origin',signal:controller.signal,headers:{'Content-Type':'application/json','X-CSRF-Token':session.csrf},body:JSON.stringify({messages:next})});if(response.status===401){void refresh();throw Error('Entre novamente para continuar.');}if(!response.ok){const data=await response.json();throw Error(typeof data.message==='string'?data.message:'Assistente indisponível.');}const result=resultSchema.parse(await response.json());if(owner.current!==accountId)return;setMessages([...next,{role:'assistant',content:result.answer}]);setSources(result.sources.map(source=>({id:source.id,title:source.title,url:source.url})));}catch(e){if(!controller.signal.aborted)setError(e instanceof Error?e.message:'Serviço indisponível.');}finally{if(owner.current===accountId)setBusy(false);}}
 if(!session?.account)return null;
 return <><button className="chat-abrir" onClick={()=>setOpen(true)}>Assistente da festa</button>{open&&<PainelDoChat messages={messages} sources={sources} onSend={text=>void send(text)} onClose={close} busy={busy} error={error}/>}</>;
}
