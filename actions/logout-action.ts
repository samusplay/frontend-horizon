"use server";

import { deleteToken } from "@/src/auth/token";
import { redirect } from "next/navigation";

export async function logout() {
  await deleteToken();
  redirect("/login");
}