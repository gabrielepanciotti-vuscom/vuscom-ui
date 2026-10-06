import { Children, cloneElement, isValidElement, useId } from "react";
import { cn } from "../lib/cn.js";

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
            <span className="ml-0.5 text-destructive" aria-hidden>
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
        <p id={errorId} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
