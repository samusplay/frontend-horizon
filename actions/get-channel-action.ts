"use server";

import { getClipsByChannel } from "@/actions/get-clips-action";
import { getScheduleByChannel } from "@/actions/get-schedule-action";
import { getStreams } from "@/actions/get-streams-action";
import { getVodsByChannel } from "@/actions/get-vods-action";
import { ChannelListSchema } from "@/src/schemas/streams";
import { CHANNELS } from "@/src/streams/data";
import type { Channel, ChannelPageData } from "@/src/streams/types";

// ---------------------------------------------------------------------------
// Página pública de un canal/creador. Existe aunque no haya emisión activa.
// TODO backend:
//   GET `${process.env.API_URL}/api/channels/:slug`
//   GET `${process.env.API_URL}/api/channels/:slug/videos`
//   GET `${process.env.API_URL}/api/channels/:slug/clips`
//   GET `${process.env.API_URL}/api/channels/:slug/schedule`
// ---------------------------------------------------------------------------

export async function getChannels(): Promise<Channel[]> {
  return ChannelListSchema.parse(CHANNELS);
}

export async function getChannelBySlug(slug: string): Promise<Channel | undefined> {
  const channels = await getChannels();
  return channels.find((channel) => channel.slug === slug);
}

export async function getChannelPageData(slug: string): Promise<ChannelPageData | undefined> {
  const channel = await getChannelBySlug(slug);
  if (!channel) return undefined;

  const [streams, vods, clips, schedule] = await Promise.all([
    getStreams(),
    getVodsByChannel(slug),
    getClipsByChannel(slug),
    getScheduleByChannel(slug),
  ]);

  const liveStream = streams.find(
    (stream) => stream.channelSlug === slug && stream.status === "live"
  );
  const nextStream = streams.find(
    (stream) => stream.channelSlug === slug && stream.status === "scheduled"
  );

  const recommendations = streams
    .filter((stream) => stream.status === "live" && stream.channelSlug !== slug)
    .sort((a, b) => b.viewers - a.viewers)
    .slice(0, 6);

  return { channel, liveStream, nextStream, vods, clips, schedule, recommendations };
}
