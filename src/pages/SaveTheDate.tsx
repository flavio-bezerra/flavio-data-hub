import { useEffect } from "react";

const SaveTheDate = () => {
  useEffect(() => {
    document.title = "Victoria & Flávio · Casamento";
  }, []);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-6 text-[#1F2820] font-serif antialiased">
      {/* Convite Digital */}
      <div className="max-w-lg w-full bg-white p-12 md:p-20 border border-gray-100 shadow-[0_25px_50px_-12px_rgba(31,40,32,0.15)] relative overflow-hidden">

        {/* Elementos decorativos botânicos sutis (topo e base) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-gray-300 to-transparent pointer-events-none" />

        {/* Citação */}
        <div className="text-center mb-16 relative">
          <p className="text-[15px] text-[#6D7E6B] font-serif italic leading-relaxed tracking-widest mb-2 uppercase">
            &ldquo;O amor é uma companhia.&rdquo;
          </p>
          <p className="text-[12px] text-[#4F5F4C] font-serif tracking-wider uppercase">
            Alberto Caeiro
          </p>
        </div>

        {/* Texto introdutório */}
        <div className="text-center mb-14">
          <p className="text-[16px] text-[#333D34] font-serif leading-relaxed tracking-wide">
            Com a alegria de estarmos juntos e o desejo de celebrar este momento ao lado de quem amamos,
          </p>
        </div>

        {/* Nomes */}
        <div className="text-center mb-14">
          <h1 className="text-[34px] md:text-[42px] font-light leading-none text-[#1F2820] tracking-widest mb-3 uppercase">
            Victoria
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="w-[60px] h-[0.5px] bg-[#7A8D77]"></div>
            <span className="text-[18px] text-[#4A5947] font-serif italic">&amp;</span>
            <div className="w-[60px] h-[0.5px] bg-[#7A8D77]"></div>
          </div>
          <h1 className="text-[34px] md:text-[42px] font-light leading-none text-[#1F2820] tracking-widest mt-3 uppercase">
            Flávio
          </h1>
        </div>

        {/* Convidam */}
        <div className="text-center mb-16">
          <p className="text-[14px] text-[#556651] font-serif tracking-widest uppercase">
            convidam para a celebração de seu casamento
          </p>
        </div>

        {/* Data e Horário */}
        <div className="flex flex-col items-center justify-center gap-2 mb-16">
          <div className="flex items-center gap-3">
            <span className="text-[15px] text-[#222A23] font-serif tracking-wide">Domingo</span>
            <div className="w-[0.5px] h-[24px] bg-[#8A9D87]"></div>
            <span className="text-[32px] font-light text-[#1F2820] leading-none">10</span>
            <div className="w-[0.5px] h-[24px] bg-[#8A9D87]"></div>
            <span className="text-[15px] text-[#222A23] font-serif tracking-wide">Outubro</span>
          </div>
          <span className="text-[18px] text-[#556651] font-serif tracking-widest uppercase mt-2">
            2027
          </span>
          <span className="text-[15px] text-[#333D34] font-serif tracking-wide mt-4">
            14:00
          </span>
        </div>

        {/* Local */}
        <div className="text-center mb-20">
          <p className="text-[18px] font-normal text-[#1F2820] mb-2 tracking-wide leading-tight">
            DellaTorres Eventos
          </p>
          <p className="text-[14px] text-[#4F5F4C] font-serif tracking-wide">
            Mairiporã — SP
          </p>
          <p className="text-[13px] text-[#5F705C] font-serif italic mt-3 tracking-wide">
            Recepção a seguir no mesmo local
          </p>
        </div>

        {/* Site / Confirmação */}
        <div className="text-center">
          <p className="text-[12px] text-[#6A7A67] font-sans tracking-widest uppercase mb-3">
            Confirmação de Presença
          </p>
          <a
            href="https://casamento-flavio-victoria.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[15px] text-[#1F2820] font-serif tracking-wide hover:text-[#4A5947] transition-colors underline underline-offset-4 decoration-[#D4C9B9] decoration-2"
          >
            casamento-flavio-victoria.com.br
          </a>
        </div>

        {/* Linha inferior decorativa */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-gray-300 to-transparent pointer-events-none" />
      </div>
    </main>
  );
};

export default SaveTheDate;