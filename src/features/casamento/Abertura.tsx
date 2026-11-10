import { casamento } from "./conteudo";
import Monograma from "./Monograma";

export default function Abertura() {
  return (
    <section id="inicio" aria-labelledby="nomes" className="herbario-abertura">
      <figure className="herbario-prancha" aria-hidden="true">
        <img src="/copo-de-leite-abertura.webp" width={952} height={1247} alt="" fetchPriority="high" />
      </figure>
      <div className="herbario-texto">
        <Monograma className="herbario-monograma" />
        <p className="herbario-convite">Com alegria, convidamos você para o nosso casamento</p>
        <h1 id="nomes" className="herbario-nomes">
          <span>Victória</span>{" "}
          <span className="herbario-e">&amp;</span>{" "}
          <span>Flávio</span>
        </h1>
        <div className="data-destaque">
          <time dateTime={casamento.dataIso} aria-label={`${casamento.diaDaSemana}, ${casamento.data}, às ${casamento.horario}`} className="data-destaque-linha">
            <span className="data-destaque-lateral">{casamento.diaDaSemana.toLowerCase()}</span>
            <span className="data-destaque-dia">{casamento.dia}</span>
            <span className="data-destaque-lateral">{casamento.mes}<br />{casamento.ano}</span>
          </time>
          <p className="data-destaque-local">às {casamento.horario} · {casamento.local}, {casamento.cidade.replace(" — SP", "")}</p>
        </div>
        <nav className="herbario-acoes" aria-label="Ações do convite">
          <a href="#presenca" className="acao-principal">Responder ao convite</a>
          <a href="#casamento" className="acao-secundaria">Programa do dia</a>
        </nav>
      </div>
      <p className="herbario-legenda">Copo-de-leite — J. W. Penfold, <i>Madeira Flowers, Fruits and Ferns</i>, 1845</p>
    </section>
  );
}
