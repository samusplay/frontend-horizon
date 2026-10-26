"use server";

import { ClipListSchema } from "@/src/schemas/streams";
import { CLIPS } from "@/src/streams/data";
import type { Clip } from "@/src/streams/types";

// ---------------------------------------------------------------------------
// Clips de la comunidad.
// TODO backend: GET `${process.env.API_URL}/api/channels/:slug/clips`.
// ---------------------------------------------------------------------------

export async function getClips(): Promise<Clip[]> {
  return ClipListSchema.parse(CLIPS);
}

export async function getClipsByChannel(channelSlug: string): Promise<Clip[]> {
  const clips = await getClips();
  return clips
    .filter((clip) => clip.channelSlug === channelSlug)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
