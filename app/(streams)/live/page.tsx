import { getStreams } from "@/actions/get-streams-action";
import { CategoryRow } from "@/components/streams/category-row";
import { LiveCarousel } from "@/components/streams/live-carousel";
import { StreamsGrid } from "@/components/streams/streams-grid";
import { CATEGORIES } from "@/src/streams/data";

export const metadata = {
  title: "En vivo · Horizon",
  description: "Canales y torneos en directo, con chat sincronizado.",
};

export default async function LivePage() {
  const streams = await getStreams();
  const liveStreams = streams.filter((stream) => stream.status === "live");

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold text-white">En vivo</h1>
        <p className="mt-2 text-white/60">
          Los mejores torneos y creadores transmitiendo ahora mismo.
        </p>
      </header>

      <LiveCarousel streams={liveStreams} title="Destacados en vivo" />
      <StreamsGrid streams={liveStreams} title="Para ti" />
      <CategoryRow categories={CATEGORIES} streams={streams} />
    </div>
  );
}
