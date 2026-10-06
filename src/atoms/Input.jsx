import { forwardRef } from "react";
import { cn } from "../lib/cn.js";

export const CAMPO =
  "w-full rounded-lg border bg-background text-sm text-foreground placeholder:text-muted-foreground " +
  "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 " +
  "disabled:cursor-not-allowed disabled:opacity-50";

export const campoClasses = (invalid) =>
  cn(
    CAMPO,
    invalid
      ? "border-destructive focus-visible:ring-destructive/40"
      : "border-input hover:border-ring/60 focus-visible:border-ring focus-visible:ring-ring/40",
  );

const Input = forwardRef(function Input(
  { invalid, icon: Icon, className, ...props },
  ref,
) {
  const input = (
    <input
      ref={ref}
      aria-invalid={invalid ? "true" : undefined}
      {...props}
      className={cn(
        campoClasses(invalid),
        "h-10 px-3",
        Icon && "pl-9",
        className,
      )}
    />
  );
  if (!Icon) return input;
  return (
    <div className="relative w-full">
      <Icon
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      {input}
    </div>
  );
});

export default Input;
