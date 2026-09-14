// components/ui/auth-background.tsx
"use client";
import { motion } from "motion/react";

export function AuthBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
      <motion.div
        className="absolute top-1/2 left-1/2 w-[650px] h-[650px] rounded-full bg-fuchsia-600/55 blur-[90px]"
        animate={{
          x: ["-70%", "-30%", "-70%"],
          y: ["-70%", "-40%", "-70%"],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-[550px] h-[550px] rounded-full bg-cyan-400/50 blur-[80px]"
        animate={{
          x: ["30%", "60%", "30%"],
          y: ["10%", "40%", "10%"],
          scale: [1, 0.85, 1],
        }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full bg-violet-500/50 blur-[70px]"
        animate={{
          x: ["-40%", "10%", "-40%"],
          y: ["30%", "0%", "30%"],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}