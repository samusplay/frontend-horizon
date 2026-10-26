import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-lg">
      <div className="mb-6 flex justify-center">
        <span className="text-xs uppercase tracking-widest text-white/40">
          Recupera tu acceso
        </span>
      </div>

      <ForgotPasswordForm />

      <p className="mt-6 text-center text-sm text-white/50">
        ¿Recordaste tu contraseña?{" "}
        <Link
          href="/login"
          className="text-white underline underline-offset-4 hover:text-fuchsia-300 transition-colors"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
