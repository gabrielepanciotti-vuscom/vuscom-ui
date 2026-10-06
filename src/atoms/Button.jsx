import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../lib/cn.js";

const VARIANTI = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline:
    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
  link: "text-primary underline-offset-4 hover:underline",
};
const TAGLIE = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

export const buttonClasses = (variant = "primary", size = "md") =>
  cn(
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
    VARIANTI[variant],
    TAGLIE[size],
  );

const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    icon: Icon,
    iconRight: IconRight,
    fullWidth,
    className,
    children,
    type = "button",
    disabled,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      {...props}
      // After the spread on purpose: a caller's disabled={false} must never re-enable a loading button.
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        buttonClasses(variant, size),
        fullWidth && "w-full",
        className,
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : (
        Icon && <Icon className="h-4 w-4" aria-hidden />
      )}
      {children}
      {!loading && IconRight && <IconRight className="h-4 w-4" aria-hidden />}
    </button>
  );
});

export default Button;
