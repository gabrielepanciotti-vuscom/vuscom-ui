import { BookOpen } from "lucide-react";
import InfoTip from "../molecules/InfoTip.jsx";
import { cn } from "../lib/cn.js";

/** Standard page title block: title, description, help, actions and tabs. */
export default function PageHeader({
  title,
  description,
  icon: Icon,
  help,
  helpHref,
  actions,
  tabs,
  className,
}) {
  return (
    <div className={cn("mb-6 space-y-4", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-6 w-6 text-primary" aria-hidden />}
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {help && <InfoTip>{help}</InfoTip>}
            {helpHref && (
              <a
                href={helpHref}
                className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <BookOpen className="h-3.5 w-3.5" aria-hidden />
                Guida
              </a>
            )}
          </div>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        )}
      </div>
      {tabs}
    </div>
  );
}
