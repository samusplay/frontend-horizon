import type { EventSummary } from "@/src/schemas/events";
import { Clock, ImageIcon } from "lucide-react";
import Link from "next/link";

export function ScheduledEventCard({ event }: { event: EventSummary }) {
  const time = new Date(event.startsAt).toLocaleTimeString("es-CO", {
    timeZone: "America/Bogota",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Link
      href={`/events/${event.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 outline-none transition duration-300 hover:-translate-y-1 hover:border-fuchsia-400/40 hover:shadow-[0_8px_32px_rgba(217,70,239,0.15)] focus-visible:ring-[3px] focus-visible:ring-fuchsia-400/50"
    >
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-fuchsia-500/20 via-violet-500/10 to-transparent">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={`Portada de ${event.title}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/30">
            <ImageIcon className="size-10" />
          </div>
        )}

        <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold backdrop-blur">
          <Clock className="size-3.5 text-fuchsia-300" />
          {time}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="line-clamp-2 font-semibold">{event.title}</h3>
        {event.description && <p className="line-clamp-2 text-sm text-white/50">{event.description}</p>}
      </div>
    </Link>
  );
}