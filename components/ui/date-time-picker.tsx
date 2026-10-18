"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, CheckCircle2, ChevronDown, ChevronUp, Clock, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Dialog } from "radix-ui";
import { useState } from "react";
import { es } from "react-day-picker/locale";

const DEFAULT_TIME = "18:00";
const MINUTE_STEP = 5; //cada clic en las flechas de minutos mueve 5 minutos

type Period = "AM" | "PM";

const pad = (n: number) => String(n).padStart(2, "0");

//Date -> "2026-10-20" en hora local
function toDateString(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

//"2026-10-20T18:00" -> { date, time }
function parseValue(value: string) {
  const [datePart, time = ""] = value.split("T");
  if (!datePart) return { date: undefined, time: "" };
  const [year, month, day] = datePart.split("-").map(Number);
  return { date: new Date(year, month - 1, day), time };
}

//formato de 24 horas <-> 12 horas
function to12h(hours24: number): { hour12: number; period: Period } {
  return { hour12: hours24 % 12 === 0 ? 12 : hours24 % 12, period: hours24 < 12 ? "AM" : "PM" };
}

function to24h(hour12: number, period: Period) {
  return (hour12 % 12) + (period === "PM" ? 12 : 0);
}

//si el día es hoy, una hora que ya pasó no sirve
function isPastTime(day: Date | undefined, time: string) {
  if (!day || !time) return false;
  const now = new Date();
  if (toDateString(day) !== toDateString(now)) return false;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes <= now.getHours() * 60 + now.getMinutes();
}

//6 p. m., o la próxima hora en punto si hoy ya pasaron las 6
function defaultTimeFor(day: Date) {
  if (!isPastTime(day, DEFAULT_TIME)) return DEFAULT_TIME;
  const next = new Date();
  next.setHours(next.getHours() + 1, 0, 0, 0);
  return `${pad(next.getHours())}:00`;
}

//una columna del reloj: flecha arriba, número grande, flecha abajo
function ClockSegment({
  label,
  display,
  valueNow,
  disabled,
  onUp,
  onDown,
}: {
  label: string;
  display: string;
  valueNow: number;
  disabled: boolean;
  onUp: () => void;
  onDown: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        type="button"
        aria-label={`Subir ${label}`}
        disabled={disabled}
        onClick={onUp}
        className="rounded-md p-2 text-fuchsia-300 transition hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <ChevronUp className="size-6" />
      </button>

      {/* con el foco, las flechas del teclado también ajustan el valor */}
      <div
        role="spinbutton"
        aria-label={label}
        aria-valuenow={valueNow}
        aria-valuetext={display}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "ArrowUp") {
            e.preventDefault();
            onUp();
          }
          if (e.key === "ArrowDown") {
            e.preventDefault();
            onDown();
          }
        }}
        className={`flex h-20 w-20 items-center justify-center rounded-xl bg-white/5 font-mono text-5xl font-semibold tabular-nums outline-none focus-visible:ring-[3px] focus-visible:ring-fuchsia-400/50 ${
          disabled ? "text-white/30" : "text-white drop-shadow-[0_0_14px_rgba(217,70,239,0.5)]"
        }`}
      >
        <motion.span
          key={display}
          initial={reduceMotion ? false : { opacity: 0.3, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          {display}
        </motion.span>
      </div>

      <button
        type="button"
        aria-label={`Bajar ${label}`}
        disabled={disabled}
        onClick={onDown}
        className="rounded-md p-2 text-fuchsia-300 transition hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <ChevronDown className="size-6" />
      </button>
    </div>
  );
}

