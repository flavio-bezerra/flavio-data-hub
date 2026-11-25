import { useCallback, useRef, useState } from "react";
import { presentesCatalogo, type PresenteItem } from "../casamento/conteudo";
import ModalPagamento from "./ModalPagamento";
import PresenteCard from "./PresenteCard";

export default function Presentes() {
  const [presenteSelecionado, setPresenteSelecionado] = useState<PresenteItem | null>(null);
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const inicioRef = useRef<HTMLDivElement>(null);
  const fecharPagamento = useCallback(() => setPresenteSelecionado(null), []);
  const pagamentosAtivos = import.meta.env.VITE_PAGAMENTOS_VISIVEIS === 'true';
  const presentesVisiveis = mostrarTodos ? presentesCatalogo : presentesCatalogo.slice(0, 3);

  return (
    <section id="presentes" aria-labelledby="presentes-titulo" className="presentes-cardapio presentes-ilustrados">
      <div className="cardapio-folha" ref={inicioRef}>
        <p className="rotulo-herbario">Lista de presentes</p>
        <h2 id="presentes-titulo" className="titulo-secao">Com carinho</h2>
        <p className="cardapio-intro">Sua presença é o nosso maior presente. Mas, se quiser deixar um carinho a mais, aqui cabem nossas aventuras e algumas boas risadas.</p>
        <ul id="catalogo-presentes" className="presentes-galeria">
          {presentesVisiveis.map(presente => <PresenteCard key={presente.id} presente={presente} onSelecionar={pagamentosAtivos ? setPresenteSelecionado : undefined} />)}
        </ul>
        <div className="presentes-expandir">
          <button type="button" aria-expanded={mostrarTodos} aria-controls="catalogo-presentes" onClick={() => {
            setMostrarTodos(!mostrarTodos);
            if (mostrarTodos) inicioRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
          }}>
            {mostrarTodos ? "Mostrar menos" : "Ver todos os presentes"}<span aria-hidden="true"> {mostrarTodos ? "−" : "+"}</span>
          </button>
          <p>Presentes simbólicos: contribuições para o casal, sem compra ou entrega dos itens.</p>
          {!pagamentosAtivos && <p>A lista está disponível para consulta. Os pagamentos ainda não estão abertos.</p>}
        </div>
      </div>
      {presenteSelecionado && <ModalPagamento presente={presenteSelecionado} onClose={fecharPagamento} />}
    </section>
  );
}
