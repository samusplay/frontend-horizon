"use client";

import { setFollow } from "@/actions/follow-channel-action";
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
import type { Stream } from "@/src/streams/types";
import { categoryName, formatFollowers, formatViewers } from "@/src/streams/utils";
import { BadgeCheck, Bell, ChevronDown, EllipsisVertical, Gift, Heart, Share2, Star } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function ChannelHeader({ stream }: { stream: Stream }) {
  const [following, setFollowing] = useState(false);
  const [pending, startTransition] = useTransition();

  function toggleFollow() {
    const next = !following;
    setFollowing(next);

    startTransition(async () => {
      const result = await setFollow({ slug: stream.slug, follow: next });
      if (!result.ok) {
        setFollowing(!next);
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="flex flex-wrap items-start gap-4">
      <div className="flex flex-col items-center gap-1.5">
        <StreamAvatar name={stream.streamer.name} accent={stream.streamer.accent} size="xl" />
        {stream.status === "live" && (
          <span className="rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            En directo
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <Link
            href={`/channel/${stream.slug}`}
            className="text-lg font-bold text-white hover:text-fuchsia-300"
          >
            {stream.streamer.name}
          </Link>
          {stream.streamer.verified && <BadgeCheck className="size-5 text-fuchsia-400" />}
        </div>

        <p className="text-sm text-white/60">
          {formatFollowers(stream.streamer.followers)} seguidores
        </p>

        <h1 className="mt-1 text-base font-semibold text-white/90">{stream.title}</h1>

        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-white/60">
          <Link href={`/category/${stream.categorySlug}`} className="text-fuchsia-300 hover:underline">
            {categoryName(stream.categorySlug)}
          </Link>
          <span aria-hidden>·</span>
          <span>{formatViewers(stream.viewers)} espectadores</span>
          <span aria-hidden>·</span>
          <span>{stream.language}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="lg"
          onClick={toggleFollow}
          disabled={pending}
          className={cn(
            following
              ? "bg-white/10 text-white hover:bg-white/15"
              : "bg-fuchsia-500 text-white hover:bg-fuchsia-400"
          )}
        >
          <Heart className={cn("size-4", following && "fill-current")} />
          {following ? "Siguiendo" : "Seguir"}
        </Button>

        <Button size="lg" className="bg-white/10 text-white hover:bg-white/15">
          <Gift className="size-4" /> Regalar una sub
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg bg-white/10 px-3.5 py-2 text-sm font-semibold text-white outline-none transition hover:bg-white/15">
            <Star className="size-4" /> Suscribirse <ChevronDown className="size-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Tier 1 · 4,99 €/mes</DropdownMenuItem>
            <DropdownMenuItem>Tier 2 · 9,99 €/mes</DropdownMenuItem>
            <DropdownMenuItem>Tier 3 · 24,99 €/mes</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Gift className="size-4" /> Regalar una suscripción
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          type="button"
          aria-label="Compartir"
          className="rounded-lg bg-white/10 p-2.5 text-white transition hover:bg-white/15"
        >
          <Share2 className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Notificaciones"
          className="rounded-lg bg-white/10 p-2.5 text-white transition hover:bg-white/15"
        >
          <Bell className="size-4" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Más opciones"
            className="rounded-lg bg-white/10 p-2.5 text-white outline-none transition hover:bg-white/15"
          >
            <EllipsisVertical className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Compartir perfil</DropdownMenuItem>
            <DropdownMenuItem>Reportar canal</DropdownMenuItem>
            <DropdownMenuItem className="text-red-300 focus:bg-red-500/10 focus:text-red-200">
              Bloquear
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
