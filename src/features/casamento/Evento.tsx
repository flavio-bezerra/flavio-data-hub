import { casamento } from "./conteudo";

export default function Evento() {
  return (
    <section id="casamento" aria-labelledby="evento-titulo" className="programa-dia">
      <div className="programa-papel">
      <div className="programa-folha">
        <div className="programa-cabecalho">
          <p className="rotulo-herbario">Programa</p>
          <h2 id="evento-titulo">O nosso dia</h2>
          <p className="programa-data">{casamento.diaDaSemana}, {casamento.data}</p>
        </div>
        <ol className="programa-lista">
          <li>
            <span className="programa-hora">{casamento.horario}</span>
            <div><h3>Cerimônia</h3><p>{casamento.local}, {casamento.cidade}.</p></div>
          </li>
          <li>
            <span className="programa-hora">a seguir</span>
            <div><h3>Recepção</h3><p>{casamento.recepcao}.</p></div>
          </li>
        </ol>
        <div className="programa-endereco">
          <p>{casamento.endereco ?? "Endereço completo, mapa e orientações de acesso em breve."}</p>
          {casamento.mapaUrl && <a href={casamento.mapaUrl} target="_blank" rel="noopener noreferrer" className="acao-secundaria">Abrir mapa</a>}
        </div>
      </div>
      <img src="/orquidea-phalaenopsis.webp" width={724} height={991} alt="" aria-hidden="true" loading="lazy" className="programa-prancha" />
      </div>
    </section>
  );
}
