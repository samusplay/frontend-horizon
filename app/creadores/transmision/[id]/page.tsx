import { CopyField } from "@/components/creators/CopyField";
import { StreamPlayer } from "@/components/stream/StreamPlayer";
import { requireCreator } from "@/src/auth/session";
import { getEvent } from "@/src/events/get-event";
import { CheckCircle2, Radio } from "lucide-react";
import { notFound } from "next/navigation";

//servidor RTMP al que apunta OBS, es público (no es secreto)
const RTMP_URL = process.env.NEXT_PUBLIC_RTMP_URL ?? "rtmp://localhost:1935/live";

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
      <div className="mx-auto max-w-6xl space-y-8">
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
          <p className="mt-2 text-white/50">Copia estos datos en OBS y mira cómo se verá tu stream</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="space-y-4">
            <StreamPlayer eventId={event.id} poster={event.imageUrl ?? undefined} />
            <div>
              <h2 className="text-2xl font-semibold">{event.title}</h2>
              {event.description && <p className="mt-1 text-white/50">{event.description}</p>}
              <p className="mt-2 text-sm text-white/40 capitalize">{dateLabel}</p>
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
          </div>
        </div>
      </div>
    </main>
  );
}