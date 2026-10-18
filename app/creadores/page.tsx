import { MyEventCard } from "@/components/creators/MyEventCard";
import { requireCreator } from "@/src/auth/session";

import type { EventSummary } from "@/src/schemas/events";
import { getMyEvents } from "@/src/schemas/get-my-events";
import { CalendarPlus, PlusCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const FILTERS: { key: string; label: string; status?: EventSummary["status"] }[] = [
  { key: "todos", label: "Todos" },
  { key: "proximos", label: "Próximos", status: "Scheduled" },
  { key: "en-vivo", label: "En vivo", status: "Live" },
  { key: "finalizados", label: "Finalizados", status: "Finished" },
];

export default async function CreadoresPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  await requireCreator();
  const { estado } = await searchParams;

  const data = await getMyEvents();
  //el token venció: volvemos a login
  if (!data) redirect("/login");

  const active = FILTERS.find((f) => f.key === estado) ?? FILTERS[0];

  //el backend los entrega del más antiguo al más reciente; aquí mostramos primero los últimos
  const all = [...data.items].sort((a, b) => Date.parse(b.startsAt) - Date.parse(a.startsAt));
  const events = active.status ? all.filter((e) => e.status === active.status) : all;
  const countOf = (status?: EventSummary["status"]) =>
    status ? all.filter((e) => e.status === status).length : all.length;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            Mis eventos
          </h1>
          <p className="mt-2 text-white/50">
            {data.totalCount === 0
              ? "Aquí aparecerán los eventos que crees"
              : `${data.totalCount} ${data.totalCount === 1 ? "evento" : "eventos"}`}
          </p>
        </div>

        {data.totalCount > 0 && (
          <Link
            href="/creadores/nuevo"
            className="flex h-10 items-center gap-2 rounded-md bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90"
          >
            <PlusCircle className="size-4" />
            Crear evento
          </Link>
        )}
      </div>

      {data.totalCount > 0 && (
        <nav aria-label="Filtrar eventos" className="flex flex-wrap gap-2">
          {FILTERS.map((filter) => {
            const isActive = filter.key === active.key;

            return (
              <Link
                key={filter.key}
                href={filter.key === "todos" ? "/creadores" : `/creadores?estado=${filter.key}`}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition ${
                  isActive
                    ? "border-fuchsia-400/40 bg-fuchsia-500/15 text-white"
                    : "border-white/10 text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                {filter.label}
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">{countOf(filter.status)}</span>
              </Link>
            );
          })}
        </nav>
      )}

      {data.totalCount === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center">
          <CalendarPlus className="size-12 text-fuchsia-300" />
          <div>
            <h2 className="text-lg font-semibold">Aún no tienes eventos</h2>
            <p className="mt-1 text-sm text-white/50">Crea el primero y transmítelo desde OBS</p>
          </div>
          <Link
            href="/creadores/nuevo"
            className="flex h-10 items-center gap-2 rounded-md bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90"
          >
            <PlusCircle className="size-4" />
            Crear mi primer evento
          </Link>
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-12 text-center">
          <p className="text-white/60">No tienes eventos {active.label.toLowerCase()}</p>
          <Link href="/creadores" className="text-sm text-fuchsia-300 hover:text-fuchsia-200">
            Ver todos
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
            {events.map((event) => (
              <MyEventCard key={event.id} event={event} />
            ))}
          </div>

          {data.totalCount > all.length && (
            <p className="text-center text-sm text-white/40">
              Mostrando {all.length} de {data.totalCount} eventos
            </p>
          )}
        </>
      )}
    </div>
  );
}