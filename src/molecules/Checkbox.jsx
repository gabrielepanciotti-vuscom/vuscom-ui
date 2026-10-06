import { useId } from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "../lib/cn.js";

// `id`, `aria-*` and other extra props land on the checkbox button, so a Field
// wrapper can label and describe it. The label text toggles too.
export default function Checkbox({
  checked,
  indeterminate,
  onChange,
  label,
  disabled,
  className,
  id,
  ...rest
}) {
  const uid = useId();
  const on = indeterminate || checked;
  const cambia = () => {
    if (!disabled) onChange?.(indeterminate ? true : !checked);
  };
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        aria-labelledby={label ? uid : undefined}
        {...rest}
        id={id}
        type="button"
        role="checkbox"
        aria-checked={indeterminate ? "mixed" : !!checked}
        disabled={disabled}
        onClick={cambia}
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "active:scale-90 disabled:cursor-not-allowed disabled:opacity-50",
          on
            ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
            : "border-input bg-background hover:border-ring/60",
        )}
      >
        {indeterminate ? (
          <Minus className="h-3 w-3" strokeWidth={3} aria-hidden />
        ) : (
          checked && <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
        )}
      </button>
      {label && (
        <span
          id={uid}
          onClick={cambia}
          data-no-row-click
          className={cn(
            "select-none text-sm text-foreground",
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}
