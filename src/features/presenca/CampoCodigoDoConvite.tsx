import { useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function CampoCodigoDoConvite({ titulo, aberto = false }: { titulo: string; aberto?: boolean }) {
  const id = useId();
  const navegar = useNavigate();
  const [erro, setErro] = useState(false);
  return <details open={aberto} className="etapa-do-convite p-4 sm:p-6">
    <summary className="min-h-11 cursor-pointer font-display text-2xl text-primary">{titulo}</summary>
    <form className="mt-4 space-y-3" onSubmit={evento => {
      evento.preventDefault();
      const codigo = String(new FormData(evento.currentTarget).get('codigo') ?? '').trim().toLowerCase();
      if (!/^[a-f0-9]{64}$/.test(codigo)) { setErro(true); return; }
      evento.currentTarget.reset();
      navegar(`/meu-convite#codigo=${codigo}`, { replace: true });
    }}>
      <label htmlFor={id} className="block">Código privado do convite</label>
      <input id={id} name="codigo" type="text" className="min-h-11 w-full rounded border bg-background p-2" autoComplete="off" autoCapitalize="none" spellCheck={false} required maxLength={100} onChange={() => setErro(false)} aria-invalid={erro} aria-describedby={erro ? `${id}-erro` : undefined} />
      {erro && <p id={`${id}-erro`} role="alert" className="text-destructive">O código parece incompleto ou inválido. Copie o código inteiro que você recebeu.</p>}
      <Button type="submit">Continuar com o código</Button>
    </form>
  </details>;
}
