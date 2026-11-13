import { casamento } from "./conteudo";

export default function NossaHistoria() {
  return (
    <section id="historia" aria-labelledby="historia-titulo" className="historia-livro">
      <div className="historia-album">
        <figure className="foto-album foto-celebracao">
          <img src="/rebranding/casal-celebracao.webp" width={1280} height={853} alt="Victória e Flávio abraçados durante uma celebração" loading="lazy" />
        </figure>
        <figure className="foto-album foto-juntos">
          <img src="/rebranding/casal-juntos.webp" width={1400} height={788} alt="Flávio segurando Victória no colo, os dois sorrindo ao ar livre" loading="lazy" />
        </figure>
        <img src="/copo-de-leite-cartao.webp" width={819} height={524} alt="" aria-hidden="true" loading="lazy" className="album-flor" />
      </div>
      <div className="historia-coluna">
        <p className="rotulo-herbario">Dois caminhos, uma vida</p>
        <h2 id="historia-titulo" className="titulo-secao">Nossa história</h2>
        <p className="historia-abertura">Com a alegria de estarmos juntos e o desejo de celebrar este momento ao lado de quem amamos.</p>
        <p className="historia-pendente">{casamento.historia ?? "Em breve, vamos compartilhar um pouco da nossa história por aqui."}</p>
        <figure className="historia-citacao">
          <blockquote>{casamento.poema.split("\n").map((verso) => <p key={verso}>{verso}</p>)}</blockquote>
          <figcaption>{casamento.autor}</figcaption>
        </figure>
      </div>
    </section>
  );
}
