import Monograma from "./Monograma";
import { casamento } from "./conteudo";

export default function Rodape() {
  return (
    <footer className="rodape-editorial px-5 py-14 text-center">
      <Monograma className="mx-auto mb-6 w-24" />
      <p className="rodape-nomes">{casamento.nomes}</p>
      <p className="rotulo-herbario mt-3">{casamento.data} · {casamento.cidade}</p>
      <a href="/#inicio" className="acao-secundaria mt-3">Voltar ao início</a>
    </footer>
  );
}
