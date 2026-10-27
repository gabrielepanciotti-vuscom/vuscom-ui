import { cn } from "../lib/cn.js";
import { Card } from "./Card.jsx";
import BarraInline, { valoreBarra } from "./BarraInline.jsx";

// Clicks on these (or inside them) belong to the control, not to the row.
export const INTERATTIVI =
  "a,button,input,textarea,select,[role=listbox],[role=option],[role=switch],[role=checkbox],[data-no-row-click]";

export function contenutoCella(colonna, riga, massimi = {}) {
  const contenuto = colonna.cell
    ? colonna.cell(riga)
    : (riga[colonna.key] ?? "");
  return colonna.bar ? (
    <BarraInline
      value={valoreBarra(colonna, riga)}
      max={massimi[colonna.key]}
    >
      {contenuto}
    </BarraInline>
  ) : (
    contenuto
  );
}

export default function DataTableCards({
  columns,
  rows,
  rowKey,
  onRowClick,
  massimi,
  className,
}) {
  const attivaRiga = (evento, riga) => {
    const hit = evento.target.closest?.(INTERATTIVI);
    if (hit && evento.currentTarget.contains(hit)) return;
    onRowClick(riga);
  };

  return (
    <div className={cn("space-y-2 p-3 sm:hidden", className)}>
      {rows.map((riga) => (
        <Card
          key={rowKey(riga)}
          role={onRowClick ? "button" : undefined}
          tabIndex={onRowClick ? 0 : undefined}
          onClick={onRowClick ? (evento) => attivaRiga(evento, riga) : undefined}
          onKeyDown={
            onRowClick
              ? (evento) => {
                  if (
                    (evento.key === "Enter" || evento.key === " ") &&
                    evento.target === evento.currentTarget
                  ) {
                    evento.preventDefault();
                    onRowClick(riga);
                  }
                }
              : undefined
          }
          className={cn(
            "p-4 transition-colors",
            onRowClick &&
              "cursor-pointer hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          <dl className="space-y-2">
            {columns.map((colonna) => (
              <div
                key={colonna.key}
                className="flex items-start justify-between gap-3"
              >
                <dt
                  className={cn(
                    "text-sm text-muted-foreground",
                    colonna.srOnly && "sr-only",
                  )}
                >
                  {colonna.header}
                </dt>
                <dd className="min-w-0 text-right">
                  {contenutoCella(colonna, riga, massimi)}
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      ))}
    </div>
  );
}
