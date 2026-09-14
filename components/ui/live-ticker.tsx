"use client";
import { motion } from "motion/react";
import { useState } from "react";

const events = ["🔴 Torneo Valorant Masters", "🔴 Liga LoL Regional", "🔴 Copa CS2 Apertura", "🔴 Free Fire World Series"];

export function LiveTicker() {
  const [paused, setPaused] = useState(false);

  return (
    <div
      className="overflow-hidden border-y border-white/10 py-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div
        className="flex gap-12 whitespace-nowrap text-sm text-white/70"
        animate={{ x: paused ? undefined : ["0%", "-50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {[...events, ...events, ...events].map((e, i) => (
          <span key={i}>{e}</span>
        ))}
      </motion.div>
    </div>
  );
}