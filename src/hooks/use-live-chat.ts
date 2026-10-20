"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type FlowMessage = {
  id: number; // id local, solo para las keys de React
  userId: string;
  username: string;
  text: string;
  sentAt: string;
};

export type ChatStatus = "connecting" | "open" | "reconnecting" | "closed";

// lo que manda Flow por el WebSocket
type ServerFrame =
  | { type: "message"; userId: string; username: string; text: string; sentAt: string }
  | { type: "error"; error: string };

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;
const MAX_MESSAGES = 200;

export function useLiveChat(
  eventId: string,
  enabled: boolean,
  onServerError?: (message: string) => void,
) {
  const [messages, setMessages] = useState<FlowMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("connecting");

  const socketRef = useRef<WebSocket | null>(null);
  const nextIdRef = useRef(0);
  const onErrorRef = useRef(onServerError);

  useEffect(() => {
    onErrorRef.current = onServerError;
  });

  const active = enabled && Boolean(WS_URL) && Boolean(eventId);

  useEffect(() => {
    if (!active) return;

    let disposed = false;
    let attempt = 0;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const connect = () => {
      const socket = new WebSocket(`${WS_URL}/ws/${eventId}`);
      socketRef.current = socket;

      socket.onopen = () => {
        attempt = 0;
        setStatus("open");
      };

      socket.onmessage = (event) => {
        let frame: ServerFrame;
        try {
          frame = JSON.parse(event.data);
        } catch {
          return;
        }

        if (frame.type === "message") {
          const message: FlowMessage = {
            id: nextIdRef.current++,
            userId: frame.userId,
            username: frame.username,
            text: frame.text,
            sentAt: frame.sentAt,
          };
          setMessages((prev) => [...prev, message].slice(-MAX_MESSAGES));
        } else if (frame.type === "error") {
          onErrorRef.current?.(frame.error);
        }
      };

      socket.onclose = () => {
        if (disposed) return;
        setStatus("reconnecting");
        // 1s, 2s, 4s... hasta un máximo de 15s
        const delay = Math.min(1000 * 2 ** attempt, 15000);
        attempt += 1;
        retryTimer = setTimeout(connect, delay);
      };
    };

    connect();

    return () => {
      disposed = true;
      clearTimeout(retryTimer);
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [eventId, active]);

  const send = useCallback((text: string): boolean => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return false;
    socket.send(JSON.stringify({ text }));
    return true;
  }, []);

  return { messages, status: active ? status : ("closed" as ChatStatus), send };
}