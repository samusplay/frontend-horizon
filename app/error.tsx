"use client";

import { CloudOff, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-gradient-to-b from-[#0d0221] via-[#0a0118] to-black px-6 pt-16 text-center text-white">
      <CloudOff className="size-14 text-fuchsia-300" />
      <div>
        <h1 className="text-2xl font-bold">Algo salió mal</h1>
        <p className="mt-2 max-w-md text-white/60">
          No pudimos cargar esta pantalla. Puede ser un problema temporal, intenta de nuevo
        </p>
        {/* en producción el mensaje real no llega al navegador; el código sirve para buscarlo en el log del servidor */}
        {error.digest && <p className="mt-3 text-xs text-white/30">Código: {error.digest}</p>}
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
        >
          <RefreshCw className="size-4" />
          Reintentar
        </button>
        <Link
          href="/events"
          className="rounded-md border border-white/20 px-5 py-2.5 text-sm text-white transition hover:bg-white/10"
        >
          Ir a eventos
        </Link>
      </div>
    </main>
  );
}