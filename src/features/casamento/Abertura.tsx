import { Button } from "@/components/ui/button";
import { casamento } from "./conteudo";
import Monograma from "./Monograma";
import RamoBotanico from "./RamoBotanico";

export default function Abertura() {
  return (
    <section id="inicio" aria-labelledby="nomes" className="abertura-editorial">

      <RamoBotanico className="ramo-abertura ramo-esquerdo" />
      <RamoBotanico className="ramo-abertura ramo-direito" />
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="eyebrow">Com amor, convidamos você</p>
        <Monograma className="monograma-abertura" />
        <h1 id="nomes" className="nomes-casal">Victória <span className="font-script text-primary">&</span> Flávio</h1>
        <p className="mt-5 font-display text-xl italic text-muted-foreground md:text-2xl">O amor é uma companhia.</p>
        <div className="data-convite"><span>DOMINGO</span><time dateTime={casamento.dataIso}>10 <span className="separador-data">/</span> 10 <span className="separador-data">/</span> 2027</time><span>ÀS {casamento.horario.toUpperCase()}</span></div>
        <p className="font-display text-2xl md:text-3xl">{casamento.local}</p>
        <p className="mt-2 text-xs tracking-[.12em] text-muted-foreground">{casamento.cidade}</p>
        <div className="mt-7 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Button size="lg" asChild><a href="#presenca">Confirmar presença</a></Button>
          <Button size="lg" variant="outline" asChild><a href="#casamento">Conheça o nosso dia</a></Button>
        </div>
        <a href="#historia" className="mt-6 inline-flex min-h-11 flex-col items-center gap-2 text-[10px] uppercase tracking-[.22em] text-muted-foreground">O começo de um novo capítulo<span aria-hidden="true" className="h-8 w-px bg-primary/30" /></a>
      </div>
    </section>
  );
}
