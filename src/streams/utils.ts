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
  if (days < 7) return `hace ${days} días`;
  if (days < 30) return `hace ${Math.floor(days / 7)} semanas`;
  if (days < 365) return `hace ${Math.floor(days / 30)} meses`;
  return `hace ${Math.floor(days / 365)} años`;
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

export function viewersForCategory(slug: string, streams: Stream[]) {
  return streams
    .filter((stream) => stream.categorySlug === slug)
    .reduce((total, stream) => total + stream.viewers, 0);
}

export function streamsForCategory(slug: string, streams: Stream[]) {
  return streams.filter((stream) => stream.categorySlug === slug);
}
