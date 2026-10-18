"use client";

import { StreamAvatar } from "@/components/streams/stream-avatar";
import type { Stream } from "@/src/streams/types";
import { Bell, EllipsisVertical, Gift, Heart, Share2, Star } from "lucide-react";
import { toast } from "sonner";

const STATUS = {
  live: { label: "En directo", className: "bg-red-600 text-white" },
  scheduled: { label: "Próximo", className: "bg-white/10 text-white/80" },
  offline: { label: "Finalizado", className: "bg-white/10 text-white/50" },
} as const;



//botón de una función que aún no existe: se ve, pero apagado
function SoonButton({
  icon: Icon,
  children,
  label,
}: {
  icon: typeof Heart;
  children?: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      disabled
      title="Disponible pronto"
      aria-label={`${label} (pronto)`}
      className="flex cursor-not-allowed items-center gap-2 rounded-lg bg-white/10 px-3.5 py-2.5 text-sm font-semibold text-white opacity-40"
    >
      <Icon className="size-4" />
      {children}
    </button>
  );
}

export function ChannelHeader({ stream }: { stream: Stream }) {
  const status = STATUS[stream.status];

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Enlace copiado");
    } catch {
      toast.error("No se pudo copiar el enlace");
    }
  }

  return (
    <div className="flex flex-wrap items-start gap-4">
      <div className="flex flex-col items-center gap-1.5">
        <StreamAvatar name={stream.streamer.name} accent={stream.streamer.accent} size="xl" />
        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${status.className}`}>
          {status.label}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <h1 className="text-xl font-bold text-white">{stream.title}</h1>
        <p className="mt-0.5 text-sm text-white/60">Por {stream.streamer.name}</p>
        
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SoonButton icon={Heart} label="Seguir">
          Seguir
        </SoonButton>
        <SoonButton icon={Gift} label="Regalar una sub">
          Regalar una sub
        </SoonButton>
        <SoonButton icon={Star} label="Suscribirse">
          Suscribirse
        </SoonButton>

        {/* compartir ya funciona de verdad: copia el enlace de la sala */}
        <button
          type="button"
          onClick={share}
          aria-label="Copiar enlace de la sala"
          className="rounded-lg bg-white/10 p-2.5 text-white transition hover:bg-white/15"
        >
          <Share2 className="size-4" />
        </button>

        <SoonButton icon={Bell} label="Notificaciones" />
        <SoonButton icon={EllipsisVertical} label="Más opciones" />
      </div>
    </div>
  );
}