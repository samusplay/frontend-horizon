import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-b from-[#0d0221] via-[#0a0118] to-black px-6 pt-16 text-center text-white">
      <p className="bg-gradient-to-r from-fuchsia-300 to-violet-400 bg-clip-text text-8xl font-bold text-transparent md:text-9xl">
        404
      </p>
      <div>
        <h1 className="text-2xl font-bold">No encontramos esta página</h1>
        <p className="mt-2 max-w-md text-white/60">El enlace puede estar roto o el evento ya no existe</p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/events"
          className="rounded-md bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
        >
          Ver transmisiones en vivo
        </Link>
        <Link
          href="/"
          className="rounded-md border border-white/20 px-5 py-2.5 text-sm text-white transition hover:bg-white/10"
        >
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}