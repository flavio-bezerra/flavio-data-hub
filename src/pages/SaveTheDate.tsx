import { useState } from "react";

const SaveTheDate = () => {
  const [showMessage, setShowMessage] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full text-center border-indigo-200">
        <div className="inline-block mb-6">
          <svg className="w-16 h-16 text-indigo-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path className="stroke-2" strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13.444m0-13.444V6.253m0 7.2a7.2 7.2 0 1 0 0 14.4 7.2 7.2 0 0 0 0-14.4Z"></path>
            <path className="stroke-2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-indigo-800 mb-2">Save the Date</h1>
        <p className="text-indigo-600 mb-6">João & Maria</p>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            <span className="font-medium">Data do Casamento:</span> 15 de fevereiro de 2025
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-medium">Local:</span> Igreja São Pedro, São Paulo
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-medium">Horário:</span> 14:00
          </p>
        </div>

        <button
          onClick={() => setShowMessage(true)}
          className="mt-6 w-full bg-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
            Confirmar Presença
        </button>
      </div>

      {/* Modal / Confirmation */}
      {showMessage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-zxl z-50 items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full text-center border">
            <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path className="stroke-2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
            </svg>
            <h3 className="text-2xl font-bold mb-2">Obrigado!</h3>
            <p className="text-indigo-600 mb-6">Sua presença foi confirmada. Aguardamos você no grande dia!</p>
            <button
              onClick={() => setShowMessage(false)}
              className="bg-indigo-600 text-white py-2 px-6 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default SaveTheDate;