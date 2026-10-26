import type { z } from "zod";
import type {
  CategorySchema,
  ChannelPanelSchema,
  ChannelSchema,
  ChannelSocialSchema,
  ChatMessageSchema,
  ClipSchema,
  FollowedChannelSchema,
  NotificationSchema,
  ScheduleSlotSchema,
  StreamSchema,
  StreamStatusSchema,
  VodSchema,
} from "@/src/schemas/streams";

// Tipos derivados de los esquemas Zod: una sola fuente de verdad.
export type Category = z.infer<typeof CategorySchema>;
export type Stream = z.infer<typeof StreamSchema>;
export type StreamStatus = z.infer<typeof StreamStatusSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type FollowedChannel = z.infer<typeof FollowedChannelSchema>;
export type Vod = z.infer<typeof VodSchema>;
export type Notification = z.infer<typeof NotificationSchema>;
export type Channel = z.infer<typeof ChannelSchema>;
export type ChannelSocial = z.infer<typeof ChannelSocialSchema>;
export type ChannelPanel = z.infer<typeof ChannelPanelSchema>;
export type ScheduleSlot = z.infer<typeof ScheduleSlotSchema>;
export type Clip = z.infer<typeof ClipSchema>;

// Datos completos de la página de canal. `liveStream` y `nextStream` son
// opcionales: la página existe aunque el creador esté desconectado.
export type ChannelPageData = {
  channel: Channel;
  liveStream?: Stream;
  nextStream?: Stream;
  vods: Vod[];
  clips: Clip[];
  schedule: ScheduleSlot[];
  recommendations: Stream[];
};
