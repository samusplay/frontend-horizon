import { CREATOR_STATS } from "@/src/streams/data";
import { formatViewers } from "@/src/streams/utils";
import { TrendingUp } from "lucide-react";

export function CreatorStatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {CREATOR_STATS.map((stat) => (
        <div key={stat.label} className="rounded-xl bg-[#120a24] p-4 ring-1 ring-white/10">
          <p className="text-sm text-white/50">{stat.label}</p>
          <div className="mt-2 flex items-end justify-between">
            <span className="text-2xl font-bold text-white">{formatViewers(stat.value)}</span>
            <span
              className={
                stat.trend === "up"
                  ? "flex items-center gap-1 text-xs font-medium text-emerald-400"
                  : "flex items-center gap-1 text-xs font-medium text-red-400"
              }
            >
              <TrendingUp className={stat.trend === "down" ? "size-3.5 -scale-y-100" : "size-3.5"} />
              {stat.delta}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
