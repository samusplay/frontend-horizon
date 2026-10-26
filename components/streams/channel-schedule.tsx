import { EmptyState } from "@/components/streams/empty-state";
import type { Channel, ScheduleSlot, Stream } from "@/src/streams/types";
import {
  WEEKDAYS,
  categoryName,
  formatUpcoming,
  isUpcoming,
  todayWeekdayIndex,
} from "@/src/streams/utils";
import { CalendarDays, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChannelSchedule({
  channel,
  schedule,
  nextStream,
}: {
  channel: Channel;
  schedule: ScheduleSlot[];
  nextStream?: Stream;
}) {
  if (schedule.length === 0) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="No hay horario publicado"
        description={`${channel.name} todavía no ha compartido su calendario de emisiones.`}
      />
    );
  }

  const todayIndex = todayWeekdayIndex();
  const nextAt = nextStream?.startedAt ?? channel.nextLiveAt;
  const nextDate = nextAt ? new Date(nextAt) : undefined;
  const hasUpcoming = isUpcoming(nextAt);
  const nextWeekday = nextDate
    ? WEEKDAYS[(nextDate.getDay() + 6) % 7].value
    : undefined;

  return (
    <div className="space-y-5">
      {hasUpcoming && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-fuchsia-500/10 px-4 py-3 ring-1 ring-fuchsia-400/20">
          <div className="flex items-center gap-2.5">
            <CalendarDays className="size-5 text-fuchsia-300" />
            <div>
              <p className="text-sm font-semibold text-white">Próxima emisión</p>
              <p className="text-xs text-white/55">
                {nextStream?.title ?? "Transmisión programada"} · {formatUpcoming(nextAt)}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-fuchsia-500/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-fuchsia-100">
            Programada
          </span>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
        {WEEKDAYS.map((day, index) => {
          const slots = schedule.filter((slot) => slot.weekday === day.value);
          const isToday = index === todayIndex;

          return (
            <section
              key={day.value}
              className={cn(
                "rounded-xl bg-[#120a24] p-3 ring-1 ring-white/10",
                isToday && "ring-fuchsia-400/30"
              )}
            >
              <header className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">
                  {day.short}
                </p>
                {isToday && (
                  <span className="rounded-full bg-fuchsia-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-fuchsia-200">
                    Hoy
                  </span>
                )}
              </header>

              <div className="mt-2 space-y-2">
                {slots.length === 0 ? (
                  <p className="text-xs text-white/25">—</p>
                ) : (
                  slots.map((slot) => {
                    const isNext = hasUpcoming && slot.weekday === nextWeekday;

                    return (
                      <div
                        key={slot.id}
                        className={cn(
                          "rounded-lg bg-white/5 p-2.5",
                          isNext && "bg-fuchsia-500/15 ring-1 ring-fuchsia-400/25"
                        )}
                      >
                        <p className="flex items-center gap-1 text-[11px] font-semibold text-white/70">
                          <Clock className="size-3" />
                          {slot.startTime}–{slot.endTime}
                        </p>
                        <p className="mt-1 text-xs font-semibold leading-snug text-white">
                          {slot.title}
                        </p>
                        {slot.categorySlug && (
                          <p className="mt-0.5 text-[10px] text-white/40">
                            {categoryName(slot.categorySlug)}
                          </p>
                        )}
                        {isNext && (
                          <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-fuchsia-200">
                            Próxima
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          );
        })}
      </div>

      <p className="text-xs text-white/40">Horario en tu zona local.</p>
    </div>
  );
}
