import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import FormularioDeAcesso from '@/features/autenticacao/FormularioDeAcesso';
import useSessaoDeAcesso from '@/features/autenticacao/SessaoDeAcesso';
import { detalhesDoConvite, grupoDoConvite, idDoConvite, pedirAoConvite } from './apiDeConvites';
import CadastroDaFamilia from './CadastroDaFamilia';
import CampoCodigoDoConvite from './CampoCodigoDoConvite';

const respostaSimples = z.object({ ok: z.literal(true) });
const lista = respostaSimples.extend({ groups: z.array(grupoDoConvite) });
const vinculacao = respostaSimples.extend({ group_id: idDoConvite });

export default function MeuConvite({ codigoDoCaminho }: { codigoDoCaminho?: string }) {
  const { session, loading } = useSessaoDeAcesso();
  const { hash, state } = useLocation();
  const grupoInicial = z.object({ groupId: idDoConvite }).safeParse(state).data?.groupId;
  const navegar = useNavigate();
  const codigo = codigoDoCaminho ?? new URLSearchParams(hash.slice(1)).get('codigo');
  const conta = session?.account?.id;
  const csrf = session?.csrf;
  if (loading) return <main className="mx-auto max-w-xl px-5 py-16" role="status">Carregando acesso…</main>;
  if (!session) return <main className="mx-auto max-w-xl px-5 py-16"><p role="alert">Acesso indisponível no momento.</p><Link to="/acesso">Ir para acesso</Link></main>;
  if (codigo && !/^[a-f0-9]{64}$/.test(codigo)) return <main className="mx-auto max-w-xl space-y-4 px-5 py-16"><h1 className="font-display text-4xl">Link de convite inválido</h1><p>Confira o link que recebeu ou peça um novo à organização.</p><Link className="underline" to="/meu-convite">Voltar para Meu convite</Link></main>;
  if (!conta || !csrf) return <FormularioDeAcesso codigo={codigo} />;
  return <ConteudoDoConvite key={`${conta}:${csrf}:${codigo ?? ''}`} codigo={codigo} csrf={csrf} grupoInicial={grupoInicial} depoisDeVincular={groupId => navegar('/meu-convite', { replace: true, state: { groupId } })} />;
}

function ConteudoDoConvite({ codigo, csrf, grupoInicial, depoisDeVincular }: { codigo: string | null; csrf: string; grupoInicial?: number; depoisDeVincular: (id: number) => void }) {
  const [grupos, setGrupos] = useState<z.output<typeof lista>['groups']>([]);
  const [selecionado, selecionar] = useState<number>();
  const [grupo, setGrupo] = useState<z.output<typeof detalhesDoConvite>>();
  const [ocupado, setOcupado] = useState(false);
  const [carregando, setCarregando] = useState(!codigo);
  const [erro, setErro] = useState('');
  const [atualizacao, setAtualizacao] = useState(0);
  useEffect(() => {
    if (codigo) return;
    let ativo = true;
    void pedirAoConvite('convites', csrf, { action: 'mine' }, lista).then(({ groups }) => {
      if (ativo) { setGrupos(groups); selecionar(groups.find(grupo => grupo.id === grupoInicial)?.id ?? groups[0]?.id); }
    }).catch((e: Error) => { if (ativo) setErro(e.message); }).finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, [codigo, csrf, grupoInicial]);
  useEffect(() => {
    if (!selecionado) return;
    let ativo = true;
    void pedirAoConvite('convites', csrf, { action: 'read', group_id: selecionado }, detalhesDoConvite).then(resultado => {
      if (ativo) setGrupo(resultado);
    }).catch((e: Error) => { if (ativo) setErro(e.message); });
    return () => { ativo = false; };
  }, [selecionado, csrf, atualizacao]);
  async function executar(acao: () => Promise<void>) {
    setOcupado(true); setErro('');
    try { await acao(); } catch (e) { setErro(e instanceof Error ? e.message : 'Não foi possível concluir.'); }
    finally { setOcupado(false); }
  }
  return <div className="papelaria-do-convite"><main className="folha-do-convite space-y-6">
    <Link className="inline-flex min-h-11 items-center underline underline-offset-4" to="/acesso">Minha conta</Link>
    <header className="cabecalho-da-folha"><img src="/monograma-vf.png" width="76" height="52" alt="" />
      <p className="rubrica-do-convite">Victória &amp; Flávio · Confirmação de presença</p>
      <h1 className="font-display text-primary">Meu convite</h1>
    </header>
    {erro && <p role="alert" className="text-destructive">{erro}</p>}

    {codigo ? /^[a-f0-9]{64}$/.test(codigo) ? <section className="etapa-do-convite space-y-4 p-4 sm:p-6">
      <h2 className="text-xl">Assumir responsabilidade pelo grupo</h2>
      <p>Só você poderá preencher e atualizar as confirmações deste convite. Abrir o link não faz a vinculação automaticamente.</p>
      <Button disabled={ocupado} onClick={() => void executar(async () => { const resultado = await pedirAoConvite('convites', csrf, { action: 'claim', token: codigo }, vinculacao); depoisDeVincular(resultado.group_id); })}>Assumir este convite</Button>
      <Link to="/meu-convite" replace className="ml-3 inline-flex min-h-11 items-center underline">Cancelar</Link>
    </section> : <p role="alert">Código de convite inválido.</p> : <>
      {carregando && <p role="status">Buscando convites…</p>}
      {!carregando && !erro && grupos.length === 0 && <p>O convite ainda não está vinculado a esta conta.</p>}
      {!carregando && <CampoCodigoDoConvite key={grupos.length ? 'outro' : 'primeiro'} aberto={!grupos.length} titulo={grupos.length ? 'Vincular outro convite' : 'Informe o código do seu convite'} />}
      {grupos.length > 1 && <label className="block">Escolha o convite <select className="block max-w-full rounded border p-2" value={selecionado} disabled={ocupado} onChange={e => { setGrupo(undefined); setErro(''); selecionar(Number(e.target.value)); }}>{grupos.map(item => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>}
      {selecionado && !grupo && !erro && <p role="status">Buscando integrantes…</p>}
      {selecionado && !grupo && erro && <Button variant="outline" onClick={() => { setErro(''); setAtualizacao(atualizacao + 1); }}>Tentar novamente</Button>}
      {grupo && grupo.group.id === selecionado && <aside className="space-y-1 rounded border bg-white p-4"><h2 className="font-display text-2xl text-primary">Informações da festa</h2><p>A van liga os dois hotéis indicados ao DellaTorres Eventos. Os pontos e horários serão divulgados nas orientações.</p><Link className="inline-flex min-h-11 items-center underline" to="/#hospedagem">Consultar hospedagem e transporte</Link></aside>}
      {grupo && grupo.group.id === selecionado && <CadastroDaFamilia key={`${grupo.group.id}:${atualizacao}`} dados={grupo} csrf={csrf} recarregar={() => { setGrupo(undefined); setErro(''); setAtualizacao(atualizacao + 1); }} />}
    </>}
  </main></div>;
}
