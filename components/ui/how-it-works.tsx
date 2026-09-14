// components/ui/how-it-works.tsx
"use client";
import { motion } from "motion/react";

const steps = [
  { n: "01", title: "Únete a la sala", desc: "Entra al evento en vivo sin fricción" },
  { n: "02", title: "Chatea en tiempo real", desc: "Sincronizado, sin retraso perceptible" },
  { n: "03", title: "Vive el torneo", desc: "Con miles de espectadores al mismo tiempo" },
];

export function HowItWorks() {
  return (
    <section className="px-6 py-24 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-10">Cómo funciona</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={step.n}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className="text-center"
          >
            <div className="text-5xl font-bold text-white/10 mb-2">{step.n}</div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-white/50 text-sm">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}