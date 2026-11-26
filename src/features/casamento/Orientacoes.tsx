import { orientacoes } from "./conteudo";

export default function Orientacoes() {
  return (
    <section id="orientacoes" aria-labelledby="orientacoes-titulo" className="orientacoes-notas">
      <div className="orientacoes-cabecalho">
        <p className="rotulo-herbario">Notas aos convidados</p>
        <h2 id="orientacoes-titulo" className="titulo-secao">Para nossos convidados</h2>
      </div>
      <dl className="orientacoes-lista">
        {orientacoes.map((item) => <div key={item.id}>
          <dt>{item.pergunta}</dt>
          <dd
            className="resposta-orientacao"
            dangerouslySetInnerHTML={{
              __html: `${item.pendente ? '<span class="selo-pendente">Em definição</span>' : ''}${item.resposta}`,
            }}
          />
        </div>)}
      </dl>
    </section>
  );
}
