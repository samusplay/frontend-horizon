"use client";

import { Button } from "@/components/ui/button";
import type { Channel, Stream } from "@/src/streams/types";
import { formatUpcoming, isUpcoming } from "@/src/streams/utils";
import { Bell, BellRing, CalendarDays, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function ChannelChatOffline({
  channel,
  nextStream,
}: {
  channel: Channel;
  nextStream?: Stream;
}) {
  const [notified, setNotified] = useState(false);
  const nextAt = nextStream?.startedAt ?? channel.nextLiveAt;
  const hasUpcoming = isUpcoming(nextAt);

  function toggleNotifications() {
    const next = !notified;
    setNotified(next);
    toast.success(
      next ? "Te avisaremos cuando abra el chat" : "Avisos desactivados"
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-xl bg-[#120a24] p-8 text-center ring-1 ring-white/10 sm:p-12">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
        <MessageSquare className="size-7 text-white/40" />
      </div>
      <h2 className="mt-4 text-xl font-bold text-white">El chat está cerrado</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/55">
        {hasUpcoming
          ? `Se abrirá cuando empiece la próxima emisión: ${formatUpcoming(nextAt)}.`
          : "Se abrirá cuando el canal inicie una transmisión. Mientras tanto, puedes seguir el canal y activar los avisos."}
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Button
          size="lg"
          onClick={toggleNotifications}
          className={
            notified
              ? "bg-fuchsia-500/20 text-fuchsia-100 ring-1 ring-fuchsia-400/30 hover:bg-fuchsia-500/25"
              : "bg-fuchsia-500 text-white hover:bg-fuchsia-400"
          }
        >
          {notified ? <BellRing className="size-4" /> : <Bell className="size-4" />}
          {notified ? "Aviso activado" : "Avisarme cuando abra"}
        </Button>
        <Button asChild size="lg" className="bg-white/10 text-white hover:bg-white/15">
          <Link href={`/channel/${channel.slug}?tab=calendario`}>
            <CalendarDays className="size-4" /> Ver calendario
          </Link>
        </Button>
      </div>
    </div>
  );
}
