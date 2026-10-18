import { DeleteEventDialog } from "@/components/creators/DeleteEventDialog";
import { FinishEventDialog } from "@/components/creators/FinishEventDialog";
import type { EventSummary } from "@/src/schemas/events";
import { Eye, ImageIcon, Info, Pencil, Radio } from "lucide-react";
import Link from "next/link";

const STATUS = {
  Scheduled: { label: "PRÓXIMO", className: "bg-black/70 text-white" },
  Live: { label: "EN VIVO", className: "bg-red-600 text-white" },
  Finished: { label: "FINALIZADO", className: "bg-black/70 text-white/70" },
} as const;

//por qué un evento ya no se puede editar ni eliminar
const LOCKED_NOTE = {
  Live: "En vivo: no se puede editar ni eliminar mientras transmite",
  Finished: "Finalizado: ya no se puede editar ni eliminar",
} as const;

const primaryButton =
  "flex h-9 items-center justify-center gap-2 rounded-md bg-white text-sm font-medium text-black transition hover:bg-white/90";
const outlineButton =
  "flex h-9 items-center justify-center gap-2 rounded-md border border-white/20 text-sm text-white transition hover:bg-white/10";

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
        <span
          className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-white/20 backdrop-blur-sm ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-semibold">{event.title}</h3>
        <p className="mt-1 text-xs text-white/50 first-letter:uppercase">{dateLabel}</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {/* un evento finalizado no vuelve a transmitir, así que no tiene pantalla de transmisión */}
          {event.status !== "Finished" && (
            <Link href={`/creadores/transmision/${event.id}`} className={primaryButton}>
              <Radio className="size-4" />
              Transmitir
            </Link>
          )}

          <Link
            href={`/events/${event.id}`}
            className={event.status === "Finished" ? `${primaryButton} col-span-2` : outlineButton}
          >
            <Eye className="size-4" />
            Ver sala
          </Link>

          {event.status === "Scheduled" ? (
            <>
              <Link href={`/creadores/${event.id}/editar`} className={outlineButton}>
                <Pencil className="size-4" />
                Editar
              </Link>
              <DeleteEventDialog eventId={event.id} eventTitle={event.title} />
            </>
          ) : (
            <>
              {/* solo un evento en vivo se puede finalizar */}
              {event.status === "Live" && <FinishEventDialog eventId={event.id} eventTitle={event.title} />}

              <p className="col-span-2 flex items-start gap-2 rounded-md bg-white/5 px-3 py-2 text-xs text-white/50">
                <Info className="mt-0.5 size-3.5 shrink-0 text-fuchsia-300" />
                {LOCKED_NOTE[event.status]}
              </p>
            </>
          )}
        </div>
      </div>
    </article>
  );
}