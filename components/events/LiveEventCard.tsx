import type { EventSummary } from "@/src/schemas/events";
import { ImageIcon, Play } from "lucide-react";
import Link from "next/link";

export function LiveEventCard({ event, index }: { event: EventSummary; index: number }) {
  return (
    //el contenedor lleva la animación de entrada y el enlace el efecto al pasar el mouse, para que no se pisen
    <div
      style={{ animationDelay: `${index * 80}ms` }}
      className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500"
    >
      <Link
        href={`/events/${event.id}`}
        className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-white/5 outline-none transition duration-300 hover:-translate-y-1 hover:border-fuchsia-400/50 hover:shadow-[0_12px_40px_rgba(217,70,239,0.2)] focus-visible:ring-[3px] focus-visible:ring-fuchsia-400/50"
      >
        <div className="relative aspect-video bg-gradient-to-br from-fuchsia-500/20 via-violet-500/10 to-transparent">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={`Portada de ${event.title}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-white/30">
              <ImageIcon className="size-12" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

          <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold">
            <span className="size-1.5 animate-pulse rounded-full bg-white" />
            EN VIVO
          </span>

          {/* botón de reproducir que aparece al pasar el mouse */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
            <span className="flex size-14 items-center justify-center rounded-full bg-white/90 text-black shadow-xl">
              <Play className="size-6 fill-current" />
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-4">
            <h2 className="line-clamp-2 text-lg font-semibold">{event.title}</h2>
            {event.description && <p className="mt-1 line-clamp-1 text-sm text-white/60">{event.description}</p>}
          </div>
        </div>
      </Link>
    </div>
  );
}