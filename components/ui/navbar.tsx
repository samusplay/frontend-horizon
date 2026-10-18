// components/ui/navbar.tsx
"use client";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/ui/user-menu";
import type { Session } from "@/src/auth/session";
import { Radio } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "En vivo", href: "/events" },
  { label: "Programados", href: "/programados" },
  { label: "Creadores", href: "/creadores" },
];

export function Navbar({ session }: { session: Session | null }) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > 100);
    setScrolled(latest > 20);
  });

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  //dentro del panel del creador el navbar no muestra los enlaces del sitio
  const inPanel = pathname.startsWith("/creadores");

  return (
    <motion.header
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-black/70 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div
        className={`mx-auto h-16 flex items-center justify-between ${
          inPanel ? "max-w-[1700px] px-4 sm:px-6 lg:px-8" : "max-w-6xl px-6"
        }`}
      >
        <Link href="/" className="font-bold text-lg tracking-tight text-white">
          HORIZON
        </Link>

        {inPanel ? (
          <span className="hidden md:flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-3.5 py-1.5 text-sm font-medium text-fuchsia-100">
            <Radio className="size-4 text-fuchsia-300" />
            Panel del creador
          </span>
        ) : (
          <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.label} label={item.label} href={item.href} active={pathname === item.href} />
            ))}

            {/* todavía no existe: se muestra apagado */}
            <span
              aria-disabled="true"
              title="Disponible pronto"
              className="flex cursor-not-allowed items-center gap-2 text-white/35"
            >
              Salas virtuales
              <span className="rounded-full bg-fuchsia-500/15 px-2 py-0.5 text-[10px] font-semibold text-fuchsia-200">
                Pronto
              </span>
            </span>
          </nav>
        )}

        <div className="flex items-center gap-3">
          {session ? (
            <>
              {inPanel && (
                <Link href="/events">
                  <Button variant="ghost" className="hidden text-white hover:bg-white/10 sm:inline-flex">
                    Ver eventos
                  </Button>
                </Link>
              )}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
              >
                <UserMenu email={session.email} role={session.role} />
              </motion.div>
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
                  <Button className="bg-white text-black hover:bg-white/90">
                    Registrarse
                  </Button>
                </motion.div>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}

function NavLink({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`relative group ${active ? "text-white" : ""}`}
    >
      {label}
      <motion.span
        className={`absolute -bottom-1 left-0 h-px w-full bg-white origin-left transition-transform duration-300 ${
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </Link>
  );
}