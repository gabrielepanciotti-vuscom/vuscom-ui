import { cn } from "../lib/cn.js";
import { Card } from "./Card.jsx";
import BarraInline, { valoreBarra } from "./BarraInline.jsx";

const INTERATTIVI =
  "a,button,input,textarea,select,[role=listbox],[role=option],[role=switch],[role=checkbox],[data-no-row-click]";

function valoreCella(colonna, riga, massimi) {
  const contenuto = colonna.cell ? colonna.cell(riga) : (riga[colonna.key] ?? "");
  if (!colonna.bar) return contenuto;
  return (
    <BarraInline value={valoreBarra(colonna, riga)} max={massimi[colonna.key]}>
      {contenuto}
    </BarraInline>
  );
}

export default function DataTableCards({
  columns,
  rows,
  rowKey,
  onRowClick,
  massimi,
}) {
  const gestisciClic = (event, riga) => {
    const hit = event.target.closest?.(INTERATTIVI);
    if (!hit || !event.currentTarget.contains(hit)) onRowClick(riga);
  };

  return (
    <div className="space-y-3 p-3 sm:hidden">
      {rows.map((riga) => (
        <Card
          key={rowKey(riga)}
          role={onRowClick ? "button" : undefined}
          tabIndex={onRowClick ? 0 : undefined}
          onClick={onRowClick ? (event) => gestisciClic(event, riga) : undefined}
          onKeyDown={
            onRowClick
              ? (event) => {
                  if (
                    (event.key === "Enter" || event.key === " ") &&
                    event.target === event.currentTarget
                  ) {
                    event.preventDefault();
                    onRowClick(riga);
                  }
                }
              : undefined
          }
          className={cn(
            "p-4",
            onRowClick &&
              "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          )}
        >
          <dl className="space-y-2">
            {columns.map((colonna) => (
              <div key={colonna.key} className="grid grid-cols-2 gap-3 text-sm">
                <dt className="text-muted-foreground">{colonna.header}</dt>
                <dd className="min-w-0 text-right">{valoreCella(colonna, riga, massimi)}</dd>
              </div>
            ))}
          </dl>
        </Card>
      ))}
    </div>
  );
}
