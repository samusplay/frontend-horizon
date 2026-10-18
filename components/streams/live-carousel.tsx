import { LiveChannelCard } from "@/components/streams/live-channel-card";
import type { Stream } from "@/src/streams/types";

export function LiveCarousel({ streams, title = "En vivo ahora" }: { streams: Stream[]; title?: string }) {
  if (streams.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <div className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-3">
        {streams.map((stream) => (
          <div key={stream.id} className="w-[260px] shrink-0 snap-start sm:w-[300px]">
            <LiveChannelCard stream={stream} />
          </div>
        ))}
      </div>
    </section>
  );
}
