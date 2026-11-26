import { BrowserRouter, Routes, Route } from "react-router-dom";
import SaveTheDate from "./pages/SaveTheDate";
import NotFound from "./pages/NotFound";
import ConfirmacaoPresenca from "@/features/presenca/ConfirmacaoPresenca";
import MeuConvite from "@/features/presenca/MeuConvite";
import PainelDaOrganizacao from "@/features/administracao/PainelDaOrganizacao";
import PainelDeConvidados from "@/features/administracao/PainelDeConvidados";
import PosicaoDaPagina from "@/features/casamento/PosicaoDaPagina";
import FormularioDeAcesso from "@/features/autenticacao/FormularioDeAcesso";

import AssistenteDaFesta from "@/features/assistente/AssistenteDaFesta";
import Cabecalho from "@/features/casamento/Cabecalho";
import { Outlet } from "react-router-dom";
import MemoriaDoAssistente from "@/features/administracao/MemoriaDoAssistente";
import PainelDeEmails from "@/features/administracao/PainelDeEmails";

const App = () => (
  <BrowserRouter>
    <PosicaoDaPagina />
    {(import.meta.env.VITE_ASSISTENTE_VISIVEL === 'true' || (import.meta.env.DEV && import.meta.env.MODE === 'convites-local')) && <AssistenteDaFesta />}
    <Routes>
      <Route path="/" element={<SaveTheDate />} />
      <Route element={<><Cabecalho /><Outlet /></>}>
      <Route path="/administracao" element={<PainelDaOrganizacao />} />
      <Route path="/administracao/emails" element={<PainelDeEmails />} />
      <Route path="/administracao/assistente" element={<MemoriaDoAssistente />} />
      <Route path="/acesso" element={<FormularioDeAcesso />} />
      <Route path="/meu-convite" element={<MeuConvite />} />
      <Route path="/administracao/convidados" element={<PainelDeConvidados />} />
      <Route path="/convite/:codigo" element={<ConfirmacaoPresenca />} />
      <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>

  </BrowserRouter>
);

export default App;
