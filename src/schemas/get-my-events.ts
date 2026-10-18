import { getToken } from "@/src/auth/token";
import { MyEventsSchema } from "@/src/schemas/events";

//lista los eventos del creador con sesión. Devuelve null si el token no sirve (venció o no es creador)
export async function getMyEvents() {
  const token = await getToken();
  if (!token) return null;

  //50 es el máximo que acepta el backend por página
  const req = await fetch(`${process.env.API_URL}/api/events/mine?pageSize=50`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (req.status === 401 || req.status === 403) return null;
  if (!req.ok) throw new Error("No se pudieron cargar tus eventos");

  return MyEventsSchema.parse(await req.json());
}