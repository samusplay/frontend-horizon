"use client";
import { motion } from "motion/react";

import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Button } from "@/components/ui/button";
import { CreatorsGrid } from "@/components/ui/creators-grid";
import { FinalCta } from "@/components/ui/final-cta";
import { GlowOrbs } from "@/components/ui/glow-orbs";
import { HowItWorks } from "@/components/ui/how-it-works";
import { LiveTicker } from "@/components/ui/live-ticker";
import { ParallaxEvents } from "@/components/ui/parallax-events";
import { TitleAurora } from "@/components/ui/title-aurora";
import { TypewriterTitle } from "@/components/ui/typewriter-title";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0d0221] via-[#0a0118] to-black text-white overflow-hidden">
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-6 text-center">
        <GlowOrbs />
        <TitleAurora />

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm backdrop-blur-sm"
        >
          <motion.span
            className="h-2 w-2 rounded-full bg-red-500"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <AnimatedCounter target={12483} /> espectadores conectados ahora
        </motion.div>

        <TypewriterTitle text="HORIZON" />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-4 max-w-xl text-lg text-white/60"
        >
          Donde cada torneo se vuelve un evento. Chat en vivo, sincronizado, sin retraso.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8 flex gap-4"
        >
          <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }}>
            <Button size="lg" className="bg-white text-black hover:bg-white/90">
              Explorar eventos
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }}>
            <Button size="lg" variant="outline" className="border-white/20 text-white backdrop-blur-sm">
              Soy creador
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <LiveTicker />
      <ParallaxEvents />
      <CreatorsGrid />
      <HowItWorks />

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-8 px-6 py-24 max-w-5xl mx-auto text-center"
      >
        {[
          { value: 500, suffix: "+", label: "Torneos activos" },
          { value: 50000, suffix: "+", label: "Espectadores" },
          { value: 300, suffix: "ms", label: "Latencia de chat" },
          { value: 24, suffix: "/7", label: "Streaming en vivo" },
        ].map((stat) => (
          <div key={stat.label}>
            <div className="text-4xl font-bold">
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
            </div>
            <p className="mt-2 text-sm text-white/50">{stat.label}</p>
          </div>
        ))}
      </motion.section>

      <FinalCta />
    </main>
  );
}