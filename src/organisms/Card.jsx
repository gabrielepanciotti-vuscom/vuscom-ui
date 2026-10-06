import { cn } from "../lib/cn.js";

export function Card({ className, interactive = false, children, ...props }) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm",
        interactive &&
          "transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  description,
  actions,
  className,
  children,
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 p-5 pb-0",
        className,
      )}
    >
      <div className="min-w-0 space-y-1">
        {title && <CardTitle>{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
        {children}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3
      {...props}
      className={cn("text-base font-semibold leading-tight", className)}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p {...props} className={cn("text-sm text-muted-foreground", className)}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div {...props} className={cn("p-5", className)}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div
      {...props}
      className={cn("flex items-center gap-2 border-t p-4", className)}
    >
      {children}
    </div>
  );
}
