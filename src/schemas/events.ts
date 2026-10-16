import { z } from "zod";

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

//esquema para crear un evento
export const CreateEventSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(150, "El título no puede superar 150 caracteres"),
  description: z.string().max(2000, "La descripción no puede superar 2000 caracteres").optional(),
  //llega en UTC con Z, el navegador la convierte antes de enviar
  startsAt: z
    .string()
    .min(1, "La fecha de inicio es requerida")
    .refine((v) => !Number.isNaN(Date.parse(v)), "La fecha de inicio no es válida")
    .refine((v) => Date.parse(v) > Date.now(), "La fecha de inicio debe ser futura"),
  //url publica que devuelve S3, puede venir vacia si no subió portada
  imageUrl: z.string().url("La URL de la imagen no es válida").max(500, "La URL es muy larga").optional().or(z.literal("")),
});

export const CreateEventSuccessSchema = z.object({
  id: z.string(),
});

//pedir la url firmada para subir la portada
export const UploadUrlSchema = z.object({
  contentType: z.enum(ALLOWED_IMAGE_TYPES, { message: "Solo se permiten imágenes JPEG, PNG o WEBP" }),
});

export const UploadUrlSuccessSchema = z.object({
  uploadUrl: z.string(),
  publicUrl: z.string(),
  expiresInSeconds: z.number(),
});

//detalle de un evento: GET /api/events/{id}
export const EventDetailSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  startsAt: z.string(),
  imageUrl: z.string().nullable(),
  status: z.enum(["Scheduled", "Live", "Finished"]),
  creatorId: z.string(),
  createdAt: z.string(),
});

//estado del formulario de crear evento, lo devuelve el action
export type CreateEventState = {
  errors: string[]; //errores generales (sesión, servidor)
  fieldErrors: Partial<Record<"title" | "description" | "startsAt" | "imageUrl", string>>;
  success: string;
  eventId: string;
};

export type EventDetail = z.infer<typeof EventDetailSchema>;


//un evento dentro de una lista: GET /api/events/mine
export const EventSummarySchema = EventDetailSchema.omit({ createdAt: true });

export const MyEventsSchema = z.object({
  items: z.array(EventSummarySchema),
  page: z.number(),
  pageSize: z.number(),
  totalCount: z.number(),
});

export type EventSummary = z.infer<typeof EventSummarySchema>;