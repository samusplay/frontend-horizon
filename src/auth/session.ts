import { redirect } from "next/navigation";
import { getToken } from "./token";

//Identity escribe el rol con este nombre largo
const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

export type Session = { id: string; email: string; role: string };

function decodePayload(token: string) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
  } catch {
    return null;
  }
}

//datos del usuario a partir de un token (no valida la firma, eso lo hace el backend)
export function readSession(token: string): Session | null {
  const payload = decodePayload(token);
  if (!payload) return null;

  return { id: payload.sub, email: payload.email, role: payload[ROLE_CLAIM] };
}

//lee la cookie y devuelve los datos del usuario, o null si no hay sesión
export async function getSession(): Promise<Session | null> {
  const token = await getToken();
  if (!token) return null;

  return readSession(token);
}

//para las páginas del panel: sin sesión va a login, sin ser creador va al catálogo
export async function requireCreator() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "Creador") redirect("/events");
  return session;
}