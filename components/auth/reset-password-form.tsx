"use client";

import { resetPassword } from "@/actions/reset-password-action";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResetPasswordSchema } from "@/src/schemas/auth";
import { useActionState, useState } from "react";
import { AuthCard } from "./auth-card";

type FieldName = "password" | "confirmPassword";

export default function ResetPasswordForm({ token }: { token: string }) {
  const [state, dispatch, pending] = useActionState(resetPassword, {
    errors: [],
    success: "",
  });

  const [values, setValues] = useState({ password: "", confirmPassword: "" });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldName, string>>>({});

  function validateField(name: FieldName, next: typeof values) {
    const result = ResetPasswordSchema.safeParse(next);

    const issue = result.success
      ? undefined
      : result.error.issues.find((issue) => issue.path[0] === name);

    setFieldErrors((prev) => ({ ...prev, [name]: issue?.message }));
  }

  function updateValue(name: FieldName, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  return (
    <AuthCard
      title="Nueva contraseña"
      description="Elige una contraseña segura para tu cuenta"
    >
      <form action={dispatch} noValidate className="space-y-3.5">
        <input type="hidden" name="token" value={token} />

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium text-white/80">
            Contraseña
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={values.password}
            aria-invalid={!!fieldErrors.password}
            onBlur={() => validateField("password", values)}
            onChange={(e) => updateValue("password", e.target.value)}
            className="h-11 bg-white/5 border-white/10 focus-visible:ring-fuchsia-400/50 focus-visible:border-fuchsia-400/50 text-base"
          />
          {fieldErrors.password && (
            <p className="text-xs text-red-400">{fieldErrors.password}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-white/80">
            Confirmar contraseña
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            aria-invalid={!!fieldErrors.confirmPassword}
            onBlur={() => validateField("confirmPassword", values)}
            onChange={(e) => updateValue("confirmPassword", e.target.value)}
            className="h-11 bg-white/5 border-white/10 focus-visible:ring-fuchsia-400/50 focus-visible:border-fuchsia-400/50 text-base"
          />
          {fieldErrors.confirmPassword && (
            <p className="text-xs text-red-400">{fieldErrors.confirmPassword}</p>
          )}
        </div>

        <Alert variant="error" show={state.errors.length > 0}>
          {state.errors.join(" ")}
        </Alert>

        <Button
          type="submit"
          disabled={pending}
          className="w-full h-11 text-base bg-white text-black hover:bg-white/90"
        >
          {pending ? "Guardando..." : "Cambiar contraseña"}
        </Button>
      </form>
    </AuthCard>
  );
}
