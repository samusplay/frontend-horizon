"use client";

import type HlsType from "hls.js";
import { Loader2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

//donde nginx publica el HLS, es público (no es secreto)
const HLS_BASE_URL = process.env.NEXT_PUBLIC_HLS_URL ?? "http://localhost:8080/hls";
const RETRY_MS = 3000;

export function StreamPlayer({
  eventId,
  poster,
  soundPrompt = true,
}: {
  eventId: string;
  poster?: string;
  soundPrompt?: boolean; //false en la vista del creador: el sonido de su propio stream haría eco con OBS
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [live, setLive] = useState(false);
  const [muted, setMuted] = useState(true);

  //el navegador solo deja arrancar solo un video sin sonido, así que empieza silenciado
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const sync = () => setMuted(video.muted || video.volume === 0);
    video.addEventListener("volumechange", sync);
    return () => video.removeEventListener("volumechange", sync);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const src = `${HLS_BASE_URL}/${eventId}.m3u8`;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let hls: HlsType | null = null;

    async function start() {
      const { default: Hls } = await import("hls.js");
      if (cancelled || !video) return;

      //navegadores con HLS nativo y sin soporte de hls.js: sin reintentos automáticos
      if (!Hls.isSupported()) {
        video.src = src;
        video.addEventListener("loadedmetadata", () => setLive(true), { once: true });
        return;
      }

      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLive(true);
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (!data.fatal) return;
        //404 mientras OBS no transmite, o se cayó la señal: reiniciamos y reintentamos
        setLive(false);
        hls?.destroy();
        hls = null;
        if (!cancelled) timer = setTimeout(start, RETRY_MS);
      });
    }

    start();

    return () => {
      cancelled = true;
      clearTimeout(timer);
      hls?.destroy();
    };
  }, [eventId]);

  function enableSound() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.volume = 1;
    video.play().catch(() => {});
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
      <video
        ref={videoRef}
        poster={poster}
        controls
        muted
        autoPlay
        playsInline
        className="h-full w-full object-contain"
      />

      {live ? (
        <>
          <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold">
            <span className="size-1.5 animate-pulse rounded-full bg-white" />
            EN VIVO
          </span>

          {soundPrompt && muted && (
            <button
              type="button"
              onClick={enableSound}
              className="absolute top-3 right-3 flex items-center gap-2 rounded-full bg-black/70 px-3.5 py-2 text-sm font-medium backdrop-blur transition hover:bg-black/90 focus-visible:ring-[3px] focus-visible:ring-fuchsia-400/50 focus-visible:outline-none"
            >
              <VolumeX className="size-4 text-fuchsia-300" />
              Activar sonido
            </button>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 px-6 text-center backdrop-blur-sm">
          <Loader2 className="size-8 animate-spin text-fuchsia-300" />
          <p className="font-medium">Esperando señal de OBS...</p>
          <p className="max-w-xs text-sm text-white/50">
            Inicia la transmisión en OBS. Puede tardar entre 10 y 15 segundos en aparecer.
          </p>
        </div>
      )}
    </div>
  );
}