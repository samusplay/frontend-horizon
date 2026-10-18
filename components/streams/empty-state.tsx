import type { ComponentType } from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center">
      <Icon className="size-8 text-white/30" />
      <p className="mt-3 font-semibold text-white">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-white/50">{description}</p>}
    </div>
  );
}
