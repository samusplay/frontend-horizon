
import EditEventForm from "@/components/creators/EditEventForm";
import { requireCreator } from "@/src/auth/session";
import { getEvent } from "@/src/events/get-event";
import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditarEventoPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireCreator();
  const { id } = await params;

  const event = await getEvent(id);

  //si no existe, o no es suyo, no se muestra
  if (!event || event.creatorId.toLowerCase() !== session.id.toLowerCase()) notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link href="/creadores" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white">
          <ArrowLeft className="size-4" />
          Volver a mis eventos
        </Link>
        <h1 className="mt-4 text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
          Editar evento
        </h1>
        <p className="mt-2 text-white/50">Los cambios se ven en el catálogo apenas guardes</p>
      </div>

      {event.status === "Scheduled" ? (
        <EditEventForm event={event} />
      ) : (
        //el backend también lo rechaza con 409, esto evita mostrar un formulario que no va a funcionar
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center">
          <Lock className="size-12 text-fuchsia-300" />
          <h2 className="text-lg font-semibold">
            {event.status === "Live" ? "Este evento está en vivo" : "Este evento ya terminó"}
          </h2>
          <p className="max-w-sm text-sm text-white/50">Solo se pueden editar los eventos que aún no han empezado</p>
          <Link
            href="/creadores"
            className="mt-2 rounded-md bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
          >
            Volver a mis eventos
          </Link>
        </div>
      )}
    </div>
  );
}