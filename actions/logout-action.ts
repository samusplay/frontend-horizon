"use server";

import { deleteToken } from "@/src/auth/token";
import { redirect } from "next/navigation";

// Cierra la sesión: borra la cookie y vuelve al inicio.
export async function logout() {
  await deleteToken();
  redirect("/");
}
