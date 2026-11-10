import { useState } from "react";

const SaveTheDate = () => {
  const [showMessage, setShowMessage] = useState(false);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4 text-[#222A23]">
      <div className="max-w-md w-full mx-auto p-8">
        
        {/* Logo / heart icon */}
        <div className="inline-block mb-8">
          <svg className="w-16 h-16 text-gray-800 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path className="stroke-2" strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13.444m0-13.444V6.253m0 7.2a7.2 7.2 0 1 0 0 14.4 7.2 7.2 0 0 0 0-14.4Z"></path>
            <path className="stroke-2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        {/* Poem / Quote */}
        <p className="text-center text-[14px] text-gray-600 font-light italic leading-relaxed mb-8 tracking-wider">
          "O amor é uma companhia."
          <br />
          <span className="block mt-2 text-[12px] text-gray-500 font-normal not-italic tracking-tighter">
            ALBERTO CAEIRO
          </span>
        </p>

        {/* Intro text */}
        <p className="text-center text-[14px] text-gray-700 font-light leading-relaxed mb-10 tracking-wide">
          Com a alegria de estarmos juntos e o desejo de celebrar este momento ao lado de quem amamos,
        </p>

        {/* Names */}
        <div className="mb-10">
          <h1 className="text-center text-[26px] font-normal leading-tight mb-2 tracking-widest text-[#222A23]">
            Victoria
          </h1>
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-[1px] bg-gray-400 mx-2"></div>
            <span className="text-[16px] text-[#4A5947] font-light italic mx-1">&amp;</span>
            <div className="w-8 h-[1px] bg-gray-400 mx-2"></div>
          </div>
          <h1 className="text-center text-[26px] font-normal leading-tight tracking-widest text-[#222A23]">
            Flávio
          </h1>
        </div>

        {/* Invitation text */}
        <p className="text-center text-[12px] text-gray-500 font-light mb-8 tracking-wide">
          convidam para a celebração de seu casamento
        </p>

        {/* Date block */}
        <div className="flex flex-col items-center justify-center gap-2 mb-10">
          <div className="flex items-center gap-2">
            <span className="text-[14px] text-gray-600 font-light tracking-wider">Domingo</span>
            <div className="w-[0.5px] h-4 bg-gray-400"></div>
            <span className="text-[24px] font-light text-[#1F2820] tracking-tight">10</span>
            <div className="w-[0.5px] h-4 bg-gray-400"></div>
            <span className="text-[14px] text-gray-600 font-light tracking-wider">Outubro</span>
          </div>
          <span className="text-[16px] text-gray-600 font-normal tracking-widest uppercase">2027</span>
          <span className="text-[14px] text-gray-700 font-normal tracking-wide mt-2">14:00</span>
        </div>

        {/* Location */}
        <div className="text-center mb-12">
          <p className="text-[16px] font-normal text-[#1F2820] mb-2 tracking-wide">DellaTorres Eventos</p>
          <p className="text-[14px] text-gray-500 font-light tracking-wide">Mairiporã — SP</p>
          <p className="text-[12px] text-gray-400 font-light italic mt-2 tracking-wide">Recepção a seguir no mesmo local</p>
        </div>

        {/* QR Code / Website */}
        <div className="text-center">
          <p className="text-[12px] text-gray-400 font-sans font-light tracking-widest uppercase mb-4">
            Confirmação de Presença
          </p>
          <a
            href="https://casamento-flavio-victoria.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] text-[#1F2820] font-light tracking-wide hover:text-gray-600 transition-colors underline underline-offset-4"
          >
            casamento-flavio-victoria.com.br
          </a>
        </div>

        {/* Confirmation button */}
        <button
          onClick={() => setShowMessage(true)}
          className="mt-10 w-full bg-[#222A23] text-white py-3 px-6 rounded-xl font-normal text-[14px] hover:bg-[#1F2820] transition-colors tracking-wide"
        >
          Confirmar Presença
        </button>

        {/* Modal */}
        {showMessage && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-10 shadow-2xl max-w-sm w-full text-center border border-gray-100">
              <svg className="w-12 h-12 text-[#4A5947] mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path className="stroke-2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
              </svg>
              <h3 className="text-[20px] font-normal mb-2 tracking-widest text-[#222A23] uppercase">Obrigado!</h3>
              <p className="text-[14px] text-gray-600 font-light mb-8 leading-relaxed">
                Sua presença foi confirmada. Aguardamos você no grande dia!
              </p>
              <button
                onClick={() => setShowMessage(false)}
                className="bg-[#222A23] text-white py-2 px-6 rounded-xl font-normal text-[14px] hover:bg-[#1F2820] transition-colors tracking-wide"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default SaveTheDate;