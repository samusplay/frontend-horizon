"use client";

import { ChannelAbout } from "@/components/streams/channel-about";
import { ChannelChatOffline } from "@/components/streams/channel-chat-offline";
import { ChannelClips } from "@/components/streams/channel-clips";
import { ChannelOfflineStage } from "@/components/streams/channel-offline-stage";
import { ChannelSchedule } from "@/components/streams/channel-schedule";
import { EmptyState } from "@/components/streams/empty-state";
import { LiveChat } from "@/components/streams/live-chat";
import { RecommendationRail } from "@/components/streams/recommendation-rail";
import { StreamInfoPanel } from "@/components/streams/stream-info-panel";
import { VodCard } from "@/components/streams/vod-card";
import { VodRow } from "@/components/streams/vod-row";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  Channel,
  Clip,
  ScheduleSlot,
  Stream,
  Vod,
} from "@/src/streams/types";
import { categoryName } from "@/src/streams/utils";
import { Film } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function ChannelTabs({
  channel,
  liveStream,
  nextStream,
  vods,
  clips,
  schedule,
  recommendations,
  value,
  onValueChange,
  trailing,
}: {
  channel: Channel;
  liveStream?: Stream;
  nextStream?: Stream;
  vods: Vod[];
  clips: Clip[];
  schedule: ScheduleSlot[];
  recommendations: Stream[];
  value: string;
  onValueChange: (value: string) => void;
  trailing?: ReactNode;
}) {
  return (
    <Tabs value={value} onValueChange={onValueChange}>
      <div className="flex min-w-0 items-center justify-between gap-2 border-b border-white/10">
        <TabsList className="min-w-0 flex-1 gap-0.5 sm:gap-1">
          <TabsTrigger value="inicio">Inicio</TabsTrigger>
          <TabsTrigger value="acerca">Acerca de</TabsTrigger>
          <TabsTrigger value="clips">Clips</TabsTrigger>
          <TabsTrigger value="videos">Vídeos</TabsTrigger>
          <TabsTrigger value="calendario">Calendario</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>
        {trailing}
      </div>

      <TabsContent value="inicio" className="space-y-8">
        {liveStream ? (
          <>
            <StreamInfoPanel stream={liveStream} />
            <VodRow vods={vods.slice(0, 6)} title="Emisiones recientes" />
            <ChannelCategories channel={channel} />
            <RecommendationRail
              streams={recommendations}
              title={`Los espectadores de ${channel.name} también ven`}
            />
          </>
        ) : (
          <>
            <ChannelOfflineStage
              channel={channel}
              nextStream={nextStream}
              lastVod={vods[0]}
            />
            {vods.length > 0 && (
              <VodRow vods={vods.slice(0, 6)} title="Emisiones recientes" />
            )}
            <ChannelCategories channel={channel} />
            <RecommendationRail
              streams={recommendations}
              title={`Los espectadores de ${channel.name} también ven`}
            />
          </>
        )}
      </TabsContent>

      <TabsContent value="acerca">
        <ChannelAbout channel={channel} />
      </TabsContent>

      <TabsContent value="clips">
        <ChannelClips channel={channel} clips={clips} />
      </TabsContent>

      <TabsContent value="videos">
        {vods.length === 0 ? (
          <EmptyState
            icon={Film}
            title="Sin vídeos disponibles"
            description={`Las emisiones pasadas de ${channel.name} aparecerán en cuanto se publiquen.`}
          />
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-white">Vídeos</h2>
              <span className="text-xs text-white/45">{vods.length} emisiones</span>
            </div>
            <div className="grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              {vods.map((vod) => (
                <VodCard key={vod.id} vod={vod} />
              ))}
            </div>
          </div>
        )}
      </TabsContent>

      <TabsContent value="calendario">
        <ChannelSchedule channel={channel} schedule={schedule} nextStream={nextStream} />
      </TabsContent>

      <TabsContent value="chat">
        {liveStream ? (
          <div className="mx-auto max-w-3xl">
            <LiveChat channelSlug={channel.slug} embedded />
          </div>
        ) : (
          <ChannelChatOffline channel={channel} nextStream={nextStream} />
        )}
      </TabsContent>
    </Tabs>
  );
}

function ChannelCategories({ channel }: { channel: Channel }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold text-white">
        Categorías emitidas recientemente
      </h2>
      <div className="flex flex-wrap gap-2">
        {channel.categories.map((slug) => (
          <Link
            key={slug}
            href={`/category/${slug}`}
            className="rounded-full bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/75 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
          >
            {categoryName(slug)}
          </Link>
        ))}
      </div>
    </section>
  );
}
