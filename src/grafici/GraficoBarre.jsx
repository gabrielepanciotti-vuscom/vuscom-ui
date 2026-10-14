import { useEffect, useRef } from "react";
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { BarChart3 } from "lucide-react";
import { cn } from "../lib/cn.js";
import { formatNumero } from "../lib/format.js";
import { Card } from "../organisms/Card.jsx";
import EmptyState from "../organisms/EmptyState.jsx";
import { useTheme } from "../theme/useTheme.js";
import { segnalaAttr } from "../segnalazioni/segnalaAttr.js";
import { coloriTema } from "./coloriTema.js";
import { configGraficoBarre, normalizzaPeriodi } from "./configBarre.js";

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
);

/**
 * Stacked bars by period (Chart.js 4, optional peer dependency: this lives in
 * the "@vuscom/ui/grafici" entry so portals without charts never need it).
 * Colours come from the theme tokens and follow light/dark live.
 * `serie` = [{ id, label, valori: { [periodo]: n } | n[], tono?: 1…8 }].
 */
export default function GraficoBarre({
  periodi = [],
  serie = [],
  impilate = true,
  altezza = 320,
  formatValore = formatNumero,
  onPeriodoClick,
  titolo = "Grafico a barre per periodo",
  empty = "Nessun dato nel periodo",
  segnala,
  className,
}) {
  const tela = useRef(null);
  const grafico = useRef(null);
  const { theme } = useTheme();
  const vuoto = periodi.length === 0 || serie.length === 0;

  useEffect(() => {
    if (vuoto || !tela.current) return undefined;
    const config = configGraficoBarre({
      periodi,
      serie,
      colori: coloriTema(),
      impilate,
      formatValore,
      onPeriodoClick,
    });
    if (grafico.current) {
      grafico.current.data = config.data;
      grafico.current.options = config.options;
      grafico.current.update();
    } else {
      grafico.current = new Chart(tela.current, config);
    }
    return undefined;
  }, [vuoto, periodi, serie, impilate, formatValore, onPeriodoClick, theme]);

  // Destroyed only on unmount (or when the canvas goes away for the empty state).
  useEffect(() => {
    if (!vuoto) return undefined;
    grafico.current?.destroy();
    grafico.current = null;
    return undefined;
  }, [vuoto]);
  useEffect(
    () => () => {
      grafico.current?.destroy();
      grafico.current = null;
    },
    [],
  );

  if (vuoto)
    return (
      <Card className={cn("p-0", className)} {...segnalaAttr(segnala)}>
        <EmptyState icon={BarChart3} title={empty} />
      </Card>
    );

  const ps = normalizzaPeriodi(periodi);
  return (
    <Card className={cn("p-4", className)} {...segnalaAttr(segnala)}>
      <div style={{ height: altezza }} className="relative">
        <canvas ref={tela} role="img" aria-label={titolo} />
      </div>
      {ps.some((p) => p.parziale) && (
        <p className="mt-2 text-xs text-muted-foreground">
          * periodo parziale: il filtro lo taglia o non è ancora chiuso
        </p>
      )}
      {/* The canvas is a picture: screen readers get the numbers as a table. */}
      <table className="sr-only">
        <caption>{titolo}</caption>
        <thead>
          <tr>
            <th scope="col">Periodo</th>
            {serie.map((s) => (
              <th key={s.id ?? s.label} scope="col">
                {s.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ps.map((p, j) => (
            <tr key={p.key}>
              <th scope="row">
                {p.titolo}
                {p.parziale ? " (parziale)" : ""}
              </th>
              {serie.map((s) => (
                <td key={s.id ?? s.label}>
                  {formatValore(
                    Number(
                      Array.isArray(s.valori) ? s.valori[j] : s.valori?.[p.key],
                    ) || 0,
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
