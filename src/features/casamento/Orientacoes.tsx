import { orientacoes } from "./conteudo";

export default function Orientacoes() {
  return (
    <section id="orientacoes" aria-labelledby="orientacoes-titulo" className="orientacoes-notas">
      <div className="orientacoes-cabecalho">
        <p className="rotulo-herbario">Notas aos convidados</p>
        <h2 id="orientacoes-titulo" className="titulo-secao">Para aproveitar o dia</h2>
        <img src="/violeta-flor.webp" width={642} height={357} alt="" aria-hidden="true" loading="lazy" className="flor-orientacoes" />
      </div>
      <dl className="orientacoes-lista">
        {orientacoes.map((item) => <div key={item.id}>
          <dt>{item.pergunta}</dt>
          <dd>{item.pendente && <span className="selo-pendente">Em definição</span>}{item.resposta}</dd>
        </div>)}
      </dl>
    </section>
  );
}
