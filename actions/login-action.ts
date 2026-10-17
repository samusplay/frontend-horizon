// actions/login-action.ts
"use server";

import { setToken } from "@/src/auth/token";
import { LoginSchema, LoginSuccessSchema, ProblemDetailsSchema } from "@/src/schemas/auth";
import { redirect } from "next/navigation";

type ActionStateType = {
  errors: string[];
  success: string;
};

// Evita redirecciones abiertas: solo aceptamos rutas internas.
function safeRedirectTo(value: FormDataEntryValue | null) {
  if (typeof value === "string" && value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }
  return "/live";
}

export async function login(prevState: ActionStateType, formData: FormData) {
  const loginData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = LoginSchema.safeParse(loginData);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => issue.message);
    return { errors, success: prevState.success };
  }

  const url = `${process.env.API_URL}/api/identity/users/login`;

  const req = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result.data),
  });

  //esperamos el request
  const json = await req.json();

  if (!req.ok) {
    const problem = ProblemDetailsSchema.safeParse(json);
    const message = problem.success ? problem.data.detail : "Ocurrió un error inesperado.";
    return { errors: [message], success: "" };
  }

  const response = LoginSuccessSchema.parse(json);

  //Guardamos el token en una cookie httpOnly
  await setToken(response.token);

  //Y redirigimos al destino solicitado (o a /live).
  //`redirect` lanza una excepción interna, por eso va al final y sin try/catch.
  redirect(safeRedirectTo(formData.get("redirectTo")));
}
