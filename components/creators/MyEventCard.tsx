import type { EventSummary } from "@/src/schemas/events";
import { Eye, ImageIcon, Pencil, Radio, Trash2 } from "lucide-react";
import Link from "next/link";

const STATUS = {
  Scheduled: { label: "PRÓXIMO", className: "bg-white/10 text-white/80" },
  Live: { label: "EN VIVO", className: "bg-red-600 text-white" },
  Finished: { label: "FINALIZADO", className: "bg-white/10 text-white/50" },
} as const;

const disabledButton =
  "flex h-9 cursor-not-allowed items-center justify-center gap-2 rounded-md border border-white/10 text-sm text-white/30";

export function MyEventCard({ event }: { event: EventSummary }) {
  const status = STATUS[event.status];

  const dateLabel = new Date(event.startsAt).toLocaleString("es-CO", {
    timeZone: "America/Bogota",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5">
      <div className="relative aspect-video bg-gradient-to-br from-fuchsia-500/20 via-violet-500/10 to-transparent">
        {event.imageUrl ? (
          <img src={event.imageUrl} alt={`Portada de ${event.title}`} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-white/30">
            <ImageIcon className="size-10" />
          </div>
        )}
        <span className={`absolute top-3 left-3 rounded-full px-2 py-1 text-xs font-semibold ${status.className}`}>
          {status.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-semibold">{event.title}</h3>
        <p className="mt-1 text-xs text-white/50 first-letter:uppercase">{dateLabel}</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href={`/creadores/transmision/${event.id}`}
            className="flex h-9 items-center justify-center gap-2 rounded-md bg-white text-sm font-medium text-black transition hover:bg-white/90"
          >
            <Radio className="size-4" />
            Transmitir
          </Link>
          <Link
            href={`/events/${event.id}`}
            className="flex h-9 items-center justify-center gap-2 rounded-md border border-white/20 text-sm text-white transition hover:bg-white/10"
          >
            <Eye className="size-4" />
            Ver sala
          </Link>

          {/* esperan a que existan PUT y DELETE en el backend */}
          <button type="button" disabled title="Disponible pronto" className={disabledButton}>
            <Pencil className="size-4" />
            Editar
          </button>
          <button type="button" disabled title="Disponible pronto" className={disabledButton}>
            <Trash2 className="size-4" />
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}