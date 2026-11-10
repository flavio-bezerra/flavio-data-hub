import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { orientacoes } from "./conteudo";

export default function Orientacoes() {
  return (
    <section id="orientacoes" aria-labelledby="orientacoes-titulo" className="orientacoes-editorial border-y bg-secondary/40 px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-3xl">
        <h2 id="orientacoes-titulo" className="mb-8 text-center font-display text-4xl md:text-5xl">Para aproveitar o dia</h2>
        <Accordion type="single" collapsible>
          {orientacoes.map((item) => <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="min-h-14 gap-4 text-left text-base">{item.pergunta}</AccordionTrigger>
            <AccordionContent className="leading-relaxed text-muted-foreground">
              {item.pendente && <p className="mb-2 text-xs font-medium text-primary">Em definição</p>}
              {item.resposta}
            </AccordionContent>
          </AccordionItem>)}
        </Accordion>
      </div>
    </section>
  );
}
