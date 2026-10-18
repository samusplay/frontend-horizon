"use client";

import { StreamAvatar } from "@/components/streams/stream-avatar";
import { cn } from "@/lib/utils";
import type { Stream } from "@/src/streams/types";
import { Calendar, ChevronDown, ChevronLeft, ChevronUp, Compass, Radio, Users, Video } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ComponentType } from "react";

type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  soon?: boolean; //función que aún no existe: se ve apagada
};

const NAV_ITEMS: NavItem[] = [
  { label: "En vivo", href: "/events", icon: Radio },
  { label: "Programados", href: "/programados", icon: Calendar },
  { label: "Explorar", href: "/explorar", icon: Compass, soon: true },
  { label: "Creador", href: "/creadores", icon: Video },
];

const PREVIEW_COUNT = 5;

function Soon() {
  return (
    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/50">
      Pronto
    </span>
  );
}

export function StreamsSidebar({ liveStreams }: { liveStreams: Stream[] }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [showAllLive, setShowAllLive] = useState(false);

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
          const Icon = item.icon;

          if (item.soon) {
            return (
              <div
                key={item.href}
                aria-disabled="true"
                title="Disponible pronto"
                className="flex cursor-not-allowed items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-white/30"
              >
                <Icon className="size-5 shrink-0" />
                {!collapsed && (
                  <>
                    <span>{item.label}</span>
                    <Soon />
                  </>
                )}
              </div>
            );
          }

          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
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
            <header className="px-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Canales que sigo</p>
            </header>

            {/* los canales serán otro servicio: por ahora solo se anuncia */}
            <div className="mt-2 flex flex-col items-center gap-2 rounded-lg border border-dashed border-white/10 px-3 py-4 text-center">
              <Users className="size-5 text-white/30" />
              <p className="text-xs text-white/50">Aquí verás los canales que sigues</p>
              <Soon />
            </div>
          </section>

          <section>
            <header className="px-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40">En directo ahora</p>
            </header>

            {liveStreams.length === 0 ? (
              <p className="mt-2 px-2 text-xs text-white/40">Nadie está transmitiendo en este momento</p>
            ) : (
              <div className="mt-2 flex flex-col gap-0.5">
                {live.map((stream) => (
                  <LiveRow key={stream.id} stream={stream} />
                ))}
              </div>
            )}

            {liveStreams.length > PREVIEW_COUNT && (
              <ShowMore expanded={showAllLive} onClick={() => setShowAllLive((value) => !value)} />
            )}
          </section>
        </div>
      )}
    </aside>
  );
}

function LiveRow({ stream }: { stream: Stream }) {
  return (
    <Link
      href={`/events/${stream.id}`}
      className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition hover:bg-white/5"
    >
      <StreamAvatar name={stream.title} accent={stream.streamer.accent} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-white/85">{stream.title}</p>
        <p className="truncate text-xs text-white/40">{stream.streamer.name}</p>
      </div>
      <span title="En directo" className="size-2 shrink-0 rounded-full bg-red-500" />
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