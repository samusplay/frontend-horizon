import { LiveChannelCard } from "@/components/streams/live-channel-card";
import type { Stream } from "@/src/streams/types";

export function StreamsGrid({
  streams,
  title,
  emptyLabel = "No hay canales disponibles por ahora.",
}: {
  streams: Stream[];
  title?: string;
  emptyLabel?: string;
}) {
  return (
    <section className="space-y-4">
      {title && <h2 className="text-xl font-bold text-white">{title}</h2>}

      {streams.length === 0 ? (
        <p className="text-sm text-white/50">{emptyLabel}</p>
      ) : (
        <div className="grid gap-x-4 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {streams.map((stream) => (
            <LiveChannelCard key={stream.id} stream={stream} />
          ))}
        </div>
      )}
    </section>
  );
}
