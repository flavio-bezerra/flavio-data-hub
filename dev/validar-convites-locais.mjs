import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { convitesLocais } from './convites-locais.mjs';

const middleware = convitesLocais();
const server = createServer((req,res) => { void middleware(req,res,() => res.writeHead(404).end()); });
server.listen(0,'127.0.0.1');
await once(server,'listening');
const base = `http://127.0.0.1:${server.address().port}`;
const auth = '/api/auth.php', conv = '/api/convites.php', rsvp = '/api/confirmacoes.php';
function navegador() {
  let cookie='', csrf='';
  return async (route, body, expected=200) => {
    const response=await fetch(base+route,{ method:body?'POST':'GET', headers:{cookie,origin:base,'x-csrf-token':csrf,...(body?{'Content-Type':'application/json'}:{})}, body:body?JSON.stringify(body):undefined });
    const data=await response.json();
    assert.equal(response.status,expected,JSON.stringify(data));
    if (response.headers.has('set-cookie')) cookie=response.headers.get('set-cookie').split(';')[0];
    if (data.csrf) csrf=data.csrf;
    return data;
  };
}
async function entrar(navegar,email){ await navegar(auth); await navegar(auth,{action:'fixture_login',email,password:'Convite-local-2027'}); return (await navegar(auth)).account; }
try {
  const admin=navegador(), convidado=navegador(), outra=navegador();
  assert.equal((await entrar(admin,'organizacao@example.test')).administrator,true);
  assert.equal((await entrar(convidado,'convidado@example.test')).administrator,false);
  await entrar(outra,'outra-familia@example.test');
  await convidado(conv,{action:'admin_list'},403);
  const {digest}=await admin(conv,{action:'import_preview'});
  assert.equal((await admin(conv,{action:'import_apply',digest})).created,1);
   await admin(conv,{action:'import_apply',digest},409);
   const csv='id_convite;grupo_familia;nome;id_pessoa\r\nCSV-001;Família Ipê;"Ana Ipê; Exemplo";P01\r\nCSV-001;Família Ipê;Rui Ipê;P02\r\n';
   await convidado(conv,{action:'import_preview',csv},403);
   await admin(conv,{action:'import_preview',csv:'nome\nAna'},422);
   const previa=await admin(conv,{action:'import_preview',csv});
   assert.equal(previa.groups[0].count,2);
   await admin(conv,{action:'import_apply',csv:csv.replace('Rui','Ruy'),digest:previa.digest},409);
   assert.equal((await admin(conv,{action:'import_apply',csv,digest:previa.digest})).created,1);
   assert.equal((await admin(conv,{action:'import_preview',csv})).groups[0].status,'unchanged');
   assert.equal((await admin(conv,{action:'import_preview',csv:csv.replace('Rui','Ruy')})).groups[0].status,'conflict');
   assert.equal((await admin(conv,{action:'admin_list',status:'unclaimed'})).groups.length,4);
   await convidado(conv,{action:'admin_deadline_read'},403);
  const {group_id}=await convidado(conv,{action:'claim',token:'a'.repeat(64)});
  await outra(conv,{action:'claim',token:'a'.repeat(64)},409);
  await outra(conv,{action:'read',group_id},404);
  const {guests}=await convidado(conv,{action:'read',group_id});
  const responses=guests.map((g,i)=>({id:g.id,revision:g.revision,full_name:g.display_name,attendance:i?'no':'yes'}));
  await convidado(rsvp,{group_id,responses,contact_phone:''},422);
  const {receipt}=await convidado(rsvp,{group_id,responses,contact_phone:'(11) 98765-4321'});
  assert.match(receipt.protocol,/^[a-f0-9]{32}$/);
  assert.deepEqual((await convidado(conv,{action:'read',group_id})).group.receipt,receipt);
  assert.equal((await admin(conv,{action:'admin_detail',group_id})).group.contact_phone,'+5511987654321');
   const panorama=await admin(conv,{action:'admin_overview'});
   assert.deepEqual([panorama.total,panorama.unclaimed,panorama.awaiting,panorama.complete,panorama.confirmed],[4,3,3,1,1]);
   const prazo=await admin(conv,{action:'admin_deadline_read'});
   await admin(conv,{action:'admin_deadline_update',revision:prazo.revision,deadline:'2027-10-11T12:30'},422);
   const fechado=await admin(conv,{action:'admin_deadline_update',revision:prazo.revision,deadline:'2025-04-01T12:30'});
   await admin(conv,{action:'admin_deadline_update',revision:prazo.revision,deadline:null},409);
   await convidado(rsvp,{group_id,responses,contact_phone:'(11) 98765-4321'},403);
   assert.deepEqual((await convidado(conv,{action:'read',group_id})).group.receipt,receipt);
   await admin(conv,{action:'admin_deadline_update',revision:fechado.revision,deadline:null});
   assert.equal((await convidado(conv,{action:'read',group_id})).group.deadline,null);
   await admin(conv,{action:'admin_transfer',group_id,email:'outra-familia@example.test'});
  await convidado(conv,{action:'read',group_id},404);
  assert.equal((await outra(conv,{action:'read',group_id})).group.receipt,null);
  await outra(auth,{action:'logout'}); await outra(auth); await outra(conv,{action:'mine'},401);
  console.log('Simulação validada: perfis, CSV, divergências, painel, prazo, vínculo, isolamento, comprovante, transferência e logout.');
} finally { server.close(); }
