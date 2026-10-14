import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

// jsdom has no canvas: a fake Chart records what the component hands to Chart.js.
const istanze = [];
vi.mock("chart.js", () => {
  class Chart {
    static register() {}
    constructor(_tela, config) {
      this.config = config;
      this.update = vi.fn();
      this.destroy = vi.fn();
      istanze.push(this);
    }
  }
  const x = {};
  return { Chart, BarController: x, BarElement: x, CategoryScale: x, LinearScale: x, Legend: x, Tooltip: x };
});

const { default: AndamentoCampagna } = await import("../../../src/grafici/report/AndamentoCampagna.jsx");

test("fewer than two periods: no fake chart, the history note instead", () => {
  render(<AndamentoCampagna periodi={[{ key: "2026-10" }]} serie={[]} inCostruzione="Storico in costruzione, prima foto mensile il 1/11." />);
  expect(screen.getByRole("status")).toHaveTextContent("prima foto mensile il 1/11");
  expect(document.querySelector("canvas")).toBeNull();
  expect(istanze).toHaveLength(0);
});

test("two periods or more: one stacked chart", () => {
  render(
    <AndamentoCampagna
      periodi={[{ key: "2026-09" }, { key: "2026-10", parziale: true }]}
      serie={[{ id: "a", label: "Attive", valori: { "2026-09": 10, "2026-10": 12 } }]}
    />,
  );
  expect(istanze).toHaveLength(1);
  expect(istanze[0].config.options.scales.y.stacked).toBe(true);
  expect(istanze[0].config.data.labels).toEqual(["set 2026", "ott 2026 *"]);
});
