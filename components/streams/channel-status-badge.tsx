import { cn } from "@/lib/utils";
import type { StreamStatus } from "@/src/streams/types";

const STYLES = {
  live: {
    dot: "bg-red-500",
    text: "text-red-100",
    surface: "bg-red-500/10 ring-red-500/25",
    label: "En directo",
  },
  scheduled: {
    dot: "bg-fuchsia-400",
    text: "text-fuchsia-100",
    surface: "bg-fuchsia-500/10 ring-fuchsia-400/25",
    label: "Programado",
  },
  offline: {
    dot: "bg-white/40",
    text: "text-white/60",
    surface: "bg-white/5 ring-white/10",
    label: "Sin conexión",
  },
} as const;

export function ChannelStatusBadge({
  status,
  label,
  className,
}: {
  status: StreamStatus;
  label?: string;
  className?: string;
}) {
  const style = STYLES[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ring-1",
        style.surface,
        style.text,
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", style.dot, status === "live" && "animate-pulse")} />
      {label ?? style.label}
    </span>
  );
}
