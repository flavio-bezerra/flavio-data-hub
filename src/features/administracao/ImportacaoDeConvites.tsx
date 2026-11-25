import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { pedirAoConvite } from '@/features/presenca/apiDeConvites';

const previaDaImportacao = z.object({ ok: z.literal(true), digest: z.string(), invalid_rows: z.array(z.number()), groups: z.array(z.object({ id: z.string(), label: z.string(), count: z.number(), status: z.enum(['new', 'unchanged', 'conflict', 'invalid']), issues: z.array(z.string()) })) });
const situacoes = { new: 'Novo', unchanged: 'Já importado', conflict: 'Divergência · não será alterado', invalid: 'Inválido · não será importado' };

export default function ImportacaoDeConvites({ csrf, aoImportar }: { csrf: string; aoImportar: () => void }) {
  const [previa, setPrevia] = useState<z.infer<typeof previaDaImportacao>>();
  const [ocupado, setOcupado] = useState(false);
  const [aviso, setAviso] = useState('');
  const [erro, setErro] = useState('');
  const [arquivo, setArquivo] = useState<File>();
  const [csvDaPrevia, setCsvDaPrevia] = useState<string>();
  async function importar(aplicar: boolean, peloMySql = false) {
    setOcupado(true); setErro(''); setAviso('');
    try {
      if (aplicar && previa) {
        const resultado = await pedirAoConvite('convites', csrf, { action: 'import_apply', digest: previa.digest, ...(csvDaPrevia === undefined ? {} : { csv: csvDaPrevia }) }, z.object({ ok: z.literal(true), created: z.number() }));
        setPrevia(undefined); setAviso(`${resultado.created} grupos importados. Gere os links na lista de grupos.`); aoImportar();
      } else {
        setPrevia(undefined);
        if (!peloMySql && (!arquivo || arquivo.size > 16384)) throw Error('Escolha um CSV de até 16 KiB.');
        const csv = peloMySql ? undefined : new TextDecoder('utf-8', { fatal: true }).decode(await arquivo!.arrayBuffer());
        const resultado = await pedirAoConvite('convites', csrf, { action: 'import_preview', ...(csv === undefined ? {} : { csv }) }, previaDaImportacao);
        setCsvDaPrevia(csv);
        setPrevia(resultado);
      }
    } catch (e) { setPrevia(undefined); setErro(e instanceof Error ? e.message : 'Importação indisponível.'); }
    finally { setOcupado(false); }
  }
  const novos = previa?.groups.filter(grupo => grupo.status === 'new').length ?? 0;
  return <details className="rounded border p-4">
    <summary className="min-h-10 cursor-pointer font-medium">Importar convidados</summary>
    <div className="space-y-4">
      <p className="text-sm">Envie um CSV UTF-8 com uma linha por pessoa: até 250 pessoas e 16 KiB por lote. Não divida a mesma família em arquivos diferentes. Grupos existentes não serão alterados.</p>
      <a className="inline-flex min-h-11 items-center underline" download="modelo-convidados.csv" href={`data:text/csv;charset=utf-8,${encodeURIComponent('\uFEFFid_convite;grupo_familia;nome;id_pessoa\r\nEX-001;Família Exemplo;Ana Exemplo;P01\r\nEX-001;Família Exemplo;Rui Exemplo;P02\r\n')}`}>Baixar modelo CSV</a>
      <label className="block">Arquivo CSV<input className="mt-1 block min-h-11 w-full text-sm" type="file" accept=".csv,text/csv" disabled={ocupado} onChange={e => { setArquivo(e.target.files?.[0]); setPrevia(undefined); setErro(''); setAviso(''); }} /></label>
      <div className="flex flex-wrap gap-2"><Button variant="outline" disabled={ocupado || !arquivo} onClick={() => void importar(false)}>Revisar arquivo</Button>
      <Button variant="ghost" disabled={ocupado} onClick={() => void importar(false, true)}>Revisar lista do MySQL</Button></div>
      {aviso && <p role="status">{aviso}</p>}{erro && <p role="alert" className="text-destructive">{erro}</p>}
      {previa && <>
        <p role="status">{novos} grupos novos de {previa.groups.length} encontrados.</p>
        {previa.invalid_rows.length > 0 && <p role="alert" className="break-words">Linhas com ID inválido: {previa.invalid_rows.join(', ')}.</p>}
        <ul className="max-h-72 divide-y overflow-auto rounded border px-3">{previa.groups.map(grupo => <li className="break-words py-2 text-sm" key={grupo.id}><strong>{grupo.label || grupo.id}</strong> · {grupo.id} · {grupo.count} pessoa(s) · {situacoes[grupo.status]}{grupo.issues.map(issue => <p key={issue}>{issue}</p>)}</li>)}</ul>
        <Button disabled={ocupado || novos === 0} onClick={() => void importar(true)}>Importar {novos} grupos novos</Button>
      </>}
    </div>
  </details>;
}
