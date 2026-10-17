import { CreatorStatsCards } from "@/components/streams/creator-stats-cards";
import { GoLivePanel } from "@/components/streams/go-live-panel";
import { StreamsGrid } from "@/components/streams/streams-grid";
import { getStreams } from "@/actions/get-streams-action";
import { CATEGORIES } from "@/src/streams/data";
import { Sparkles } from "lucide-react";

export const metadata = {
  title: "Creador · Horizon",
  description: "Panel del creador: métricas y control de transmisión.",
};

const TIPS = [
  "Escribe un título claro: los canales con título descriptivo reciben más visitas.",
  "Elige bien la categoría para aparecer en las recomendaciones.",
  "Mantén el chat activo: responde y modera para crear comunidad.",
];

export default async function DashboardPage() {
  const streams = await getStreams();
  const myLiveStreams = streams.filter((stream) => stream.status === "live").slice(0, 4);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white">Panel del creador</h1>
        <p className="mt-2 text-white/60">Gestiona tu transmisión y revisa tus métricas.</p>
      </header>

      <CreatorStatsCards />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <GoLivePanel categories={CATEGORIES} />

        <section className="space-y-4 rounded-xl bg-[#120a24] p-5 ring-1 ring-white/10">
          <header className="flex items-center gap-2">
            <Sparkles className="size-5 text-fuchsia-300" />
            <h2 className="text-lg font-bold text-white">Consejos para crecer</h2>
          </header>
          <ul className="space-y-3">
            {TIPS.map((tip) => (
              <li key={tip} className="flex gap-2.5 text-sm text-white/70">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-fuchsia-400" />
                {tip}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <StreamsGrid streams={myLiveStreams} title="Transmisiones activas" />
    </div>
  );
}
