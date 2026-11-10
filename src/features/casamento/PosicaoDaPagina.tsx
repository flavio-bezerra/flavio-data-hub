import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function PosicaoDaPagina() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    document.title = pathname.startsWith("/convite/") ? "Sua presença · Victoria & Flávio" : "Victoria & Flávio · Casamento";
    if (hash) {
      const elemento = document.getElementById(hash.slice(1));
      elemento?.scrollIntoView();
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname, hash]);
  return null;
}
