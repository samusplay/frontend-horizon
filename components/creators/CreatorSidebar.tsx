"use client";

import { BarChart3, LayoutGrid, PanelLeftClose, PanelLeftOpen, PlusCircle } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const COOKIE = "creator_sidebar";

const ITEMS = [
  {
    href: "/creadores",
    label: "Mis eventos",
    icon: LayoutGrid,
    //la pantalla de transmisión y la de editar también pertenecen a "Mis eventos"
    isActive: (path: string) =>
      path === "/creadores" ||
      path.startsWith("/creadores/transmision") ||
      /^\/creadores\/[^/]+\/editar/.test(path),
  },
  {
    href: "/creadores/nuevo",
    label: "Crear evento",
    icon: PlusCircle,
    isActive: (path: string) => path.startsWith("/creadores/nuevo"),
  },
];

//el texto se desvanece cuando el menú está contraído (solo en pantallas grandes)
function labelClass(collapsed: boolean) {
  return `overflow-hidden whitespace-nowrap transition-all duration-200 motion-reduce:transition-none ${
    collapsed ? "lg:max-w-0 lg:opacity-0" : "lg:max-w-44 lg:opacity-100"
  }`;
}

//etiqueta flotante: aparece solo al pasar el mouse sobre el icono
function Tooltip({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute left-full z-50 ml-3 hidden rounded-md border border-white/10 bg-[#120629] px-2.5 py-1.5 text-xs whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 lg:block">
      {children}
    </span>
  );
}

const focusRing = "outline-none focus-visible:ring-[3px] focus-visible:ring-fuchsia-400/50";

export function CreatorSidebar({ defaultCollapsed = false }: { defaultCollapsed?: boolean }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  function toggle() {
    const next = !collapsed;
    setCollapsed(next);
    //se recuerda en una cookie para que el servidor pinte el menú ya contraído, sin parpadeo
    document.cookie = `${COOKIE}=${next ? "collapsed" : "expanded"}; path=/; max-age=31536000; samesite=lax`;
  }

  return (
    <nav
      aria-label="Panel del creador"
      className={`flex shrink-0 gap-2 overflow-x-auto pb-1 transition-[width] duration-300 ease-in-out motion-reduce:transition-none lg:sticky lg:top-28 lg:z-20 lg:flex-col lg:self-start lg:overflow-visible lg:pb-0 ${
        collapsed ? "lg:w-[72px]" : "lg:w-60"
      }`}
    >
      {ITEMS.map((item) => {
        const active = item.isActive(pathname);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors lg:px-[26px] ${focusRing} ${
              active ? "text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            {/* el resaltado morado se desliza de una opción a otra */}
            {active && (
              <motion.span
                layoutId="creator-nav-active"
                className="absolute inset-0 rounded-xl border border-fuchsia-400/40 bg-fuchsia-500/15 shadow-[0_0_24px_rgba(217,70,239,0.2)]"
                transition={reduceMotion ? { duration: 0 } : { type: "spring", duration: 0.4, bounce: 0.2 }}
              />
            )}
            <Icon className="relative size-5 shrink-0 text-fuchsia-300" />
            <span className={`relative ${labelClass(collapsed)}`}>{item.label}</span>
            {collapsed && <Tooltip>{item.label}</Tooltip>}
          </Link>
        );
      })}

      {/* Estadísticas todavía no existe: se muestra apagada */}
      <div
        aria-disabled="true"
        className="group relative flex cursor-not-allowed items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium whitespace-nowrap text-white/30 lg:px-[26px]"
      >
        <BarChart3 className="size-5 shrink-0" />
        <span className={`flex items-center gap-2 ${labelClass(collapsed)}`}>
          Estadísticas
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/50">Pronto</span>
        </span>
        {collapsed && <Tooltip>Estadísticas · Pronto</Tooltip>}
      </div>

      {/* en pantallas pequeñas el menú es una fila y no se contrae */}
      <div aria-hidden className="mx-2 my-1 hidden h-px bg-white/10 lg:block" />
      <button
        type="button"
        onClick={(e) => {
          toggle();
          //con mouse se suelta el foco para que no quede el aro pegado; con teclado (detail 0) se conserva
          if (e.detail > 0) e.currentTarget.blur();
        }}
        aria-expanded={!collapsed}
        aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
        className={`group relative hidden h-11 items-center gap-3 rounded-xl px-[26px] text-sm text-white/50 transition-colors hover:bg-white/5 hover:text-white lg:flex ${focusRing}`}
      >
        {collapsed ? (
          <PanelLeftOpen className="size-5 shrink-0 text-fuchsia-300" />
        ) : (
          <PanelLeftClose className="size-5 shrink-0 text-fuchsia-300" />
        )}
        <span className={labelClass(collapsed)}>Contraer menú</span>
        {collapsed && <Tooltip>Expandir menú</Tooltip>}
      </button>
    </nav>
  );
}