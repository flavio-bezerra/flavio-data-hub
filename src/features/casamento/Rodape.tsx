import Monograma from "./Monograma";
import { casamento } from "./conteudo";

export default function Rodape() {
  return (
    <footer className="rodape-editorial border-t px-5 py-12 text-center">
      <Monograma className="mx-auto mb-6 w-24" />
      <p className="font-display text-3xl">{casamento.nomes}</p>
      <p className="mt-3 text-xs text-muted-foreground">{casamento.data} · {casamento.cidade}</p>
      <a href="/#inicio" className="mt-4 inline-flex min-h-11 items-center text-xs underline underline-offset-4">Voltar ao início</a>
    </footer>
  );
}
