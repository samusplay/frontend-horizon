"use client";

import "./globals.css";

export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col items-center justify-center gap-5 bg-black px-6 text-center text-white">
        <h1 className="text-2xl font-bold">Algo salió mal</h1>
        <p className="max-w-md text-white/60">Horizon tuvo un problema inesperado. Intenta de nuevo</p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="rounded-md bg-white px-5 py-2.5 text-sm font-medium text-black"
        >
          Reintentar
        </button>
      </body>
    </html>
  );
}