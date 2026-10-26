"use server";

import { VodListSchema } from "@/src/schemas/streams";
import { VODS } from "@/src/streams/data";
import type { Vod } from "@/src/streams/types";

// ---------------------------------------------------------------------------
// Emisiones pasadas (VODs).
// TODO backend: GET `${process.env.API_URL}/api/streams/:slug/videos`.
// ---------------------------------------------------------------------------

export async function getVods(): Promise<Vod[]> {
  return VodListSchema.parse(VODS);
}

export async function getVodsByStreamer(streamerName: string): Promise<Vod[]> {
  const vods = await getVods();
  return vods.filter((vod) => vod.streamerName === streamerName);
}

export async function getVodsByChannel(channelSlug: string): Promise<Vod[]> {
  const vods = await getVods();
  return vods
    .filter((vod) => vod.channelSlug === channelSlug)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}
