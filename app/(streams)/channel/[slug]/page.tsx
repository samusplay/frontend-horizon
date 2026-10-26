import { getChannelPageData } from "@/actions/get-channel-action";
import { ChannelView } from "@/components/streams/channel-view";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type ChannelPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export async function generateMetadata({ params }: ChannelPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getChannelPageData(slug);
  if (!data) return { title: "Canal · Horizon" };

  const { channel, liveStream } = data;
  return {
    title: liveStream
      ? `${channel.name} · ${liveStream.title} · Horizon`
      : `${channel.name} · Horizon`,
    description: channel.bio,
    openGraph: {
      title: `${channel.name} · Horizon`,
      description: channel.bio,
    },
  };
}

export default async function ChannelPage({ params, searchParams }: ChannelPageProps) {
  const { slug } = await params;
  const data = await getChannelPageData(slug);
  if (!data) notFound();

  const { tab } = await searchParams;
  return <ChannelView key={tab ?? "inicio"} data={data} initialTab={tab} />;
}
