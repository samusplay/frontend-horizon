import { VodCard } from "@/components/streams/vod-card";
import type { Vod } from "@/src/streams/types";

export function VodRow({ vods, title }: { vods: Vod[]; title?: string }) {
  if (vods.length === 0) return null;

  return (
    <section className="space-y-4">
      {title && <h2 className="text-xl font-bold text-white">{title}</h2>}
      <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-3">
        {vods.map((vod) => (
          <div key={vod.id} className="w-[280px] shrink-0 sm:w-[320px]">
            <VodCard vod={vod} />
          </div>
        ))}
      </div>
    </section>
  );
}
