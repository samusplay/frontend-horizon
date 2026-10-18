import type { EventSummary } from "@/src/schemas/events";
import type { Stream, StreamStatus } from "@/src/streams/types";

const STATUS: Record<EventSummary["status"], StreamStatus> = {
  Live: "live",
  Scheduled: "scheduled",
  Finished: "offline",
};

//traduce un evento real del backend a la forma que esperan los componentes de Cristian
//lo que el backend aún no tiene (nombre del creador, espectadores, seguidores) queda provisional
export function eventToStream(event: EventSummary): Stream {
  return {
    id: event.id,
    slug: event.id,
    title: event.title,
    streamer: { name: "Creador", accent: "#7c3aed", verified: false, followers: 0 },
    categorySlug: "eventos",
    viewers: 0,
    status: STATUS[event.status],
    thumbnail: event.imageUrl ?? "",
    tags: [],
    language: "Español",
    startedAt: event.startsAt,
    description: event.description ?? "",
  };
}