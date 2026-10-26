import { CATEGORIES } from "./data";
import type { Stream } from "./types";

// TODO backend: resolver con las categorías que devuelva la API.
export function categoryName(slug: string) {
  return CATEGORIES.find((category) => category.slug === slug)?.name ?? slug;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("es-ES").format(value);
}

export function formatViewers(value: number) {
  return new Intl.NumberFormat("es-ES", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatFollowers(value: number) {
  return formatNumber(value);
}

// 29264 -> "8:07:44"
export function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value: number) => value.toString().padStart(2, "0");
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${minutes}:${pad(seconds)}`;
}

export function formatRelativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 0) return "próximamente";

  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor(diff / 3_600_000);

  if (days <= 0) return hours <= 0 ? "hace unos minutos" : `hace ${hours} h`;
  if (days === 1) return "ayer";

  const plural = (value: number, singular: string, pluralForm: string) =>
    `${value} ${value === 1 ? singular : pluralForm}`;

  if (days < 7) return `hace ${plural(days, "día", "días")}`;
  if (days < 30) return `hace ${plural(Math.floor(days / 7), "semana", "semanas")}`;
  if (days < 365) return `hace ${plural(Math.floor(days / 30), "mes", "meses")}`;
  return `hace ${plural(Math.floor(days / 365), "año", "años")}`;
}

export function formatUptime(startedAt: string) {
  const start = new Date(startedAt).getTime();
  const diff = Math.max(0, Date.now() - start);
  const totalMinutes = Math.floor(diff / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours <= 0) return `${minutes} min`;
  return `${hours} h ${minutes} min`;
}

export function isUpcoming(iso?: string) {
  if (!iso) return false;
  return new Date(iso).getTime() > Date.now();
}

// Fecha para "próxima emisión": hoy/mañana + hora, o día completo.
export function formatUpcoming(iso?: string) {
  if (!iso) return undefined;

  const date = new Date(iso);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  if (diff <= 0) return "próximamente";

  const time = new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const dayDiff = Math.round((startOfDate - startOfToday) / 86_400_000);

  if (dayDiff === 0) return `hoy a las ${time}`;
  if (dayDiff === 1) return `mañana a las ${time}`;

  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export const WEEKDAYS = [
  { value: "lun", label: "Lunes", short: "Lun" },
  { value: "mar", label: "Martes", short: "Mar" },
  { value: "mie", label: "Miércoles", short: "Mié" },
  { value: "jue", label: "Jueves", short: "Jue" },
  { value: "vie", label: "Viernes", short: "Vie" },
  { value: "sab", label: "Sábado", short: "Sáb" },
  { value: "dom", label: "Domingo", short: "Dom" },
] as const;

export function weekdayLabel(value: string) {
  return WEEKDAYS.find((day) => day.value === value)?.label ?? value;
}

// Índice del día actual empezando en lunes (0) y terminando en domingo (6).
export function todayWeekdayIndex() {
  return (new Date().getDay() + 6) % 7;
}

export function viewersForCategory(slug: string, streams: Stream[]) {
  return streams
    .filter((stream) => stream.categorySlug === slug)
    .reduce((total, stream) => total + stream.viewers, 0);
}

export function streamsForCategory(slug: string, streams: Stream[]) {
  return streams.filter((stream) => stream.categorySlug === slug);
}
