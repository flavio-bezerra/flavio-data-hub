import { casamento } from "./conteudo";

export default function NossaHistoria() {
  return (
    <section id="historia" aria-labelledby="historia-titulo" className="border-y bg-secondary/40 px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="flex flex-col gap-5">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Victoria & Flávio</p>
          <h2 id="historia-titulo" className="font-display text-4xl md:text-5xl">Nossa história</h2>
          <p className="font-display text-xl leading-relaxed">Com a alegria de estarmos juntos e o desejo de celebrar este momento ao lado de quem amamos.</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{casamento.historia ?? "Em breve, vamos compartilhar um pouco da nossa história por aqui."}</p>
        </div>
        <div className="flex aspect-[4/3] flex-col items-center justify-center gap-4 border border-champagne p-8 text-center">
          <span className="font-display text-6xl text-primary" aria-hidden="true">V <span className="font-script text-4xl">&</span> F</span>
          <p className="text-xs tracking-widest text-muted-foreground">Espaço para uma foto escolhida por nós</p>
        </div>
      </div>
    </section>
  );
}
