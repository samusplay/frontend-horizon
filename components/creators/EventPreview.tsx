import { ImageIcon } from "lucide-react";

//vista previa: copia el diseño de EventCard con un placeholder mientras no hay portada
export function EventPreview({
  title,
  description,
  imageUrl,
  startsAt,
  large = false,
}: {
  title: string;
  description: string;
  imageUrl: string;
  startsAt: string; // hora local "2026-10-20T18:00" o ISO con Z
  large?: boolean;
}) {
  const date = startsAt ? new Date(startsAt) : null;
  const dateLabel =
    date && !Number.isNaN(date.getTime())
      ? date.toLocaleString("es-CO", {
          weekday: "long",
          day: "numeric",
          month: "long",
          hour: "numeric",
          minute: "2-digit",
        })
      : "Fecha por definir";

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
      <div className="relative aspect-video bg-gradient-to-br from-fuchsia-500/20 via-violet-500/10 to-transparent">
        {imageUrl ? (
          <img src={imageUrl} alt="Portada del evento" className="w-full h-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-white/30">
            <ImageIcon className="size-10" />
          </div>
        )}
        <span className="absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full bg-white/10 text-white/80">
          PRÓXIMO
        </span>
      </div>

      <div className={large ? "p-6" : "p-4"}>
        <h3 className={`font-semibold mb-1 ${large ? "text-2xl line-clamp-2" : "line-clamp-2"}`}>
          {title || "Título del evento"}
        </h3>
        <p className={`text-white/50 mb-3 ${large ? "text-base line-clamp-3" : "text-sm line-clamp-2"}`}>
          {description || "La descripción aparecerá aquí"}
        </p>
        {/* la hora depende de la zona del navegador, el servidor puede renderizarla distinta */}
        <span suppressHydrationWarning className="text-xs text-white/50 capitalize">
          {dateLabel}
        </span>
      </div>
    </div>
  );
}