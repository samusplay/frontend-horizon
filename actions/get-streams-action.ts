"use server";

import { FollowedChannelListSchema, StreamListSchema } from "@/src/schemas/streams";
import { FOLLOWED_CHANNELS, STREAMS } from "@/src/streams/data";
import type { FollowedChannel, Stream } from "@/src/streams/types";

// ---------------------------------------------------------------------------
// Lectura de canales/streams.
// TODO backend: sustituir el mock por:
//
//   const res = await fetch(`${process.env.API_URL}/api/streams`, {
//     headers: { Authorization: `Bearer ${await getToken()}` },
//   });
//   if (!res.ok) { /* mapear ProblemDetailsSchema como en login-action */ }
//   return StreamListSchema.parse(await res.json());
// ---------------------------------------------------------------------------

export async function getStreams(): Promise<Stream[]> {
  // Validamos el mock con el mismo esquema que usará el backend: si algún
  // campo cambia, el fallo aparece aquí y no en la UI.
  return StreamListSchema.parse(STREAMS);
}

export async function getStreamBySlug(slug: string): Promise<Stream | undefined> {
  const streams = await getStreams();
  return streams.find((stream) => stream.slug === slug);
}

// Canales que sigue el usuario (barra lateral).
// TODO backend: GET `${process.env.API_URL}/api/me/followed` con el token.
export async function getFollowedChannels(): Promise<FollowedChannel[]> {
  return FollowedChannelListSchema.parse(FOLLOWED_CHANNELS);
}
