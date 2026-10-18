"use client";

import { ChannelHeader } from "@/components/streams/channel-header";
import { ChannelTabs } from "@/components/streams/channel-tabs";
import { LiveChat } from "@/components/streams/live-chat";
import { VideoPlayer } from "@/components/streams/video-player";
import { cn } from "@/lib/utils";
import type { Stream, Vod } from "@/src/streams/types";
import { MessageSquare } from "lucide-react";
import { useState } from "react";

export function ChannelView({
  stream,
  vods,
  recommendations,
  upcoming,
}: {
  stream: Stream;
  vods: Vod[];
  recommendations: Stream[];
  upcoming: Stream[];
}) {
  const [chatOpen, setChatOpen] = useState(true);
  const [theater, setTheater] = useState(false);
  const showChat = chatOpen && !theater;

  function toggleChat() {
    if (theater) {
      setTheater(false);
      setChatOpen(true);
      return;
    }
    setChatOpen((value) => !value);
  }

  return (
    <div className={cn("gap-6", showChat ? "grid lg:grid-cols-[minmax(0,1fr)_340px]" : "block")}>
      <div className="min-w-0 space-y-5">
        <VideoPlayer
          stream={stream}
          theater={theater}
          onToggleTheater={() => setTheater((value) => !value)}
        />
        <ChannelHeader stream={stream} />
        <ChannelTabs
          stream={stream}
          vods={vods}
          recommendations={recommendations}
          upcoming={upcoming}
          trailing={
            <button
              type="button"
              onClick={toggleChat}
              className="hidden shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white lg:flex"
            >
              <MessageSquare className="size-4" />
              {showChat ? "Ocultar chat" : "Mostrar chat"}
            </button>
          }
        />
      </div>

      {showChat && <LiveChat channelSlug={stream.slug} onClose={() => setChatOpen(false)} />}
    </div>
  );
}
