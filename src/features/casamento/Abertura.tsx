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
          <p className="data-destaque-local">{casamento.local} · {casamento.cidade}</p>
        </div>
        <nav className="herbario-acoes" aria-label="Ações do convite">
          <a href="#presenca" className="acao-secundaria">Responder ao convite</a>
          <a href="#casamento" className="acao-secundaria">Programa do dia</a>
        </nav>
      </div>
    </section>
  );
}
