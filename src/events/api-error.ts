import { ProblemDetailsSchema } from "@/src/schemas/auth";

//por si el backend responde sin cuerpo (un 401 o 403 de la autorización llegan vacíos)
const DEFAULT_MESSAGES: Record<number, string> = {
  401: "Tu sesión expiró, inicia sesión de nuevo",
  403: "No tienes permiso para hacer esto",
  404: "El evento ya no existe",
  409: "El estado del evento no permite esta acción",
};

export async function readApiError(req: Response) {
  const json = await req.json().catch(() => null);

  //las validaciones del backend traen la lista de mensajes en "errors"
  const errors = (json as { errors?: unknown } | null)?.errors;
  if (Array.isArray(errors) && errors.length > 0) return errors.join(" ");

  const problem = ProblemDetailsSchema.safeParse(json);
  if (problem.success) return problem.data.detail;

  return DEFAULT_MESSAGES[req.status] ?? "Ocurrió un error inesperado.";
}