"use server";

import { ScheduleSlotListSchema } from "@/src/schemas/streams";
import { SCHEDULES } from "@/src/streams/data";
import type { ScheduleSlot } from "@/src/streams/types";
import { WEEKDAYS } from "@/src/streams/utils";

// ---------------------------------------------------------------------------
// Horario semanal de los canales.
// TODO backend: GET `${process.env.API_URL}/api/channels/:slug/schedule`.
// ---------------------------------------------------------------------------

const WEEKDAY_ORDER = new Map(WEEKDAYS.map((day, index) => [day.value, index] as const));

export async function getSchedule(): Promise<ScheduleSlot[]> {
  return ScheduleSlotListSchema.parse(SCHEDULES);
}

export async function getScheduleByChannel(channelSlug: string): Promise<ScheduleSlot[]> {
  const schedule = await getSchedule();
  return schedule
    .filter((slot) => slot.channelSlug === channelSlug)
    .sort(
      (a, b) =>
        (WEEKDAY_ORDER.get(a.weekday) ?? 0) - (WEEKDAY_ORDER.get(b.weekday) ?? 0) ||
        a.startTime.localeCompare(b.startTime)
    );
}
