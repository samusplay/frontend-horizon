import type { Vod } from "@/src/streams/types";
import { formatDuration, formatNumber, formatRelativeTime } from "@/src/streams/utils";
import Link from "next/link";

export function VodCard({ vod }: { vod: Vod }) {
  return (
    <Link href={vod.url} className="group block">
      <div className="relative aspect-video overflow-hidden rounded-xl ring-1 ring-white/10">
        <img
          src={vod.thumbnail}
          alt={vod.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-white">
          {formatDuration(vod.durationSeconds)}
        </span>
      </div>
      <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-white group-hover:text-fuchsia-300">
        {vod.title}
      </h3>
      <p className="mt-0.5 text-xs text-white/50">
        {formatNumber(vod.views)} visualizaciones · {formatRelativeTime(vod.publishedAt)}
      </p>
    </Link>
  );
}
