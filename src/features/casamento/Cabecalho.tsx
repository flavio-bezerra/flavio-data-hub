import { useState } from "react";
import { casamento, secoes } from "./conteudo";

export default function Cabecalho() {
  const [menuAberto, setMenuAberto] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 md:px-8">
        <a href="/#inicio" className="font-display text-2xl" aria-label={`${casamento.nomes} — início`}>V <span className="font-script text-primary">&</span> F</a>
        <nav aria-label="Navegação principal" className="hidden items-center gap-6 lg:flex">
          {secoes.map((secao) => <a key={secao.id} href={`/#${secao.id}`} className="py-3 text-xs hover:text-primary">{secao.titulo}</a>)}
        </nav>
        <button type="button" onClick={() => setMenuAberto(!menuAberto)} aria-expanded={menuAberto} aria-controls="menu-celular" className="min-h-11 px-3 text-sm lg:hidden">{menuAberto ? "Fechar" : "Menu"}</button>
      </div>
      {menuAberto && <nav id="menu-celular" aria-label="Navegação no celular" className="grid border-t px-5 pb-4 lg:hidden">
        {secoes.map((secao) => <a key={secao.id} href={`/#${secao.id}`} onClick={() => setMenuAberto(false)} className="py-3 text-sm">{secao.titulo}</a>)}
      </nav>}
    </header>
  );
}
