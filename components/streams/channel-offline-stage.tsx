"use client";

import { ChannelStatusBadge } from "@/components/streams/channel-status-badge";
import { VodCard } from "@/components/streams/vod-card";
import { Button } from "@/components/ui/button";
import type { Channel, Stream, Vod } from "@/src/streams/types";
import {
  categoryName,
  formatFollowers,
  formatRelativeTime,
  formatUpcoming,
  isUpcoming,
} from "@/src/streams/utils";
import { Bell, BellRing, CalendarDays, Clock, Play, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function ChannelOfflineStage({
  channel,
  nextStream,
  lastVod,
}: {
  channel: Channel;
  nextStream?: Stream;
  lastVod?: Vod;
}) {
  const [notified, setNotified] = useState(false);
  const nextAt = nextStream?.startedAt ?? channel.nextLiveAt;
  const hasUpcoming = isUpcoming(nextAt);
  const status = hasUpcoming ? "scheduled" : "offline";

  function toggleNotifications() {
    const next = !notified;
    setNotified(next);
    toast.success(
      next ? "Te avisaremos cuando empiece la emisión" : "Avisos desactivados"
    );
  }

  return (
    <section className="relative overflow-hidden rounded-2xl ring-1 ring-white/10">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(120% 130% at 8% 0%, ${channel.accent}40 0%, transparent 48%), linear-gradient(135deg, #170d2e 0%, #0b0716 72%)`,
        }}
      />
      <div className="relative grid gap-6 p-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:p-8">
        <div className="flex flex-col justify-between gap-6">
          <div>
            <ChannelStatusBadge
              status={status}
              label={status === "scheduled" ? "Próxima emisión" : "Sin conexión"}
            />
            <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
              {channel.name} no está en directo
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60">
              {channel.offlineMessage ??
                "Sigue el canal para recibir un aviso cuando empiece la próxima transmisión."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
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
              {notified ? "Aviso activado" : "Notificarme"}
            </Button>

            {lastVod && (
              <Button asChild size="lg" className="bg-white/10 text-white hover:bg-white/15">
                <Link href={lastVod.url}>
                  <Play className="size-4" /> Ver último directo
                </Link>
              </Button>
            )}

            <Button asChild size="lg" className="bg-white/10 text-white hover:bg-white/15">
              <Link href={`/channel/${channel.slug}?tab=calendario`}>
                <CalendarDays className="size-4" /> Ver calendario
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/50">
            {channel.lastLiveAt && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" /> Última emisión{" "}
                {formatRelativeTime(channel.lastLiveAt)}
              </span>
            )}
            {nextAt && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-3.5" /> Próxima {formatUpcoming(nextAt)}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-3.5" /> {formatFollowers(channel.followers)} seguidores
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-black/25 p-4 ring-1 ring-white/10 backdrop-blur-sm">
          {nextStream ? (
            <div className="flex h-full flex-col">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
                Próxima emisión
              </p>
              <h3 className="mt-2 text-lg font-bold leading-snug text-white">
                {nextStream.title}
              </h3>
              <p className="mt-1 text-sm text-white/60">
                {categoryName(nextStream.categorySlug)} · {formatUpcoming(nextStream.startedAt)}
              </p>
              <Button
                size="lg"
                onClick={toggleNotifications}
                className="mt-4 w-full bg-white/10 text-white hover:bg-white/15"
              >
                {notified ? <BellRing className="size-4" /> : <Bell className="size-4" />}
                {notified ? "Aviso activado" : "Añadir recordatorio"}
              </Button>
            </div>
          ) : lastVod ? (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
                Último directo
              </p>
              <div className="mt-3">
                <VodCard vod={lastVod} />
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col justify-center text-center">
              <p className="font-semibold text-white">Aún no hay emisiones</p>
              <p className="mt-1 text-sm text-white/50">
                Sígue el canal para no perderte la primera transmisión.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
