import { cn } from "../lib/cn.js";

/** Titled block of a page; the heading row is omitted when there is nothing to show. */
export default function Section({
  title,
  description,
  actions,
  className,
  children,
}) {
  return (
    <section className={cn("space-y-3", className)}>
      {(title || description || actions) && (
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title && <h2 className="text-lg font-semibold">{title}</h2>}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
