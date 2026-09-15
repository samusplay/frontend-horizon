// components/events/category-gallery.tsx
"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const CATEGORIES = [
  { slug: "valorant", name: "Valorant", image: "/images/categories/valorant.jpg" },
  { slug: "minecraft", name: "Minecraft", image: "/images/categories/minecraft.jpg" },
  { slug: "lol", name: "League of Legends", image: "/images/categories/league-of-legends.jpg" },
] as const;

export function CategoryGallery() {
  const [active, setActive] = useState(0);

  return (
    <section className="px-6 py-24 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-10">Explora por categoría</h2>

      <div className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={CATEGORIES[active].slug}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src={CATEGORIES[active].image}
              alt={CATEGORIES[active].name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between">
              <h3 className="text-4xl md:text-5xl font-bold text-white">
                {CATEGORIES[active].name}
              </h3>
              <span className="text-sm text-white/60">
                {active + 1} / {CATEGORIES.length}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-4 justify-center">
        {CATEGORIES.map((category, i) => (
          <motion.button
            key={category.slug}
            onClick={() => setActive(i)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "relative w-48 aspect-video rounded-xl overflow-hidden transition-all duration-200",
              i === active
                ? "ring-2 ring-white ring-offset-2 ring-offset-black opacity-100"
                : "opacity-40 hover:opacity-70"
            )}
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            <span className="absolute bottom-2 left-3 text-sm font-semibold text-white">
              {category.name}
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}