"use client";

import type { Stream } from "@/src/streams/types";
import { categoryName, formatViewers } from "@/src/streams/utils";
import {
  Expand,
  Maximize,
  MonitorPlay,
  Pause,
  PictureInPicture2,
  Play,
  Settings,
  Shrink,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

// Reproductor simulado con overlay de autoplay silenciado y modo teatro.
// TODO backend: integrar el player real (HLS/WebRTC) usando `stream.slug`
// para pedir la fuente de vídeo al servidor.
export function VideoPlayer({
  stream,
  theater,
  onToggleTheater,
}: {
  stream: Stream;
  theater: boolean;
  onToggleTheater: () => void;
}) {
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [overlay, setOverlay] = useState(true);

  function startWatching() {
    setOverlay(false);
    setMuted(false);
    setPlaying(true);
  }

  return (
    <div className="group relative aspect-video w-full overflow-hidden rounded-xl bg-black ring-1 ring-white/10">
      <img src={stream.thumbnail} alt={stream.title} className="h-full w-full object-cover opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

      <div className="absolute left-3 top-3 flex items-center gap-2">
        {stream.status === "live" && (
          <span className="flex items-center gap-1 rounded-md bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white">
            <motion.span
              className="inline-block size-1.5 rounded-full bg-white"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            EN VIVO
          </span>
        )}
        <span className="rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white">
          {formatViewers(stream.viewers)} espectadores
        </span>
      </div>

      {overlay ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/45 p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm rounded-xl bg-black/80 p-5 backdrop-blur-sm"
          >
            <span className="inline-block rounded bg-red-600 px-2 py-0.5 text-[11px] font-bold uppercase text-white">
              En directo ahora
            </span>
            <h2 className="mt-3 text-lg font-bold leading-snug text-white">
              {stream.streamer.name} está transmitiendo {categoryName(stream.categorySlug)}
            </h2>
            <button
              type="button"
              onClick={startWatching}
              className="mt-3 text-sm font-medium text-fuchsia-300 underline underline-offset-4 transition hover:text-fuchsia-200"
            >
              Ver ahora junto a {formatViewers(stream.viewers)} espectadores
            </button>
          </motion.div>

          <button
            type="button"
            onClick={startWatching}
            className="absolute bottom-4 left-4 flex items-center gap-2 rounded-md bg-black/80 px-3 py-2 text-sm font-semibold text-white transition hover:bg-black"
          >
            <VolumeX className="size-4" />
            Silenciar
          </button>
        </div>
      ) : (
        <div className="absolute inset-x-0 bottom-0 translate-y-2 px-3 pb-2.5 pt-8 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
          <div className="mb-2 h-1 w-full overflow-hidden rounded-full bg-white/20">
            <div className="h-full w-full rounded-full bg-red-500" />
          </div>
          <div className="flex items-center gap-3 text-white">
            <button type="button" onClick={() => setPlaying((value) => !value)} aria-label="Reproducir/Pausar">
              {playing ? <Pause className="size-5" /> : <Play className="size-5" />}
            </button>
            <button type="button" onClick={() => setMuted((value) => !value)} aria-label="Silenciar/Activar sonido">
              {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
            </button>
            <span className="text-xs font-medium text-white/70">1080p60</span>
            <div className="ml-auto flex items-center gap-3">
              <Settings className="size-5" />
              <PictureInPicture2 className="size-5" />
              <button
                type="button"
                onClick={onToggleTheater}
                aria-label={theater ? "Salir del modo teatro" : "Modo teatro"}
              >
                {theater ? <Shrink className="size-5" /> : <Expand className="size-5" />}
              </button>
              <button type="button" aria-label="Modo cine" className="hidden sm:block">
                <MonitorPlay className="size-5" />
              </button>
              <button type="button" aria-label="Pantalla completa">
                <Maximize className="size-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
