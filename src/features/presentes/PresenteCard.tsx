import type { PresenteItem } from "../casamento/conteudo";

interface PresenteCardProps {
  presente: PresenteItem;
  onSelecionar: (presente: PresenteItem) => void;
}

export default function PresenteCard({ presente, onSelecionar }: PresenteCardProps) {
  return (
    <li className="presente-aquarela">
      <img src={presente.imagem} alt="" width={307} height={341} loading="lazy" />
      <div className="presente-aquarela-texto">
        <h3>{presente.titulo}</h3>
        <p>{presente.descricao}</p>
        <span className="presente-aquarela-valor">{presente.livre ? "Valor à escolha" : presente.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
        <button type="button" onClick={() => onSelecionar(presente)} className="presente-aquarela-acao" aria-label={`Presentear: ${presente.titulo}`}>
          {presente.livre ? "Escolher meu valor" : "Presentear"}<span aria-hidden="true"> ↗</span>
        </button>
      </div>
    </li>
  );
}
