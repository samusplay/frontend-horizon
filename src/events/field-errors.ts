import type { CreateEventState } from "@/src/schemas/events";
import type { ZodError } from "zod";

//deja solo el primer mensaje de cada campo
export function toFieldErrors(error: ZodError) {
  const fieldErrors: CreateEventState["fieldErrors"] = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !(field in fieldErrors)) {
      fieldErrors[field as keyof CreateEventState["fieldErrors"]] = issue.message;
    }
  }

  return fieldErrors;
}