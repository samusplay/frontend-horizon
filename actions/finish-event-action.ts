"use server";

import { getToken } from "@/src/auth/token";
import { readApiError } from "@/src/events/api-error";
import { EventIdSchema } from "@/src/schemas/events";
import { revalidatePath } from "next/cache";

export async function finishEvent(eventId: string) {
  //el id llega desde el navegador, no se confía en él
  if (!EventIdSchema.safeParse(eventId).success) {
    return { errors: ["Identificador de evento inválido"], success: "" };
  }

  const token = await getToken();

  if (!token) {
    return { errors: ["Debes iniciar sesión"], success: "" };
  }

  const req = await fetch(`${process.env.API_URL}/api/events/${eventId}/finish`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!req.ok) {
    return { errors: [await readApiError(req)], success: "" };
  }

  //todas las pantallas que muestran este evento se vuelven a pedir
  revalidatePath("/creadores");
  revalidatePath("/events");
  revalidatePath(`/events/${eventId}`);
  revalidatePath(`/creadores/transmision/${eventId}`);

  return { errors: [], success: "Transmisión finalizada." };
}