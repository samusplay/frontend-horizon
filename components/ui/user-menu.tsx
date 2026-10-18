"use client";

import { logout } from "@/actions/logout-action";
import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { Compass, LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { DropdownMenu } from "radix-ui";

//"creador@test.com" -> "CR", "juan.perez@x.com" -> "JP"
function getInitials(email: string) {
  const name = email.split("@")[0];
  const parts = name.split(/[._-]+/).filter(Boolean);
  const letters = parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2);
  return letters.toUpperCase() || "?";
}

const itemClass =
  "flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-white/80 outline-none transition data-[highlighted]:bg-white/10 data-[highlighted]:text-white";

export function UserMenu({ email, role }: { email: string; role: string }) {
  const isCreator = role === "Creador";

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Abrir menú de usuario"
          className="rounded-full outline-none transition hover:scale-105 focus-visible:ring-[3px] focus-visible:ring-fuchsia-400/50"
        >
          <Avatar className="size-10">
            <AvatarFallback className="bg-gradient-to-br from-fuchsia-500 to-violet-600 text-sm font-semibold text-white">
              {getInitials(email)}
            </AvatarFallback>
            <AvatarBadge className="bg-emerald-500" />
          </Avatar>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={10}
          className="z-[110] w-64 rounded-xl border border-white/10 bg-[#120629] p-1.5 text-white shadow-2xl shadow-fuchsia-500/20 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <div className="px-3 py-2.5">
            <p className="truncate text-sm font-medium">{email}</p>
            <span className="mt-1.5 inline-block rounded-full border border-fuchsia-400/40 bg-fuchsia-500/15 px-2 py-0.5 text-[11px] font-semibold text-fuchsia-200">
              {role}
            </span>
          </div>

          <DropdownMenu.Separator className="my-1 h-px bg-white/10" />

          {isCreator && (
            <DropdownMenu.Item asChild>
              <Link href="/creadores" className={itemClass}>
                <LayoutDashboard className="size-4 text-fuchsia-300" />
                Mi panel
              </Link>
            </DropdownMenu.Item>
          )}

          <DropdownMenu.Item asChild>
            <Link href="/events" className={itemClass}>
              <Compass className="size-4 text-fuchsia-300" />
              Ver eventos
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-1 h-px bg-white/10" />

          <form action={logout}>
            {/* preventDefault: el menú no se cierra antes de enviar el formulario */}
            <DropdownMenu.Item asChild onSelect={(e) => e.preventDefault()}>
              <button type="submit" className={`${itemClass} w-full text-left`}>
                <LogOut className="size-4 text-fuchsia-300" />
                Cerrar sesión
              </button>
            </DropdownMenu.Item>
          </form>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}