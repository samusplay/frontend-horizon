"use client";

import { StreamAvatar } from "@/components/streams/stream-avatar";
import { cn } from "@/lib/utils";
import { categoryName, formatViewers } from "@/src/streams/utils";
import type { Stream } from "@/src/streams/types";
import { BadgeCheck } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export function LiveChannelCard({ stream }: { stream: Stream }) {
  const isLive = stream.status === "live";

  return (
    <motion.article whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="group">
      <Link href={`/channel/${stream.slug}`} className="block">
        <div className="relative aspect-video overflow-hidden rounded-xl ring-1 ring-white/10">
          <img
            src={stream.thumbnail}
            alt={stream.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {isLive && (
            <span className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-red-600 px-1.5 py-0.5 text-[11px] font-bold text-white">
              <motion.span
                className="inline-block size-1.5 rounded-full bg-white"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              EN VIVO
            </span>
          )}

          <span className="absolute bottom-2 left-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-semibold text-white">
            {stream.viewers > 0 ? `${formatViewers(stream.viewers)} espectadores` : "Programado"}
          </span>
        </div>
      </Link>

      <div className="mt-2.5 flex gap-2.5">
        <StreamAvatar name={stream.streamer.name} accent={stream.streamer.accent} size="md" />
        <div className="min-w-0 flex-1">
          <Link href={`/channel/${stream.slug}`}>
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white group-hover:text-fuchsia-300">
              {stream.title}
            </h3>
          </Link>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-white/60">
            <span className="truncate">{stream.streamer.name}</span>
            {stream.streamer.verified && (
              <BadgeCheck className="size-3.5 shrink-0 text-fuchsia-400" />
            )}
          </p>
          <Link
            href={`/category/${stream.categorySlug}`}
            className="mt-0.5 block truncate text-xs text-white/50 hover:text-fuchsia-300"
          >
            {categoryName(stream.categorySlug)}
          </Link>

          <div className="mt-1.5 flex flex-wrap gap-1">
            {stream.tags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  "rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/70"
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
