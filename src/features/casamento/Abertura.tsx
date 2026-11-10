import { Button } from "@/components/ui/button";
import { casamento } from "./conteudo";

export default function Abertura() {
  return (
    <section id="inicio" aria-labelledby="nomes" className="relative px-5 py-16 text-center md:px-8 md:py-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Vamos celebrar juntos</p>
        <h1 id="nomes" className="flex flex-col items-center font-display text-6xl font-light leading-none sm:text-7xl md:text-8xl">
          Victoria <span className="my-3 font-script text-4xl text-primary md:text-5xl">&</span> Flávio
        </h1>
        <div className="h-px w-20 bg-champagne" aria-hidden="true" />
        <div className="flex flex-col gap-2">
          <p className="font-display text-2xl md:text-3xl"><time dateTime={casamento.dataIso}>{casamento.data}</time></p>
          <p className="text-sm text-muted-foreground">{casamento.diaDaSemana} · {casamento.horario} · {casamento.cidade}</p>
          <p className="font-display text-xl">{casamento.local}</p>
        </div>
        <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Button size="lg" asChild><a href="#presenca">Confirmar presença</a></Button>
          <Button size="lg" variant="outline" asChild><a href="#casamento">Sobre o dia</a></Button>
        </div>
        <figure className="mt-6 max-w-xl">
          <blockquote className="whitespace-pre-line font-display text-xl italic leading-relaxed md:text-2xl">{casamento.poema}</blockquote>
          <figcaption className="mt-4 text-xs tracking-widest text-muted-foreground">{casamento.autor}</figcaption>
        </figure>
      </div>
    </section>
  );
}
