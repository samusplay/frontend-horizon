"use server";

import { getToken } from "@/src/auth/token";
import { ProblemDetailsSchema } from "@/src/schemas/auth";
import {
  CreateEventSchema,
  CreateEventSuccessSchema,
  type CreateEventState,
} from "@/src/schemas/events";
import type { ZodError } from "zod";

//deja solo el primer mensaje de cada campo
function toFieldErrors(error: ZodError) {
  const fieldErrors: CreateEventState["fieldErrors"] = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !(field in fieldErrors)) {
      fieldErrors[field as keyof CreateEventState["fieldErrors"]] = issue.message;
    }
  }

  return fieldErrors;
}

export async function createEvent(
  _prevState: CreateEventState,
  formData: FormData
): Promise<CreateEventState> {
  const eventData = {
    title: formData.get("title"),
    description: formData.get("description"),
    startsAt: formData.get("startsAt"),
    imageUrl: formData.get("imageUrl"),
  };

  const result = CreateEventSchema.safeParse(eventData);

  if (!result.success) {
    return { errors: [], fieldErrors: toFieldErrors(result.error), success: "", eventId: "" };
  }

  const token = await getToken();

  if (!token) {
    return { errors: ["Debes iniciar sesión"], fieldErrors: {}, success: "", eventId: "" };
  }

  //los campos vacíos no se mandan, así en la base queda null y no ""
  const body = {
    title: result.data.title,
    description: result.data.description || undefined,
    startsAt: result.data.startsAt,
    imageUrl: result.data.imageUrl || undefined,
  };

  const url = `${process.env.API_URL}/api/events`;

  const req = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  //401 y 403 vienen sin cuerpo, no se puede hacer req.json()
  if (req.status === 401) {
    return { errors: ["Tu sesión expiró, inicia sesión de nuevo"], fieldErrors: {}, success: "", eventId: "" };
  }

  if (req.status === 403) {
    return { errors: ["Solo los creadores pueden crear eventos"], fieldErrors: {}, success: "", eventId: "" };
  }

  const json = await req.json().catch(() => null);

  if (!req.ok) {
    const problem = ProblemDetailsSchema.safeParse(json);
    const message = problem.success ? problem.data.detail : "Ocurrió un error inesperado.";
    return { errors: [message], fieldErrors: {}, success: "", eventId: "" };
  }

  const response = CreateEventSuccessSchema.parse(json);

  return { errors: [], fieldErrors: {}, success: "Evento creado correctamente.", eventId: response.id };
}