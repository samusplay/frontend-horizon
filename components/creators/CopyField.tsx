"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

//campo de solo lectura con botón de copiar
export function CopyField({ label, value, big = false }: { label: string; value: string; big?: boolean }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-white/80">{label}</Label>
      <div className="flex items-center gap-2">
        <code
          className={`flex-1 break-all rounded-md border border-white/10 bg-white/5 px-3 font-mono text-white/90 ${
            big ? "py-4 text-lg" : "py-2.5 text-sm"
          }`}
        >
          {value}
        </code>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={copy}
          aria-label={`Copiar ${label}`}
          className="shrink-0 text-fuchsia-300 hover:bg-white/10 hover:text-fuchsia-200"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </Button>
      </div>
    </div>
  );
}