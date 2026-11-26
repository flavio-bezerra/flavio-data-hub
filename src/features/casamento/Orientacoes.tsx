import { orientacoes } from "./conteudo";

export default function Orientacoes() {
  return (
    <section id="orientacoes" aria-labelledby="orientacoes-titulo" className="orientacoes-notas">
      <div className="orientacoes-cabecalho">
        <p className="rotulo-herbario">Notas aos convidados</p>
        <h2 id="orientacoes-titulo" className="titulo-secao">Para nossos convidados</h2>
      </div>
      <div className="orientacoes-grid">
        {orientacoes.map((item, index) => (
          <div key={item.id} className="orientacao-card">
            <div className="orientacao-numero">{`0${index + 1}`}</div>
            <h3 className="orientacao-pergunta">{item.pergunta}</h3>
            <div className="orientacao-resposta" dangerouslySetInnerHTML={{
              __html: `${item.pendente ? '<span class="selo-pendente">Em definição</span>' : ''}${item.resposta}`,
            }} />
          </div>
        ))}
      </div>
    </section>
  );
}
