import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

// jsdom has no canvas: a fake Chart records what the component hands to Chart.js.
const istanze = [];
vi.mock("chart.js", () => {
  class Chart {
    static register() {}
    constructor(_tela, config) {
      this.data = config.data;
      this.options = config.options;
      this.config = config;
      this.update = vi.fn();
      this.destroy = vi.fn();
      istanze.push(this);
    }
  }
  const x = {};
  return { Chart, BarController: x, BarElement: x, CategoryScale: x, LinearScale: x, Legend: x, Tooltip: x };
});

const { GraficoBarre, configGraficoBarre, coloriTema, coloreSerie } = await import(
  "../../src/grafici/index.js"
);

const periodi = ["2026-09", { key: "2026-10", parziale: true }];
const serie = [
  { id: "ok", label: "Accettate", valori: { "2026-09": 10, "2026-10": 4 } },
  { id: "ko", label: "Rifiutate", valori: [2, 1] },
];

test("theme colours come from the tokens, never hex", () => {
  document.documentElement.style.setProperty("--chart-1", "217 91% 60%");
  document.documentElement.style.setProperty("--border", "214 32% 91%");
  const c = coloriTema();
  expect(c.serie[0]).toBe("hsl(217 91% 60%)");
  expect(c.griglia).toBe("hsl(214 32% 91%)");
  expect(c.serie).toHaveLength(8);
  expect(coloreSerie(c, 9)).toBe(c.serie[1]);
  expect(coloreSerie(c, 0, 3)).toBe(c.serie[2]);
});

test("config: stacked, asterisk on partial periods, tooltip title and total", () => {
  const colori = coloriTema();
  const onPeriodoClick = vi.fn();
  const cfg = configGraficoBarre({ periodi, serie, colori, onPeriodoClick });
  expect(cfg.type).toBe("bar");
  expect(cfg.data.labels).toEqual(["set 2026", "ott 2026 *"]);
  expect(cfg.data.datasets.map((d) => d.data)).toEqual([[10, 4], [2, 1]]);
  expect(cfg.data.datasets[0].backgroundColor).toBe(colori.serie[0]);
  expect(cfg.options.scales.x.stacked).toBe(true);
  expect(cfg.options.scales.y.stacked).toBe(true);
  expect(cfg.options.plugins.legend.display).not.toBe(false);
  const cb = cfg.options.plugins.tooltip.callbacks;
  const items = [
    { dataIndex: 1, parsed: { y: 4 }, dataset: { label: "Accettate" } },
    { dataIndex: 1, parsed: { y: 1 }, dataset: { label: "Rifiutate" } },
  ];
  expect(cb.title(items)).toBe("ottobre 2026 (parziale)");
  expect(cb.label(items[0])).toBe("Accettate: 4");
  expect(cb.footer(items)).toBe("Totale: 5");
  cfg.options.onClick({}, [{ index: 0 }]);
  expect(onPeriodoClick).toHaveBeenCalledWith("2026-09");
  expect(JSON.stringify(cfg.data)).not.toMatch(/#[0-9a-f]{3,6}\b/i);
});

test("side-by-side bars when not stacked", () => {
  const cfg = configGraficoBarre({ periodi, serie, colori: coloriTema(), impilate: false });
  expect(cfg.options.scales.x.stacked).toBe(false);
  expect(cfg.data.datasets[0].stack).toBeUndefined();
});

test("component: one chart, updated in place, destroyed on unmount", () => {
  istanze.length = 0;
  const { rerender, unmount } = render(
    <GraficoBarre periodi={periodi} serie={serie} titolo="Esiti per mese" />,
  );
  expect(istanze).toHaveLength(1);
  expect(screen.getByRole("img", { name: "Esiti per mese" })).toBeInTheDocument();
  expect(screen.getByText(/periodo parziale/)).toBeInTheDocument();
  expect(screen.getByRole("rowheader", { name: "ottobre 2026 (parziale)" })).toBeInTheDocument();
  rerender(<GraficoBarre periodi={periodi} serie={serie.slice(0, 1)} titolo="Esiti per mese" />);
  expect(istanze).toHaveLength(1);
  expect(istanze[0].update).toHaveBeenCalled();
  unmount();
  expect(istanze[0].destroy).toHaveBeenCalled();
});

test("empty state without series", () => {
  render(<GraficoBarre periodi={periodi} serie={[]} />);
  expect(screen.getByText("Nessun dato nel periodo")).toBeInTheDocument();
});
