import { Inbox } from "lucide-react";
import { cn } from "../lib/cn.js";
import { formatNumero } from "../lib/format.js";
import { periodLabel } from "../lib/periodi.js";
import { Card } from "./Card.jsx";
import EmptyState from "./EmptyState.jsx";
import { segnalaAttr } from "../segnalazioni/segnalaAttr.js";

const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
const somma = (xs) => xs.reduce((a, b) => a + b, 0);
const percento = (v) =>
  formatNumero(v, { style: "percent", maximumFractionDigits: 1 });

/** Period keys or { key, label, parziale } → normalised columns. */
const colonne = (periodi) =>
  periodi.map((p) =>
    typeof p === "string"
      ? { key: p, label: periodLabel(p, { breve: true }), parziale: false }
      : { label: periodLabel(p.key, { breve: true }), ...p },
  );

/**
 * Colour of a cell: square-root scale of value / max, so small values stay
 * visible next to a large one. Returns the background alpha (0 = no colour).
 */
export function intensita(valore, massimo) {
  if (!(massimo > 0) || !(valore > 0)) return 0;
  return Math.sqrt(Math.min(valore / massimo, 1));
}

function Cella({ valore, massimo, format, nd }) {
  const mancante = nd !== undefined && (valore === null || valore === undefined);
  const t = mancante ? 0 : intensita(valore, massimo);
  const alfa = t > 0 ? 0.08 + 0.82 * t : 0;
  return (
    <td
      className={cn(
        "px-3 py-2 text-right tabular-nums transition-colors",
        alfa > 0.55 ? "text-primary-foreground" : "text-foreground",
      )}
      style={
        alfa
          ? { backgroundColor: `hsl(var(--primary) / ${alfa.toFixed(3)})` }
          : undefined
      }
      data-intensita={t.toFixed(3)}
    >
      {mancante ? (
        <span className="text-muted-foreground">{nd}</span>
      ) : valore || (nd !== undefined && valore === 0) ? (
        format(valore)
      ) : (
        <span className="text-muted-foreground">–</span>
      )}
    </td>
  );
}

export default function MatriceCalore({
  righe = [],
  periodi = [],
  onRigaClick,
  formatValore = formatNumero,
  etichettaRighe = "Voce",
  totale = true,
  quota = true,
  rigaTotali = true,
  caption,
  scala = "globale",
  nd,
  empty = "Nessun dato nel periodo",
  segnala,
  className,
}) {
  const cols = colonne(periodi);
  // `nd` set: a missing value (null/undefined) reads `nd`, a real 0 reads 0.
  const grezzo = (r, k) => {
    const v = r.valori?.[k];
    return nd !== undefined && (v === null || v === undefined) ? null : num(v);
  };
  const valore = (r, k) => num(r.valori?.[k]);
  const totaliRiga = righe.map((r) => somma(cols.map((c) => valore(r, c.key))));
  const totaliColonna = cols.map((c) =>
    somma(righe.map((r) => valore(r, c.key))),
  );
  const generale = somma(totaliRiga);
  // "riga": each row is coloured against its own maximum, for rows with
  // different units (counts next to euros) that one scale would flatten.
  const massimoDi = (rs) =>
    Math.max(0, ...rs.flatMap((r) => cols.map((c) => valore(r, c.key))));
  const massimo = massimoDi(righe);
  const massimoRiga = (r) => (scala === "riga" ? massimoDi([r]) : massimo);
  const parziali = cols.some((c) => c.parziale);
  const intest = "px-3 py-2 font-medium whitespace-nowrap";

  if (righe.length === 0 || cols.length === 0)
    return (
      <Card className={cn("p-0", className)} {...segnalaAttr(segnala)}>
        <EmptyState icon={Inbox} title={empty} />
      </Card>
    );

  return (
    <Card className={cn("p-0", className)} {...segnalaAttr(segnala)}>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="border-b bg-muted/50 text-muted-foreground">
            <tr>
              <th
                scope="col"
                className={cn(intest, "sticky left-0 bg-card text-left")}
              >
                {etichettaRighe}
              </th>
              {cols.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={cn(intest, "text-right")}
                  title={c.parziale ? "Periodo parziale" : undefined}
                >
                  {c.label}
                  {c.parziale && (
                    <>
                      <span aria-hidden>*</span>
                      <span className="sr-only"> (parziale)</span>
                    </>
                  )}
                </th>
              ))}
              {totale && (
                <th scope="col" className={cn(intest, "text-right")}>
                  Totale
                </th>
              )}
              {quota && (
                <th scope="col" className={cn(intest, "text-right")}>
                  Quota
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y">
            {righe.map((r, i) => (
              <tr
                key={r.id ?? r.label}
                tabIndex={onRigaClick ? 0 : undefined}
                onClick={onRigaClick ? () => onRigaClick(r) : undefined}
                onKeyDown={
                  onRigaClick
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onRigaClick(r);
                        }
                      }
                    : undefined
                }
                className={cn(
                  onRigaClick &&
                    "cursor-pointer hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                )}
              >
                <th
                  scope="row"
                  className="sticky left-0 bg-card px-3 py-2 text-left font-medium"
                >
                  {r.label}
                </th>
                {cols.map((c) => (
                  <Cella
                    key={c.key}
                    valore={grezzo(r, c.key)}
                    massimo={massimoRiga(r)}
                    format={r.format ?? formatValore}
                    nd={nd}
                  />
                ))}
                {totale && (
                  <td className="px-3 py-2 text-right font-semibold tabular-nums">
                    {(r.format ?? formatValore)(totaliRiga[i])}
                  </td>
                )}
                {quota && (
                  <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                    {generale > 0 ? percento(totaliRiga[i] / generale) : "–"}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
          {rigaTotali && (
            <tfoot className="border-t-2 bg-muted/30 font-semibold">
              <tr>
                <th
                  scope="row"
                  className="sticky left-0 bg-card px-3 py-2 text-left"
                >
                  Totale
                </th>
                {totaliColonna.map((t, i) => (
                  <td
                    key={cols[i].key}
                    className="px-3 py-2 text-right tabular-nums"
                  >
                    {formatValore(t)}
                  </td>
                ))}
                {totale && (
                  <td className="px-3 py-2 text-right tabular-nums">
                    {formatValore(generale)}
                  </td>
                )}
                {quota && (
                  <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                    {generale > 0 ? percento(1) : "–"}
                  </td>
                )}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      {parziali && (
        <p className="border-t px-4 py-2 text-xs text-muted-foreground">
          * periodo parziale: il filtro lo taglia o non è ancora chiuso
        </p>
      )}
    </Card>
  );
}
