import { casamento } from "./conteudo";
import Monograma from "./Monograma";

export default function Abertura() {
  return (
    <section id="inicio" aria-labelledby="nomes" className="herbario-abertura">
      <div className="herbario-texto">
        <Monograma className="herbario-monograma" />
        <p className="herbario-convite">Com alegria, convidamos você para o nosso casamento</p>
        <h1 id="nomes" className="herbario-nomes">
          <span>Victória</span><span className="herbario-e">&amp;</span><span>Flávio</span>
        </h1>
        <div className="data-destaque">
          <time dateTime={casamento.dataIso} className="data-por-extenso">{casamento.data}</time>
          <p className="data-destaque-local">{casamento.diaDaSemana}, às {casamento.horario}</p>
          <p className="data-destaque-local abertura-local"><span>{casamento.local}</span><span className="abertura-local-separador"> · </span><span>{casamento.cidade}</span></p>
        </div>

      </div>
    </section>
  );
}
