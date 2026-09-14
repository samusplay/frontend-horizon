// components/ui/typewriter-title.tsx
"use client";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function TypewriterTitle({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i === text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <h1 className="text-6xl md:text-8xl font-bold tracking-tight bg-gradient-to-b from-white via-fuchsia-200 to-cyan-300 bg-clip-text text-transparent">
      {displayed.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: -30, rotateX: 90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.4, ease: "backOut" }}
          className="inline-block"
        >
          {char}
        </motion.span>
      ))}
      <motion.span
        animate={done ? { opacity: 0 } : { opacity: [1, 0] }}
        transition={
          done
            ? { duration: 0.3, delay: 0.6 }
            : { duration: 0.6, repeat: Infinity, repeatType: "reverse" }
        }
        className="inline-block w-2 ml-1 bg-cyan-300 h-[0.9em] align-middle"
      />
    </h1>
  );
}