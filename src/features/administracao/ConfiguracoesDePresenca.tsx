import { useEffect, useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { pedirAoConvite } from '@/features/presenca/apiDeConvites';

const resposta = z.object({ ok: z.literal(true), revision: z.number(), deadline: z.string().nullable() });
export default function ConfiguracoesDePresenca({ csrf }: { csrf: string }) {
  const [atual, setAtual] = useState<z.output<typeof resposta>>();
  const [prazo, setPrazo] = useState('');
  const [revisar, setRevisar] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [consulta, setConsulta] = useState(0);
  useEffect(() => {
    let ativo = true;
    void pedirAoConvite('convites', csrf, { action: 'admin_deadline_read' }, resposta)
      .then(dados => { if (ativo) { setAtual(dados); setPrazo(dados.deadline ?? ''); } })
      .catch((e: Error) => { if (ativo) setErro(e.message); });
    return () => { ativo = false; };
  }, [csrf, consulta]);
  return <section id="prazo-de-presenca" className="scroll-mt-24 space-y-4 rounded border bg-white p-5">
    <h2 className="font-display text-3xl">Prazo de confirmação</h2>
    <p>Horário de São Paulo. Após o prazo, os convidados ainda podem consultar o comprovante, mas não editar a resposta.</p>
    {erro && <p role="alert" className="text-destructive">{erro}</p>}
    {aviso && <p role="status">{aviso}</p>}
    {!atual ? !erro && <p role="status">Consultando prazo…</p> : <form className="space-y-3" onSubmit={async e => {
      e.preventDefault();
      if (!revisar) { setRevisar(true); setAviso(''); return; }
      setOcupado(true); setErro('');
      try {
        const dados = await pedirAoConvite('convites', csrf, { action: 'admin_deadline_update', revision: atual.revision, deadline: prazo || null }, resposta);
        setAtual(dados); setPrazo(dados.deadline ?? ''); setRevisar(false); setAviso('Prazo atualizado.');
      } catch (e) { setErro(e instanceof Error ? e.message : 'Não foi possível alterar o prazo.'); }
      finally { setOcupado(false); }
    }}>
      <label className="block">Data e hora de encerramento<input className="block min-h-11 max-w-full rounded border p-2" type="datetime-local" value={prazo} disabled={revisar || ocupado} onChange={e => { setPrazo(e.target.value); setAviso(''); }} /></label>
      <p className="text-sm text-muted-foreground">Deixe em branco para não aplicar um prazo de encerramento.</p>
      {revisar && <p role="status">{prazo ? `Aplicar ${prazo.slice(0, 10).split('-').reverse().join('/')} às ${prazo.slice(11)} em São Paulo?` : 'Remover o prazo e permitir novas alterações de presença?'}</p>}
      <div className="flex flex-wrap gap-2"><Button disabled={ocupado || prazo === (atual.deadline ?? '')}>{revisar ? 'Confirmar alteração' : 'Revisar alteração'}</Button>
      {revisar && <Button type="button" variant="outline" disabled={ocupado} onClick={() => setRevisar(false)}>Voltar</Button>}</div>
    </form>}
    {erro && <Button type="button" variant="outline" disabled={ocupado} onClick={() => { setErro(''); setRevisar(false); setAtual(undefined); setConsulta(v => v + 1); }}>Recarregar prazo</Button>}
  </section>;
}
