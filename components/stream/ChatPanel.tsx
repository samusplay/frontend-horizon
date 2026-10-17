import { MessageSquare, SendHorizontal, Users } from "lucide-react";
import Link from "next/link";

//mensajes de ejemplo para ver el diseño, se reemplazan cuando Flow esté listo
const SAMPLE_MESSAGES = [
  { user: "andrea_g", text: "Ya empezó, qué bien se ve", color: "text-fuchsia-300" },
  { user: "juanpa", text: "Se escucha perfecto", color: "text-sky-300" },
  { user: "sofi.dev", text: "Saludos desde Medellín", color: "text-emerald-300" },
  { user: "cris_77", text: "¿A qué hora termina?", color: "text-amber-300" },
  { user: "andrea_g", text: "Más tarde hacen el sorteo", color: "text-fuchsia-300" },
  { user: "mateo", text: "Llegué tarde, ¿qué me perdí?", color: "text-rose-300" },
  { user: "juanpa", text: "Nada, apenas va empezando", color: "text-sky-300" },
];

//por ahora es de servidor y estático, cuando conecte con Flow pasa a "use client"
export function ChatPanel({ loggedIn, closed = false }: { loggedIn: boolean; closed?: boolean }) {
  return (
    <div className="flex h-[520px] flex-col rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl shadow-fuchsia-500/10 lg:h-[600px]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-4 text-fuchsia-300" />
          <h2 className="font-semibold">Chat en vivo</h2>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-white/50">
          <Users className="size-3.5" />
          -- conectados
        </span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {SAMPLE_MESSAGES.map((message, i) => (
          <p key={i} className="text-sm leading-snug">
            <span className={`font-semibold ${message.color}`}>{message.user}</span>
            <span className="text-white/80"> {message.text}</span>
          </p>
        ))}
        <p className="pt-2 text-center text-xs text-white/30">
          Mensajes de ejemplo · el chat real llega con Flow
        </p>
      </div>

      <div className="border-t border-white/10 p-3">
        {closed ? (
          <p className="rounded-lg bg-white/5 px-3 py-2.5 text-center text-sm text-white/50">
            El chat cerró cuando terminó la transmisión
          </p>
        ) : loggedIn ? (
          <div className="flex gap-2">
            <input
              disabled
              placeholder="Escribe un mensaje..."
              className="h-10 flex-1 rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white outline-none placeholder:text-white/40 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              disabled
              aria-label="Enviar mensaje"
              className="flex size-10 items-center justify-center rounded-md bg-fuchsia-500/20 text-fuchsia-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <SendHorizontal className="size-4" />
            </button>
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
    </div>
  );
}