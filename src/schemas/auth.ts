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