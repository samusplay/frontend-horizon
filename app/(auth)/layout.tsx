"use client";
import { AuthBackground } from "@/components/ui/auth-background";

import { motion } from "motion/react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-8 overflow-hidden bg-gradient-to-b from-[#0d0221] via-[#0a0118] to-black">
      <AuthBackground />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute top-24 left-1/2 -translate-x-1/2 md:top-24 md:left-6 md:translate-x-0 z-20"
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
        >
          ← Volver al inicio
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full flex justify-center"
      >
        {children}
      </motion.div>
    </div>
  );
}