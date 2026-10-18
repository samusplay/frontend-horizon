"use server";

import { getToken } from "@/src/auth/token";
import { readApiError } from "@/src/events/api-error";
import { toFieldErrors } from "@/src/events/field-errors";

import { EventIdSchema, UpdateEventSchema, type UpdateEventState } from "@/src/schemas/events";
import { revalidatePath } from "next/cache";

//los dos primeros parámetros se fijan con .bind(null, eventId, originalStartsAt) en el formulario
export async function updateEvent(
  eventId: string,
  originalStartsAt: string,
  _prevState: UpdateEventState,
  formData: FormData
): Promise<UpdateEventState> {
  if (!EventIdSchema.safeParse(eventId).success) {
    return { errors: ["Identificador de evento inválido"], fieldErrors: {}, success: "" };
  }

  const eventData = {
    title: formData.get("title"),
    description: formData.get("description"),
    startsAt: formData.get("startsAt"),
    imageUrl: formData.get("imageUrl"),
  };

  const result = UpdateEventSchema.safeParse(eventData);

  if (!result.success) {
    return { errors: [], fieldErrors: toFieldErrors(result.error), success: "" };
  }

  //la fecha puede conservarse aunque ya haya pasado; si se cambia, tiene que ser futura
  //(se comparan instantes y no textos: "…:00Z" y "…:00.000Z" son la misma fecha)
  const newStart = Date.parse(result.data.startsAt);
  if (newStart !== Date.parse(originalStartsAt) && newStart <= Date.now()) {
    return { errors: [], fieldErrors: { startsAt: "La fecha de inicio debe ser futura" }, success: "" };
  }

  const token = await getToken();

  if (!token) {
    return { errors: ["Debes iniciar sesión"], fieldErrors: {}, success: "" };
  }

  //es un PUT: reemplaza el evento completo. Lo vacío no se manda y en la base queda null
  const body = {
    title: result.data.title,
    description: result.data.description || undefined,
    startsAt: result.data.startsAt,
    imageUrl: result.data.imageUrl || undefined,
  };

  const req = await fetch(`${process.env.API_URL}/api/events/${eventId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!req.ok) {
    return { errors: [await readApiError(req)], fieldErrors: {}, success: "" };
  }

  //el backend responde 204 sin cuerpo. Se refrescan las pantallas que muestran este evento
  revalidatePath("/creadores");
  revalidatePath(`/events/${eventId}`);
  revalidatePath(`/creadores/transmision/${eventId}`);

  return { errors: [], fieldErrors: {}, success: "Evento actualizado correctamente." };
}