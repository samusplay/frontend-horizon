import { MyEventCard } from "@/components/creators/MyEventCard";
import { requireCreator } from "@/src/auth/session";
import { getMyEvents } from "@/src/schemas/get-my-events";

import { CalendarPlus, PlusCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CreadoresPage() {
  await requireCreator();

  const data = await getMyEvents();
  //el token venció: volvemos a login
  if (!data) redirect("/login");

  //el backend los entrega del más antiguo al más reciente; aquí mostramos primero los últimos
  const events = [...data.items].sort((a, b) => Date.parse(b.startsAt) - Date.parse(a.startsAt));

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

      {events.length === 0 ? (
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
      ) : (
        <>
          <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
            {events.map((event) => (
              <MyEventCard key={event.id} event={event} />
            ))}
          </div>

          {data.totalCount > events.length && (
            <p className="text-center text-sm text-white/40">
              Mostrando {events.length} de {data.totalCount} eventos
            </p>
          )}
        </>
      )}
    </div>
  );
}