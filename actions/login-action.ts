// actions/login-action.ts
"use server";

import { setToken } from "@/src/auth/token";
import { LoginSchema, LoginSuccessSchema, ProblemDetailsSchema } from "@/src/schemas/auth";



type ActionStateType = {
  errors: string[];
  success: string;
};

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

  //Esperamos a la funcion del Token
  await setToken(response.token);

  return { errors: [], success: "Sesión iniciada correctamente." };
}