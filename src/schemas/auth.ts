import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.enum(["Espectador", "Creador"], { message: "Selecciona un tipo de cuenta" }),
});

export const ProblemDetailsSchema = z.object({
  title: z.string(),
  status: z.number(),
  detail: z.string(),
});

export const RegisterResponseSchema = z.object({
  id: z.string(),
});

export const RegisterSuccessSchema = z.object({
  message: z.string(),
  id: z.string(),
});
//esquema de Login para inicair sesion
export const LoginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

//validar que venga el string en login
export const LoginSuccessSchema = z.object({
  token: z.string(),
});