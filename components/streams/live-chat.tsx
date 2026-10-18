"use client";

import { Clock, MessageSquare, Settings, X } from "lucide-react";
import Link from "next/link";

//el chat real llega con Flow: por ahora solo está el marco y el aviso
export function LiveChat({
  loggedIn,
  closed,
  onClose,
}: {
  loggedIn: boolean;
  closed: boolean; //el evento ya terminó
  onClose?: () => void;
}) {
  return (
    <aside className="flex h-[70vh] flex-col overflow-hidden rounded-xl bg-[#120a24] ring-1 ring-white/10 lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]">
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <span className="text-sm font-semibold text-white">Chat</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled
            title="Disponible pronto"
            aria-label="Ajustes del chat (pronto)"
            className="cursor-not-allowed rounded-md p-1.5 text-white/30"
          >
            <Settings className="size-4" />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Ocultar chat"
              className="hidden rounded-md p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white lg:block"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
        <MessageSquare className="size-8 text-white/20" />
        <p className="text-sm font-semibold text-white/80">El chat en vivo llega pronto</p>
        <p className="text-xs text-white/40">
          Aquí aparecerán los mensajes de los espectadores cuando el chat esté activo.
        </p>
      </div>

      <div className="border-t border-white/10 p-3">
        {closed ? (
          <p className="rounded-lg bg-white/5 px-3 py-2.5 text-center text-sm text-white/50">
            El chat cerró cuando terminó la transmisión
          </p>
        ) : loggedIn ? (
          <div className="flex items-center gap-2.5 rounded-lg border border-amber-400/20 bg-amber-400/10 px-3 py-2.5 text-sm text-amber-100/90">
            <Clock className="size-4 shrink-0 text-amber-300" />
            Aún no puedes enviar mensajes. El chat se activa pronto.
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 rounded-lg bg-white/5 px-3 py-2.5">
            <p className="text-sm text-white/60">Inicia sesión para chatear</p>
            <Link
              href="/login"
              className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-black hover:bg-white/90"
            >
              Iniciar sesión
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}