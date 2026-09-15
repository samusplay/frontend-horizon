//archivo para manejar los eventos pronto consumir la api aqui

"use client";

import { Button } from "components/ui/button";
import { motion } from "motion/react";

type EventStatus = "live" | "scheduled" | "finished";

export type EventCardData = {
  id: string;
  title: string;
  category: string;
  image: string;
  status: EventStatus;
  time: string;
};

const STATUS_CONFIG: Record<EventStatus, { label: string; className: string }> = {
  live: { label: "EN VIVO", className: "bg-red-500 text-white" },
  scheduled: { label: "PRÓXIMO", className: "bg-white/10 text-white/80" },
  finished: { label: "FINALIZADO", className: "bg-white/5 text-white/40" },
};

export function EventCard({ event }: { event: EventCardData }) {
  const status = STATUS_CONFIG[event.status];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl overflow-hidden border border-white/10 bg-white/5"
    >
      <div className="relative aspect-video">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${status.className}`}
        >
          {event.status === "live" && (
            <motion.span
              className="inline-block w-1.5 h-1.5 rounded-full bg-white mr-1.5"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
          {status.label}
        </span>
      </div>

      <div className="p-4">
        <p className="text-xs text-white/40 mb-1">{event.category}</p>
        <h3 className="font-semibold mb-3">{event.title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/50">{event.time}</span>
          <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
            Ver más
          </Button>
        </div>
      </div>
    </motion.div>
  );
}