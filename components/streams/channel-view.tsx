"use client";

import { ChannelHeader } from "@/components/streams/channel-header";
import { ChannelTabs } from "@/components/streams/channel-tabs";
import { LiveChat } from "@/components/streams/live-chat";
import { VideoPlayer } from "@/components/streams/video-player";
import { cn } from "@/lib/utils";
import type { ChannelPageData } from "@/src/streams/types";
import { MessageSquare } from "lucide-react";
import { useState } from "react";

const TABS = ["inicio", "acerca", "clips", "videos", "calendario", "chat"] as const;
type TabValue = (typeof TABS)[number];

function normalizeTab(value?: string): TabValue {
  return TABS.includes(value as TabValue) ? (value as TabValue) : "inicio";
}

export function ChannelView({
  data,
  initialTab,
}: {
  data: ChannelPageData;
  initialTab?: string;
}) {
  const { channel, liveStream, nextStream, vods, clips, schedule, recommendations } = data;
  const [activeTab, setActiveTab] = useState<TabValue>(() => normalizeTab(initialTab));
  const [chatOpen, setChatOpen] = useState(true);
  const [theater, setTheater] = useState(false);

  function toggleChat() {
    if (theater) {
      setTheater(false);
      setChatOpen(true);
      return;
    }
    setChatOpen((value) => !value);
  }

  if (!liveStream) {
    return (
      <div className="min-w-0 space-y-6">
        <ChannelHeader channel={channel} nextStream={nextStream} />
        <ChannelTabs
          channel={channel}
          nextStream={nextStream}
          vods={vods}
          clips={clips}
          schedule={schedule}
          recommendations={recommendations}
          value={activeTab}
          onValueChange={(value) => setActiveTab(normalizeTab(value))}
        />
      </div>
    );
  }

  const showSideChat = activeTab !== "chat" && chatOpen && !theater;

  return (
    <div
      className={cn(
        "min-w-0 gap-6",
        showSideChat ? "grid lg:grid-cols-[minmax(0,1fr)_340px]" : "block"
      )}
    >
      <div className="min-w-0 space-y-5">
        <VideoPlayer
          stream={liveStream}
          theater={theater}
          onToggleTheater={() => setTheater((value) => !value)}
        />
        <ChannelHeader channel={channel} liveStream={liveStream} nextStream={nextStream} />
        <ChannelTabs
          channel={channel}
          liveStream={liveStream}
          nextStream={nextStream}
          vods={vods}
          clips={clips}
          schedule={schedule}
          recommendations={recommendations}
          value={activeTab}
          onValueChange={(value) => setActiveTab(normalizeTab(value))}
          trailing={
            activeTab !== "chat" ? (
              <button
                type="button"
                onClick={toggleChat}
                className="hidden shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white lg:flex"
              >
                <MessageSquare className="size-4" />
                {showSideChat ? "Ocultar chat" : "Mostrar chat"}
              </button>
            ) : undefined
          }
        />
      </div>

      {showSideChat && (
        <LiveChat channelSlug={channel.slug} onClose={() => setChatOpen(false)} />
      )}
    </div>
  );
}
