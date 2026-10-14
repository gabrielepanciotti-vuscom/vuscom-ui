import { cn } from "../lib/cn.js";

/** Numeric value used by a DataTable `bar` column: barValue, then sortAccessor, then row[key]. */
export const valoreBarra = (c, row) => {
  const v = c.barValue
    ? c.barValue(row)
    : c.sortAccessor
      ? c.sortAccessor(row)
      : row[c.key];
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/** Highest bar value of each `bar` column, keyed by column key. */
export const massimiBarre = (columns, rows) =>
  Object.fromEntries(
    columns
      .filter((c) => c.bar)
      .map((c) => [c.key, Math.max(0, ...rows.map((r) => valoreBarra(c, r)))]),
  );

/**
 * A cell with a bar proportional to the column maximum next to the value.
 * Decorative: the value stays in the text, the bar is hidden from screen readers.
 */
export default function BarraInline({ value, max, children, className }) {
  const pct = max > 0 ? Math.min(Math.max(value / max, 0), 1) * 100 : 0;
  // A tiny non-zero value still shows a sliver.
  const larghezza = pct > 0 && pct < 2 ? 2 : pct;
  return (
    <div className={cn("flex items-center justify-end gap-2", className)}>
      <div
        className="h-1.5 min-w-[3rem] flex-1 overflow-hidden rounded-full bg-muted"
        aria-hidden
        data-barra=""
      >
        <div
          className="h-full rounded-full bg-primary/70 transition-all duration-300"
          style={{ width: `${larghezza}%` }}
        />
      </div>
      <span className="shrink-0 tabular-nums">{children}</span>
    </div>
  );
}
