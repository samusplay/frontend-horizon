"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "./auth-card";




export function LoginForm() {
 // const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <AuthCard title="Iniciar sesión" description="Entra a tu cuenta de Horizon">
      <form action="" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Correo</Label>
          <Input id="email" name="email" type="email" required placeholder="tu@correo.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" name="password" type="password" required />
        </div>

       

       
      </form>
    </AuthCard>
  );
}