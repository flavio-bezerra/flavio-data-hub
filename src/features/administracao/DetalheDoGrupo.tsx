import { useEffect, useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { detalhesDoConvite, pedirAoConvite } from '@/features/presenca/apiDeConvites';

const salvo = z.object({ ok: z.literal(true) });
const presenca = { yes: 'Confirmada', no: 'Não comparecerá', pending: 'Pendente' };
type Alteracao = { action: 'admin_guest_add' } | { action: 'admin_guest_remove' | 'admin_guest_rename'; pessoa: z.output<typeof detalhesDoConvite>['guests'][number] };

export default function DetalheDoGrupo({ id, csrf, aoAlterar }: { id: number; csrf: string; aoAlterar: () => void }) {
  const [detalhe, setDetalhe] = useState<z.output<typeof detalhesDoConvite>>();
  const [erro, setErro] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [edicao, setEdicao] = useState<Alteracao>();
  const [versao, setVersao] = useState(0);
  useEffect(() => {
    let ativo = true;
    void pedirAoConvite('convites', csrf, { action: 'admin_detail', group_id: id }, detalhesDoConvite).then(data => { if (ativo) setDetalhe(data); }).catch((e: Error) => { if (ativo) setErro(e.message); });
    return () => { ativo = false; };
  }, [id, csrf, versao]);
  async function alterar(acao: Alteracao, nome: FormDataEntryValue | null) {
    setOcupado(true); setErro('');
    try {
      await pedirAoConvite('convites', csrf, { action: acao.action, group_id: id, name: nome, acknowledge: true, ...('pessoa' in acao ? { guest_id: acao.pessoa.id, revision: acao.pessoa.revision } : {}) }, salvo);
      setEdicao(undefined); setDetalhe(undefined); setVersao(v => v + 1); aoAlterar();
    } catch (e) { setErro(e instanceof Error ? e.message : 'Não foi possível alterar.'); }
    finally { setOcupado(false); }
  }
  return <section className="space-y-3 border-t pt-3" aria-label="Cadastro do grupo">
    {erro && <p role="alert" className="text-destructive">{erro}</p>}
    {!detalhe && !erro && <p role="status">Carregando cadastro…</p>}
    {detalhe && <>
      <p className="break-words text-sm">E-mail do cadastro: {detalhe.group.responsible_email ?? 'Ainda não vinculado'}</p>
      {detalhe.group.contact_phone && <p className="text-sm">Telefone do responsável: {detalhe.group.contact_phone}</p>}
      {detalhe.group.receipt && <p className="break-words text-sm">Protocolo <code>{detalhe.group.receipt.protocol.toUpperCase()}</code> · {new Intl.DateTimeFormat('pt-BR', {dateStyle:'short', timeStyle:'short', timeZone:'America/Sao_Paulo'}).format(new Date(detalhe.group.receipt.confirmed_at))}</p>}
      <ul className="divide-y">{detalhe.guests.map(pessoa => <li key={pessoa.id} className="space-y-2 py-3">
        <p className="font-medium">{pessoa.display_name}</p><p className="text-sm">{presenca[pessoa.attendance]}{pessoa.contact_phone ? ` · ${pessoa.contact_phone}` : ''}</p>
        {!edicao && <div className="flex flex-wrap gap-2"><Button type="button" variant="outline" onClick={() => setEdicao({ action: 'admin_guest_rename', pessoa })}>Corrigir nome</Button><Button type="button" variant="outline" disabled={detalhe.guests.length <= 1} onClick={() => setEdicao({ action: 'admin_guest_remove', pessoa })}>Retirar</Button></div>}
      </li>)}</ul>
      {!edicao && <Button type="button" variant="outline" onClick={() => setEdicao({ action: 'admin_guest_add' })}>Incluir pessoa</Button>}
      {edicao && <form className="space-y-3 rounded border p-3" onSubmit={evento => { evento.preventDefault(); void alterar(edicao, new FormData(evento.currentTarget).get('nome')); }}>
        <h4 className="font-medium">{edicao.action === 'admin_guest_remove' ? `Retirar ${edicao.pessoa.display_name}?` : edicao.action === 'admin_guest_add' ? 'Incluir pessoa' : 'Corrigir nome'}</h4>
        {edicao.action !== 'admin_guest_remove' && <label className="block">Nome<input className="block min-h-11 w-full rounded border p-2" name="nome" maxLength={160} required defaultValue={edicao.action === 'admin_guest_rename' ? edicao.pessoa.display_name : ''} /></label>}
        <p className="text-sm">Se houver comprovante vigente, a alteração o invalida. O responsável precisará confirmar de novo.</p>
        <div className="flex flex-wrap gap-2"><Button disabled={ocupado}>Confirmar alteração</Button><Button disabled={ocupado} type="button" variant="outline" onClick={() => setEdicao(undefined)}>Cancelar</Button></div>
      </form>}
    </>}
  </section>;
}
