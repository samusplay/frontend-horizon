import { AuthCard } from "@/components/auth/auth-card";
import ResetPasswordForm from "@/components/auth/reset-password-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="w-full max-w-lg">
        <AuthCard
          title="Enlace inválido"
          description="Este enlace no es válido o ya expiró"
        >
          <p className="mb-4 text-sm text-white/70">
            Solicita un enlace nuevo para restablecer tu contraseña.
          </p>
          <Button
            asChild
            className="w-full h-11 text-base bg-white text-black hover:bg-white/90"
          >
            <Link href="/forgot-password">Solicitar otro enlace</Link>
          </Button>
        </AuthCard>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg">
      <ResetPasswordForm token={token} />

      <p className="mt-6 text-center text-sm text-white/50">
        <Link
          href="/login"
          className="text-white underline underline-offset-4 hover:text-fuchsia-300 transition-colors"
        >
          Volver a iniciar sesión
        </Link>
      </p>
    </div>
  );
}
