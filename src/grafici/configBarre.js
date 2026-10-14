import { formatNumero } from "../lib/format.js";
import { periodLabel } from "../lib/periodi.js";
import { coloreSerie } from "./coloriTema.js";

const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

/** Period keys or { key, label, parziale } → normalised periods. */
export const normalizzaPeriodi = (periodi) =>
  periodi.map((p) => {
    const o = typeof p === "string" ? { key: p } : p;
    return {
      ...o,
      label: o.label ?? periodLabel(o.key, { breve: true }),
      titolo: o.titolo ?? periodLabel(o.key),
      parziale: Boolean(o.parziale),
    };
  });

/** Value of a series in a period: `valori` is { [key]: n } or an array in period order. */
const valoreSerie = (s, p, i) =>
  num(Array.isArray(s.valori) ? s.valori[i] : s.valori?.[p.key]);

const movimentoRidotto = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Chart.js configuration of a stacked bar chart by period. Pure: no canvas, no
 * DOM — the component passes it to `new Chart`, the tests read it directly.
 * Partial periods get an asterisk on the axis and "(parziale)" in the tooltip;
 * the tooltip footer is the total of the visible series.
 */
export function configGraficoBarre({
  periodi = [],
  serie = [],
  colori,
  impilate = true,
  formatValore = formatNumero,
  onPeriodoClick,
}) {
  const ps = normalizzaPeriodi(periodi);
  return {
    type: "bar",
    data: {
      labels: ps.map((p) => (p.parziale ? `${p.label} *` : p.label)),
      datasets: serie.map((s, i) => {
        const colore = coloreSerie(colori, i, s.tono);
        return {
          label: s.label,
          data: ps.map((p, j) => valoreSerie(s, p, j)),
          backgroundColor: colore,
          hoverBackgroundColor: colore,
          borderRadius: 3,
          borderSkipped: impilate ? "start" : false,
          maxBarThickness: 48,
          stack: impilate ? "totale" : undefined,
        };
      }),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: movimentoRidotto() ? false : { duration: 250 },
      interaction: { mode: "index", intersect: false },
      onClick: onPeriodoClick
        ? (_e, elementi) => {
            if (elementi?.length) onPeriodoClick(ps[elementi[0].index].key);
          }
        : undefined,
      scales: {
        x: {
          stacked: impilate,
          grid: { display: false },
          border: { color: colori.griglia },
          ticks: { color: colori.testo },
        },
        y: {
          stacked: impilate,
          beginAtZero: true,
          grid: { color: colori.griglia },
          border: { display: false },
          ticks: { color: colori.testo, callback: (v) => formatValore(v) },
        },
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: colori.primoPiano,
            usePointStyle: true,
            pointStyle: "rectRounded",
            padding: 16,
          },
          // Clicking an entry hides/shows its series (Chart.js default); the
          // pointer tells the user the legend is interactive.
          onHover: (e) => {
            if (e?.native?.target) e.native.target.style.cursor = "pointer";
          },
          onLeave: (e) => {
            if (e?.native?.target) e.native.target.style.cursor = "default";
          },
        },
        tooltip: {
          backgroundColor: colori.sfondoTooltip,
          titleColor: colori.testoTooltip,
          bodyColor: colori.testoTooltip,
          footerColor: colori.testoTooltip,
          borderColor: colori.griglia,
          borderWidth: 1,
          padding: 10,
          usePointStyle: true,
          callbacks: {
            title: (items) => {
              const p = ps[items[0]?.dataIndex];
              return p ? `${p.titolo}${p.parziale ? " (parziale)" : ""}` : "";
            },
            label: (item) =>
              `${item.dataset.label}: ${formatValore(item.parsed.y)}`,
            footer: (items) =>
              `Totale: ${formatValore(items.reduce((a, it) => a + num(it.parsed.y), 0))}`,
          },
        },
      },
    },
  };
}
