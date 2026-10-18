"use client";

import { finishEvent } from "@/actions/finish-event-action";
import { Alert } from "@/components/ui/alert";
import { Flag, Loader2, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

//el mismo diálogo se usa en la tarjeta (botón compacto) y en la pantalla de transmisión (botón grande)
const TRIGGER = {
  card: "col-span-2 flex h-9 items-center justify-center gap-2 rounded-md border border-red-400/30 text-sm text-red-300 transition outline-none hover:bg-red-500/10 focus-visible:ring-[3px] focus-visible:ring-red-400/40",
  page: "flex h-11 w-full items-center justify-center gap-2 rounded-md bg-red-600 text-sm font-medium text-white transition outline-none hover:bg-red-500 focus-visible:ring-[3px] focus-visible:ring-red-400/50",
} as const;

export function FinishEventDialog({
  eventId,
  eventTitle,
  variant = "card",
}: {
  eventId: string;
  eventTitle: string;
  variant?: keyof typeof TRIGGER;
}) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function handleOpenChange(next: boolean) {
    //mientras se finaliza no se puede cerrar, para no perder el resultado
    if (pending) return;

    setOpen(next);
    if (next) setError("");

    //si hubo un error (por ejemplo, el evento ya había terminado), al cerrar se vuelve a pedir el estado real
    if (!next && error) router.refresh();
  }

  function confirm() {
    startTransition(async () => {
      const result = await finishEvent(eventId);

      if (result.errors.length > 0) {
        setError(result.errors.join(" "));
        return;
      }

      //las pantallas ya se actualizaron solas: el action revalida
      toast.success(result.success);
      setOpen(false);
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button type="button" className={TRIGGER[variant]}>
          <Flag className="size-4" />
          Finalizar transmisión
        </button>
      </Dialog.Trigger>

      {/* AnimatePresence deja que el modal termine su animación de salida antes de desmontarse */}
      <AnimatePresence>
        {open && (
          <Dialog.Portal key="finish-event-modal" forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>

            {/* este contenedor centra el modal; así Motion puede mover la tarjeta sin pelear con el centrado */}
            <div className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center p-4">
              <Dialog.Content
                asChild
                forceMount
                //en una acción sin reverso el foco empieza en Cancelar
                onOpenAutoFocus={(e) => {
                  e.preventDefault();
                  cancelRef.current?.focus();
                }}
              >
                <motion.div
                  className="pointer-events-auto relative w-full max-w-md overflow-hidden rounded-3xl border border-red-400/20 bg-[#120629] p-8 text-center text-white shadow-2xl shadow-red-500/10 outline-none"
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 16 }}
                  animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8 }}
                  transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
                >
                  {/* resplandor rojo decorativo */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-24 left-1/2 size-56 -translate-x-1/2 rounded-full bg-red-500/20 blur-3xl"
                  />

                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Cerrar"
                      disabled={pending}
                      className="absolute top-4 right-4 rounded-md p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
                    >
                      <X className="size-5" />
                    </button>
                  </Dialog.Close>

                  <div className="relative">
                    <motion.div
                      initial={reduceMotion ? false : { scale: 0.5, rotate: -12 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", duration: 0.5, bounce: 0.5, delay: 0.1 }}
                      className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-500/15 ring-1 ring-red-400/40"
                    >
                      <Flag className="size-7 text-red-400" />
                    </motion.div>

                    <Dialog.Title className="mt-5 text-2xl font-bold">¿Finalizar la transmisión?</Dialog.Title>

                    <Dialog.Description className="mt-2 text-white/60">
                      Vas a dar por terminado <span className="font-semibold break-words text-white">«{eventTitle}»</span>
                    </Dialog.Description>

                    <ul className="mt-4 space-y-1.5 rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-left text-sm text-red-200">
                      <li>• Los espectadores verán que la transmisión terminó y el chat se cierra</li>
                      <li>• El evento no podrá volver a iniciarse</li>
                      <li>• Recuerda detener también la transmisión en OBS</li>
                    </ul>

                    <div className="mt-4 text-left">
                      <Alert variant="error" show={error !== ""}>
                        {error}
                      </Alert>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <button
                        ref={cancelRef}
                        type="button"
                        disabled={pending}
                        onClick={() => handleOpenChange(false)}
                        className="h-11 rounded-md border border-white/20 text-sm text-white transition outline-none hover:bg-white/10 focus-visible:ring-[3px] focus-visible:ring-fuchsia-400/50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={confirm}
                        className="flex h-11 items-center justify-center gap-2 rounded-md bg-red-600 text-sm font-medium text-white transition outline-none hover:bg-red-500 focus-visible:ring-[3px] focus-visible:ring-red-400/50 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {pending ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Finalizando...
                          </>
                        ) : (
                          "Sí, finalizar"
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}