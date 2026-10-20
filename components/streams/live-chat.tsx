"use client";

import { useLiveChat } from "@/src/hooks/use-live-chat";
import { MessageSquare, Send, Settings, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";

const MAX_LENGTH = 200;

export function LiveChat({
  eventId,
  loggedIn,
  closed,
  onClose,
}: {
  eventId: string;
  loggedIn: boolean;
  closed: boolean; //el evento ya terminó
  onClose?: () => void;
}) {
  const { messages, status, send } = useLiveChat(eventId, !closed, (message) =>
    toast.error(message),
  );

  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);

  // si el usuario sube a leer mensajes viejos, no lo bajamos a la fuerza
  function handleScroll() {
    const el = listRef.current;
    if (!el) return;
    stickToBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  }

  useEffect(() => {
    const el = listRef.current;
    if (el && stickToBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    if (send(text)) setDraft("");
  }

  const canWrite = status === "open";

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

      {status === "reconnecting" && (
        <p className="bg-amber-400/10 px-4 py-1.5 text-center text-xs text-amber-200/90">
          Reconectando al chat…
        </p>
      )}

      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
          <MessageSquare className="size-8 text-white/20" />
          <p className="text-sm font-semibold text-white/80">Aún no hay mensajes</p>
          <p className="text-xs text-white/40">
            {closed
              ? "Esta transmisión ya terminó."
              : "Los mensajes de los espectadores aparecerán aquí."}
          </p>
        </div>
      ) : (
        <div
          ref={listRef}
          onScroll={handleScroll}
          className="flex-1 space-y-1.5 overflow-y-auto px-4 py-3"
        >
          {messages.map((m) => (
            <p key={m.id} className="break-words text-sm leading-snug text-white/90">
              <span className="mr-1.5 font-semibold text-violet-300">{m.username}</span>
              {m.text}
            </p>
          ))}
        </div>
      )}

      <div className="border-t border-white/10 p-3">
        {closed ? (
          <p className="rounded-lg bg-white/5 px-3 py-2.5 text-center text-sm text-white/50">
            El chat cerró cuando terminó la transmisión
          </p>
        ) : loggedIn ? (
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={MAX_LENGTH}
                disabled={!canWrite}
                placeholder={canWrite ? "Escribe un mensaje" : "Conectando al chat…"}
                className="min-w-0 flex-1 rounded-lg bg-white/5 px-3 py-2.5 text-sm text-white outline-none ring-1 ring-white/10 placeholder:text-white/40 focus:ring-violet-400/60 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!canWrite || draft.trim() === ""}
                aria-label="Enviar mensaje"
                className="rounded-lg bg-violet-600 p-2.5 text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="size-4" />
              </button>
            </div>
            {draft.length > 150 && (
              <p className="mt-1 text-right text-xs text-white/40">
                {draft.length}/{MAX_LENGTH}
              </p>
            )}
          </form>
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