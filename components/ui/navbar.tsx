// components/ui/navbar.tsx
"use client";

import { GlobalSearch } from "@/components/streams/global-search";
import { NotificationsMenu } from "@/components/streams/notifications-menu";
import { UserMenu } from "@/components/streams/user-menu";
import { Button } from "@/components/ui/button";
import type { Notification } from "@/src/streams/types";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const PUBLIC_NAV_ITEMS = [
  { label: "En vivo", href: "/live" },
  { label: "Explorar", href: "/browse" },
  { label: "Eventos", href: "/events" },
];

const CREATOR_NAV_ITEM = { label: "Creador", href: "/dashboard" };

// Rutas que usan el layout de autenticación (sin navbar).
const AUTH_PATHS = ["/login", "/register", "/forgot-password", "/reset-password"];

export function Navbar({
  isAuthenticated = false,
  notifications = [],
}: {
  isAuthenticated?: boolean;
  notifications?: Notification[];
}) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > 100);
    setScrolled(latest > 20);
  });

  if (AUTH_PATHS.includes(pathname)) {
    return null;
  }

  const navItems = isAuthenticated
    ? [...PUBLIC_NAV_ITEMS, CREATOR_NAV_ITEM]
    : PUBLIC_NAV_ITEMS;

  return (
    <motion.header
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-black/70 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center gap-4">
        <Link href="/" className="shrink-0 font-bold text-lg tracking-tight">
          HORIZON
        </Link>

        <nav className="hidden lg:flex shrink-0 items-center gap-6 text-sm text-white/70">
          {navItems.map((item) => (
            <NavLink key={item.label} label={item.label} href={item.href} />
          ))}
        </nav>

        <div className="hidden flex-1 justify-center md:flex">
          <GlobalSearch />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          {isAuthenticated ? (
            <>
              <NotificationsMenu notifications={notifications} />
              <UserMenu />
            </>
          ) : (
            <>
              <Link href="/login">
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    Iniciar sesión
                  </Button>
                </motion.div>
              </Link>
              <Link href="/register">
                <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }}>
                  <Button className="bg-white text-black hover:bg-white/90">Registrarse</Button>
                </motion.div>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}

function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <Link href={href} className="relative group">
      {label}
      <motion.span className="absolute -bottom-1 left-0 h-px w-full bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </Link>
  );
}
