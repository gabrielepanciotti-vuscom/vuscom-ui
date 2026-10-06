import { useId, useRef } from "react";
import { cn } from "../lib/cn.js";

const tabId = (prefix, id) => (prefix ? `${prefix}-tab-${id}` : `tab-${id}`);
const panelId = (prefix, id) =>
  prefix ? `${prefix}-panel-${id}` : `panel-${id}`;

/**
 * Ids scoped to one Tabs instance, so two tab bars on the same page with the
 * same item ids do not collide:
 *   const ids = useTabIds();
 *   <Tabs idPrefix={ids.prefix} … />
 *   <div role="tabpanel" id={ids.panel(x)} aria-labelledby={ids.tab(x)}>
 */
export function useTabIds() {
  const prefix = useId().replace(/:/g, "");
  return {
    prefix,
    tab: (id) => tabId(prefix, id),
    panel: (id) => panelId(prefix, id),
  };
}

// Underline tabs. The caller renders each panel with role="tabpanel"
// id="panel-<id>" aria-labelledby="tab-<id>" (legacy, page-global ids), or
// passes `idPrefix` from useTabIds() and uses its `panel`/`tab` helpers.
export default function Tabs({
  value,
  onChange,
  items = [],
  "aria-label": ariaLabel,
  idPrefix,
  className,
}) {
  const refs = useRef([]);
  const vai = (i) => {
    const n = (i + items.length) % items.length;
    onChange?.(items[n].id);
    refs.current[n]?.focus();
  };
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "flex gap-6 overflow-x-auto overflow-y-hidden border-b border-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {items.map((t, i) => {
        const attiva = t.id === value;
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={tabId(idPrefix, t.id)}
            aria-selected={attiva}
            aria-controls={attiva ? panelId(idPrefix, t.id) : undefined}
            tabIndex={attiva ? 0 : -1}
            onClick={() => onChange?.(t.id)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                e.preventDefault();
                vai(i + 1);
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                vai(i - 1);
              }
            }}
            className={cn(
              "-mb-px inline-flex items-center gap-2 whitespace-nowrap border-b-2 py-2.5 text-sm font-medium transition-colors",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              attiva
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {Icon && <Icon className="h-4 w-4" aria-hidden />}
            {t.label}
            {t.count != null && (
              <span className="rounded-full bg-muted px-1.5 text-xs tabular-nums text-muted-foreground">
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
