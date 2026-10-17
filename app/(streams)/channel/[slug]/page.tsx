import { getRecommendationsForStream } from "@/actions/get-recommendations-action";
import { getStreamBySlug, getStreams } from "@/actions/get-streams-action";
import { getVodsByStreamer } from "@/actions/get-vods-action";
import { ChannelView } from "@/components/streams/channel-view";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type ChannelPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ChannelPageProps): Promise<Metadata> {
  const { slug } = await params;
  const stream = await getStreamBySlug(slug);
  return { title: stream ? `${stream.title} · Horizon` : "Canal · Horizon" };
}

export default async function ChannelPage({ params }: ChannelPageProps) {
  const { slug } = await params;
  const stream = await getStreamBySlug(slug);
  if (!stream) notFound();

  const [vods, recommendations, streams] = await Promise.all([
    getVodsByStreamer(stream.streamer.name),
    getRecommendationsForStream(slug),
    getStreams(),
  ]);

  const upcoming = streams.filter((item) => item.status === "scheduled");

  return (
    <ChannelView
      stream={stream}
      vods={vods}
      recommendations={recommendations}
      upcoming={upcoming}
    />
  );
}
