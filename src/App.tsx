import { BrowserRouter, Routes, Route } from "react-router-dom";
import SaveTheDate from "./pages/SaveTheDate";
import NotFound from "./pages/NotFound";
import ConfirmacaoPresenca from "@/features/presenca/ConfirmacaoPresenca";
import PosicaoDaPagina from "@/features/casamento/PosicaoDaPagina";

const App = () => (
  <BrowserRouter>
    <PosicaoDaPagina />
    <Routes>
      <Route path="/" element={<SaveTheDate />} />
      <Route path="/convite/:codigo" element={<ConfirmacaoPresenca />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;