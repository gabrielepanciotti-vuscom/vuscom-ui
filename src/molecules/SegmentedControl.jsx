import { useRef } from "react";
import { cn } from "../lib/cn.js";

const SIZE = { sm: "h-7 px-3 text-xs", md: "h-9 px-4 text-sm" };

export default function SegmentedControl({
  value,
  onChange,
  options = [],
  size = "sm",
  "aria-label": ariaLabel,
  className,
}) {
  const refs = useRef([]);
  const vai = (i) => {
    const n = (i + options.length) % options.length;
    onChange?.(options[n].value);
    refs.current[n]?.focus();
  };
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn("inline-flex rounded-lg bg-muted p-1", className)}
    >
      {options.map((o, i) => {
        const attivo = o.value === value;
        const Icon = o.icon;
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={attivo}
            tabIndex={attivo ? 0 : -1}
            onClick={() => onChange?.(o.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                vai(i + 1);
              } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                vai(i - 1);
              }
            }}
            className={cn(
              "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              SIZE[size] || SIZE.sm,
              attivo
                ? "bg-background text-primary shadow"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {Icon && <Icon className="h-3.5 w-3.5" aria-hidden />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
