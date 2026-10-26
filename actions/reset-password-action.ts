"use server";

import { ProblemDetailsSchema, ResetPasswordSchema } from "@/src/schemas/auth";
import { redirect } from "next/navigation";

type ActionStateType = {
  errors: string[];
  success: string;
};

export async function resetPassword(prevState: ActionStateType, formData: FormData) {
  const token = formData.get("token");

  const result = ResetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!result.success) {
    return {
      errors: result.error.issues.map((issue) => issue.message),
      success: prevState.success,
    };
  }

  if (typeof token !== "string" || token.trim() === "") {
    return { errors: ["El enlace de recuperación es inválido."], success: "" };
  }

  try {
    const req = await fetch(`${process.env.API_URL}/api/identity/users/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword: result.data.password }),
    });

    const json = await req.json().catch(() => null);

    if (!req.ok) {
      const problem = ProblemDetailsSchema.safeParse(json);
      return {
        errors: [problem.success ? problem.data.detail : "Ocurrió un error inesperado."],
        success: "",
      };
    }
  } catch {
    return {
      errors: ["No se pudo conectar con el servidor. Inténtalo de nuevo."],
      success: "",
    };
  }

  // `redirect` lanza una excepción interna: debe quedar fuera del try/catch.
  redirect("/login?reset=1");
}
