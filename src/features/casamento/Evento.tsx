import { Button } from "@/components/ui/button";
import { casamento } from "./conteudo";

export default function Evento() {
  return (
    <section id="casamento" aria-labelledby="evento-titulo" className="px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">Um dia para guardar</p>
          <h2 id="evento-titulo" className="font-display text-4xl md:text-5xl">O casamento</h2>
        </div>
        <div className="grid gap-8 border-y py-10 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-3xl">Cerimônia & recepção</h3>
            <p className="text-sm leading-relaxed">{casamento.data}, às {casamento.horario}.</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{casamento.recepcao}.</p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-3xl">{casamento.local}</h3>
            <p className="text-sm">{casamento.cidade}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{casamento.endereco ?? "Endereço completo e orientações de acesso em breve."}</p>
            {casamento.mapaUrl && <Button variant="outline" size="lg" asChild><a href={casamento.mapaUrl} target="_blank" rel="noopener noreferrer">Abrir mapa</a></Button>}
          </div>
        </div>
      </div>
    </section>
  );
}
