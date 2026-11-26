import { createHash, randomBytes } from 'node:crypto';

// Somente Vite serve em loopback. Dados em memória; não usa PHP, MySQL nem serviços externos.
export function convitesLocais({ listaGrande = false } = {}) {
  const contas = new Map([
    ['organizacao@example.test', { id: 1, name: 'Organização do casamento', administrator: true }],
    ['convidado@example.test', { id: 2, name: 'Convidado Exemplo', administrator: false }],
    ['outra-familia@example.test', { id: 3, name: 'Outra Família', administrator: false }],
  ]);
  const token = () => randomBytes(32).toString('hex');
  const grupos = new Map(); const sessoes = new Map(); let proximo = 1; let pessoa = 1;
  function criar(label, nomes, code = token(), external_id = null) {
    const item = { id: proximo++, label, external_id, code, owner: null, contact_phone: null, deadline: null, receipt: null, guests: nomes.map(display_name => ({ id: pessoa++, display_name, attendance: 'pending', contact_phone: null, revision: 0 })) };
    grupos.set(item.id, item); return item;
  }
  criar('Família Jardim', ['Ana Jardim Exemplo','Rui Jardim Exemplo'], 'a'.repeat(64), 'LOCAL-001');
  criar('Família Oliveira', ['Bia Oliveira Exemplo'], 'b'.repeat(64), 'LOCAL-002');
  // A prévia visual tem 180 pessoas em 61 grupos; os testes pequenos preservam sua base.
  if (listaGrande) for (let i = 0; i < 59; i++) {
    const numero = String(i + 3).padStart(3, '0');
    const nomes = [`Clara Exemplo ${numero}`, `Lucas Exemplo ${numero}`, `Marina Exemplo ${numero}`];
    criar(`Família Exemplo ${numero}`, nomes, token(), `DEMO-${numero}`);
  }
  const amostra = [{ id:'LOCAL-003',label:'Família Aurora',count:2, names:['Eva Aurora Exemplo','Ivo Aurora Exemplo'] }];
  let prazo = null; let revisaoDoPrazo = 0;
  function listaCsv(csv) {
    if (typeof csv !== 'string' || Buffer.byteLength(csv) > 16384) throw falha(422,'Use um CSV de até 16 KiB.');
    const [cabecalho, ...linhas] = csv.replace(/^\uFEFF/, '').split(/\r\n|\n|\r/);
    const separador = cabecalho.includes(';') ? ';' : ',';
    const campo = `(?:"(?:[^"]|"")*"|[^"${separador}]*)`;
    const linhaValida = new RegExp(`^${campo}(?:${separador}${campo})*$`);
    const ler = linha => {
      if (!linhaValida.test(linha)) throw falha(422,'CSV inválido.');
      return linha.match(new RegExp(`(?:^|${separador})(${campo})`, 'g')).map((celula, i) => (i ? celula.slice(1) : celula).replace(/^"(.*)"$/, '$1').replace(/""/g, '"').trim());
    };
    const colunas=ler(cabecalho).join(';');
    if(!['id_convite;grupo_familia;nome','id_convite;grupo_familia;nome;id_pessoa'].includes(colunas))throw falha(422,'Use as colunas do modelo.');
    const dados=linhas.filter(l=>l.trim());
    if(!dados.length||dados.length>250)throw falha(422,'O lote precisa ter de 1 a 250 pessoas.');
    const itens=new Map();
    for(const linha of dados){const campos=ler(linha);if(campos.length!==colunas.split(';').length)throw falha(422,'Número de colunas incorreto.');const [id,label,nome,person='']=campos;
      if(!/^[\w.-]{1,80}$/.test(id))throw falha(422,'ID inválido.');
      if(!itens.has(id))itens.set(id,{id,label,names:[],people:new Set(),issues:[]});
      const item=itens.get(id);const chave=person||nome.toLowerCase();
      if(!nome||!label||label!==item.label||label.length>160||nome.length>160||item.people.has(chave))item.issues.push('Preenchimento inconsistente ou pessoa duplicada.');
      item.people.add(chave);item.names.push(nome);
    }
    return [...itens.values()].map(({people,...x})=>({...x,count:x.names.length}));
  }
  const falha = (status, message) => Object.assign(new Error(message), { status });
  function resumo(g) { return { id:g.id, label:g.label }; }
  function detalhe(g, admin = false) {
    return { group:{ ...resumo(g), external_id:g.external_id, contact_phone:g.contact_phone, responsible_email:g.owner, deadline:prazo ? `${prazo}:00-03:00` : null, receipt:g.receipt, lodging_intent:g.lodging_intent, hotel_name:g.hotel_name, arrival_mode:g.arrival_mode, table_number:admin||g.table_visible?g.table_number:null, ...(admin?{table_visible:!!g.table_visible}:{}) }, guests:g.guests };
  }
  return async (req, res, next) => {
    const rota = new URL(req.url ?? '/', 'http://localhost').pathname;
    if (!rota.startsWith('/api/')) return next();
    const loopback = /^((127\.0\.0\.1)|(localhost)|\[::1\])(?::\d+)?$/;
    const responder = (status, body) => { res.writeHead(status, { 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store' }); res.end(JSON.stringify(body)); };
    const ok = body => responder(200, { ok:true, ...body });
    try {
      if (!loopback.test(req.headers.host ?? '') || !['127.0.0.1','::1','::ffff:127.0.0.1'].includes(req.socket.remoteAddress)) throw falha(403,'Acesso local apenas.');
      if (!['GET','POST'].includes(req.method)) throw falha(405,'Método indisponível.');
      if (req.method === 'POST' && req.headers.origin !== `http://${req.headers.host}`) throw falha(403,'Origem inválida.');
      // Cookies HTTP não separam portas: isole cada prévia local.
      const nomeDoCookie = `casamento_fixture_${req.socket.localPort}`;
      let sid = (req.headers.cookie ?? '').split(';').map(c => c.trim()).find(c => c.startsWith(`${nomeDoCookie}=`))?.slice(nomeDoCookie.length + 1);
      let sessao = sessoes.get(sid);
      const trocarSessao = email => { if (sid) sessoes.delete(sid); sid = token(); sessao = { email, csrf:token() }; sessoes.set(sid,sessao); res.setHeader('Set-Cookie',`${nomeDoCookie}=${sid}; Path=/; HttpOnly; SameSite=Strict`); };
      if (rota === '/api/auth.php' && req.method === 'GET') { if (!sessao) trocarSessao(null); return ok({ account:contas.get(sessao.email) ?? null, csrf:sessao.csrf, google_nonce:'', google_client_id:'', fixture_login:true }); }
      if (req.method !== 'POST') throw falha(405,'Método indisponível.');
      if (!sessao || req.headers['x-csrf-token'] !== sessao.csrf) throw falha(403,'Recarregue para renovar sua sessão.');
      const chunks=[]; let tamanho=0;
      for await (const chunk of req) { tamanho += chunk.length; if(tamanho>49152)throw falha(413,'Solicitação muito grande.'); chunks.push(chunk); }
      let body; try { body = JSON.parse(Buffer.concat(chunks).toString()); if (!body || typeof body !== 'object' || Array.isArray(body)) throw Error(); } catch { throw falha(422,'Dados inválidos.'); }
      const action = body.action;
      if (rota === '/api/auth.php') {
        if (action === 'logout') { trocarSessao(null); return ok({}); }
        if (action !== 'fixture_login' || body.password !== 'Convite-local-2027' || !contas.has(body.email)) throw falha(403,'Conta fictícia ou senha inválida.');
        trocarSessao(body.email); return ok({});
      }
      const conta = contas.get(sessao.email);
      if (!conta) throw falha(401,'Entre na sua conta.');
      if (rota === '/api/assistente.php') {
        if (body.preview_version !== undefined) throw falha(503,'A prévia de versões não faz parte desta simulação local.');
        if (![...grupos.values()].some(grupo => grupo.owner === sessao.email)) throw falha(403,'Vincule um convite para usar o assistente.');
        const mensagem = Array.isArray(body.messages) ? body.messages.at(-1) : null;
        if (mensagem?.role !== 'user' || typeof mensagem.content !== 'string' || !mensagem.content.trim() || mensagem.content.length > 1800) throw falha(422,'Envie uma pergunta válida.');
        return ok({ answer:'Resposta fictícia para testar o chat. Nenhum serviço de IA foi consultado e esta mensagem não contém informações do evento.', version:null, context_key:'simulacao-local', sources:[] });
      }
      if (rota === '/api/memoria.php' || rota === '/api/contexto.php') throw falha(503,'A memória e a logística não fazem parte desta simulação local.');
      const g = grupos.get(body.group_id);
      if (rota === '/api/confirmacoes.php') {
        if (!g || g.owner !== sessao.email) throw falha(404,'Convite indisponível.');
        if(prazo&&Date.now()>=Date.parse(`${prazo}:00-03:00`))throw falha(403,'Prazo de confirmação encerrado.');
        if (!Array.isArray(body.responses) || body.responses.length !== g.guests.length || new Set(body.responses.map(p=>p.id)).size !== g.guests.length) throw falha(422,'Responda por todas as pessoas.');
        const telefone = valor => { const s=String(valor ?? '').trim(); if(!s)return null; if(!/^\+?[0-9(). -]{8,32}$/.test(s))throw falha(422,'Telefone inválido.'); const n=s.replace(/\D/g,''); if(s.startsWith('+')? !/^[1-9]\d{7,14}$/.test(n): !/^[1-9]\d{9,10}$/.test(n))throw falha(422,'Informe DDD + telefone ou código do país.'); return (s.startsWith('+')?'+':'+55')+n; };
        const contato=telefone(body.contact_phone);
        const novas=g.guests.map(p => {const r=body.responses.find(v=>v.id===p.id); if(!r||r.revision!==p.revision)throw falha(409,'O cadastro mudou. Recarregue.'); if(typeof r.full_name!=='string'||!r.full_name.trim().includes(' ')||!['yes','no'].includes(r.attendance))throw falha(422,'Revise os nomes completos e as presenças.'); return {...p, display_name:r.full_name.trim(), contact_phone:telefone(r.phone), attendance:r.attendance, revision:p.revision+1};});
        if(novas.some(p=>p.attendance==='yes')&&!contato)throw falha(422,'Informe o telefone do responsável.');
        g.guests=novas.map(p=>({...p,arrival_override:p.attendance==='yes'?(g.guests.find(anterior=>anterior.id===p.id)?.arrival_override??null):null})); g.contact_phone=contato; g.receipt={ protocol:token().slice(0,32),confirmed_at:new Date().toISOString() }; return ok({ receipt:g.receipt });
      }
      if(rota !== '/api/convites.php') throw falha(503,'Este serviço não está disponível no ambiente local.');
      if(action==='logistics_save'){
         if(!g||g.owner!==sessao.email)throw falha(404,'Convite indisponível.');
         const presentes=g.guests.filter(p=>p.attendance==='yes');
         if(!g.receipt||!presentes.length)throw falha(409,'Confirme a presença antes de informar a logística.');
         const modes=['undecided','car','app','van'];
         if(!modes.includes(body.arrival_mode)||!['undecided','yes','no'].includes(body.lodging_intent)||typeof body.hotel_name!=='string'||body.hotel_name.length>160||!Array.isArray(body.overrides)||new Set(body.overrides.map(x=>x?.guest_id)).size!==body.overrides.length||body.overrides.some(x=>!presentes.some(p=>p.id===x?.guest_id)||!modes.includes(x.mode)))throw falha(422,'Revise hospedagem e transporte.');
         g.arrival_mode=body.arrival_mode;g.lodging_intent=body.lodging_intent;g.hotel_name=body.lodging_intent==='yes'?body.hotel_name.trim()||null:null;
         for(const p of g.guests)p.arrival_override=body.overrides.find(x=>x.guest_id===p.id)?.mode??null;
         return ok({});
       }
       if(action==='mine')return ok({groups:[...grupos.values()].filter(x=>x.owner===sessao.email).map(resumo)});
      if(action==='claim'){const item=[...grupos.values()].find(x=>x.code===body.token); if(!item)throw falha(404,'Convite indisponível.'); if(item.owner&&item.owner!==sessao.email)throw falha(409,'Este convite já tem um responsável.'); item.owner=sessao.email; return ok({group_id:item.id});}
      if(action==='read'){if(!g||g.owner!==sessao.email)throw falha(404,'Convite indisponível.');return ok(detalhe(g));}
      if(!conta.administrator)throw falha(403,'Acesso administrativo não autorizado.');
        if(action==='admin_logistics_summary'){
          const transport={car:0,app:0,van:0,undecided:0},hotels=new Map(),tables=new Map();let lodging=0,unassigned=0;
          for(const row of grupos.values())if(row.receipt)for(const p of row.guests)if(p.attendance==='yes'){
            transport[p.arrival_override??row.arrival_mode??'undecided']++;if(row.lodging_intent==='yes'){lodging++;const name=row.hotel_name??'Hotel não informado';hotels.set(name,(hotels.get(name)??0)+1);}
            if(row.table_number)tables.set(row.table_number,(tables.get(row.table_number)??0)+1);else unassigned++;
          }
          return ok({transport,lodging,unassigned,hotels:[...hotels].map(([name,count])=>({name,count})),tables:[...tables].map(([number,count])=>({number,count}))});
        }
        if(action==='admin_email_send')throw falha(503,'Não há envio real no simulador.');
        if(action==='admin_email_preview'){
          const {montarComunicado}=await import('../backend/autenticacao/modelo-de-comunicado.js');
          if(!['table','reminder','hotel','van','guide','thanks','message'].includes(body.template)||!['test','selected','eligible'].includes(body.audience)||!Array.isArray(body.group_ids)||typeof body.message!=='string'||typeof body.subject!=='string'||body.message.length>3000||body.subject.length>140||(body.template==='message'&&(!body.subject.trim()||body.audience==='eligible'))||(!['table','reminder'].includes(body.template)&&!body.message.trim()))throw falha(422,'Revise o modelo e a mensagem.');
          const ficticia={group_id:0,label:'Família Exemplo',table_number:12};
          const candidatas=[...grupos.values()].filter(x=>body.audience!=='selected'||body.group_ids.includes(x.id)).filter(x=>{
            const presentes=x.guests.filter(p=>p.attendance==='yes');
            if(body.template==='reminder')return !x.receipt;
            if(body.template==='message')return true;
            if(!x.receipt||!presentes.length)return false;
            if(body.template==='table')return x.table_visible&&x.table_number;
            if(body.template==='hotel')return x.lodging_intent==='yes';
            if(body.template==='van')return presentes.some(p=>(p.arrival_override??x.arrival_mode)==='van');
            return true;
          });
          const recipients=body.audience==='test'?[ficticia]:candidatas.filter(x=>x.owner).map(x=>({group_id:x.id,label:x.label,table_number:x.table_visible?x.table_number:null}));
          return ok({enabled:false,recipients,skipped:body.audience==='test'?0:(body.audience==='selected'?new Set(body.group_ids).size:candidatas.length)-recipients.length,fingerprint:createHash('sha256').update(JSON.stringify([body.template,body.audience,body.subject,body.message,recipients])).digest('hex'),preview:montarComunicado(body,recipients.find(x=>x.group_id===body.preview_group_id)??recipients[0]??ficticia,`http://${req.headers.host}`)});
        }
        if(action==='admin_overview'){
         const gruposAtivos=[...grupos.values()];const completos=gruposAtivos.filter(g=>g.receipt);
         return ok({total:gruposAtivos.length,unclaimed:gruposAtivos.filter(g=>!g.owner).length,awaiting:gruposAtivos.length-completos.length,complete:completos.length,confirmed:completos.reduce((n,g)=>n+g.guests.filter(p=>p.attendance==='yes').length,0)});
       }
       if(action==='admin_deadline_read')return ok({deadline:prazo,revision:revisaoDoPrazo});
       if(action==='admin_deadline_update'){
         if(body.revision!==revisaoDoPrazo)throw falha(409,'O prazo mudou.');
         if(body.deadline!==null&&(!/^20\d\d-\d\d-\d\dT\d\d:\d\d$/.test(body.deadline)||!Number.isFinite(Date.parse(body.deadline))||body.deadline>'2027-10-10T13:30'))throw falha(422,'Prazo inválido.');
         prazo=body.deadline;return ok({deadline:prazo,revision:++revisaoDoPrazo});
       }
       if(action==='admin_list'){
        const busca=String(body.search??'').toLowerCase();
        const itens=[...grupos.values()].filter(x=>x.id>(body.after??0)).filter(x=>body.table==='none'?!x.table_number:typeof body.table==='number'?x.table_number===body.table:true).map(x=>({...resumo(x),external_id:x.external_id,whatsapp_contacted_at:x.whatsapp_contacted_at??null,has_receipt:!!x.receipt,responsible_account_id:contas.get(x.owner)?.id??null,responsible_name:contas.get(x.owner)?.name??null,total:x.guests.length,confirmed:x.guests.filter(p=>p.attendance==='yes').length,declined:x.guests.filter(p=>p.attendance==='no').length, termos:[x.label,x.external_id,x.id,...x.guests.map(p=>p.display_name)].join(' ').toLowerCase()})).filter(x=>x.termos.includes(busca)).filter(x=>!body.status||body.status==='all'||(body.status==='unclaimed'&&!x.responsible_account_id)||(body.status==='awaiting'&&!x.has_receipt)||(body.status==='no_email'&&!x.responsible_account_id)||(body.status==='whatsapp_pending'&&!x.whatsapp_contacted_at&&!x.has_receipt)||body.status===(x.has_receipt?'complete':x.confirmed+x.declined?'partial':'pending'));
        return ok({groups:itens.slice(0,25).map(({termos,...x})=>x),next:itens.length>25?itens[24].id:null});
      }
       if(action==='import_preview'||action==='import_apply'){
         const lista=body.csv===undefined?amostra:listaCsv(body.csv);
         const items=lista.map(x=>{const anterior=[...grupos.values()].find(g=>g.external_id===x.id);const fingerprint=JSON.stringify([x.label,[...x.names].sort()]);const status=x.issues?.length||x.names.length>100?'invalid':anterior?(anterior.importFingerprint===fingerprint?'unchanged':'conflict'):'new';return {...x,status,fingerprint};});
         const digest=createHash('sha256').update(JSON.stringify([body.csv??null,items])).digest('hex');
         if(action==='import_preview')return ok({digest,invalid_rows:[],groups:items.map(({names,fingerprint,...x})=>({...x,issues:x.issues??[]}))});
         if(body.digest!==digest)throw falha(409,'Atualize a prévia.');
         const novos=items.filter(x=>x.status==='new');for(const x of novos)criar(x.label,x.names,token(),x.id).importFingerprint=x.fingerprint;
         return ok({created:novos.length});
       }
      if(action==='admin_create'){if(!String(body.label??'').trim()||!Array.isArray(body.guests)||body.guests.length<1||body.guests.length>100)throw falha(422,'Informe o grupo e os convidados.');const item=criar(body.label,body.guests);return ok({group_id:item.id,token:item.code});}
      if(!g)throw falha(404,'Convite indisponível.');
       if(action==='admin_whatsapp_contact'){
         if(typeof body.contacted!=='boolean')throw falha(422,'Contato inválido.');
         g.whatsapp_contacted_at=body.contacted?new Date().toISOString():null;return ok({});
       }
       if(action==='admin_detail')return ok(detalhe(g,true));
       if(action==='admin_table'){
         const n=body.table_number,v=body.table_visible;if(typeof v!=='boolean'||(n!==null&&(!Number.isInteger(n)||n<1||n>999))||(v&&n===null))throw falha(422,'Informe uma mesa válida para divulgar.');
         g.table_number=n;g.table_visible=v;return ok({});
       }
      if(action==='admin_rotate'){if(g.owner)throw falha(409,'Este convite já tem responsável.');g.code=token();return ok({group_id:g.id,token:g.code});}
      if(action==='admin_transfer'){if(!g.owner||!contas.has(body.email)||g.owner===body.email)throw falha(422,'Escolha outra conta verificada.');g.owner=body.email;g.code=token();g.contact_phone=null;g.whatsapp_contacted_at=null;g.receipt=null;g.lodging_intent='undecided';g.hotel_name=null;g.arrival_mode='undecided';g.table_visible=false;for(const p of g.guests)p.arrival_override=null;return ok({group_id:g.id,token:null});}
      if(['admin_guest_add','admin_guest_remove','admin_guest_rename'].includes(action)){
        if(body.acknowledge!==true)throw falha(422,'Confirme a alteração.');
        const alvo=g.guests.find(p=>p.id===body.guest_id&&p.revision===body.revision);
        if(action!=='admin_guest_add'&&!alvo)throw falha(409,'O cadastro mudou.');
        const nome=String(body.name??'').trim();if(action!=='admin_guest_remove'&&(!nome||nome.length>160))throw falha(422,'Nome inválido.');
        if(action==='admin_guest_add')g.guests.push({id:pessoa++,display_name:nome,attendance:'pending',contact_phone:null,revision:0});
        if(action==='admin_guest_rename'){alvo.display_name=nome;alvo.revision++;}
        if(action==='admin_guest_remove'){if(g.guests.length<=1)throw falha(422,'Mantenha pelo menos uma pessoa.');g.guests=g.guests.filter(p=>p!==alvo);}
        g.receipt=null;return ok({group_id:g.id,token:null});
      }
      throw falha(404,'Operação indisponível.');
    } catch(e) { responder(e.status ?? 500,{ok:false,message:e.status?e.message:'Serviço local indisponível.'}); }
  };
}
