import { useCallback, useEffect, useState } from 'react';
import { z } from 'zod';
const schema=z.object({ok:z.literal(true),account:z.object({id:z.number(),name:z.string(),administrator:z.boolean().optional()}).nullable(),csrf:z.string(),google_client_id:z.string(),google_nonce:z.string()});
export default function useSessaoDeAcesso(){
 const [session,setSession]=useState<z.infer<typeof schema>|null>(null);
 const [loading,setLoading]=useState(true);
 const refresh=useCallback(async()=>{try{const response=await fetch('/api/auth.php',{credentials:'same-origin',cache:'no-store'});if(!response.ok){setSession(null);return;}setSession(schema.parse(await response.json()));}catch{setSession(null);}finally{setLoading(false);}},[]);
 useEffect(()=>{void refresh();const handler=()=>void refresh();window.addEventListener('casamento-session',handler);window.addEventListener('focus',handler);const timer=window.setInterval(handler,60000);return()=>{window.removeEventListener('casamento-session',handler);window.removeEventListener('focus',handler);window.clearInterval(timer);};},[refresh]);
 return {session,loading,refresh};
}
