"use server";

import { ChatMessageSchema } from "@/src/schemas/streams";
import type { ChatMessage } from "@/src/streams/types";

export type SendChatMessageResult = ChatMessage | { error: string };

// ---------------------------------------------------------------------------
// Envía un mensaje al chat de un canal.
// TODO backend: publicar el mensaje por WebSocket o POST a
// `${process.env.API_URL}/api/streams/${channelSlug}/chat` usando el token de
// la sesión (ver `src/auth/token.ts`) para firmar autoría y color.
// ---------------------------------------------------------------------------

export async function sendChatMessage(message: string): Promise<SendChatMessageResult> {
  const result = ChatMessageSchema.safeParse({
    id: crypto.randomUUID(),
    author: "Tú",
    color: "#e879f9",
    message,
  });

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  return result.data;
}
