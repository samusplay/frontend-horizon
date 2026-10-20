"use client";

import { ChannelHeader } from "@/components/streams/channel-header";
import { ChannelTabs } from "@/components/streams/channel-tabs";
import { LiveChat } from "@/components/streams/live-chat";
import { cn } from "@/lib/utils";
import type { Stream } from "@/src/streams/types";
import { MessageSquare } from "lucide-react";
import { useState, type ReactNode } from "react";

export function ChannelView({
  eventId,
  stream,
  player,
  upcoming,
  dateLabel,
  loggedIn,
}: {
  eventId: string,
  stream: Stream;
  player: ReactNode; //el video, la cuenta regresiva o el panel de "terminó": lo decide la página
  upcoming: Stream[];
  dateLabel: string;
  loggedIn: boolean
}) {
  const [chatOpen, setChatOpen] = useState(true);

  return (
    <div className={cn("gap-6", chatOpen ? "grid lg:grid-cols-[minmax(0,1fr)_340px]" : "block")}>
      <div className="min-w-0 space-y-5">
        {player}
        <ChannelHeader stream={stream} />
        <ChannelTabs
          stream={stream}

          upcoming={upcoming}
          trailing={
            <button
              type="button"
              onClick={() => setChatOpen((value) => !value)}
              className="hidden shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white lg:flex"
            >
              <MessageSquare className="size-4" />
              {chatOpen ? "Ocultar chat" : "Mostrar chat"}
            </button>
          }
        />
      </div>

      {chatOpen && (
        <LiveChat
          key={eventId}
          eventId={eventId}
          loggedIn={loggedIn}
          closed={stream.status === "offline"}
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
}