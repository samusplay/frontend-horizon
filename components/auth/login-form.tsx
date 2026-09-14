// components/auth/login-form.tsx
"use client"

import { login } from "@/actions/login-action"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { LoginSchema } from "@/src/schemas/auth"
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"
import { AuthCard } from "./auth-card"

export default function LoginForm() {
  const [state, dispatch, pending] = useActionState(login, {
    errors: [],
    success: ''
  })

  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})

  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
    }
  }, [state.success]);

  function validateField(name: "email" | "password", value: string) {
    const shape = LoginSchema.shape[name];
    const result = shape.safeParse(value);
    setFieldErrors((prev) => ({
      ...prev,
      [name]: result.success ? undefined : result.error.issues[0].message,
    }));
  }

  return (
    <AuthCard title="Iniciar sesión" description="Entra a tu cuenta de Horizon">
      <form action={dispatch} noValidate className="space-y-3.5">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-white/80">Correo</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="tu@correo.com"
            aria-invalid={!!fieldErrors.email}
            onBlur={(e) => validateField("email", e.target.value)}
            onChange={() => fieldErrors.email && setFieldErrors((p) => ({ ...p, email: undefined }))}
            className="h-11 bg-white/5 border-white/10 focus-visible:ring-fuchsia-400/50 focus-visible:border-fuchsia-400/50 text-base"
          />
          {fieldErrors.email && <p className="text-xs text-red-400">{fieldErrors.email}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium text-white/80">Contraseña</Label>
          <Input
            id="password"
            name="password"
            type="password"
            aria-invalid={!!fieldErrors.password}
            onBlur={(e) => validateField("password", e.target.value)}
            onChange={() => fieldErrors.password && setFieldErrors((p) => ({ ...p, password: undefined }))}
            className="h-11 bg-white/5 border-white/10 focus-visible:ring-fuchsia-400/50 focus-visible:border-fuchsia-400/50 text-base"
          />
          {fieldErrors.password && <p className="text-xs text-red-400">{fieldErrors.password}</p>}
        </div>

        <Alert variant="error" show={state.errors.length > 0}>
          {state.errors.join(" ")}
        </Alert>

        <Button
          type="submit"
          disabled={pending}
          className="w-full h-11 text-base bg-white text-black hover:bg-white/90"
        >
          {pending ? "Entrando..." : "Iniciar sesión"}
        </Button>
      </form>
    </AuthCard>
  );
}