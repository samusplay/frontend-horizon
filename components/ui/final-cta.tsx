// components/ui/final-cta.tsx
"use client";
import { motion } from "motion/react";

const lines = ["Tu próximo torneo", "empieza en Horizon."];

export function FinalCta() {
  return (
    <section className="px-6 py-32 text-center">
      {lines.map((line, i) => (
        <div key={i} className="overflow-hidden">
          <motion.h2
            initial={{ y: "100%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.15, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-bold"
          >
            {line}
          </motion.h2>
        </div>
      ))}
    </section>
  );
}