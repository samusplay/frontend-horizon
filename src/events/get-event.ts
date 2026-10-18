import { EventDetailSchema } from "@/src/schemas/events";

//es público, no necesita token. Devuelve null si el evento no existe
//con esta funccion le hacemos Get a los eventos disponibles para los usuarios
export async function getEvent(id: string) {
  const req = await fetch(`${process.env.API_URL}/api/events/${id}`, { cache: "no-store" });

  if (req.status === 404) return null;
  if (!req.ok) throw new Error("No se pudo cargar el evento");

  return EventDetailSchema.parse(await req.json());
}