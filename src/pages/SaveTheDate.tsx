import { useEffect } from "react";

const SaveTheDate = () => {
  useEffect(() => {
    document.title = "Victoria & Flávio · Casamento";
  }, []);

  const fullPoem = `O amor é uma companhia.
Já não sei andar só pelos caminhos,
Porque os meus caminhos já não são só meus;
Há um deitar de olhos doces em mim no fim do prado,
E os meus passos tornam-se mais lentos e mais suaves
Porque sinto que há outra pessoa a andar com eles,
E mesmo quando estou sozinho
Sinto-me acompanhado com a presença dela
E da pessoa que ela é para mim.

Não vejo bem a flor que vejo
Senão quando ela ma mostra com os olhos dela;
Não sinto a brisa que sopra
Senão quando me diz que ela sentiu a brisa soprar.

Nunca posso estar totalmente só,
Nunca posso andar só pelos meus caminhos,
Porque há sempre um eco dos passos dela nos meus,
E um silêncio que é ela a calar-se comigo
E a olhar para o mundo a meu lado.`;

  return (
    <main className="min-h-screen flex items-center justify-center p-8 md:p-16 bg-[#FAF8F5] text-[#2A2A2A] antialiased select-none relative overflow-hidden">
      
      {/* Background Poem Watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <blockquote className="font-[Cormorant_Garamond] italic text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] leading-[1.5] tracking-[0.02em] text-[#C9B896]/[0.035] font-light whitespace-pre-line text-center px-8 transform -rotate-1">
          {fullPoem}
        </blockquote>
      </div>

      <article className="w-full max-w-xl mx-auto text-center px-6 relative z-10">
        
        {/* Quote Section - Extended Version */}
        <section className="mb-16 md:mb-20 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <blockquote className="font-[Cormorant_Garamond] italic text-[1.5rem] md:text-[1.875rem] lg:text-[2rem] leading-[1.6] tracking-[0.01em] text-[#3A3A3A] font-light whitespace-pre-line">
            {`O amor é uma companhia.
Já não sei andar só pelos caminhos,
Porque os meus caminhos já não são só meus;`}
          </blockquote>
          <cite className="block mt-6 font-[Montserrat] uppercase tracking-[0.3em] text-[0.7rem] text-[#8A8A8A] font-normal">
            Alberto Caeiro
          </cite>
        </section>

        {/* Divider Line */}
        <hr className="w-24 mx-auto border-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9B896]/60 to-transparent mb-16 md:mb-20 animate-scale-in" style={{ animationDelay: '0.3s' }} />

        {/* Intro Text */}
        <section className="mb-14 md:mb-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <p className="font-[Cormorant_Garamond] text-[1.125rem] md:text-[1.25rem] leading-[1.7] tracking-[0.01em] text-[#4A4A4A] font-normal">
            Com a alegria de estarmos juntos e o desejo de celebrar este momento ao lado de quem amamos,
          </p>
        </section>

        {/* Names Section */}
        <section className="mb-16 md:mb-20 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <h1 className="font-[Cormorant_Garamond] text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] leading-[1.1] tracking-[0.08em] text-[#2A2A2A] font-light uppercase mb-4">
            Victoria
          </h1>
          
          <div className="flex items-center justify-center gap-3 my-6">
            <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#C9B896] to-transparent"></div>
            <span className="font-[Great_Vibes] text-[2.5rem] text-[#C9B896] leading-none select-none">
              &
            </span>
            <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#C9B896] to-transparent"></div>
          </div>
          
          <h1 className="font-[Cormorant_Garamond] text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] leading-[1.1] tracking-[0.08em] text-[#2A2A2A] font-light uppercase">
            Flávio
          </h1>
        </section>

        {/* Invite Text */}
      {/* SVG Invitation */}
      <section className="mb-16 md:mb-20 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
        <div className="flex justify-center">
          <img src="/convite_interno_frente.svg" alt="Convite" className="max-w-full h-auto" />
        </div>
      </section>
        <section className="mb-16 md:mb-20 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <p className="font-[Montserrat] uppercase tracking-[0.25em] text-[0.75rem] md:text-[0.8rem] text-[#8A8A8A] font-light leading-[1.5]">
            convidam para a celebração de seu casamento
          </p>
        </section>

        {/* Date & Time Section */}
        <section className="mb-16 md:mb-20 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <div className="flex flex-col items-center gap-3 md:gap-4">
            {/* Day of week, day number, month */}
            <div className="flex items-center gap-6 md:gap-8">
              <span className="font-[Montserrat] uppercase tracking-[0.2em] text-[0.7rem] text-[#8A8A8A] font-normal whitespace-nowrap">
                Domingo
              </span>
              
              <div className="relative">
                <span className="font-[Cormorant_Garamond] text-[5rem] md:text-[6rem] lg:text-[7rem] leading-none tracking-[0.05em] text-[#2A2A2A] font-light">
                  10
                </span>
                {/* Subtle vertical lines flanking the day number */}
                <div className="absolute left-[-3.5rem] top-1/2 -translate-y-1/2 w-[1px] h-8 bg-gradient-to-b from-transparent via-[#C9B896]/50 to-transparent hidden md:block"></div>
                <div className="absolute right-[-3.5rem] top-1/2 -translate-y-1/2 w-[1px] h-8 bg-gradient-to-b from-transparent via-[#C9B896]/50 to-transparent hidden md:block"></div>
              </div>
              
              <span className="font-[Montserrat] uppercase tracking-[0.2em] text-[0.7rem] text-[#8A8A8A] font-normal whitespace-nowrap">
                Outubro
              </span>
            </div>

            {/* Year */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#C9B896]/40 to-transparent"></div>
              <span className="font-[Montserrat] uppercase tracking-[0.3em] text-[0.75rem] text-[#8A8A8A] font-light">
                2027
              </span>
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#C9B896]/40 to-transparent"></div>
            </div>

            {/* Time */}
            <div className="mt-2">
              <span className="font-[Cormorant_Garamond] tracking-[0.15em] text-[1.125rem] md:text-[1.25rem] text-[#4A4A4A] font-normal">
                14:00
              </span>
            </div>
          </div>
        </section>

        {/* Venue Section */}
        <section className="mb-16 md:mb-20 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <p className="font-[Cormorant_Garamond] text-[1.5rem] md:text-[1.75rem] leading-[1.3] tracking-[0.02em] text-[#2A2A2A] font-normal mb-3">
            DellaTorres Eventos
          </p>
          <p className="font-[Montserrat] uppercase tracking-[0.15em] text-[0.8rem] text-[#8A8A8A] font-light mb-2">
            Mairiporã — SP
          </p>
          <p className="font-[Cormorant_Garamond] italic text-[0.95rem] text-[#6A6A6A] font-light tracking-[0.01em]">
            Recepção a seguir no mesmo local
          </p>
        </section>

        {/* Website Link - Simple */}
        <section className="animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
          <a
            href="https://casamento-flavio-victoria.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="font-[Montserrat] uppercase tracking-[0.15em] text-[0.7rem] text-[#8A8A8A] hover:text-[#C9B896] transition-colors duration-500 ease-out underline underline-offset-4 decoration-[1px] decoration-[#C9B896]/40 hover:decoration-[#C9B896]"
          >
            casamento-flavio-victoria.com.br
          </a>
        </section>

      </article>
    </main>
  );
};

export default SaveTheDate;