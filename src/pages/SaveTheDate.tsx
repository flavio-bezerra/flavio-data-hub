import Cabecalho from "@/features/casamento/Cabecalho";
import Abertura from "@/features/casamento/Abertura";
import NossaHistoria from "@/features/casamento/NossaHistoria";
import Evento from "@/features/casamento/Evento";
import Orientacoes from "@/features/casamento/Orientacoes";
import Rodape from "@/features/casamento/Rodape";
import Presentes from "@/features/presentes/Presentes";
import ConviteDePresenca from "@/features/presenca/ConviteDePresenca";

export default function SaveTheDate() {
  return (
    <div className="convite-site">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:p-4">Ir para o conteúdo</a>
      <div className="border-b bg-secondary px-4 py-2 text-center text-xs text-muted-foreground">Presentes e confirmação em demonstração</div>
      <Cabecalho />
      <main id="conteudo">
        <Abertura />
        <NossaHistoria />
        <Evento />
        <Orientacoes />
        <Presentes />
        <ConviteDePresenca />
      </main>
      <Rodape />
    </div>
  );
}
