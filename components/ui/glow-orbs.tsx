// components/ui/glow-orbs.tsx
"use client";
import { motion } from "motion/react";

export function GlowOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10 bg-gradient-to-b from-[#0d0221] via-black to-[#0a0118]">
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-fuchsia-600/40 blur-[130px]"
        animate={{ x: [0, 120, 0], y: [0, 80, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "-15%", left: "0%" }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-cyan-400/30 blur-[110px]"
        animate={{ x: [0, -100, 0], y: [0, 60, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        style={{ bottom: "-10%", right: "5%" }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-violet-500/30 blur-[100px]"
        animate={{ x: [0, 60, -60, 0], y: [0, -40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "30%", left: "50%" }}
      />
    </div>
  );
}