"use server";

import { ForgotPasswordSchema, MessageResponseSchema, ProblemDetailsSchema } from "@/src/schemas/auth";

type ActionStateType = {
  errors: string[];
  success: string;
};

export async function forgotPassword(prevState: ActionStateType, formData: FormData) {
  const result = ForgotPasswordSchema.safeParse({ email: formData.get("email") });

  if (!result.success) {
    return {
      errors: result.error.issues.map((issue) => issue.message),
      success: prevState.success,
    };
  }

  try {
    const req = await fetch(`${process.env.API_URL}/api/identity/users/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.data),
    });

    const json = await req.json().catch(() => null);

    if (!req.ok) {
      const problem = ProblemDetailsSchema.safeParse(json);
      return {
        errors: [problem.success ? problem.data.detail : "Ocurrió un error inesperado."],
        success: "",
      };
    }

    // El backend responde lo mismo exista o no el correo.
    const response = MessageResponseSchema.safeParse(json);

    return {
      errors: [],
      success: response.success
        ? response.data.message
        : "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.",
    };
  } catch {
    return {
      errors: ["No se pudo conectar con el servidor. Inténtalo de nuevo."],
      success: "",
    };
  }
}
