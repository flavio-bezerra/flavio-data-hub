import { useEffect, useRef, useState } from "react";

interface GoogleIdentity {
  accounts: { id: {
    initialize: (options: { client_id: string; nonce: string; auto_select: boolean; callback: (response: { credential: string }) => void }) => void;
    renderButton: (element: HTMLElement, options: { theme: string; size: string; text: string; width: number }) => void;
    cancel: () => void;
  } };
}

export default function EntrarComGoogle({ clientId, nonce, onCredential }: {
  clientId: string; nonce: string; onCredential: (credential: string) => Promise<void>;
}) {
  const container = useRef<HTMLDivElement>(null);
  const callbackAtual = useRef(onCredential);
  useEffect(() => { callbackAtual.current = onCredential; }, [onCredential]);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!clientId) return;
    let disposed = false;
    const googleWindow = window as Window & { google?: GoogleIdentity };
    const render = () => {
      if (disposed || !googleWindow.google || !container.current) return;
      googleWindow.google.accounts.id.initialize({ client_id: clientId, nonce, auto_select: false,
        callback: ({ credential }) => { if (!disposed) void callbackAtual.current(credential); } });
      container.current.replaceChildren();
      googleWindow.google.accounts.id.renderButton(container.current, { theme: "outline", size: "large", text: "continue_with", width: Math.min(320, container.current.clientWidth) });
    };
    let script = document.querySelector<HTMLScriptElement>('script[data-google-login]');
    if (googleWindow.google) render();
    else {
      if (!script) { script = document.createElement('script'); script.src = 'https://accounts.google.com/gsi/client'; script.async = true; script.dataset.googleLogin = 'true'; document.head.append(script); }
      script.addEventListener('load', render);
      script.addEventListener('error', fail);
    }
    function fail() { if (!disposed) setError(true); }
    return () => { disposed = true; script?.removeEventListener('load', render); script?.removeEventListener('error', fail); googleWindow.google?.accounts.id.cancel(); };
  }, [clientId, nonce]);
  if (!clientId) return <p>Google ainda não configurado.</p>;
  return <div className="login-google"><div ref={container} />{error && <p role="alert">Não foi possível carregar o acesso por Google. Verifique sua conexão e recarregue a página.</p>}</div>;
}
