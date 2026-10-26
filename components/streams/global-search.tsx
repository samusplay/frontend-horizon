"use client";

import { searchChannels, type SearchResults } from "@/actions/search-action";
import { StreamAvatar } from "@/components/streams/stream-avatar";
import { categoryName, formatViewers } from "@/src/streams/utils";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";

const EMPTY: SearchResults = { categories: [], streams: [] };

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>(EMPTY);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;

    const timeout = setTimeout(() => {
      startTransition(async () => {
        const data = await searchChannels(trimmed);
        setResults(data);
      });
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  const hasResults = results.categories.length > 0 || results.streams.length > 0;
  const showPanel = open && query.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 ring-1 ring-white/10 focus-within:ring-fuchsia-400/40">
        <Search className="size-4 shrink-0 text-white/40" />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Buscar canales, categorías o etiquetas"
          className="h-9 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
        />
        {query.length > 0 && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Limpiar búsqueda"
            className="text-white/40 transition hover:text-white"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {showPanel && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-white/10 bg-[#150c2b] p-2 shadow-2xl shadow-black/50">
          {pending && <p className="px-2 py-1.5 text-xs text-white/40">Buscando…</p>}

          {!pending && !hasResults && (
            <p className="px-2 py-1.5 text-sm text-white/50">Sin resultados para “{query}”.</p>
          )}

          {results.categories.length > 0 && (
            <div className="mb-1">
              <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/40">
                Categorías
              </p>
              {results.categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition hover:bg-white/5"
                >
                  <img src={category.image} alt="" className="size-8 rounded-md object-cover" />
                  <span className="text-sm text-white/80">{category.name}</span>
                </Link>
              ))}
            </div>
          )}

          {results.streams.length > 0 && (
            <div>
              <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/40">
                Canales
              </p>
              {results.streams.map((stream) => (
                <Link
                  key={stream.id}
                  href={`/channel/${stream.channelSlug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition hover:bg-white/5"
                >
                  <StreamAvatar name={stream.streamer.name} accent={stream.streamer.accent} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-white/90">{stream.streamer.name}</p>
                    <p className="truncate text-xs text-white/50">{categoryName(stream.categorySlug)}</p>
                  </div>
                  {stream.status === "live" && (
                    <span className="flex items-center gap-1 text-xs text-white/50">
                      <span className="size-1.5 rounded-full bg-red-500" />
                      {formatViewers(stream.viewers)}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
