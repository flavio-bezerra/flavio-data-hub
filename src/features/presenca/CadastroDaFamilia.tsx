import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { comprovanteDoConvite, detalhesDoConvite, pedirAoConvite } from './apiDeConvites';
import ComprovanteDePresenca from './ComprovanteDePresenca';

const resposta = z.object({ ok: z.literal(true), receipt: comprovanteDoConvite });
const dataDoPrazo = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Sao_Paulo' });

export default function CadastroDaFamilia({ dados, csrf, recarregar }: { dados: z.output<typeof detalhesDoConvite>; csrf: string; recarregar: () => void }) {
  const { group, guests } = dados;
  const [pessoas, setPessoas] = useState(guests.map(p => ({ id: p.id, revision: p.revision, full_name: p.display_name, phone: p.contact_phone ?? '', attendance: p.attendance })));
  const [telefone, setTelefone] = useState(group.contact_phone ?? '');
  const [etapa, setEtapa] = useState<'preencher' | 'revisar' | 'comprovante'>(group.receipt ? 'comprovante' : 'preencher');
  const [recibo, setRecibo] = useState(group.receipt);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState('');
  const [precisaRecarregar, setPrecisaRecarregar] = useState(false);
  const titulo = useRef<HTMLHeadingElement>(null);
  const mudouEtapa = useRef(false);
  useEffect(() => { if (mudouEtapa.current) titulo.current?.focus(); }, [etapa]);
  const editar = (index: number, patch: Partial<(typeof pessoas)[number]>) => setPessoas(atuais => atuais.map((p, i) => i === index ? { ...p, ...patch } : p));
  const presentes = pessoas.filter(p => p.attendance === 'yes').length;
  const prazo = group.deadline === null ? null : new Date(group.deadline);
  const fechado = prazo !== null && prazo.getTime() <= Date.now();
  function mudarEtapa(nova: typeof etapa) { mudouEtapa.current = true; setErro(''); setEtapa(nova); }
  async function confirmar() {
    setErro(''); setOcupado(true);
    try {
      const { receipt } = await pedirAoConvite('confirmacoes', csrf, { group_id: group.id, contact_phone: telefone.trim(), responses: pessoas }, resposta);
      setRecibo(receipt); setPrecisaRecarregar(true); mudarEtapa('comprovante');
    } catch (e) { setErro(e instanceof Error ? e.message : 'Não foi possível confirmar.'); }
    finally { setOcupado(false); }
  }
  return <section className="space-y-5">
    <h2 ref={titulo} tabIndex={-1} className="font-display text-3xl outline-none">{etapa === 'revisar' ? 'Revise suas respostas' : group.label}</h2>
    <p className="rounded border p-3 text-sm" role="status">{recibo ? 'Resposta registrada. Seu comprovante está disponível nesta página.' : fechado ? 'Prazo encerrado. Nenhum comprovante foi emitido para este convite.' : 'Falta confirmar a presença do grupo.'}</p>
    {prazo && <p className="text-sm text-muted-foreground">{fechado ? 'Prazo encerrado em' : 'Você pode alterar até'} {dataDoPrazo.format(prazo)} (horário de São Paulo).</p>}
    {erro && <p role="alert" className="text-destructive">{erro}</p>}
    {etapa === 'comprovante' && recibo && <>
      <ComprovanteDePresenca protocolo={recibo.protocol} data={recibo.confirmed_at} grupo={group.label} pessoas={pessoas.map(p => ({ id: p.id, nome: p.full_name, presente: p.attendance === 'yes' }))} />
      {!fechado && <Button variant="outline" onClick={() => precisaRecarregar ? recarregar() : mudarEtapa('preencher')}>{precisaRecarregar ? 'Recarregar cadastro' : 'Editar confirmação'}</Button>}
    </>}
    {etapa === 'preencher' && !fechado && <form className="space-y-4" onSubmit={evento => {
      evento.preventDefault(); const revisadas = pessoas.map(p => ({ ...p, full_name: p.full_name.trim().replace(/\s+/gu, ' ') }));
      if (revisadas.some(p => p.attendance === 'pending' || !p.full_name.includes(' '))) { setErro('Preencha o nome completo e escolha uma resposta para cada pessoa.'); return; }
      setPessoas(revisadas); mudarEtapa('revisar');
    }}>
      <p>Confira o nome completo e a presença de cada pessoa. O telefone individual é opcional.</p>
      {group.responsible_email && <p className="break-words text-sm">E-mail do responsável: <strong>{group.responsible_email}</strong></p>}
      {pessoas.map((p, i) => <fieldset key={p.id} className="linha-da-familia">
        <legend className="rubrica-do-convite pr-3">Pessoa {i + 1}</legend>
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)]">
        <label className="block">Nome completo<input className="mt-1 block min-h-11 w-full rounded border p-2" value={p.full_name} required maxLength={160} autoComplete="off" onChange={e => editar(i, { full_name: e.target.value })} /></label>
        <label className="block">Telefone <span className="text-sm text-muted-foreground">(opcional)</span><input className="mt-1 block min-h-11 w-full rounded border p-2" type="tel" inputMode="tel" value={p.phone} maxLength={32} onChange={e => editar(i, { phone: e.target.value })} /></label>
        </div>
        <div role="group" aria-label={`Presença da pessoa ${i + 1}`} className="mt-3 flex flex-wrap gap-2">
          {([{ valor: 'yes', texto: 'Vai comparecer' }, { valor: 'no', texto: 'Não vai comparecer' }] as const).map(opcao => <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded border px-3 has-[:checked]:border-primary has-[:checked]:bg-secondary" key={opcao.valor}><input type="radio" required name={`presenca-${p.id}`} checked={p.attendance === opcao.valor} onChange={() => editar(i, { attendance: opcao.valor })} />{opcao.texto}</label>)}
        </div>
      </fieldset>)}
      <label className="block">Telefone do responsável {presentes > 0 ? '(obrigatório)' : '(opcional)'}<input className="mt-1 block min-h-11 w-full rounded border p-2" type="tel" inputMode="tel" autoComplete="tel" value={telefone} required={presentes > 0} maxLength={32} placeholder="DDD + telefone" onChange={e => setTelefone(e.target.value)} /></label>
      <p className="text-sm text-muted-foreground">Use DDD no Brasil ou +código do país. Os contatos são usados pela organização e não aparecem no comprovante.</p>
      <Button type="submit" disabled={pessoas.length === 0}>Revisar confirmação</Button>
      {recibo && <Button type="button" variant="link" onClick={recarregar}>Descartar alterações e ver comprovante</Button>}
    </form>}
    {etapa === 'revisar' && !fechado && <>
      <p>{presentes} {presentes === 1 ? 'presença' : 'presenças'} · {pessoas.length - presentes} não comparecerão</p>
      <ul className="divide-y rounded border px-4">{pessoas.map(p => <li key={p.id} className="flex flex-wrap justify-between gap-2 py-3"><span>{p.full_name}</span><strong className="text-sm">{p.attendance === 'yes' ? 'Vai comparecer' : 'Não vai comparecer'}</strong></li>)}</ul>
      <div className="flex flex-wrap gap-2"><Button variant="outline" disabled={ocupado} onClick={() => mudarEtapa('preencher')}>Voltar e editar</Button><Button disabled={ocupado} onClick={() => void confirmar()}>{ocupado ? 'Salvando…' : 'Confirmar e emitir comprovante'}</Button></div>
      {erro && <Button variant="link" onClick={recarregar}>Recarregar dados do servidor</Button>}
    </>}
  </section>;
}
