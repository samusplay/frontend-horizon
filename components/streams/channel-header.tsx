"use client";

import { setFollow } from "@/actions/follow-channel-action";
import { ChannelStatusBadge } from "@/components/streams/channel-status-badge";
import { StreamAvatar } from "@/components/streams/stream-avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Channel, Stream, StreamStatus } from "@/src/streams/types";
import {
  categoryName,
  formatFollowers,
  formatRelativeTime,
  formatUpcoming,
  formatUptime,
  formatViewers,
  isUpcoming,
} from "@/src/streams/utils";
import {
  BadgeCheck,
  Bell,
  BellRing,
  ChevronDown,
  EllipsisVertical,
  Gift,
  Heart,
  Share2,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function ChannelHeader({
  channel,
  liveStream,
  nextStream,
}: {
  channel: Channel;
  liveStream?: Stream;
  nextStream?: Stream;
}) {
  const [following, setFollowing] = useState(false);
  const [notified, setNotified] = useState(false);
  const [pending, startTransition] = useTransition();

  const nextAt = nextStream?.startedAt ?? channel.nextLiveAt;
  const hasUpcoming = isUpcoming(nextAt);
  const status: StreamStatus = liveStream ? "live" : hasUpcoming ? "scheduled" : "offline";
  const categorySlug = liveStream?.categorySlug ?? channel.categories[0];

  function toggleFollow() {
    const next = !following;
    setFollowing(next);

    startTransition(async () => {
      const result = await setFollow({ slug: channel.slug, follow: next });
      if (!result.ok) {
        setFollowing(!next);
        toast.error(result.error);
      }
    });
  }

  function toggleNotifications() {
    const next = !notified;
    setNotified(next);
    toast.success(
      next
        ? "Te avisaremos cuando empiece la próxima emisión"
        : "Avisos de emisión desactivados"
    );
  }

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: channel.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("Enlace copiado");
    } catch {
      // El usuario canceló el diálogo nativo: no hay nada que hacer.
    }
  }

  return (
    <div className="flex min-w-0 flex-wrap items-start gap-4">
      <div className="flex shrink-0 flex-col items-center gap-2">
        <div
          className="rounded-full p-1"
          style={{ backgroundColor: `${channel.accent}33` }}
        >
          <StreamAvatar name={channel.name} accent={channel.accent} size="xl" />
        </div>
        <ChannelStatusBadge status={status} />
      </div>

      <div className="min-w-0 flex-1 sm:min-w-[16rem]">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link
            href={`/channel/${channel.slug}`}
            className="text-2xl font-bold text-white hover:text-fuchsia-300 sm:text-3xl"
          >
            {channel.name}
          </Link>
          {channel.verified && <BadgeCheck className="size-5 text-fuchsia-400" />}
        </div>

        <p className="mt-1 text-sm text-white/60">
          {formatFollowers(channel.followers)} seguidores
        </p>

        {liveStream ? (
          <>
            <h1 className="mt-2 text-base font-semibold text-white/90">{liveStream.title}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-white/60">
              <Link
                href={`/category/${liveStream.categorySlug}`}
                className="text-fuchsia-300 hover:underline"
              >
                {categoryName(liveStream.categorySlug)}
              </Link>
              <span aria-hidden>·</span>
              <span>{formatViewers(liveStream.viewers)} espectadores</span>
              <span aria-hidden>·</span>
              <span>{formatUptime(liveStream.startedAt)} en directo</span>
              <span aria-hidden>·</span>
              <span>{liveStream.language}</span>
            </div>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-white/70">
              {status === "scheduled" ? (
                <>
                  Próxima emisión:{" "}
                  <span className="font-semibold text-fuchsia-200">
                    {formatUpcoming(nextAt)}
                  </span>
                </>
              ) : (
                "Sin transmisión en este momento."
              )}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-white/50">
              {channel.lastLiveAt && (
                <span>Última emisión {formatRelativeTime(channel.lastLiveAt)}</span>
              )}
              {categorySlug && (
                <>
                  <span aria-hidden>·</span>
                  <Link
                    href={`/category/${categorySlug}`}
                    className="text-fuchsia-300 hover:underline"
                  >
                    {categoryName(categorySlug)}
                  </Link>
                </>
              )}
              {channel.offlineMessage && (
                <>
                  <span aria-hidden>·</span>
                  <span className="max-w-xl truncate">{channel.offlineMessage}</span>
                </>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex w-full flex-wrap items-center gap-2 sm:ml-auto sm:w-auto sm:justify-end">
        <Button
          size="lg"
          onClick={toggleFollow}
          disabled={pending}
          className={cn(
            "flex-1 sm:flex-none",
            following
              ? "bg-white/10 text-white hover:bg-white/15"
              : "bg-fuchsia-500 text-white hover:bg-fuchsia-400"
          )}
        >
          <Heart className={cn("size-4", following && "fill-current")} />
          {following ? "Siguiendo" : "Seguir"}
        </Button>

        <button
          type="button"
          onClick={toggleNotifications}
          aria-pressed={notified}
          aria-label={notified ? "Desactivar avisos de emisión" : "Avisarme cuando empiece"}
          className={cn(
            "flex size-9 items-center justify-center rounded-lg transition",
            notified
              ? "bg-fuchsia-500/20 text-fuchsia-200 ring-1 ring-fuchsia-400/30"
              : "bg-white/10 text-white hover:bg-white/15"
          )}
        >
          {notified ? <BellRing className="size-4" /> : <Bell className="size-4" />}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg bg-white/10 px-3.5 py-2 text-sm font-semibold text-white outline-none transition hover:bg-white/15">
            <Star className="size-4" /> Suscribirse <ChevronDown className="size-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Tier 1 · 4,99 €/mes</DropdownMenuItem>
            <DropdownMenuItem>Tier 2 · 9,99 €/mes</DropdownMenuItem>
            <DropdownMenuItem>Tier 3 · 24,99 €/mes</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => toast.info("Próximamente: regalar una suscripción")}>
              <Gift className="size-4" /> Regalar una suscripción
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          type="button"
          onClick={() => toast.info("Próximamente: regalar una sub")}
          className="flex items-center gap-2 rounded-lg bg-white/10 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
        >
          <Gift className="size-4" /> Regalar una sub
        </button>

        <button
          type="button"
          onClick={share}
          aria-label="Compartir canal"
          className="rounded-lg bg-white/10 p-2.5 text-white transition hover:bg-white/15"
        >
          <Share2 className="size-4" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Más opciones"
            className="rounded-lg bg-white/10 p-2.5 text-white outline-none transition hover:bg-white/15"
          >
            <EllipsisVertical className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={share}>Copiar enlace del canal</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => toast.info("Gracias, revisaremos el canal.")}>
              Reportar canal
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => toast.info("Canal bloqueado (solo en esta sesión).")}
              className="text-red-300 focus:bg-red-500/10 focus:text-red-200"
            >
              Bloquear
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
