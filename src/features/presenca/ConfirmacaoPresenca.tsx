import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Cabecalho from "@/features/casamento/Cabecalho";
import Rodape from "@/features/casamento/Rodape";

type Resposta = "pendente" | "sim" | "nao";

export default function ConfirmacaoPresenca() {
  const { codigo } = useParams<{ codigo: string }>();
  const [respostas, setRespostas] = useState<Record<string, Resposta>>({ pessoa1: "pendente", pessoa2: "pendente" });
  const [resultado, setResultado] = useState<"inicial" | "incompleto" | "salvo">("inicial");
  const pessoas = [{ id: "pessoa1", nome: "Convidada de exemplo" }, { id: "pessoa2", nome: "Convidado de exemplo" }];
  const conviteValido = codigo === "demonstracao";

  return (
    <div className="min-h-screen">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:p-4">Ir para o conteúdo</a>
      <Cabecalho />
      <main id="conteudo" className="mx-auto max-w-2xl px-5 py-16 md:py-24">
        <p className="mb-4 text-xs uppercase tracking-widest text-primary">Demonstração · sem envio de dados</p>
        <h1 className="font-display text-4xl md:text-5xl">Sua presença</h1>
        {!conviteValido ? <div className="mt-8 flex flex-col gap-5">
          <p role="alert" className="text-sm leading-relaxed">Este convite não está disponível nesta prévia. Use o convite de demonstração para conhecer a confirmação.</p>
          <Button size="lg" asChild><Link to="/convite/demonstracao">Abrir demonstração</Link></Button>
        </div> : <form className="mt-8 flex flex-col gap-6" onSubmit={(event) => {
          event.preventDefault();
          setResultado(Object.values(respostas).some((resposta) => resposta === "pendente") ? "incompleto" : "salvo");
        }}>
          <p className="text-sm leading-relaxed text-muted-foreground">Convite de exemplo. Escolha uma resposta para cada pessoa.</p>
          {pessoas.map((pessoa) => <fieldset key={pessoa.id} className="border p-5">
            <legend className="px-2 font-display text-2xl">{pessoa.nome}</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {([{ valor: "sim", texto: "Estarei presente" }, { valor: "nao", texto: "Não poderei ir" }] as const).map((opcao) => <label key={opcao.valor} className="flex min-h-12 cursor-pointer items-center gap-3 border p-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-secondary">
                <input type="radio" className="h-4 w-4 accent-primary" name={pessoa.id} value={opcao.valor} checked={respostas[pessoa.id] === opcao.valor} onChange={() => {
                  setRespostas({ ...respostas, [pessoa.id]: opcao.valor });
                  setResultado("inicial");
                }} />
                {opcao.texto}
              </label>)}
            </div>
          </fieldset>)}
          {resultado === "incompleto" && <p role="alert" className="text-sm text-destructive">Escolha uma resposta para cada pessoa do convite.</p>}
          {resultado === "salvo" && <p role="status" className="border border-primary bg-secondary p-4 text-sm leading-relaxed">Respostas registradas apenas nesta demonstração. Nenhuma confirmação real foi enviada. Ao recarregar a página, as escolhas serão apagadas.</p>}
          <Button type="submit" size="lg">{resultado === "salvo" ? "Atualizar demonstração" : "Salvar demonstração"}</Button>
          <p className="text-xs leading-relaxed text-muted-foreground">Prazo real, convidados e envio ao servidor serão configurados antes da abertura das confirmações.</p>
        </form>}
        <Link to="/#presenca" className="mt-8 inline-flex min-h-11 items-center text-sm underline underline-offset-4">Voltar ao site</Link>
      </main>
      <Rodape />
    </div>
  );
}
