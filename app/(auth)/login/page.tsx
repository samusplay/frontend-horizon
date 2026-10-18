"use client";
import LoginForm from "@/components/auth/login-form";
import { motion } from "motion/react";

export default function LoginPage() {
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

      <LoginForm />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6 text-center text-sm text-white/50"
      >
        ¿No tienes cuenta?{" "}
        <a href="/register" className="text-white underline underline-offset-4 hover:text-fuchsia-300 transition-colors">
          Regístrate
        </a>
      </motion.p>
    </div>
  );
}