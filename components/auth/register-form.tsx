"use client"

import { register } from "@/actions/create-account-action"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { RegisterSchema } from "@/src/schemas/auth"
import { Eye, Video } from "lucide-react"
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"
import { AuthCard } from "./auth-card"


export default function RegisterForm() {
  const [state, dispatch, pending] = useActionState(register, {
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
    const shape = RegisterSchema.shape[name];
    const result = shape.safeParse(value);
    setFieldErrors((prev) => ({
      ...prev,
      [name]: result.success ? undefined : result.error.issues[0].message,
    }));
  }

  return (
    <AuthCard title="Crear cuenta" description="Únete como espectador o creador">
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

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-white/80">Tipo de cuenta</Label>
          <RadioGroup name="role" defaultValue="Espectador" className="grid grid-cols-2 gap-3">
            <RoleOption value="Espectador" icon={Eye} label="Espectador" description="Mira y chatea" />
            <RoleOption value="Creador" icon={Video} label="Creador" description="Transmite eventos" />
          </RadioGroup>
        </div>

        <Alert variant="error" show={state.errors.length > 0}>
          {state.errors.join(" ")}
        </Alert>

        <Button
          type="submit"
          disabled={pending}
          className="w-full h-11 text-base bg-white text-black hover:bg-white/90"
        >
          {pending ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>
    </AuthCard>
  );
}

function RoleOption({
  value,
  icon: Icon,
  label,
  description,
}: {
  value: string;
  icon: typeof Eye;
  label: string;
  description: string;
}) {
  const id = `role-${value.toLowerCase()}`;

  return (
    <div>
      <RadioGroupItem value={value} id={id} className="peer sr-only" />
      <Label
        htmlFor={id}
        className={cn(
          "flex items-center gap-3 rounded-xl border-2 border-white/10 bg-white/5 px-4 py-2.5 cursor-pointer transition-all",
          "hover:bg-white/10 hover:border-white/20",
          "peer-data-[state=checked]:border-fuchsia-400/60 peer-data-[state=checked]:bg-fuchsia-500/10"
        )}
      >
        <Icon className="w-5 h-5 shrink-0" />
        <div className="flex flex-col text-left">
          <span className="font-semibold text-sm">{label}</span>
          <span className="text-xs text-white/50">{description}</span>
        </div>
      </Label>
    </div>
  );
}