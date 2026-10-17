import { getFollowedChannels, getStreams } from "@/actions/get-streams-action";
import { StreamsSidebar } from "@/components/streams/streams-sidebar";

export default async function StreamsLayout({ children }: { children: React.ReactNode }) {
  const [streams, followedChannels] = await Promise.all([getStreams(), getFollowedChannels()]);
  const liveStreams = streams
    .filter((stream) => stream.status === "live")
    .sort((a, b) => b.viewers - a.viewers);

  return (
    <div className="min-h-screen bg-[#0b0716] text-white">
      <div className="mx-auto flex w-full max-w-[1700px] pt-16">
        <StreamsSidebar followedChannels={followedChannels} liveStreams={liveStreams} />
        <main className="min-w-0 flex-1 px-4 py-6 md:px-6">{children}</main>
      </div>
    </div>
  );
}
