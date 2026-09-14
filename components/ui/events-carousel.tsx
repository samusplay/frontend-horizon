// components/ui/events-carousel.tsx
"use client";
import { Button } from "@/components/ui/button";
import { motion, useAnimation, useMotionValue } from "motion/react";
import { useState } from "react";

const events = [
  { name: "Torneo Valorant Masters", time: "En vivo ahora", color: "from-red-600 to-orange-500" },
  { name: "Liga LoL Regional", time: "Empieza en 2h", color: "from-cyan-500 to-blue-600" },
  { name: "Copa CS2 Apertura", time: "Mañana, 3:00 PM", color: "from-violet-600 to-fuchsia-600" },
  { name: "Free Fire World Series", time: "Sábado, 5:00 PM", color: "from-emerald-500 to-teal-600" },
];

const CARD_WIDTH = 340;
const GAP = 24;

export function EventsCarousel() {
  const [index, setIndex] = useState(0);
  const x = useMotionValue(0);
  const controls = useAnimation();

  const maxIndex = events.length - 1;

  function goTo(newIndex: number) {
    const clamped = Math.max(0, Math.min(maxIndex, newIndex));
    setIndex(clamped);
    controls.start({ x: -clamped * (CARD_WIDTH + GAP), transition: { type: "spring", stiffness: 300, damping: 30 } });
  }

  return (
    <section className="px-6 py-24 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Eventos en este momento</h2>
        <div className="flex gap-2">
          <button
            onClick={() => goTo(index - 1)}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition"
          >
            ←
          </button>
          <button
            onClick={() => goTo(index + 1)}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition"
          >
            →
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <motion.div
          className="flex gap-6"
          style={{ x }}
          animate={controls}
          drag="x"
          dragConstraints={{ left: -maxIndex * (CARD_WIDTH + GAP), right: 0 }}
          dragElastic={0.1}
          onDragEnd={(_, info) => {
            const offset = info.offset.x;
            if (offset < -80) goTo(index + 1);
            else if (offset > 80) goTo(index - 1);
            else goTo(index);
          }}
        >
          {events.map((event) => (
            <div
              key={event.name}
              style={{ width: CARD_WIDTH }}
              className="shrink-0 rounded-2xl overflow-hidden border border-white/10"
            >
              <div className={`h-40 bg-gradient-to-br ${event.color}`} />
              <div className="p-5 bg-white/5">
                <p className="text-xs text-white/50 mb-1">{event.time}</p>
                <h3 className="font-semibold mb-4">{event.name}</h3>
                <Button size="sm" className="w-full bg-white text-black hover:bg-white/90">
                  Ver evento
                </Button>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {events.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-white" : "w-1.5 bg-white/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}