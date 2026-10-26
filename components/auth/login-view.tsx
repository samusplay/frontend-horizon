"use client";

import LoginForm from "@/components/auth/login-form";
import { CircleCheck } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export function LoginView({
  redirectTo,
  justRegistered = false,
  justReset = false,
}: {
  redirectTo?: string;
  justRegistered?: boolean;
  justReset?: boolean;
}) {
  return (
    <div className="w-full max-w-lg">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6 flex justify-center"
      >
        <span className="text-xs uppercase tracking-widest text-white/40">
          Bienvenido de vuelta
        </span>
      </motion.div>

      {(justRegistered || justReset) && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300"
        >
          <CircleCheck className="size-4 shrink-0" />
          {justReset
            ? "Contraseña actualizada. Inicia sesión con tu nueva contraseña."
            : "Cuenta creada correctamente. Inicia sesión para continuar."}
        </motion.div>
      )}

      <LoginForm redirectTo={redirectTo} />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6 text-center text-sm text-white/50"
      >
        ¿No tienes cuenta?{" "}
        <Link
          href="/register"
          className="text-white underline underline-offset-4 hover:text-fuchsia-300 transition-colors"
        >
          Regístrate
        </Link>
      </motion.p>
    </div>
  );
}
