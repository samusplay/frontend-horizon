"use client";

import { createEvent } from "@/actions/create-event-action";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useImageUpload } from "@/src/hooks/use-image-upload";
import { ALLOWED_IMAGE_TYPES } from "@/src/schemas/events";
import { CheckCircle2, ImagePlus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { EventPreview } from "./EventPreview";

const fieldClass = (hasError: boolean) =>
  `h-11 bg-white/5 text-base focus-visible:ring-fuchsia-400/50 focus-visible:border-fuchsia-400/50 ${
    hasError ? "border-red-400/60" : "border-white/10"
  }`;

//mensaje de error debajo de cada campo
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-red-400">{message}</p>;
}

export default function CreateEventForm() {
  const router = useRouter();

  const [state, dispatch, pending] = useActionState(createEvent, {
    errors: [],
    fieldErrors: {},
    success: "",
    eventId: "",
  });

  const { imageUrl, uploading, error: uploadError, upload } = useImageUpload({ maxMB: 5 });

  //controlados para alimentar la vista previa
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startsAtLocal, setStartsAtLocal] = useState("");

  //el picker entrega hora local sin zona, al backend va en UTC
  const parsed = startsAtLocal ? new Date(startsAtLocal) : null;
  const startsAtUtc = parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString() : "";

  //cuando llega el id del evento nuevo, vamos a la pantalla de transmisión
  useEffect(() => {
    if (state.eventId) router.push(`/creadores/transmision/${state.eventId}?creado=1`);
  }, [state.eventId, router]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <form
        action={dispatch}
        noValidate
        className="space-y-5 rounded-2xl border border-white/10 bg-black/50 p-6 backdrop-blur-xl shadow-2xl shadow-fuchsia-500/10"
      >
        <div className="space-y-1.5">
          <Label htmlFor="title" className="text-sm font-medium text-white/80">Título</Label>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={150}
            placeholder="Ej. Estreno Horizon"
            className={fieldClass(!!state.fieldErrors.title)}
          />
          <div className="flex items-start justify-between gap-3">
            <FieldError message={state.fieldErrors.title} />
            <p className="ml-auto text-xs text-white/30">{title.length}/150</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description" className="text-sm font-medium text-white/80">Descripción</Label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
            rows={4}
            placeholder="Cuéntale a tu audiencia de qué trata"
            className={`w-full resize-none rounded-md border bg-white/5 px-3 py-2 text-base text-white outline-none placeholder:text-white/40 focus-visible:border-fuchsia-400/50 focus-visible:ring-[3px] focus-visible:ring-fuchsia-400/50 ${
              state.fieldErrors.description ? "border-red-400/60" : "border-white/10"
            }`}
          />
          <FieldError message={state.fieldErrors.description} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="startsAt-picker" className="text-sm font-medium text-white/80">
            Fecha y hora de inicio
          </Label>
          <DateTimePicker
            id="startsAt-picker"
            value={startsAtLocal}
            onChange={setStartsAtLocal}
            error={state.fieldErrors.startsAt}
          />
          <input type="hidden" name="startsAt" value={startsAtUtc} />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-white/80">Portada</Label>
          <label
            htmlFor="cover"
            className="flex h-24 cursor-pointer items-center justify-center gap-3 rounded-lg border border-dashed border-white/20 bg-white/5 text-sm text-white/50 transition hover:border-fuchsia-400/50 hover:text-white/80"
          >
            {uploading ? (
              <>
                <Loader2 className="size-5 animate-spin text-fuchsia-300" />
                Subiendo portada...
              </>
            ) : imageUrl ? (
              <>
                <CheckCircle2 className="size-5 text-fuchsia-300" />
                Portada lista · clic para cambiarla
              </>
            ) : (
              <>
                <ImagePlus className="size-5 text-fuchsia-300" />
                Subir portada · JPG, PNG o WEBP · máx. 5 MB
              </>
            )}
          </label>
          {/* sin name: el archivo va directo a S3, no por el servidor de Next */}
          <input
            id="cover"
            type="file"
            accept={ALLOWED_IMAGE_TYPES.join(",")}
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
              e.target.value = ""; // permite elegir el mismo archivo otra vez
            }}
          />
          <input type="hidden" name="imageUrl" value={imageUrl} />
          <FieldError message={uploadError || state.fieldErrors.imageUrl} />
        </div>

        {/* solo errores generales: sesión vencida, permisos o fallos del servidor */}
        <Alert variant="error" show={state.errors.length > 0}>
          {state.errors.join(" ")}
        </Alert>

        <Button
          type="submit"
          disabled={pending || uploading || state.eventId !== ""}
          className="w-full h-11 text-base bg-white text-black hover:bg-white/90"
        >
          {pending ? "Creando evento..." : state.eventId ? "Redirigiendo..." : "Crear evento"}
        </Button>
      </form>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <p className="mb-3 text-sm font-medium text-white/50">Vista previa en el catálogo</p>
        <EventPreview title={title} description={description} imageUrl={imageUrl} startsAt={startsAtLocal} />
      </div>
    </div>
  );
}