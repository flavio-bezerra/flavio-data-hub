import { BrowserRouter, Routes, Route } from "react-router-dom";
import SaveTheDate from "./pages/SaveTheDate";
import NotFound from "./pages/NotFound";
import ConfirmacaoPresenca from "@/features/presenca/ConfirmacaoPresenca";
import PosicaoDaPagina from "@/features/casamento/PosicaoDaPagina";
import FormularioDeAcesso from "@/features/autenticacao/FormularioDeAcesso";
import { ChatSidebar } from "@/features/chat/ChatSidebar";

import AssistenteDaFesta from "@/features/assistente/AssistenteDaFesta";
import MemoriaDoAssistente from "@/features/administracao/MemoriaDoAssistente";

const App = () => (
  <BrowserRouter>
    <PosicaoDaPagina />
    <AssistenteDaFesta />
    <Routes>
      <Route path="/" element={<SaveTheDate />} />
      <Route path="/administracao/assistente" element={<MemoriaDoAssistente />} />
      <Route path="/acesso" element={<FormularioDeAcesso />} />
      <Route path="/convite/:codigo" element={<ConfirmacaoPresenca />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <ChatSidebar />
  </BrowserRouter>
);

export default App;
