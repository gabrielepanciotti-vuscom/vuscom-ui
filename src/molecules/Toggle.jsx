import { useId } from "react";
import { cn } from "../lib/cn.js";

// `id`, `aria-*` and other extra props land on the switch button, so a Field
// wrapper can label and describe it. The label text toggles too.
export default function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
  className,
  id,
  "aria-describedby": describedBy,
  ...rest
}) {
  const uid = useId();
  const cambia = () => {
    if (!disabled) onChange?.(!checked);
  };
  const descrizione =
    [describedBy, description ? `${uid}-d` : null].filter(Boolean).join(" ") ||
    undefined;
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <button
        aria-labelledby={label ? `${uid}-l` : undefined}
        {...rest}
        id={id}
        type="button"
        role="switch"
        aria-checked={!!checked}
        aria-describedby={descrizione}
        disabled={disabled}
        onClick={cambia}
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
              onClick={cambia}
              data-no-row-click
              className={cn(
                "select-none text-sm font-medium text-foreground",
                disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
              )}
            >
              {label}
            </div>
          )}
          {description && (
            <div
              id={`${uid}-d`}
              data-no-row-click
              className="text-xs text-muted-foreground"
            >
              {description}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
