import { categoryName, formatUptime, formatViewers } from "@/src/streams/utils";
import type { Stream } from "@/src/streams/types";
import { Clock, Eye, Tv } from "lucide-react";

export function StreamInfoPanel({ stream }: { stream: Stream }) {
  const stats = [
    { icon: Eye, label: "Espectadores", value: formatViewers(stream.viewers) },
    { icon: Clock, label: "En directo", value: formatUptime(stream.startedAt) },
    { icon: Tv, label: "Categoría", value: categoryName(stream.categorySlug) },
  ];

  return (
    <div className="space-y-5 rounded-xl bg-[#120a24] p-5 ring-1 ring-white/10">
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg bg-white/5 p-3">
            <stat.icon className="size-4 text-fuchsia-300" />
            <p className="mt-2 text-lg font-bold text-white">{stat.value}</p>
            <p className="text-xs text-white/50">{stat.label}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-semibold text-white">Acerca de esta transmisión</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-white/70">{stream.description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {stream.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/70"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
