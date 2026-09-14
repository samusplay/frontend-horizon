"use client"

import { register } from "@/actions/create-account-action"
import { Label } from "radix-ui/label"
import { RadioGroup, RadioGroupItem } from "radix-ui/radio-group"
import { useActionState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { AuthCard } from "./auth-card"



export default function RegisterForm() {
    //utilizar useactionstate
    const[state,dispatch,pending]=useActionState(register,{
        errors:[],
        success:''
    })


    return (
    <AuthCard title="Crear cuenta" description="Únete como espectador o creador">
      <form action={dispatch} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Correo</Label>
          <Input id="email" name="email" type="email" required placeholder="tu@correo.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" name="password" type="password" required minLength={6} />
        </div>

        <div className="space-y-2">
          <Label>Tipo de cuenta</Label>
          <RadioGroup name="role" defaultValue="Espectador" className="flex gap-4">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Espectador" id="role-espectador" />
              <Label htmlFor="role-espectador" className="font-normal">Espectador</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Creador" id="role-creador" />
              <Label htmlFor="role-creador" className="font-normal">Creador</Label>
            </div>
          </RadioGroup>
        </div>

        {state.errors && <p className="text-sm text-red-400">{state.errors}</p>}

        <Button type="submit" disabled={pending} className="w-full bg-white text-black hover:bg-white/90">
          {pending ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>
    </AuthCard>
  );
        

}