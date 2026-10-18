import { cn } from "@/lib/utils";

const SIZES = {
  sm: "size-6 text-[10px]",
  md: "size-9 text-xs",
  lg: "size-12 text-sm",
  xl: "size-20 text-xl",
} as const;

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

export function StreamAvatar({
  name,
  accent,
  size = "md",
  className,
}: {
  name: string;
  accent?: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex shrink-0 select-none items-center justify-center rounded-full font-bold text-white ring-1 ring-white/10",
        SIZES[size],
        className
      )}
      style={{ backgroundColor: accent ?? "#7c3aed" }}
    >
      {initials(name)}
    </div>
  );
}
