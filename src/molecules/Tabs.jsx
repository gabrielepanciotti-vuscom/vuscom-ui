import { useRef } from "react";
import { cn } from "../lib/cn.js";

// Underline tabs. The caller renders each panel with role="tabpanel"
// id="panel-<id>" aria-labelledby="tab-<id>".
export default function Tabs({
  value,
  onChange,
  items = [],
  "aria-label": ariaLabel,
  className,
}) {
  const refs = useRef([]);
  const vai = (i) => {
    const n = (i + items.length) % items.length;
    onChange?.(items[n].id);
    refs.current[n]?.focus();
  };
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "flex gap-6 overflow-x-auto overflow-y-hidden border-b border-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {items.map((t, i) => {
        const attiva = t.id === value;
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={attiva}
            aria-controls={attiva ? `panel-${t.id}` : undefined}
            tabIndex={attiva ? 0 : -1}
            onClick={() => onChange?.(t.id)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                e.preventDefault();
                vai(i + 1);
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                vai(i - 1);
              }
            }}
            className={cn(
              "-mb-px inline-flex items-center gap-2 whitespace-nowrap border-b-2 py-2.5 text-sm font-medium transition-colors",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              attiva
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {Icon && <Icon className="h-4 w-4" aria-hidden />}
            {t.label}
            {t.count != null && (
              <span className="rounded-full bg-muted px-1.5 text-xs tabular-nums text-muted-foreground">
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
