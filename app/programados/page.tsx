import { AutoRefresh } from "@/components/events/AutoRefresh";
import { ScheduledEventCard } from "@/components/events/ScheduledEventCard";
import { getScheduledEvents } from "@/src/events/get-scheduled-events";
import type { EventSummary } from "@/src/schemas/events";
import { CalendarClock, CloudOff } from "lucide-react";

const TZ = "America/Bogota";

//"2026-10-17" según la hora de Colombia, para agrupar por día
const dayKey = (date: Date) => date.toLocaleDateString("en-CA", { timeZone: TZ });

function dayLabel(key: string, firstEvent: EventSummary, now: Date) {
  if (key === dayKey(now)) return "Hoy";
  if (key === dayKey(new Date(now.getTime() + 24 * 3_600_000))) return "Mañana";

  return new Date(firstEvent.startsAt).toLocaleDateString("es-CO", {
    timeZone: TZ,
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default async function ProgramadosPage() {
  let events: EventSummary[] = [];
  let failed = false;

  try {
    events = await getScheduledEvents();
  } catch {
    failed = true;
  }

  //el backend entrega los eventos del más cercano al más lejano, así que los grupos quedan en orden
  const groups = new Map<string, EventSummary[]>();
  for (const event of events) {
    const key = dayKey(new Date(event.startsAt));
    groups.set(key, [...(groups.get(key) ?? []), event]);
  }

  const now = new Date();

  return (
    <main className="min-h-screen pt-28 pb-16 px-6 bg-gradient-to-b from-[#0d0221] via-[#0a0118] to-black text-white">
      <AutoRefresh seconds={15} />

      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h1 className="flex items-center gap-3 text-4xl font-bold md:text-5xl">
            <CalendarClock className="size-9 text-fuchsia-300 md:size-10" />
            Programados
          </h1>
          <p className="mt-3 text-white/60">
            {events.length > 0
              ? `${events.length} ${events.length === 1 ? "evento próximo" : "eventos próximos"}`
              : "Los eventos que se programen aparecerán aquí"}
          </p>
        </div>

        {failed ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center">
            <CloudOff className="size-12 text-fuchsia-300" />
            <h2 className="text-lg font-semibold">No pudimos cargar los eventos</h2>
            <p className="text-sm text-white/50">Lo intentaremos de nuevo en unos segundos</p>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center">
            <CalendarClock className="size-12 text-fuchsia-300" />
            <h2 className="text-lg font-semibold">No hay eventos programados</h2>
            <p className="max-w-sm text-sm text-white/50">
              Cuando un creador programe una transmisión, la verás aquí con su fecha y hora
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {[...groups].map(([key, dayEvents]) => (
              <section key={key}>
                <h2 className="mb-4 text-xl font-semibold first-letter:uppercase">
                  {dayLabel(key, dayEvents[0], now)}
                </h2>
                <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
                  {dayEvents.map((event) => (
                    <ScheduledEventCard key={event.id} event={event} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}