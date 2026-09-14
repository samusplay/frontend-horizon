// components/ui/parallax-events.tsx
"use client";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const featuredEvents = [
  { name: "Torneo Valorant Masters", color: "from-red-600 to-orange-500" },
  { name: "Liga LoL Regional", color: "from-cyan-500 to-blue-600" },
  { name: "Copa CS2 Apertura", color: "from-violet-600 to-fuchsia-600" },
];

function ParallaxCard({ event, speed }: { event: typeof featuredEvents[0]; speed: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);

  return (
    <div ref={ref} className="relative h-[400px] overflow-hidden rounded-2xl">
      <motion.div
        style={{ y }}
        className={`absolute inset-[-15%] bg-gradient-to-br ${event.color} opacity-60`}
      />
      <div className="relative h-full flex items-end p-6 bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="text-2xl font-bold text-white">{event.name}</h3>
      </div>
    </div>
  );
}

export function ParallaxEvents() {
  return (
    <section className="px-6 py-24 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-10 text-center">Eventos destacados</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {featuredEvents.map((event, i) => (
          <ParallaxCard key={event.name} event={event} speed={40 + i * 15} />
        ))}
      </div>
    </section>
  );
}