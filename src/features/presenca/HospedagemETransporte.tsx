import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { hoteisIndicados } from '@/features/casamento/conteudo';
import { detalhesDoConvite, hospedagem, pedirAoConvite, rotulosTransporte, transporte } from './apiDeConvites';
const salvo = z.object({ ok: z.literal(true) });

export default function HospedagemETransporte({ dados, presentes, csrf }: { dados: z.output<typeof detalhesDoConvite>; presentes: { id: number; full_name: string }[]; csrf: string }) {
  const { group, guests } = dados;
  const [hotel, setHotel] = useState(group.hotel_name ?? '');
  const [escolha, setEscolha] = useState(() => hoteisIndicados.find(h=>h.nome===group.hotel_name)?.nome ?? (group.hotel_name?'other':''));
  const [intencao, setIntencao] = useState(group.lodging_intent);
  const [chegada, setChegada] = useState(group.arrival_mode);
  const [excecoes, setExcecoes] = useState(Object.fromEntries(guests.map(p => [p.id, p.arrival_override ?? ''])));
  const [ocupado, setOcupado] = useState(false);
  const [estado, setEstado] = useState<{ erro: boolean; texto: string }>();
  const campo = 'mt-1 block min-h-11 w-full rounded border bg-white p-2';
  return <details className="rounded border p-4" open>
    <summary className="cursor-pointer font-medium">Hospedagem e transporte <span className="text-sm text-muted-foreground">(opcional)</span></summary>
    <p className="mt-2 text-sm">Ajude a gente a organizar a festa. A rota da van liga os dois hotéis indicados ao espaço. Informar interesse aqui não reserva hotel nem lugar na van.</p>
    <form className="mt-3 grid gap-3" onSubmit={async e => {
      e.preventDefault(); if (ocupado) return; setOcupado(true); setEstado(undefined);
      try {
        const overrides = presentes.filter(p => excecoes[p.id]).map(p => ({ guest_id: p.id, mode: excecoes[p.id] }));
        await pedirAoConvite('convites', csrf, { action: 'logistics_save', group_id: group.id, lodging_intent: intencao, hotel_name: hoteisIndicados.length ? (escolha==='other'?hotel.trim():escolha) : hotel.trim(), arrival_mode: chegada, overrides }, salvo);
        setEstado({ erro: false, texto: 'Preferências salvas. Seu comprovante não mudou.' });
      } catch (e) { setEstado({ erro: true, texto: e instanceof Error ? e.message : 'Não foi possível salvar.' }); }
      finally { setOcupado(false); }
    }}>
      <div className="grid gap-3 sm:grid-cols-2"><label>Pretendem se hospedar?<select className={campo} value={intencao} onChange={e => setIntencao(hospedagem.parse(e.target.value))}><option value="undecided">Ainda não decidimos</option><option value="no">Não vamos nos hospedar</option><option value="yes">Pretendemos nos hospedar</option></select></label>
      <label>Como a família pretende chegar?<select className={campo} value={chegada} onChange={e => setChegada(transporte.parse(e.target.value))}>{transporte.options.map(m => <option key={m} value={m}>{rotulosTransporte[m]}</option>)}</select></label></div>
      {intencao === 'yes' && hoteisIndicados.length > 0 && <label>Onde pretendem se hospedar?<select className={campo} value={escolha} onChange={e=>setEscolha(e.target.value)}><option value="">Ainda não escolhemos</option>{hoteisIndicados.map(h=><option key={h.nome} value={h.nome}>{h.nome}</option>)}<option value="other">Outro hotel</option></select></label>}
      {intencao === 'yes' && (!hoteisIndicados.length || escolha==='other') && <label>Nome do hotel, se já souberem<input className={campo} maxLength={160} value={hotel} onChange={e => setHotel(e.target.value)}/></label>}
      {presentes.length > 1 && <details><summary className="min-h-11 cursor-pointer py-2">Alguém vai de outro jeito?</summary><div className="grid gap-3 sm:grid-cols-2">{presentes.map(p => <label key={p.id}>{p.full_name}<select className={campo} value={excecoes[p.id] ?? ''} onChange={e => setExcecoes({ ...excecoes, [p.id]: e.target.value as typeof excecoes[number] })}><option value="">Mesmo transporte da família</option>{transporte.options.map(m => <option key={m} value={m}>{rotulosTransporte[m]}</option>)}</select></label>)}</div></details>}
      <Button className="justify-self-start" disabled={ocupado}>{ocupado ? 'Salvando…' : 'Salvar hospedagem e transporte'}</Button>
      {estado && <p role={estado.erro ? 'alert' : 'status'}>{estado.texto}</p>}
    </form>
  </details>;
}
