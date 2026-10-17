"use client";

import { CategoryCard } from "@/components/streams/category-card";
import { StreamsGrid } from "@/components/streams/streams-grid";
import { categoryName, viewersForCategory } from "@/src/streams/utils";
import type { Category, Stream } from "@/src/streams/types";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

export function BrowseExplorer({
  categories,
  streams,
}: {
  categories: Category[];
  streams: Stream[];
}) {
  const [query, setQuery] = useState("");
  const term = query.trim().toLowerCase();

  const filteredCategories = useMemo(
    () => categories.filter((category) => category.name.toLowerCase().includes(term)),
    [categories, term]
  );

  const filteredStreams = useMemo(
    () =>
      streams.filter((stream) => {
        if (term.length === 0) return true;
        return (
          stream.title.toLowerCase().includes(term) ||
          stream.streamer.name.toLowerCase().includes(term) ||
          categoryName(stream.categorySlug).toLowerCase().includes(term) ||
          stream.tags.some((tag) => tag.toLowerCase().includes(term))
        );
      }),
    [streams, term]
  );

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 ring-1 ring-white/10 focus-within:ring-fuchsia-400/40">
        <Search className="size-4 text-white/40" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Busca categorías, canales o etiquetas"
          className="h-11 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
        />
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">Categorías</h2>
        {filteredCategories.length === 0 ? (
          <p className="text-sm text-white/50">No encontramos categorías con “{query}”.</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {filteredCategories.map((category) => (
              <CategoryCard
                key={category.slug}
                category={category}
                viewers={viewersForCategory(category.slug, streams)}
              />
            ))}
          </div>
        )}
      </section>

      <StreamsGrid
        streams={filteredStreams.filter((stream) => stream.status === "live")}
        title="Canales en vivo"
        emptyLabel={`No hay canales en vivo que coincidan con “${query}”.`}
      />

      {filteredStreams.some((stream) => stream.status === "scheduled") && (
        <StreamsGrid
          streams={filteredStreams.filter((stream) => stream.status === "scheduled")}
          title="Próximamente"
          emptyLabel="Sin emisiones programadas."
        />
      )}
    </div>
  );
}
