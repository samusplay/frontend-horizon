import { getStreams } from "@/actions/get-streams-action";
import { BrowseExplorer } from "@/components/streams/browse-explorer";
import { CATEGORIES } from "@/src/streams/data";

export const metadata = {
  title: "Explorar · Horizon",
  description: "Explora categorías, canales y etiquetas en directo.",
};

export default async function BrowsePage() {
  const streams = await getStreams();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white">Explorar</h1>
        <p className="mt-2 text-white/60">Descubre nuevas categorías y canales en directo.</p>
      </header>

      <BrowseExplorer categories={CATEGORIES} streams={streams} />
    </div>
  );
}
