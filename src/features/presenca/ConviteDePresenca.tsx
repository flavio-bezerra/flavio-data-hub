import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { casamento } from "@/features/casamento/conteudo";

export default function ConviteDePresenca() {
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState(false);
  const navigate = useNavigate();
  return (
    <section id="presenca" aria-labelledby="presenca-titulo" className="presenca-secao">
      <div className="cartao-resposta">
        <p className="rotulo-herbario">Cartão-resposta</p>
        <h2 id="presenca-titulo" className="titulo-secao">Esperamos você</h2>
        <p className="cartao-texto">Será uma alegria celebrar esse dia ao seu lado. Cada família receberá um link ou código de convite para confirmar a presença de cada pessoa.</p>
        <p className="selo-pendente">{casamento.prazoPresenca ?? "Confirmações reais ainda não abertas · demonstração"}</p>
        <p className="cartao-linha" aria-hidden="true"><span /> aceita com alegria</p>
        <form className="cartao-formulario" onSubmit={(event) => {
          event.preventDefault();
          if (codigo.trim().toLowerCase() !== "demonstracao") { setErro(true); return; }
          navigate("/convite/demonstracao");
        }}>
          <label htmlFor="codigo-convite">Código do convite</label>
          <div className="cartao-campo">
            <input id="codigo-convite" value={codigo} onChange={(event) => { setCodigo(event.target.value); setErro(false); }} autoComplete="off" maxLength={80} aria-invalid={erro} aria-describedby={erro ? "codigo-erro" : "codigo-ajuda"} className="cartao-input" />
            <button type="submit" className="acao-principal">Abrir convite</button>
          </div>
          {erro ? <p id="codigo-erro" role="alert" className="text-sm text-destructive">Nesta prévia, use o código demonstracao. Os convites reais ainda não estão disponíveis.</p> : <p id="codigo-ajuda" className="text-xs text-muted-foreground">Código de exemplo: demonstracao</p>}
        </form>
        <Link to="/convite/demonstracao" className="acao-secundaria mt-4">Conhecer a demonstração</Link>
      </div>
    </section>
  );
}
