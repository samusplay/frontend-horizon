// app/(auth)/register/page.tsx
"use client";
import RegisterForm from "@/components/auth/register-form";
import { motion } from "motion/react";

export default function RegisterPage() {
  return (
    <div className="w-full max-w-lg">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6 flex justify-center"
      >
        <span className="text-xs uppercase tracking-widest text-white/40">
          Únete a Horizon
        </span>
      </motion.div>

      <RegisterForm />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6 text-center text-sm text-white/50"
      >
        ¿Ya tienes cuenta?{" "}
        <a href="/login" className="text-white underline underline-offset-4 hover:text-fuchsia-300 transition-colors">
          Inicia sesión
        </a>
      </motion.p>
    </div>
  );
}