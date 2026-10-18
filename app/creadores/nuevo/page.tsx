import CreateEventForm from "@/components/creators/CreateEventForm";
import { requireCreator } from "@/src/auth/session";

export default async function NuevoEventoPage() {
  await requireCreator();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
          Crear evento
        </h1>
        <p className="mt-2 text-white/50">Programa tu transmisión y mira cómo se verá en el catálogo</p>
      </div>

      <CreateEventForm />
    </div>
  );
}