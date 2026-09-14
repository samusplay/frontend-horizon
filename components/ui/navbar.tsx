"use client";
import { Button } from "@/components/ui/button";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Navbar() {
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

  return (
    <motion.header
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-black/70 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight">
          HORIZON
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
          {["Eventos", "Creadores", "Cómo funciona"].map((item) => (
            <NavLink key={item} label={item} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
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
        </div>
      </div>
    </motion.header>
  );
}

function NavLink({ label }: { label: string }) {
  return (
    <a href="#" className="relative group">
      {label}
      <motion.span className="absolute -bottom-1 left-0 h-px w-full bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </a>
  );
}