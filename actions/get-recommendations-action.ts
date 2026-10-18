"use server";

import { getStreams } from "@/actions/get-streams-action";
import type { Stream } from "@/src/streams/types";

// ---------------------------------------------------------------------------
// "Los espectadores de X también ven": recomendaciones de otros canales.
// TODO backend: GET `${process.env.API_URL}/api/streams/:slug/recommendations`.
// ---------------------------------------------------------------------------

export async function getRecommendationsForStream(slug: string, limit = 5): Promise<Stream[]> {
  const streams = await getStreams();

  return streams
    .filter((stream) => stream.slug !== slug && stream.status === "live")
    .sort((a, b) => b.viewers - a.viewers)
    .slice(0, limit);
}
