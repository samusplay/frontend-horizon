"use client";

import { goLive } from "@/actions/go-live-action";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoLiveSchema } from "@/src/schemas/streams";
import type { Category } from "@/src/streams/types";
import { Radio } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

export function GoLivePanel({ categories }: { categories: Category[] }) {
  const [state, dispatch, pending] = useActionState(goLive, {
    errors: [],
    success: "",
  });

  const [fieldErrors, setFieldErrors] = useState<{ title?: string; description?: string }>({});

  useEffect(() => {
    if (state.success) toast.success(state.success);
  }, [state.success]);

  function validateField(name: "title" | "description", value: string) {
    const shape = GoLiveSchema.shape[name];
    const result = shape.safeParse(value);
    setFieldErrors((previous) => ({
      ...previous,
      [name]: result.success ? undefined : result.error.issues[0].message,
    }));
  }

  return (
    <section className="rounded-xl bg-[#120a24] p-5 ring-1 ring-white/10">
      <header className="mb-4 flex items-center gap-2">
        <Radio className="size-5 text-fuchsia-300" />
        <h2 className="text-lg font-bold text-white">Iniciar transmisión</h2>
      </header>

      <form action={dispatch} noValidate className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="title" className="text-sm font-medium text-white/80">
            Título de la transmisión
          </Label>
          <Input
            id="title"
            name="title"
            placeholder="Ej: Torneo Valorant Masters — Gran final"
            aria-invalid={!!fieldErrors.title}
            onBlur={(event) => validateField("title", event.target.value)}
            onChange={() => fieldErrors.title && setFieldErrors((p) => ({ ...p, title: undefined }))}
            className="h-11 border-white/10 bg-white/5 text-base focus-visible:border-fuchsia-400/50 focus-visible:ring-fuchsia-400/50"
          />
          {fieldErrors.title && <p className="text-xs text-red-400">{fieldErrors.title}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="categorySlug" className="text-sm font-medium text-white/80">
            Categoría
          </Label>
          <select
            id="categorySlug"
            name="categorySlug"
            defaultValue=""
            className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-base text-white outline-none focus-visible:border-fuchsia-400/50 focus-visible:ring-3 focus-visible:ring-fuchsia-400/50"
          >
            <option value="" disabled className="bg-[#120a24]">
              Selecciona una categoría
            </option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug} className="bg-[#120a24]">
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description" className="text-sm font-medium text-white/80">
            Descripción
          </Label>
          <textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Cuenta de qué va tu emisión…"
            aria-invalid={!!fieldErrors.description}
            onBlur={(event) => validateField("description", event.target.value)}
            onChange={() =>
              fieldErrors.description && setFieldErrors((p) => ({ ...p, description: undefined }))
            }
            className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-base text-white outline-none placeholder:text-white/40 focus-visible:border-fuchsia-400/50 focus-visible:ring-3 focus-visible:ring-fuchsia-400/50"
          />
          {fieldErrors.description && <p className="text-xs text-red-400">{fieldErrors.description}</p>}
        </div>

        <Alert variant="error" show={state.errors.length > 0}>
          {state.errors.join(" ")}
        </Alert>

        <Button
          type="submit"
          disabled={pending}
          className="h-11 w-full bg-fuchsia-500 text-base text-white hover:bg-fuchsia-400"
        >
          {pending ? "Preparando…" : "Salir en vivo"}
        </Button>
      </form>
    </section>
  );
}
