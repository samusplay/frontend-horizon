"use server";

import { NotificationListSchema } from "@/src/schemas/streams";
import { NOTIFICATIONS } from "@/src/streams/data";
import type { Notification } from "@/src/streams/types";

// ---------------------------------------------------------------------------
// Notificaciones del usuario.
// TODO backend: GET `${process.env.API_URL}/api/notifications` con el token
// de la sesión (`getToken()`); devolver [] si no hay sesión.
// ---------------------------------------------------------------------------

export async function getNotifications(): Promise<Notification[]> {
  return NotificationListSchema.parse(NOTIFICATIONS);
}
