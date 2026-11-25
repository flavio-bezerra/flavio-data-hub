import { Link } from "react-router-dom";
import { casamento } from "@/features/casamento/conteudo";

export default function ConviteDePresenca() {
  return <section id="presenca" aria-labelledby="presenca-titulo" className="presenca-secao">
    <div className="cartao-resposta">
      <p className="rotulo-herbario">Cartão-resposta</p>
      <h2 id="presenca-titulo" className="titulo-secao">Esperamos você</h2>
      <p className="cartao-texto">Abra o link privado que recebeu para revisar sua família e confirmar a presença de cada pessoa.</p>
      {casamento.prazoPresenca && <p className="selo-pendente">{casamento.prazoPresenca}</p>}
      <Link to="/meu-convite" className="acao-principal mt-4 inline-flex">Acessar meu convite</Link>
      <p className="mt-4 text-sm">Já vinculou seu convite? Entre para consultar sua resposta ou recuperar o comprovante.</p>
    </div>
  </section>;
}
