import { useId } from "react";
import { cn } from "../lib/cn.js";

export default function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
  className,
}) {
  const uid = useId();
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={!!checked}
        aria-labelledby={label ? `${uid}-l` : undefined}
        aria-describedby={description ? `${uid}-d` : undefined}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          "relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "active:scale-95 disabled:cursor-not-allowed disabled:opacity-50",
          checked
            ? "bg-primary hover:bg-primary/90"
            : "bg-muted-foreground/30 hover:bg-muted-foreground/40",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "inline-block h-4 w-4 rounded-full bg-background shadow transition-transform",
            checked ? "translate-x-[18px]" : "translate-x-0.5",
          )}
        />
      </button>
      {(label || description) && (
        <div className="min-w-0">
          {label && (
            <div
              id={`${uid}-l`}
              className="text-sm font-medium text-foreground"
            >
              {label}
            </div>
          )}
          {description && (
            <div id={`${uid}-d`} className="text-xs text-muted-foreground">
              {description}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