//píldora morada del pie: confirma lo que el usuario eligió
function SelectionBadge({ summary }: { summary: string }) {
  const reduceMotion = useReducedMotion();

  if (!summary) {
    return <p className="text-base text-white/50">Aún no eliges fecha y hora</p>;
  }

  return (
    //key: al cambiar el resumen se vuelve a montar y la animación se repite
    <motion.div
      key={summary}
      initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", duration: 0.4, bounce: 0.35 }}
      className="relative inline-flex items-center gap-2.5 rounded-full border border-fuchsia-400/40 bg-fuchsia-500/15 py-2 pr-5 pl-3 text-fuchsia-100 shadow-[0_0_28px_rgba(217,70,239,0.25)]"
    >
      {/* aro que se expande una vez */}
      {!reduceMotion && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full border-2 border-fuchsia-400"
          initial={{ opacity: 0.7, scale: 1 }}
          animate={{ opacity: 0, scale: 1.18 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      )}

      <motion.span
        initial={reduceMotion ? false : { scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.6, delay: 0.05 }}
      >
        <CheckCircle2 className="size-5 text-fuchsia-300" />
      </motion.span>
      <span className="text-base font-medium first-letter:uppercase">{summary}</span>
    </motion.div>
  );
}

type Props = {
  id: string;
  value: string; // "2026-10-20T18:00" (hora local) o ""
  onChange: (value: string) => void;
  error?: string;
};

export function DateTimePicker({ id, value, onChange, error }: Props) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const { date, time } = parseValue(value);

  //mientras no hay hora elegida, el reloj muestra la de por defecto (apagada)
  const [hours24, minutes] = (time || DEFAULT_TIME).split(":").map(Number);
  const { hour12, period } = to12h(hours24);
  const timePassed = isPastTime(date, time);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function setTime(newHours24: number, newMinutes: number) {
    if (!date) return;
    onChange(`${toDateString(date)}T${pad(newHours24)}:${pad(newMinutes)}`);
  }

  //al elegir el día se conserva la hora si sigue valiendo, si no se pone una por defecto
  function handleSelectDay(day: Date | undefined) {
    if (!day) return;
    const nextTime = time && !isPastTime(day, time) ? time : defaultTimeFor(day);
    onChange(`${toDateString(day)}T${nextTime}`);
  }

  //las horas giran entre 1 y 12 sin cambiar a. m./p. m.
  function stepHour(delta: number) {
    const next = ((hour12 - 1 + delta + 12) % 12) + 1;
    setTime(to24h(next, period), minutes);
  }

  //los minutos giran entre 0 y 55 sin mover la hora, como en un reloj digital
  function stepMinute(delta: number) {
    setTime(hours24, (minutes + delta * MINUTE_STEP + 60) % 60);
  }

  function changePeriod(next: Period) {
    setTime(to24h(hour12, next), minutes);
  }

  const dateLabel = date?.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });
  const timeLabel = time ? `${hour12}:${pad(minutes)} ${period === "AM" ? "a. m." : "p. m."}` : "";
  const summary = dateLabel && timeLabel ? `${dateLabel} · ${timeLabel}` : "";

  return (
    <div className="space-y-1.5">
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          {/* type="button": dentro de un formulario, sin esto enviaría el form */}
          <button
            type="button"
            id={id}
            className={`flex h-11 w-full items-center gap-3 rounded-md border bg-white/5 px-3 text-left text-base outline-none transition focus-visible:ring-[3px] focus-visible:ring-fuchsia-400/50 ${
              error ? "border-red-400/60" : "border-white/10 focus-visible:border-fuchsia-400/50"
            }`}
          >
            <CalendarDays className="size-4 shrink-0 text-fuchsia-300" />
            <span className={summary ? "text-white first-letter:uppercase" : "text-white/40"}>
              {summary || "Elige la fecha y la hora"}
            </span>
          </button>
        </Dialog.Trigger>

        {/* AnimatePresence deja que el modal termine su animación de salida antes de desmontarse */}
        <AnimatePresence>
          {open && (
            <Dialog.Portal key="date-time-modal" forceMount>
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
                <Dialog.Content asChild forceMount>
                  <motion.div
                    className="pointer-events-auto relative max-h-full w-full max-w-5xl overflow-x-hidden overflow-y-auto rounded-3xl border border-fuchsia-400/20 bg-[#120629] p-6 text-white shadow-2xl shadow-fuchsia-500/20 outline-none sm:p-10"
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 16 }}
                    animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8 }}
                    transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
                  >
                    {/* resplandor decorativo, recortado para que no genere scroll */}
                    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                      <div className="absolute -top-28 -right-28 size-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
                    </div>

                    <div className="relative">
                      <div className="mb-8 flex items-start justify-between gap-4">
                        <div>
                          <Dialog.Title className="text-2xl font-bold">Fecha y hora de inicio</Dialog.Title>
                          <Dialog.Description className="mt-1.5 text-base text-white/50">
                            Elige el día y ajusta la hora en que empieza tu transmisión
                          </Dialog.Description>
                        </div>
                        <Dialog.Close asChild>
                          <button
                            type="button"
                            aria-label="Cerrar"
                            className="rounded-md p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
                          >
                            <X className="size-5" />
                          </button>
                        </Dialog.Close>
                      </div>

                      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_320px] md:gap-10">
                        {/* las variables pintan el día elegido en morado y el de hoy en un tono suave */}
                        <div className="flex min-w-0 items-center justify-center [--accent-foreground:#ffffff] [--accent:#d946ef33] [--foreground:#ffffff] [--muted:#ffffff14] [--primary-foreground:#ffffff] [--primary:#c026d3]">
                          <Calendar
                            mode="single"
                            locale={es}
                            selected={date}
                            defaultMonth={date}
                            onSelect={handleSelectDay}
                            disabled={{ before: today }}
                            className="bg-transparent p-0 [--cell-size:--spacing(10)] lg:[--cell-size:--spacing(14)] 2xl:[--cell-size:--spacing(16)]"
                          />
                        </div>

                        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                          <div className="mb-3 flex items-center gap-2 self-start text-sm font-medium text-white/80">
                            <Clock className="size-4 text-fuchsia-300" />
                            Hora de inicio
                          </div>

                          <div className="flex items-center gap-2">
                            <ClockSegment
                              label="hora"
                              display={String(hour12)}
                              valueNow={hour12}
                              disabled={!date}
                              onUp={() => stepHour(1)}
                              onDown={() => stepHour(-1)}
                            />
                            <span className={`pb-1 text-4xl font-bold ${date ? "text-fuchsia-300" : "text-white/30"}`}>:</span>
                            <ClockSegment
                              label="minutos"
                              display={pad(minutes)}
                              valueNow={minutes}
                              disabled={!date}
                              onUp={() => stepMinute(1)}
                              onDown={() => stepMinute(-1)}
                            />

                            <div className="ml-1 flex flex-col gap-2">
                              {(["AM", "PM"] as const).map((option) => (
                                <button
                                  key={option}
                                  type="button"
                                  disabled={!date}
                                  aria-pressed={period === option}
                                  onClick={() => changePeriod(option)}
                                  className={`h-10 rounded-md border px-3 text-sm transition disabled:cursor-not-allowed disabled:opacity-30 ${
                                    period === option
                                      ? "border-fuchsia-400 bg-fuchsia-500/20 text-white"
                                      : "border-white/10 bg-white/5 text-white/70 hover:border-fuchsia-400/50 hover:bg-white/10 disabled:hover:border-white/10 disabled:hover:bg-white/5"
                                  }`}
                                >
                                  {option === "AM" ? "a. m." : "p. m."}
                                </button>
                              ))}
                            </div>
                          </div>

                          {!date && <p className="mt-4 text-xs text-white/40">Elige primero el día</p>}
                          {date && !timePassed && (
                            <p className="mt-4 text-center text-xs text-white/40">
                              Usa las flechas ▲ ▼ (minutos de 5 en 5)
                            </p>
                          )}
                          {timePassed && (
                            <p className="mt-4 text-center text-xs text-red-400">
                              Esa hora ya pasó, elige una más tarde
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <div role="status" className="min-h-10">
                          <SelectionBadge summary={summary} />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            disabled={!value}
                            onClick={() => onChange("")}
                            className="h-11 px-5 text-white/70 hover:bg-white/10 hover:text-white"
                          >
                            Borrar
                          </Button>
                          <Button
                            type="button"
                            disabled={timePassed}
                            onClick={() => setOpen(false)}
                            className="h-11 bg-white px-8 text-black hover:bg-white/90"
                          >
                            Listo
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Dialog.Content>
              </div>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>

      {error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : (
        <p className="text-xs text-white/30">Hora de tu dispositivo</p>
      )}
    </div>
  );
}