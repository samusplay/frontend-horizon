import { formatViewers } from "@/src/streams/utils";
import type { Category } from "@/src/streams/types";
import Link from "next/link";

export function CategoryCard({ category, viewers }: { category: Category; viewers: number }) {
  return (
    <Link href={`/category/${category.slug}`} className="group block">
      <div className="relative aspect-video overflow-hidden rounded-xl ring-1 ring-white/10">
        <img
          src={category.image}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>
      <h3 className="mt-2 font-semibold text-white group-hover:text-fuchsia-300">{category.name}</h3>
      <p className="text-sm text-white/50">
        {viewers > 0 ? `${formatViewers(viewers)} espectadores` : "Sin emisiones"}
      </p>
    </Link>
  );
}
