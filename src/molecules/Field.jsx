import { Children, cloneElement, isValidElement, useId } from "react";
import { cn } from "../lib/cn.js";
import { TESTO } from "../atoms/tones.js";

export default function Field({
  label,
  hint,
  error,
  required,
  id,
  className,
  children,
}) {
  const auto = useId();
  const child = Children.only(children);
  const fieldId = id || child.props?.id || auto;
  const hintId = hint ? `${fieldId}-hint` : null;
  const errorId = error ? `${fieldId}-error` : null;
  const describedBy =
    [child.props?.["aria-describedby"], hintId, errorId]
      .filter(Boolean)
      .join(" ") || undefined;

  const control = isValidElement(child)
    ? cloneElement(child, {
        id: fieldId,
        "aria-describedby": describedBy,
        ...(error ? { "aria-invalid": "true" } : {}),
      })
    : child;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label
          htmlFor={fieldId}
          className="text-sm font-medium text-foreground"
        >
          {label}
          {required && (
            <span className={cn("ml-0.5", TESTO.danger)} aria-hidden>
              *
            </span>
          )}
        </label>
      )}
      {control}
      {hint && !error && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className={cn("text-xs", TESTO.danger)}>
          {error}
        </p>
      )}
    </div>
  );
}
