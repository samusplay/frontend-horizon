import { z } from "zod";

// ---------------------------------------------------------------------------
// Esquemas de la vertical `streams`.
// Se usan para validar formularios y para tipar lo que devolverá el backend.
// TODO backend: reutilizar estos esquemas para parsear las respuestas de la API.
// ---------------------------------------------------------------------------

export const CategorySchema = z.object({
  slug: z.string(),
  name: z.string(),
  image: z.string(),
});

export const CategoryListSchema = z.array(CategorySchema);

export const StreamerSchema = z.object({
  name: z.string(),
  accent: z.string(),
  verified: z.boolean(),
  followers: z.number().int().nonnegative(),
});

export const StreamStatusSchema = z.enum(["live", "offline", "scheduled"]);

export const StreamSchema = z.object({
  id: z.string(),
  slug: z.string(),
  channelSlug: z.string(),
  title: z.string(),
  streamer: StreamerSchema,
  categorySlug: z.string(),
  viewers: z.number().int().nonnegative(),
  status: StreamStatusSchema,
  thumbnail: z.string(),
  tags: z.array(z.string()),
  language: z.string(),
  startedAt: z.string(),
  description: z.string(),
});

export const StreamListSchema = z.array(StreamSchema);

// Canales que sigue el usuario (barra lateral). Incluye los que están offline.
export const FollowedChannelSchema = z.object({
  slug: z.string(),
  name: z.string(),
  accent: z.string(),
  categorySlug: z.string(),
  status: StreamStatusSchema,
  viewers: z.number().int().nonnegative(),
});

export const FollowedChannelListSchema = z.array(FollowedChannelSchema);

// Canales/creadores: identidad estable independiente de la emisión.
export const ChannelSocialSchema = z.object({
  label: z.string(),
  url: z.string(),
});

export const ChannelPanelSchema = z.object({
  title: z.string(),
  body: z.string(),
});

export const ChannelSchema = z.object({
  slug: z.string(),
  name: z.string(),
  accent: z.string(),
  verified: z.boolean(),
  followers: z.number().int().nonnegative(),
  bio: z.string(),
  avatar: z.string().optional(),
  socials: z.array(ChannelSocialSchema).optional(),
  categories: z.array(z.string()),
  lastLiveAt: z.string().optional(),
  nextLiveAt: z.string().optional(),
  offlineMessage: z.string().optional(),
  totalViews: z.number().int().nonnegative().optional(),
  joinedAt: z.string().optional(),
  panels: z.array(ChannelPanelSchema).optional(),
});

export const ChannelListSchema = z.array(ChannelSchema);

// Horario semanal del canal.
export const ScheduleSlotSchema = z.object({
  id: z.string(),
  channelSlug: z.string(),
  weekday: z.enum(["lun", "mar", "mie", "jue", "vie", "sab", "dom"]),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  title: z.string(),
  categorySlug: z.string().optional(),
});

export const ScheduleSlotListSchema = z.array(ScheduleSlotSchema);

// Clips cortos creados por la comunidad.
export const ClipSchema = z.object({
  id: z.string(),
  channelSlug: z.string(),
  title: z.string(),
  thumbnail: z.string(),
  durationSeconds: z.number().int().nonnegative(),
  views: z.number().int().nonnegative(),
  createdAt: z.string(),
  url: z.string(),
});

export const ClipListSchema = z.array(ClipSchema);

// Emisiones pasadas (VODs).
export const VodSchema = z.object({
  id: z.string(),
  channelSlug: z.string(),
  streamerName: z.string(),
  title: z.string(),
  thumbnail: z.string(),
  durationSeconds: z.number().int().nonnegative(),
  views: z.number().int().nonnegative(),
  publishedAt: z.string(),
  url: z.string(),
});

export const VodListSchema = z.array(VodSchema);

export const NotificationSchema = z.object({
  id: z.string(),
  streamerName: z.string(),
  accent: z.string(),
  title: z.string(),
  createdAt: z.string(),
  read: z.boolean(),
  href: z.string(),
});

export const NotificationListSchema = z.array(NotificationSchema);

export const ChatMessageSchema = z.object({
  id: z.string(),
  author: z.string(),
  color: z.string(),
  message: z
    .string()
    .trim()
    .min(1, "Escribe un mensaje")
    .max(200, "El mensaje no puede superar 200 caracteres"),
});

// Formulario "Iniciar transmisión" del dashboard del creador.
export const GoLiveSchema = z.object({
  title: z
    .string()
    .trim()
    .min(4, "El título debe tener al menos 4 caracteres")
    .max(80, "El título no puede superar 80 caracteres"),
  categorySlug: z.string().min(1, "Selecciona una categoría"),
  description: z
    .string()
    .trim()
    .max(300, "La descripción no puede superar 300 caracteres"),
});

export const SearchResultSchema = z.object({
  categories: CategoryListSchema,
  streams: StreamListSchema,
});
