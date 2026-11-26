import { Link } from "react-router-dom";
import { hoteisIndicados, orientacoes } from "./conteudo";

export default function Orientacoes() {
  return (
    <section id="orientacoes" aria-labelledby="orientacoes-titulo" className="orientacoes-notas">
      <div className="orientacoes-cabecalho">
        <h2 id="orientacoes-titulo" className="titulo-secao">Para nossos convidados</h2>
        <p>Estamos muito felizes em celebrar com vocês. Aqui vai o que vale saber antes do grande dia.</p>
      </div>
      <div className="orientacoes-lista orientacoes-guia">
        {orientacoes.map(({ id, titulo, destaque, paragrafos }) => (
          <article key={id}>
            <h3>{titulo}</h3>
            <p className="orientacoes-destaque">{destaque}</p>
            {paragrafos.map(paragrafo => <p key={paragrafo}>{paragrafo}</p>)}
            {id === "familia" && <Link className="acao-secundaria" to="/acesso">Abrir a Área do convidado <span aria-hidden="true">&nbsp; →</span></Link>}
          </article>
        ))}
      </div>
      <div className="mx-auto mt-6 max-w-3xl border-t pt-5" id="hospedagem">
        <h3 className="font-display text-3xl text-primary">Hospedagem</h3>
        <p className="mt-2">Vamos indicar dois hotéis. A van fará o trajeto entre os dois hotéis e o DellaTorres Eventos. As reservas de hospedagem são feitas diretamente com cada hotel.</p>
        {hoteisIndicados.length === 0 ? <p className="mt-2">Em breve, publicaremos os nomes, os links de reserva e os detalhes do embarque.</p> : <ul className="mt-3 grid gap-4 sm:grid-cols-2">{hoteisIndicados.map(h=> <li key={h.nome} className="min-w-0"><strong>{h.nome}</strong>{h.trajeto && <p>{h.trajeto}</p>}{h.contato && <p>{h.contato}</p>}<a className="inline-flex min-h-11 items-center underline" href={h.reserva} target="_blank" rel="noopener noreferrer">Consultar reserva <span className="sr-only">em {h.nome}</span></a></li>)}</ul>}
      </div>
    </section>
  );
}
