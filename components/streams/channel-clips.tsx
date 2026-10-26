import { EmptyState } from "@/components/streams/empty-state";
import type { Channel, Clip } from "@/src/streams/types";
import { formatDuration, formatNumber, formatRelativeTime } from "@/src/streams/utils";
import { Scissors } from "lucide-react";
import Link from "next/link";

export function ChannelClips({ channel, clips }: { channel: Channel; clips: Clip[] }) {
  if (clips.length === 0) {
    return (
      <EmptyState
        icon={Scissors}
        title="Aún no hay clips"
        description={`Cuando la comunidad cree clips de las mejores jugadas de ${channel.name}, aparecerán aquí.`}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-white">Clips de la comunidad</h2>
        <span className="text-xs text-white/45">
          {clips.length} {clips.length === 1 ? "clip" : "clips"}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clips.map((clip) => (
          <Link key={clip.id} href={clip.url} className="group block">
            <div className="relative aspect-video overflow-hidden rounded-xl ring-1 ring-white/10">
              <img
                src={clip.thumbnail}
                alt={clip.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                {formatDuration(clip.durationSeconds)}
              </span>
              <span className="absolute left-2 top-2 rounded-md bg-black/65 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Clip
              </span>
            </div>
            <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-white group-hover:text-fuchsia-300">
              {clip.title}
            </h3>
            <p className="mt-0.5 text-xs text-white/50">
              {formatNumber(clip.views)} visualizaciones · {formatRelativeTime(clip.createdAt)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
