import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { RIGHE, SOLO } from "./report/fixture.js";

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

const { PaginaReportCampagna } = await import("../../src/grafici/index.js");
const OGGI = "2026-10-14";
const CAMPAGNE = [{ id: "bonus_50", label: "Bonus 50" }, { id: "segnalatori", label: "Segnalatori" }];

beforeEach(() => istanze.splice(0));

test("title, snapshot date, one grid of same-size tiles with deltas", () => {
  render(<PaginaReportCampagna campagne={CAMPAGNE} righe={RIGHE} oggi={OGGI} />);
  expect(screen.getByRole("heading", { level: 1, name: "Bonus 50" })).toBeInTheDocument();
  expect(screen.getByText("Situazione al 14/10/2026")).toBeInTheDocument();
  const griglia = screen.getByRole("region", { name: "Indicatori" });
  const tessere = griglia.children;
  // 6 metrics + 3 indicators (beneficiari, bonus_riconosciuto, dati_al), same component.
  expect(tessere).toHaveLength(9);
  [...tessere].forEach((t) => expect(t.className).toMatch(/min-h-\[8\.5rem\]/));
  expect(within(griglia).getByText("+5")).toBeInTheDocument();
  expect(within(griglia).getAllByText("n.d.").length).toBeGreaterThanOrEqual(2);
  expect(within(griglia).getByText("Beneficiari")).toBeInTheDocument();
});

test("three months: stacked chart, matrix, monthly-only history", () => {
  render(<PaginaReportCampagna campagne={CAMPAGNE} righe={RIGHE} oggi={OGGI} />);
  expect(istanze).toHaveLength(1);
  expect(istanze[0].config.data.datasets.map((d) => d.label)).toEqual(["Forniture attive", "Storni", "Maturati"]);
  expect(istanze[0].config.data.labels.at(-1)).toBe("ott 2026 *");
  expect(screen.getByRole("table", { name: "Variazioni per periodo e indicatore" })).toBeInTheDocument();
  const storico = screen.getByRole("table", { name: "Storico delle foto della campagna" });
  expect(within(storico).getAllByRole("row")).toHaveLength(4);
});

test("a campaign with one period: no chart, history under construction", async () => {
  const onCampagnaChange = vi.fn();
  const { rerender } = render(
    <PaginaReportCampagna campagne={CAMPAGNE} righe={RIGHE} campagna="bonus_50" onCampagnaChange={onCampagnaChange} oggi={OGGI} />,
  );
  await userEvent.click(screen.getByRole("tab", { name: "Segnalatori" }));
  expect(onCampagnaChange).toHaveBeenCalledWith("segnalatori");
  istanze.splice(0);
  rerender(<PaginaReportCampagna campagne={CAMPAGNE} righe={SOLO("segnalatori")} campagna="segnalatori" oggi={OGGI} />);
  expect(screen.getByRole("heading", { level: 1, name: "Segnalatori" })).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("Storico in costruzione, prima foto mensile il 1/11.");
  expect(istanze).toHaveLength(0);
  expect(screen.getByText(/almeno 3 periodi/)).toBeInTheDocument();
  // No monthly photo yet: the table shows the daily ones.
  expect(within(screen.getByRole("table", { name: "Storico delle foto della campagna" })).getAllByRole("row")).toHaveLength(2);
});

test("no rows: empty state; error: alert", () => {
  const { rerender } = render(<PaginaReportCampagna campagne={["bonus_50"]} righe={[]} />);
  expect(screen.getByText("Nessuna foto ancora")).toBeInTheDocument();
  rerender(<PaginaReportCampagna campagne={["bonus_50"]} righe={RIGHE} errore="Timeout" oggi={OGGI} />);
  expect(screen.getByRole("alert")).toHaveTextContent("Timeout");
});
