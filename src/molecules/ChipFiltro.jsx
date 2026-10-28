import { X } from "lucide-react";
import { cn } from "../lib/cn.js";

/** An active filter shown as a chip; the cross removes it. */
export default function ChipFiltro({ children, onRemove, className }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-1 rounded-full border bg-primary/10 pl-3 text-xs font-medium text-primary",
        onRemove ? "pr-1" : "pr-3",
        className,
      )}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Rimuovi filtro: ${typeof children === "string" ? children : ""}`.trim()}
          className="relative inline-flex h-5 w-5 items-center justify-center rounded-full transition-colors after:absolute after:-inset-3 after:content-[''] hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-3 w-3" aria-hidden />
        </button>
      )}
    </span>
  );
}
