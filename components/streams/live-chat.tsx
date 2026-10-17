"use client";

import { sendChatMessage } from "@/actions/send-chat-message-action";
import { StreamAvatar } from "@/components/streams/stream-avatar";
import { CHAT_EMOTES, CHAT_SEED } from "@/src/streams/data";
import type { ChatMessage } from "@/src/streams/types";
import { Send, Settings, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function LiveChat({ channelSlug, onClose }: { channelSlug: string; onClose?: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>(CHAT_SEED);
  const [value, setValue] = useState("");
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = value.trim();
    if (!text || pending) return;

    setPending(true);
    const result = await sendChatMessage(text);
    setPending(false);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    setMessages((current) => [...current, result]);
    setValue("");
  }

  return (
    <aside className="flex h-[70vh] flex-col overflow-hidden rounded-xl bg-[#120a24] ring-1 ring-white/10 lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]">
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <span className="text-sm font-semibold text-white">Chat</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Ajustes del chat"
            className="rounded-md p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            <Settings className="size-4" />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Ocultar chat"
              className="hidden rounded-md p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white lg:block"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </header>

      <div className="flex items-center gap-2 border-b border-white/10 bg-fuchsia-500/5 px-4 py-2 text-xs text-white/60">
        <span aria-hidden>📌</span>
        Mensaje fijado: recuerden mantener el chat respetuoso.
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {messages.map((message) => (
          <div key={message.id} className="flex gap-2.5">
            <StreamAvatar name={message.author} accent={message.color} size="sm" />
            <p className="min-w-0 text-sm leading-snug">
              <span className="font-semibold" style={{ color: message.color }}>
                {message.author}
              </span>{" "}
              <span className="text-white/85">{message.message}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-1 border-t border-white/10 px-3 pt-2">
        {CHAT_EMOTES.map((emote) => (
          <button
            key={emote}
            type="button"
            onClick={() => setValue((current) => current + emote)}
            className="rounded-md px-1.5 py-1 text-sm text-white/80 transition hover:bg-white/10"
          >
            {emote}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-3 pt-2">
        <div className="flex items-center gap-2 rounded-lg bg-white/5 px-2 ring-1 ring-white/10 focus-within:ring-fuchsia-400/40">
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={`Enviar mensaje a #${channelSlug}`}
            maxLength={200}
            className="h-10 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
          />
          <button
            type="submit"
            disabled={pending || value.trim().length === 0}
            aria-label="Enviar mensaje"
            className="rounded-md p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            <Send className="size-4" />
          </button>
        </div>
      </form>
    </aside>
  );
}
