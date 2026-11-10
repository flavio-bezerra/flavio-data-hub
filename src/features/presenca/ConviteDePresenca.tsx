import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { casamento } from "@/features/casamento/conteudo";

export default function ConviteDePresenca() {
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState(false);
  const navigate = useNavigate();
  return (
    <section id="presenca" aria-labelledby="presenca-titulo" className="border-t bg-secondary/40 px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-xl text-center">
        <h2 id="presenca-titulo" className="font-display text-4xl md:text-5xl">Esperamos por você</h2>
        <p className="mt-5 font-display text-xl leading-relaxed">Será uma alegria celebrar esse dia ao seu lado.</p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Cada família receberá um link ou código de convite para confirmar a presença de cada pessoa.</p>
        <p className="mt-4 text-xs text-primary">{casamento.prazoPresenca ?? "Confirmações reais ainda não abertas · prévia local"}</p>
        <form className="mt-8 flex flex-col gap-3 text-left" onSubmit={(event) => {
          event.preventDefault();
          if (codigo.trim().toLowerCase() !== "demonstracao") { setErro(true); return; }
          navigate("/convite/demonstracao");
        }}>
          <label htmlFor="codigo-convite" className="text-sm">Código do convite</label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input id="codigo-convite" value={codigo} onChange={(event) => { setCodigo(event.target.value); setErro(false); }} autoComplete="off" maxLength={80} aria-invalid={erro} aria-describedby={erro ? "codigo-erro" : "codigo-ajuda"} className="min-h-12 w-full rounded-md border bg-background px-4 text-base" />
            <Button type="submit" size="lg" className="min-h-12">Abrir convite</Button>
          </div>
          {erro ? <p id="codigo-erro" role="alert" className="text-sm text-destructive">Nesta prévia, use o código demonstracao. Os convites reais ainda não estão disponíveis.</p> : <p id="codigo-ajuda" className="text-xs text-muted-foreground">Código de exemplo: demonstracao</p>}
        </form>
        <Link to="/convite/demonstracao" className="mt-5 inline-flex min-h-11 items-center text-sm underline underline-offset-4">Conhecer a demonstração</Link>
      </div>
    </section>
  );
}
