// src/auth/token.ts
"use server";
import { cookies } from "next/headers";

//Generamos una cookie
const COOKIE_NAME = "horizon_token";

export async function setToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hora, igual al tiempo de expiración que definiste en el backend
  });
}

export async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

export async function deleteToken() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}