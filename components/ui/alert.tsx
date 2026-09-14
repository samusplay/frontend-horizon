"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

type AlertVariant = "error" | "success" | "warning" | "info";

const variants: Record<AlertVariant, string> = {
  error: "text-red-400 bg-red-500/10 border-red-500/20",
  success: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  warning: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  info: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
};

export function Alert({
  variant = "error",
  show,
  children,
  className,
}: {
  variant?: AlertVariant;
  show: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0, y: -8 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className={cn(
            "text-sm rounded-md px-3 py-2 border overflow-hidden",
            variants[variant],
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}