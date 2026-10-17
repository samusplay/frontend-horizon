"use client";

import { EmptyState } from "@/components/streams/empty-state";
import { RecommendationRail } from "@/components/streams/recommendation-rail";
import { StreamInfoPanel } from "@/components/streams/stream-info-panel";
import { VodCard } from "@/components/streams/vod-card";
import { VodRow } from "@/components/streams/vod-row";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Stream, Vod } from "@/src/streams/types";
import { categoryName, formatRelativeTime, formatViewers } from "@/src/streams/utils";
import { Calendar, Film, Scissors } from "lucide-react";
import type { ReactNode } from "react";

export function ChannelTabs({
  stream,
  vods,
  recommendations,
  upcoming,
  trailing,
}: {
  stream: Stream;
  vods: Vod[];
  recommendations: Stream[];
  upcoming: Stream[];
  trailing?: ReactNode;
}) {
  return (
    <Tabs defaultValue="home">
      <div className="flex items-center justify-between gap-2 border-b border-white/10">
        <TabsList className="flex-1">
          <TabsTrigger value="home">Inicio</TabsTrigger>
          <TabsTrigger value="about">Acerca de</TabsTrigger>
          <TabsTrigger value="clips">Clips</TabsTrigger>
          <TabsTrigger value="videos">Vídeos</TabsTrigger>
          <TabsTrigger value="schedule">Calendario</TabsTrigger>
        </TabsList>
        {trailing}
      </div>

      <TabsContent value="home" className="space-y-8">
        <StreamInfoPanel stream={stream} />

        <VodRow vods={vods.slice(0, 6)} title="Emisiones recientes" />

        <RecommendationRail
          streams={recommendations}
          title={`Los espectadores de ${stream.streamer.name} también ven`}
        />
      </TabsContent>

      <TabsContent value="about" className="space-y-6">
        <div className="rounded-xl bg-[#120a24] p-5 ring-1 ring-white/10">
          <h2 className="text-sm font-semibold text-white">Sobre {stream.streamer.name}</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/70">{stream.description}</p>

          <dl className="mt-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            <div className="rounded-lg bg-white/5 p-3">
              <dt className="text-xs text-white/50">Categoría</dt>
              <dd className="mt-1 font-semibold text-white">{categoryName(stream.categorySlug)}</dd>
            </div>
            <div className="rounded-lg bg-white/5 p-3">
              <dt className="text-xs text-white/50">Idioma</dt>
              <dd className="mt-1 font-semibold text-white">{stream.language}</dd>
            </div>
            <div className="rounded-lg bg-white/5 p-3">
              <dt className="text-xs text-white/50">Espectadores</dt>
              <dd className="mt-1 font-semibold text-white">{formatViewers(stream.viewers)}</dd>
            </div>
          </dl>
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
      </TabsContent>

      <TabsContent value="clips">
        <EmptyState
          icon={Scissors}
          title="Aún no hay clips"
          description="Cuando los espectadores creen clips de las mejores jugadas aparecerán aquí."
        />
      </TabsContent>

      <TabsContent value="videos">
        {vods.length === 0 ? (
          <EmptyState
            icon={Film}
            title="Sin vídeos disponibles"
            description="Las emisiones pasadas de este canal aparecerán en cuanto se publiquen."
          />
        ) : (
          <div className="grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {vods.map((vod) => (
              <VodCard key={vod.id} vod={vod} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="schedule">
        {upcoming.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No hay emisiones programadas"
            description="Este canal no tiene transmisiones previstas por ahora."
          />
        ) : (
          <ul className="divide-y divide-white/10 overflow-hidden rounded-xl bg-[#120a24] ring-1 ring-white/10">
            {upcoming.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4 px-4 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-white/50">
                    {categoryName(item.categorySlug)} · {item.language}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-white/50">
                  {formatRelativeTime(item.startedAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </TabsContent>
    </Tabs>
  );
}
