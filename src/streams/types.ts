import type { z } from "zod";
import type {
  CategorySchema,
  ChatMessageSchema,
  FollowedChannelSchema,
  NotificationSchema,
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
