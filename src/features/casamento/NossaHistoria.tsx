import { casamento } from "./conteudo";

export default function NossaHistoria() {
  return (
    <section id="historia" aria-labelledby="historia-titulo" className="historia-livro">
      <div className="historia-coluna">
        <p className="rotulo-herbario">Dois caminhos, uma vida</p>
        <h2 id="historia-titulo" className="titulo-secao">Nossa história</h2>
        <p className="historia-abertura">Com a alegria de estarmos juntos e o desejo de celebrar este momento ao lado de quem amamos.</p>
        <p className="historia-pendente">{casamento.historia ?? "Em breve, vamos compartilhar um pouco da nossa história por aqui."}</p>
      </div>
      <div className="historia-lado">
      <img src="/violeta-ramo.webp" width={692} height={992} alt="" aria-hidden="true" loading="lazy" className="flor-historia" />
      <figure className="historia-citacao">
        <blockquote>{casamento.poema.split("\n").map((verso) => <p key={verso}>{verso}</p>)}</blockquote>
        <figcaption>{casamento.autor}</figcaption>
      </figure>
      </div>
    </section>
  );
}
