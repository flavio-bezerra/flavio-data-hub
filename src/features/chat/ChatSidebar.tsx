import { useState } from "react";

export default function ChatSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-end p-4 md:hidden">
      <button
        className="rounded-full bg-ardosia text-white px-4 py-2 shadow-lg"
        onClick={() => setOpen(true)}
        aria-label="Abrir chat do assistente"
      >
        Assistente
      </button>
      {open && (
        <div className="fixed inset-0 z-[61] bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
      )}
    </div>
  );
}
