import { getStreams } from "@/actions/get-streams-action";
import { StreamsGrid } from "@/components/streams/streams-grid";
import { CATEGORIES } from "@/src/streams/data";
import { formatViewers, viewersForCategory } from "@/src/streams/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES.find((item) => item.slug === slug);
  return { title: category ? `${category.name} · Horizon` : "Categoría · Horizon" };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = CATEGORIES.find((item) => item.slug === slug);
  if (!category) notFound();

  const streams = await getStreams();
  const categoryStreams = streams.filter((stream) => stream.categorySlug === slug);
  const viewers = viewersForCategory(slug, streams);

  return (
    <div className="space-y-8">
      <div className="relative h-44 overflow-hidden rounded-2xl ring-1 ring-white/10 sm:h-56">
        <img src={category.image} alt={category.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">{category.name}</h1>
          <p className="mt-1 text-sm text-white/60">
            {formatViewers(viewers)} espectadores · {categoryStreams.length} canal
            {categoryStreams.length === 1 ? "" : "es"}
          </p>
        </div>
      </div>

      <StreamsGrid
        streams={categoryStreams}
        title="Canales en esta categoría"
        emptyLabel="Todavía no hay canales en directo en esta categoría."
      />
    </div>
  );
}
