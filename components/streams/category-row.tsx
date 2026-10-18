import { CategoryCard } from "@/components/streams/category-card";
import { viewersForCategory } from "@/src/streams/utils";
import type { Category, Stream } from "@/src/streams/types";

export function CategoryRow({
  categories,
  streams,
  title = "Categorías para ti",
}: {
  categories: Category[];
  streams: Stream[];
  title?: string;
}) {
  if (categories.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <div className="grid gap-x-4 gap-y-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {categories.map((category) => (
          <CategoryCard
            key={category.slug}
            category={category}
            viewers={viewersForCategory(category.slug, streams)}
          />
        ))}
      </div>
    </section>
  );
}
