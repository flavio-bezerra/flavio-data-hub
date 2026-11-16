import type { PresenteItem } from "../casamento/conteudo";

export default function ResumoPresente({ presente, valor }: { presente: PresenteItem; valor: number }) {
  return (
    <aside className="pagamento-resumo">
      <p className="rotulo-herbario">Um carinho para</p>
      <p className="pagamento-noivos">Victória & Flávio</p>
      <img src={presente.imagem} alt="" width={307} height={341} />
      <h3>{presente.titulo}</h3>
      <p>{presente.descricao}</p>
      <strong>{valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong>
      <span>Contribuição simbólica para o casal</span>
    </aside>
  );
}
