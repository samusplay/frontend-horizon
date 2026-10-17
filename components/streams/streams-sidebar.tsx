"use client";

import { StreamAvatar } from "@/components/streams/stream-avatar";
import { cn } from "@/lib/utils";
import type { FollowedChannel, Stream } from "@/src/streams/types";
import { categoryName, formatViewers } from "@/src/streams/utils";
import { ArrowUpDown, ChevronDown, ChevronLeft, ChevronUp, Compass, Radio, Video } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Para ti", href: "/live", icon: Radio },
  { label: "Explorar", href: "/browse", icon: Compass },
  { label: "Creador", href: "/dashboard", icon: Video },
] as const;

const PREVIEW_COUNT = 5;

export function StreamsSidebar({
  followedChannels,
  liveStreams,
}: {
  followedChannels: FollowedChannel[];
  liveStreams: Stream[];
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [showAllFollowed, setShowAllFollowed] = useState(false);
  const [showAllLive, setShowAllLive] = useState(false);

  const followed = showAllFollowed ? followedChannels : followedChannels.slice(0, PREVIEW_COUNT);
  const live = showAllLive ? liveStreams : liveStreams.slice(0, PREVIEW_COUNT);

  return (
    <aside
      className={cn(
        "sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 flex-col border-r border-white/10 bg-[#120a24]/60 backdrop-blur transition-[width] duration-200 md:flex",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex items-center justify-between px-3 py-3">
        {!collapsed && (
          <span className="px-2 text-xs font-semibold uppercase tracking-widest text-white/40">
            Navegación
          </span>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
          className="ml-auto rounded-md p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          <ChevronLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      <nav className="flex flex-col gap-1 px-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition",
                active ? "bg-fuchsia-500/15 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-fuchsia-400"
                />
              )}
              <Icon className="size-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="mt-3 flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto border-t border-white/10 px-2 pb-4 pt-3">
          <section>
            <header className="flex items-center justify-between px-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
                Canales que sigo
              </p>
              <button
                type="button"
                aria-label="Ordenar canales"
                className="rounded-md p-1 text-white/40 transition hover:bg-white/10 hover:text-white"
              >
                <ArrowUpDown className="size-3.5" />
              </button>
            </header>

            <div className="mt-2 flex flex-col gap-0.5">
              {followed.map((channel) => (
                <FollowedRow key={channel.slug} channel={channel} />
              ))}
            </div>

            {followedChannels.length > PREVIEW_COUNT && (
              <ShowMore
                expanded={showAllFollowed}
                onClick={() => setShowAllFollowed((value) => !value)}
              />
            )}
          </section>

          <section>
            <header className="px-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
                Canales en directo
              </p>
            </header>

            <div className="mt-2 flex flex-col gap-0.5">
              {live.map((stream) => (
                <LiveRow key={stream.id} stream={stream} />
              ))}
            </div>

            {liveStreams.length > PREVIEW_COUNT && (
              <ShowMore expanded={showAllLive} onClick={() => setShowAllLive((value) => !value)} />
            )}
          </section>
        </div>
      )}
    </aside>
  );
}

function FollowedRow({ channel }: { channel: FollowedChannel }) {
  const isLive = channel.status === "live";

  return (
    <Link
      href={`/channel/${channel.slug}`}
      className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition hover:bg-white/5"
    >
      <StreamAvatar
        name={channel.name}
        accent={channel.accent}
        size="sm"
        className={cn(!isLive && "opacity-50")}
      />
      <div className="min-w-0 flex-1">
        <p className={cn("truncate text-sm", isLive ? "text-white/85" : "text-white/45")}>
          {channel.name}
        </p>
        <p className="truncate text-xs text-white/40">{categoryName(channel.categorySlug)}</p>
      </div>
      {isLive ? (
        <span className="flex shrink-0 items-center gap-1 text-xs text-white/60">
          <span className="size-2 rounded-full bg-red-500" />
          {formatViewers(channel.viewers)}
        </span>
      ) : (
        <span className="shrink-0 text-[10px] text-white/30">Desconectado</span>
      )}
    </Link>
  );
}

function LiveRow({ stream }: { stream: Stream }) {
  return (
    <Link
      href={`/channel/${stream.slug}`}
      className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition hover:bg-white/5"
    >
      <StreamAvatar name={stream.streamer.name} accent={stream.streamer.accent} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-white/85">{stream.streamer.name}</p>
        <p className="truncate text-xs text-white/40">{categoryName(stream.categorySlug)}</p>
      </div>
      <span className="flex shrink-0 items-center gap-1 text-xs text-white/60">
        <span className="size-2 rounded-full bg-red-500" />
        {formatViewers(stream.viewers)}
      </span>
    </Link>
  );
}

function ShowMore({ expanded, onClick }: { expanded: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-1 flex w-full items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-fuchsia-300 transition hover:bg-white/5"
    >
      {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
      {expanded ? "Mostrar menos" : "Mostrar más"}
    </button>
  );
}
