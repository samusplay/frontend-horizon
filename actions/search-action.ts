"use server";

import { getStreams } from "@/actions/get-streams-action";
import { CATEGORIES } from "@/src/streams/data";
import { categoryName } from "@/src/streams/utils";
import type { Category, Stream } from "@/src/streams/types";

export type SearchResults = {
  categories: Category[];
  streams: Stream[];
};

// ---------------------------------------------------------------------------
// Buscador global de la barra superior.
// TODO backend: GET `${process.env.API_URL}/api/search?q=...`.
// ---------------------------------------------------------------------------

export async function searchChannels(query: string): Promise<SearchResults> {
  const term = query.trim().toLowerCase();
  if (term.length < 2) return { categories: [], streams: [] };

  const streams = await getStreams();

  const categories = CATEGORIES.filter((category) =>
    category.name.toLowerCase().includes(term)
  ).slice(0, 4);

  const matchedStreams = streams
    .filter(
      (stream) =>
        stream.title.toLowerCase().includes(term) ||
        stream.streamer.name.toLowerCase().includes(term) ||
        categoryName(stream.categorySlug).toLowerCase().includes(term) ||
        stream.tags.some((tag) => tag.toLowerCase().includes(term))
    )
    .slice(0, 6);

  return { categories, streams: matchedStreams };
}
