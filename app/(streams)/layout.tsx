import { StreamsSidebar } from "@/components/streams/streams-sidebar";
import { getLiveEvents } from "@/src/events/get-live-events";
import { eventToStream } from "@/src/streams/from-event";

export default async function StreamsLayout({ children }: { children: React.ReactNode }) {
  //eventos que están transmitiendo ahora; si el backend falla, el sidebar solo muestra la lista vacía
  const liveStreams = await getLiveEvents()
    .then((events) => events.map(eventToStream))
    .catch(() => []);

  return (
    <div className="min-h-screen bg-[#0b0716] text-white">
      <div className="mx-auto flex w-full max-w-[1700px] pt-16">
        <StreamsSidebar liveStreams={liveStreams} />
        <main className="min-w-0 flex-1 px-4 py-6 md:px-6">{children}</main>
      </div>
    </div>
  );
}