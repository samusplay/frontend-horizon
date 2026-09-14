"use client";
import { animate } from "motion";
import { useEffect, useState } from "react";

export function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, target, {
      duration: 2,
      ease: "easeOut",
      onUpdate(latest) {
        setValue(Math.round(latest));
      },
    });
    return () => controls.stop();
  }, [target]);

  return <span>{value.toLocaleString("es-CO")}{suffix}</span>;
}