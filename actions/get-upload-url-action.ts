"use server";

import { getToken } from "@/src/auth/token";
import { ProblemDetailsSchema } from "@/src/schemas/auth";
import { UploadUrlSchema, UploadUrlSuccessSchema } from "@/src/schemas/events";

export async function getUploadUrl(contentType: string) {
  const result = UploadUrlSchema.safeParse({ contentType });

  if (!result.success) {
    const errors = result.error.issues.map((issue) => issue.message);
    return { errors, data: null };
  }

  //el token viene de la cookie
  const token = await getToken();

  if (!token) {
    return { errors: ["Debes iniciar sesión"], data: null };
  }

  const url = `${process.env.API_URL}/api/events/image-upload-url`;

  const req = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(result.data),
  });

  //401 y 403 vienen sin cuerpo, no se puede hacer req.json()
  if (req.status === 401) {
    return { errors: ["Tu sesión expiró, inicia sesión de nuevo"], data: null };
  }

  if (req.status === 403) {
    return { errors: ["Solo los creadores pueden subir portadas"], data: null };
  }

  const json = await req.json().catch(() => null);

  if (!req.ok) {
    const problem = ProblemDetailsSchema.safeParse(json);
    const message = problem.success ? problem.data.detail : "Ocurrió un error inesperado.";
    return { errors: [message], data: null };
  }

  const response = UploadUrlSuccessSchema.parse(json);

  return { errors: [], data: response };
}