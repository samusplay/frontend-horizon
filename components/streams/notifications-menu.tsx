"use client";

import { StreamAvatar } from "@/components/streams/stream-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Notification } from "@/src/streams/types";
import { formatRelativeTime } from "@/src/streams/utils";
import { Bell } from "lucide-react";
import Link from "next/link";

export function NotificationsMenu({ notifications }: { notifications: Notification[] }) {
  const unread = notifications.filter((notification) => !notification.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Notificaciones"
        className="relative rounded-lg p-2 text-white/70 outline-none transition hover:bg-white/10 hover:text-white"
      >
        <Bell className="size-5" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-fuchsia-500 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80">
        <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <p className="px-2.5 py-3 text-sm text-white/50">No tienes notificaciones.</p>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} asChild className="items-start gap-2.5">
              <Link href={notification.href}>
                <StreamAvatar
                  name={notification.streamerName}
                  accent={notification.accent}
                  size="sm"
                  className="mt-0.5"
                />
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 block text-sm text-white/90">{notification.title}</span>
                  <span className="mt-0.5 block text-xs text-white/40">
                    {formatRelativeTime(notification.createdAt)}
                  </span>
                </span>
                {!notification.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-fuchsia-400" />}
              </Link>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
