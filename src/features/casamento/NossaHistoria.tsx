import { casamento } from "./conteudo";

export default function NossaHistoria() {
  return (
    <section id="historia" aria-labelledby="historia-titulo" className="historia-editorial px-6 py-16 md:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Dois caminhos, uma vida</p>
        <h2 id="historia-titulo" className="mt-5 font-display text-4xl md:text-5xl">Nossa história</h2>
        <p className="mt-6 font-display text-xl leading-relaxed">Com a alegria de estarmos juntos e o desejo de celebrar este momento ao lado de quem amamos.</p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{casamento.historia ?? "Em breve, vamos compartilhar um pouco da nossa história por aqui."}</p>
        <div className="mx-auto mt-9 h-px w-16 bg-primary/25" aria-hidden="true" />
      </div>
    </section>
  );
}
