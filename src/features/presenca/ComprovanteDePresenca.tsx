import { Button } from '@/components/ui/button';

export default function ComprovanteDePresenca({ protocolo, data, grupo, pessoas }: { protocolo: string; data: string; grupo: string; pessoas: { id: number; nome: string; presente: boolean }[] }) {
  return <section id="comprovante-presenca" className="space-y-4 rounded border border-primary/40 bg-secondary/30 p-5 sm:p-7" aria-labelledby="titulo-comprovante">
    <style>{'@media print { @page { margin: 16mm; } body { background: white !important; } body * { visibility: hidden !important; } #comprovante-presenca, #comprovante-presenca * { visibility: visible !important; color: black !important; } #comprovante-presenca { position: absolute; inset: 0 0 auto; border: 0; background: white !important; } #comprovante-presenca li { break-inside: avoid; } #comprovante-presenca .nao-imprimir { display: none !important; } }'}</style>
    <p className="text-xs uppercase tracking-widest">Victória &amp; Flávio</p>
    <h2 id="titulo-comprovante" className="font-display text-3xl">Comprovante de confirmação</h2>
    <p className="text-lg">{grupo}</p>
    <dl className="text-sm"><dt className="font-medium">Protocolo</dt><dd className="break-all font-mono">{protocolo.toUpperCase()}</dd><dt className="mt-2 font-medium">Última confirmação</dt><dd>{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Sao_Paulo' }).format(new Date(data))} · horário de Brasília</dd></dl>
    <ul className="divide-y">{pessoas.map(pessoa => <li key={pessoa.id} className="flex flex-wrap justify-between gap-x-3 py-2"><span>{pessoa.nome}</span><strong className="text-sm">{pessoa.presente ? 'Presença confirmada' : 'Não comparecerá'}</strong></li>)}</ul>
    <Button className="nao-imprimir" variant="outline" type="button" onClick={() => window.print()}>Imprimir ou salvar em PDF</Button>
  </section>;
}
