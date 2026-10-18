const pulse = "animate-pulse rounded-md bg-white/10";
const shell = "min-h-screen bg-gradient-to-b from-[#0d0221] via-[#0a0118] to-black px-6 pt-28 pb-16 text-white";

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
      <div className="aspect-video animate-pulse bg-white/10" />
      <div className="space-y-2 p-4">
        <div className={`${pulse} h-4 w-3/4`} />
        <div className={`${pulse} h-3 w-1/2`} />
      </div>
    </div>
  );
}

//catálogo (en vivo y programados)
export function PageSkeleton() {
  return (
    <main role="status" aria-busy="true" className={shell}>
      <div className="mx-auto max-w-6xl">
        <div className={`${pulse} h-12 w-72 max-w-full`} />
        <div className={`${pulse} mt-4 h-4 w-96 max-w-full`} />
        <div className="mt-10 grid gap-6 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
          {Array.from({ length: 3 }, (_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
      <span className="sr-only">Cargando...</span>
    </main>
  );
}

//dentro del panel del creador: el layout ya pone el fondo y el menú
export function PanelSkeleton() {
  return (
    <div role="status" aria-busy="true" className="space-y-8">
      <div className="space-y-3">
        <div className={`${pulse} h-10 w-56`} />
        <div className={`${pulse} h-4 w-40`} />
      </div>
      <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
        {Array.from({ length: 4 }, (_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <span className="sr-only">Cargando...</span>
    </div>
  );
}

//sala del espectador
export function RoomSkeleton() {
  return (
    <main role="status" aria-busy="true" className={shell}>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className={`${pulse} h-4 w-36`} />
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <div className="aspect-video animate-pulse rounded-xl bg-white/10" />
            <div className={`${pulse} h-8 w-2/3`} />
            <div className={`${pulse} h-4 w-1/2`} />
          </div>
          <div className="h-[520px] animate-pulse rounded-2xl bg-white/5 lg:h-[600px]" />
        </div>
      </div>
      <span className="sr-only">Cargando...</span>
    </main>
  );
}