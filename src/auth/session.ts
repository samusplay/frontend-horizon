// Nombre de la cookie de sesión, compartido entre la capa de sesión
// (`src/auth/token.ts`) y el proxy de rutas (`proxy.ts`).
// Es un módulo plano a propósito: no importa `next/headers` ni contiene
// `"use server"`, para poder reutilizarse fuera de componentes React.
export const COOKIE_NAME = "horizon_token";
