// components/ui/creators-grid.tsx
"use client";
import { motion } from "motion/react";

const creators = ["ShadowStrike", "NovaQueen", "PixelReign", "VortexFN"];

export function CreatorsGrid() {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
      className="px-6 py-24 max-w-5xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-center mb-10">Creadores destacados</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {creators.map((name) => (
          <motion.div
            key={name}
            variants={{ hidden: { opacity: 0, y: 30, scale: 0.9 }, show: { opacity: 1, y: 0, scale: 1 } }}
            transition={{ duration: 0.5 }}
            className="rounded-xl border border-white/10 bg-white/5 p-6 text-center"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-400 mb-3" />
            <p className="font-semibold">{name}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}