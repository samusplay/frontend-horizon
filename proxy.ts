import { COOKIE_NAME } from "@/src/auth/session";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// En Next.js 16 el archivo `middleware.ts` se renombró a `proxy.ts`.
// Se ejecuta antes de renderizar cada ruta protegida por el `matcher`.
//
// Nota: el proxy no puede usar `next/headers`; lee la sesión directamente
// desde las cookies de la petición.

// Rutas que requieren sesión iniciada.
const PROTECTED_PREFIXES = ["/dashboard"];

// Rutas de autenticación: si ya hay sesión, no tiene sentido visitarlas.
const AUTH_ROUTES = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(COOKIE_NAME)?.value);

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtected && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (AUTH_ROUTES.includes(pathname) && hasSession) {
    return NextResponse.redirect(new URL("/live", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
