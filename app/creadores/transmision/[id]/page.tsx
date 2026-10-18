import { CopyField } from "@/components/creators/CopyField";
import { FinishEventDialog } from "@/components/creators/FinishEventDialog";
import { AutoRefresh } from "@/components/events/AutoRefresh";
import { StreamPlayer } from "@/components/stream/StreamPlayer";
import { requireCreator } from "@/src/auth/session";
import { getEvent } from "@/src/events/get-event";
import { CheckCircle2, Radio, VideoOff } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

//servidor RTMP al que apunta OBS, es público (no es secreto)
const RTMP_URL = process.env.NEXT_PUBLIC_RTMP_URL ?? "rtmp://localhost:1935/live";

const STATUS = {
  Scheduled: { label: "PRÓXIMO", className: "bg-white/10 text-white/80" },
  Live: { label: "EN VIVO", className: "bg-red-600 text-white" },
  Finished: { label: "FINALIZADO", className: "bg-white/10 text-white/50" },
} as const;

export default async function TransmisionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ creado?: string }>;
}) {
  const session = await requireCreator();

  //en Next 15+ params y searchParams son promesas
  const { id } = await params;
  const { creado } = await searchParams;

  const event = await getEvent(id);

  //si no existe, o no es suyo, no se muestra
  if (!event || event.creatorId.toLowerCase() !== session.id.toLowerCase()) notFound();

  const status = STATUS[event.status];
  const finished = event.status === "Finished";

  const dateLabel = new Date(event.startsAt).toLocaleString("es-CO", {
    timeZone: "America/Bogota",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="space-y-8">
      {/* el estado cambia solo cuando OBS empieza o se corta, así que la pantalla se vuelve a pedir cada tanto */}
      {!finished && <AutoRefresh seconds={10} />}

      <div>
        {creado && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-fuchsia-400/30 bg-fuchsia-500/10 px-4 py-3 text-fuchsia-100">
            <CheckCircle2 className="size-5" />
            Evento creado correctamente
          </div>
        )}
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
          Tu transmisión
        </h1>
        <p className="mt-2 text-white/50">
          {finished ? "Esta transmisión ya terminó" : "Copia estos datos en OBS y mira cómo se verá tu stream"}
        </p>
      </div>

      {finished ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-black/50 px-6 py-16 text-center backdrop-blur-xl">
          <VideoOff className="size-12 text-fuchsia-300" />
          <div>
            <h2 className="text-2xl font-bold">Esta transmisión terminó</h2>
            <p className="mt-2 max-w-md text-sm text-white/60">
              Si OBS sigue encendido, deténlo desde ahí. Este evento ya no puede volver a iniciarse
            </p>
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/creadores"
              className="rounded-md bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
            >
              Volver a mis eventos
            </Link>
            <Link
              href={`/events/${event.id}`}
              className="rounded-md border border-white/20 px-5 py-2.5 text-sm text-white transition hover:bg-white/10"
            >
              Ver sala
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="space-y-4">
            <StreamPlayer eventId={event.id} poster={event.imageUrl ?? undefined} soundPrompt={false} />
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-semibold">{event.title}</h2>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>
                  {status.label}
                </span>
              </div>
              {event.description && <p className="mt-1 text-white/50">{event.description}</p>}
              <p className="mt-2 text-sm text-white/40 first-letter:uppercase">{dateLabel}</p>
            </div>
          </div>

          <div className="space-y-5 rounded-2xl border border-white/10 bg-black/50 p-6 backdrop-blur-xl shadow-2xl shadow-fuchsia-500/10 lg:self-start">
            <div className="flex items-center gap-2">
              <Radio className="size-5 text-fuchsia-300" />
              <h2 className="text-lg font-semibold">Conecta OBS</h2>
            </div>

            <p className="text-sm text-white/50">
              En OBS ve a Configuración → Emisión, elige el servicio Personalizado y pega estos dos valores.
            </p>

            <CopyField label="Servidor" value={RTMP_URL} />
            <CopyField big label="Clave de retransmisión" value={event.id} />

            <p className="text-xs text-white/40">
              Después de iniciar la transmisión, el video tarda unos 10 a 15 segundos en aparecer.
            </p>

            <div className="space-y-3 border-t border-white/10 pt-5">
              {event.status === "Live" ? (
                <>
                  <p className="text-sm text-white/60">¿Terminaste de transmitir?</p>
                  <FinishEventDialog eventId={event.id} eventTitle={event.title} variant="page" />
                </>
              ) : (
                <p className="text-xs text-white/40">
                  Cuando empieces a transmitir, aquí aparecerá el botón para finalizar la transmisión.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}