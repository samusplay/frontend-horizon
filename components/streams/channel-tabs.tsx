"use client";

import { EmptyState } from "@/components/streams/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatEventDate } from "@/src/streams/format-date";
import type { Stream } from "@/src/streams/types";
import { Calendar, Clock, Eye, Film, Radio, Scissors } from "lucide-react";
import Link from "next/link";
import type { ComponentType, ReactNode } from "react";

const STATUS_LABEL = {
  live: "En directo",
  scheduled: "Próximo",
  offline: "Finalizado",
} as const;

function Soon() {
  return (
    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/50">
      Pronto
    </span>
  );
}

function Stat({
  icon: Icon,
  label,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg bg-white/5 p-3">
      <Icon className="size-4 text-fuchsia-300" />
      <div className="mt-2 text-sm font-bold text-white first-letter:uppercase">{children}</div>
      <p className="text-xs text-white/50">{label}</p>
    </div>
  );
}

export function ChannelTabs({
  stream,
  upcoming,
  trailing,
}: {
  stream: Stream;
  upcoming: Stream[];
  trailing?: ReactNode;
}) {
  const description = stream.description || "Este evento no tiene descripción.";

  return (
    <Tabs defaultValue="home">
      <div className="flex items-center justify-between gap-2 border-b border-white/10">
        {/* sin barra de scroll: el -mb-px de las pestañas la hacía aparecer */}
        <TabsList className="flex-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TabsTrigger value="home">Inicio</TabsTrigger>
          <TabsTrigger value="about">Acerca de</TabsTrigger>
          <TabsTrigger value="clips">Clips</TabsTrigger>
          <TabsTrigger value="videos">Vídeos</TabsTrigger>
          <TabsTrigger value="schedule">Calendario</TabsTrigger>
        </TabsList>
        {trailing}
      </div>

      <TabsContent value="home">
        <div className="space-y-5 rounded-xl bg-[#120a24] p-5 ring-1 ring-white/10">
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat icon={Radio} label="Estado">
              {STATUS_LABEL[stream.status]}
            </Stat>
            <Stat icon={Clock} label="Inicio">
              {formatEventDate(stream.startedAt)}
            </Stat>
            <Stat icon={Eye} label="Espectadores">
              <Soon />
            </Stat>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">Acerca de esta transmisión</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-white/70">{description}</p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="about">
        <div className="rounded-xl bg-[#120a24] p-5 ring-1 ring-white/10">
          <h2 className="text-sm font-semibold text-white">Sobre este evento</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/70">{description}</p>

          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-lg bg-white/5 p-3">
              <dt className="text-xs text-white/50">Estado</dt>
              <dd className="mt-1 font-semibold text-white">{STATUS_LABEL[stream.status]}</dd>
            </div>
            <div className="rounded-lg bg-white/5 p-3">
              <dt className="text-xs text-white/50">Inicio</dt>
              <dd className="mt-1 font-semibold text-white first-letter:uppercase">
                {formatEventDate(stream.startedAt)}
              </dd>
            </div>
            <div className="rounded-lg bg-white/5 p-3">
              <dt className="text-xs text-white/50">Creador</dt>
              <dd className="mt-1 flex items-center gap-2 font-semibold text-white">
                {stream.streamer.name} <Soon />
              </dd>
            </div>
          </dl>
        </div>
      </TabsContent>

      <TabsContent value="clips">
        <EmptyState
          icon={Scissors}
          title="Los clips llegan pronto"
          description="Aquí podrás ver las mejores jugadas que los espectadores recorten de la transmisión."
        />
      </TabsContent>

      <TabsContent value="videos">
        <EmptyState
          icon={Film}
          title="Las emisiones pasadas llegan pronto"
          description="Cuando se puedan guardar las transmisiones, las verás aquí para repetirlas."
        />
      </TabsContent>

      <TabsContent value="schedule">
        {upcoming.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No hay eventos programados"
            description="Cuando se programe un nuevo evento aparecerá aquí."
          />
        ) : (
          <ul className="divide-y divide-white/10 overflow-hidden rounded-xl bg-[#120a24] ring-1 ring-white/10">
            {upcoming.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/events/${item.id}`}
                  className="flex items-center justify-between gap-4 px-4 py-3.5 transition hover:bg-white/5"
                >
                  <p className="min-w-0 truncate text-sm font-semibold text-white">{item.title}</p>
                  <span className="shrink-0 text-xs text-white/50 first-letter:uppercase">
                    {formatEventDate(item.startedAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </TabsContent>
    </Tabs>
  );
}