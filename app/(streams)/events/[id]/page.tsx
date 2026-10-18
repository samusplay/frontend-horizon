import { AutoRefresh } from "@/components/events/AutoRefresh";
import { EventCountdown } from "@/components/stream/EventCountdown";
import { StreamPlayer } from "@/components/stream/StreamPlayer";
import { ChannelView } from "@/components/streams/channel-view";
import { getEvent } from "@/src/events/get-event";
import { getScheduledEvents } from "@/src/events/get-scheduled-events";
import { eventToStream } from "@/src/streams/from-event";
import { VideoOff } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

//sala pública: el video lo ve cualquiera, el chat pedirá iniciar sesión (paso 4e)
export default async function EventRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [event, scheduled] = await Promise.all([
    getEvent(id),
    getScheduledEvents().catch(() => []), //si falla, solo se queda vacío el calendario
  ]);

  if (!event) notFound();

  const poster = event.imageUrl ?? undefined;

  const dateLabel = new Date(event.startsAt).toLocaleString("es-CO", {
    timeZone: "America/Bogota",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
  });

  const player =
    event.status === "Live" ? (
      <StreamPlayer eventId={event.id} poster={poster} />
    ) : event.status === "Scheduled" ? (
      <EventCountdown startsAt={event.startsAt} dateLabel={dateLabel} poster={poster} />
    ) : (
      <div className="relative flex aspect-video flex-col items-center justify-center gap-4 overflow-hidden rounded-xl border border-white/10 bg-black px-6 text-center">
        {poster && (
          <img
            src={poster}
            alt=""
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-md"
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative flex flex-col items-center gap-3">
          <VideoOff className="size-10 text-fuchsia-300" />
          <h2 className="text-2xl font-bold">Esta transmisión terminó</h2>
          <p className="max-w-sm text-sm text-white/60">Gracias por acompañarnos. Hay más eventos esperándote</p>
          <Link
            href="/events"
            className="mt-1 rounded-md bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
          >
            Ver transmisiones en vivo
          </Link>
        </div>
      </div>
    );

    return (
    <>
      {/* mientras el evento no termine, la sala se actualiza sola cuando cambia su estado */}
      {event.status !== "Finished" && <AutoRefresh seconds={10} />}

      <ChannelView
        stream={eventToStream(event)}
        player={player}
        upcoming={scheduled.filter((item) => item.id !== event.id).map(eventToStream)}
        dateLabel={dateLabel}
      />
    </>
  );
}