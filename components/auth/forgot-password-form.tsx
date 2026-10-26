"use client";

import { forgotPassword } from "@/actions/forgot-password-action";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ForgotPasswordSchema } from "@/src/schemas/auth";
import { useActionState, useState } from "react";
import { AuthCard } from "./auth-card";

export default function ForgotPasswordForm() {
  const [state, dispatch, pending] = useActionState(forgotPassword, {
    errors: [],
    success: "",
  });

  const [fieldError, setFieldError] = useState<string>();

  function validateField(value: string) {
    const result = ForgotPasswordSchema.shape.email.safeParse(value);
    setFieldError(result.success ? undefined : result.error.issues[0].message);
  }

  return (
    <AuthCard
      title="Recuperar contraseña"
      description="Te enviaremos un enlace para crear una nueva"
    >
      <form action={dispatch} noValidate className="space-y-3.5">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-white/80">
            Correo
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="tu@correo.com"
            aria-invalid={!!fieldError}
            onBlur={(e) => validateField(e.target.value)}
            onChange={() => fieldError && setFieldError(undefined)}
            className="h-11 bg-white/5 border-white/10 focus-visible:ring-fuchsia-400/50 focus-visible:border-fuchsia-400/50 text-base"
          />
          {fieldError && <p className="text-xs text-red-400">{fieldError}</p>}
        </div>

        <Alert variant="error" show={state.errors.length > 0}>
          {state.errors.join(" ")}
        </Alert>

        <Alert variant="success" show={state.success !== ""}>
          {state.success}
        </Alert>

        <Button
          type="submit"
          disabled={pending}
          className="w-full h-11 text-base bg-white text-black hover:bg-white/90"
        >
          {pending ? "Enviando..." : "Enviar enlace"}
        </Button>
      </form>
    </AuthCard>
  );
}
