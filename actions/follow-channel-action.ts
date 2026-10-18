"use server";

import { z } from "zod";

const FollowInputSchema = z.object({
  slug: z.string().min(1),
  follow: z.boolean(),
});

// ---------------------------------------------------------------------------
// Seguir / dejar de seguir un canal.
// TODO backend:
//   POST   `${process.env.API_URL}/api/channels/${slug}/follow`
//   DELETE `${process.env.API_URL}/api/channels/${slug}/follow`
// con el token de la sesión (`getToken()`).
// ---------------------------------------------------------------------------

export async function setFollow(input: { slug: string; follow: boolean }) {
  const result = FollowInputSchema.safeParse(input);

  if (!result.success) {
    return { ok: false as const, following: false, error: "Solicitud inválida." };
  }

  return { ok: true as const, following: result.data.follow };
}
