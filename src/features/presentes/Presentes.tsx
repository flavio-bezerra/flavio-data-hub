export default function Presentes() {
  const exemplos = [
    { id: "jantar", titulo: "Um jantar a dois", descricao: "Um brinde ao começo da nossa vida juntos.", valor: 150 },
    { id: "passeio", titulo: "Um passeio inesquecível", descricao: "Mais uma memória para a nossa coleção.", valor: 300 },
    { id: "viagem", titulo: "Um pedacinho da lua de mel", descricao: "Uma contribuição para a próxima aventura.", valor: 500 },
  ];
  return (
    <section id="presentes" aria-labelledby="presentes-titulo" className="presentes-cardapio">
      <div className="cardapio-folha">
        <p className="rotulo-herbario">Lista de presentes</p>
        <h2 id="presentes-titulo" className="titulo-secao">Com carinho</h2>
        <p className="cardapio-intro">Sua presença é o nosso presente mais especial. Para quem desejar nos presentear, estamos preparando uma lista de presentes simbólicos.</p>
        <p className="selo-pendente">Prévia · itens e valores ilustrativos · pagamento indisponível</p>
        <ul className="cardapio-lista">
          {exemplos.map((presente) => <li key={presente.id}>
            <div className="cardapio-linha">
              <h3>{presente.titulo}</h3>
              <span className="cardapio-pontilhado" aria-hidden="true" />
              <span className="cardapio-valor">{presente.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
            </div>
            <p>{presente.descricao}</p>
            <button type="button" disabled className="cardapio-acao">Pagamento em breve</button>
          </li>)}
        </ul>
      </div>
    </section>
  );
}
