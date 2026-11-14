import { useState } from "react";
import { presentesCatalogo, type PresenteItem } from "../casamento/conteudo";
import ModalPagamento from "./ModalPagamento";

export default function Presentes() {
  const [presenteSelecionado, setPresenteSelecionado] = useState<PresenteItem | null>(null);

  return (
    <section id="presentes" aria-labelledby="presentes-titulo" className="presentes-cardapio">
      <div className="cardapio-folha">
        <p className="rotulo-herbario">Lista de presentes</p>
        <h2 id="presentes-titulo" className="titulo-secao">Com carinho</h2>
        <p className="cardapio-intro">
          Sua presença é o nosso presente mais especial. Para quem desejar nos presentear,
          preparamos uma lista de presentes e cotas simbólicas para celebrar este momento conosco.
        </p>

        <ul className="cardapio-lista">
          {presentesCatalogo.map((presente) => (
            <li key={presente.id}>
              <div className="cardapio-linha">
                <h3>{presente.titulo}</h3>
                <span className="cardapio-pontilhado" aria-hidden="true" />
                <span className="cardapio-valor">
                  {presente.livre
                    ? "Valor à escolha"
                    : presente.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
              </div>
              <p>{presente.descricao}</p>
              <button
                type="button"
                onClick={() => setPresenteSelecionado(presente)}
                className="cardapio-acao text-[#1e3a5f] hover:underline font-serif cursor-pointer"
              >
                {presente.livre ? "Contribuir com cota livre →" : "Presentear →"}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {presenteSelecionado && (
        <ModalPagamento
          presente={presenteSelecionado}
          onClose={() => setPresenteSelecionado(null)}
        />
      )}
    </section>
  );
}
