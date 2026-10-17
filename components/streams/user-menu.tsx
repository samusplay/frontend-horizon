"use client";

import { logout } from "@/actions/logout-action";
import { StreamAvatar } from "@/components/streams/stream-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, LogOut, Settings } from "lucide-react";
import Link from "next/link";

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Menú de usuario"
        className="rounded-full outline-none ring-fuchsia-400/40 transition focus-visible:ring-2"
      >
        <StreamAvatar name="Tú" accent="#a855f7" size="md" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="normal-case">
          <p className="text-sm font-semibold tracking-normal text-white">Tu cuenta</p>
          <p className="text-xs font-normal tracking-normal text-white/40">Sesión iniciada</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <LayoutDashboard className="size-4" /> Mi panel
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <Settings className="size-4" /> Ajustes del canal
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-300 focus:bg-red-500/10 focus:text-red-200"
          onSelect={() => {
            void logout();
          }}
        >
          <LogOut className="size-4" /> Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
