import { AutoRefresh } from "@/components/events/AutoRefresh";
import { LiveEventCard } from "@/components/events/LiveEventCard";
import { getLiveEvents } from "@/src/events/get-live-events";
import type { EventSummary } from "@/src/schemas/events";
import { CloudOff, Radio } from "lucide-react";

export default async function EventsPage() {
  let events: EventSummary[] = [];
  let failed = false;

  try {
    events = await getLiveEvents();
  } catch {
    failed = true;
  }

  return (
    <main className="min-h-screen pt-28 pb-16 px-6 bg-gradient-to-b from-[#0d0221] via-[#0a0118] to-black text-white">
      <AutoRefresh seconds={15} />

      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h1 className="flex items-center gap-3 text-4xl font-bold md:text-5xl">
            <span className="relative flex size-3">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex size-3 rounded-full bg-red-500" />
            </span>
            En vivo ahora
          </h1>
          <p className="mt-3 text-white/60">
            {events.length > 0
              ? `${events.length} ${events.length === 1 ? "transmisión" : "transmisiones"} en este momento`
              : "Las transmisiones aparecen aquí apenas empiezan"}
          </p>
        </div>

        {failed ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center">
            <CloudOff className="size-12 text-fuchsia-300" />
            <h2 className="text-lg font-semibold">No pudimos cargar las transmisiones</h2>
            <p className="text-sm text-white/50">Lo intentaremos de nuevo en unos segundos</p>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center">
            <Radio className="size-12 text-fuchsia-300" />
            <h2 className="text-lg font-semibold">Nadie está transmitiendo ahora</h2>
            <p className="max-w-sm text-sm text-white/50">
              Cuando un creador salga en vivo, su transmisión aparecerá aquí sin que tengas que recargar
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
            {events.map((event, i) => (
              <LiveEventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}