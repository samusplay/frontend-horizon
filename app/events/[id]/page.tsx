import { AutoRefresh } from "@/components/events/AutoRefresh";
import { ChatPanel } from "@/components/stream/ChatPanel";
import { EventCountdown } from "@/components/stream/EventCountdown";
import { StreamPlayer } from "@/components/stream/StreamPlayer";
import { getSession } from "@/src/auth/session";
import { getEvent } from "@/src/events/get-event";
import { ArrowLeft, VideoOff } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const STATUS = {
  Scheduled: { label: "PRÓXIMO", className: "bg-white/10 text-white/80" },
  Live: { label: "EN VIVO", className: "bg-red-600 text-white" },
  Finished: { label: "FINALIZADO", className: "bg-white/10 text-white/50" },
} as const;

//sala pública: el video lo ve cualquiera, el chat pide iniciar sesión
export default async function EventRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [event, session] = await Promise.all([getEvent(id), getSession()]);

  if (!event) notFound();

  const poster = event.imageUrl ?? undefined;
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
    <main className="min-h-screen pt-28 pb-16 px-6 bg-gradient-to-b from-[#0d0221] via-[#0a0118] to-black text-white">
      {/* mientras el evento no termine, la sala se actualiza sola cuando cambia su estado */}
      {event.status !== "Finished" && <AutoRefresh seconds={10} />}

      <div className="mx-auto max-w-6xl space-y-6">
        <Link href="/events" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white">
          <ArrowLeft className="size-4" />
          Volver a eventos
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {event.status === "Live" && <StreamPlayer eventId={event.id} poster={poster} />}

            {event.status === "Scheduled" && (
              <EventCountdown startsAt={event.startsAt} dateLabel={dateLabel} poster={poster} />
            )}

            {event.status === "Finished" && (
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
            )}

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold">{event.title}</h1>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>
                  {status.label}
                </span>
              </div>
              {event.description && <p className="mt-1 text-white/60">{event.description}</p>}
              <p className="mt-2 text-sm text-white/40 first-letter:uppercase">{dateLabel}</p>
            </div>
          </div>

          <ChatPanel loggedIn={session !== null} closed={event.status === "Finished"} />
        </div>
      </div>
    </main>
  );
}