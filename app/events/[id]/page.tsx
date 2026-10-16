import { ChatPanel } from "@/components/stream/ChatPanel";
import { StreamPlayer } from "@/components/stream/StreamPlayer";
import { getSession } from "@/src/auth/session";
import { getEvent } from "@/src/events/get-event";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

//sala pública: el video lo ve cualquiera, el chat pide iniciar sesión
export default async function EventRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [event, session] = await Promise.all([getEvent(id), getSession()]);

  if (!event) notFound();

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
      <div className="mx-auto max-w-6xl space-y-6">
        <Link href="/events" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white">
          <ArrowLeft className="size-4" />
          Volver a eventos
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <StreamPlayer eventId={event.id} poster={event.imageUrl ?? undefined} />
            <div>
              <h1 className="text-2xl font-bold">{event.title}</h1>
              {event.description && <p className="mt-1 text-white/60">{event.description}</p>}
              <p className="mt-2 text-sm text-white/40 first-letter:uppercase">{dateLabel}</p>
            </div>
          </div>

          <ChatPanel loggedIn={session !== null} />
        </div>
      </div>
    </main>
  );
}