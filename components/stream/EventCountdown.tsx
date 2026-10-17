"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

//cuenta regresiva hasta la hora de inicio, sobre la portada difuminada
export function EventCountdown({
  startsAt,
  dateLabel,
  poster,
}: {
  startsAt: string;
  dateLabel: string; //ya viene formateada desde el servidor para que no cambie al hidratar
  poster?: string;
}) {
  const target = Date.parse(startsAt);

  //null hasta que el navegador monta: así el servidor y el cliente pintan lo mismo
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const timer = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, []);

  const remaining = now === null ? null : target - now;
  const started = remaining !== null && remaining <= 0;

  const total = remaining === null ? 0 : Math.max(0, Math.floor(remaining / 1000));
  const units = [
    { label: "días", value: Math.floor(total / 86400) },
    { label: "horas", value: Math.floor((total % 86400) / 3600) },
    { label: "min", value: Math.floor((total % 3600) / 60) },
    { label: "seg", value: total % 60 },
  ].filter((unit) => unit.label !== "días" || unit.value > 0);

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
      {poster && (
        <img
          src={poster}
          alt=""
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-md"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />

      <div className="relative flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
        {started ? (
          <>
            <Loader2 className="size-8 animate-spin text-fuchsia-300" />
            <p className="text-xl font-semibold sm:text-2xl">El creador está por empezar</p>
            <p className="max-w-sm text-sm text-white/60">
              La transmisión aparecerá aquí apenas empiece, no hace falta recargar
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium tracking-wide text-white/70 uppercase">Empieza en</p>

            <div role="timer" className="flex items-start gap-2 sm:gap-3">
              {units.map((unit) => (
                <div key={unit.label} className="flex flex-col items-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 font-mono text-3xl font-semibold tabular-nums drop-shadow-[0_0_14px_rgba(217,70,239,0.5)] sm:h-20 sm:w-20 sm:text-4xl">
                    {remaining === null ? "--" : pad(unit.value)}
                  </span>
                  <span className="mt-1.5 text-xs text-white/50">{unit.label}</span>
                </div>
              ))}
            </div>

            <p className="text-sm text-white/60 first-letter:uppercase">{dateLabel}</p>
          </>
        )}
      </div>
    </div>
  );
}