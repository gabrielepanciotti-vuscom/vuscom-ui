import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import {
  CalendarioMese,
  ChipFiltro,
  PulsanteEsportaCsv,
  formatDataIt,
  parseDataIt,
} from "../../src/index.js";
import * as csv from "../../src/lib/esportaCsv.js";

test("parseDataIt / formatDataIt", () => {
  expect(parseDataIt("4/10/2026")).toBe("2026-10-04");
  expect(parseDataIt("04.10.2026")).toBe("2026-10-04");
  expect(parseDataIt("")).toBeNull();
  expect(parseDataIt("31/02/2026")).toBeUndefined();
  expect(parseDataIt("2026-10-04")).toBeUndefined();
  expect(formatDataIt("2026-10-04")).toBe("04/10/2026");
  expect(formatDataIt(null)).toBe("");
});

test("CalendarioMese: Monday first, month navigation, min/max", async () => {
  const onChange = vi.fn();
  render(<CalendarioMese value="2026-10-14" oggi="2026-10-14" min="2026-10-02" onChange={onChange} />);
  expect(screen.getAllByRole("columnheader")[0]).toHaveTextContent("lu");
  expect(screen.getByRole("grid", { name: "ottobre 2026" })).toBeInTheDocument();
  expect(screen.getByRole("gridcell", { name: / 1 ottobre 2026$/ })).toBeDisabled();
  await userEvent.click(screen.getByRole("gridcell", { name: / 20 ottobre 2026$/ }));
  expect(onChange).toHaveBeenCalledWith("2026-10-20");
  await userEvent.click(screen.getByRole("button", { name: "Mese successivo" }));
  expect(screen.getByRole("grid", { name: "novembre 2026" })).toBeInTheDocument();
});

test("ChipFiltro removes", async () => {
  const onRemove = vi.fn();
  render(<ChipFiltro onRemove={onRemove}>Stato: attivo</ChipFiltro>);
  await userEvent.click(screen.getByRole("button", { name: "Rimuovi filtro: Stato: attivo" }));
  expect(onRemove).toHaveBeenCalled();
});

test("ChipFiltro removal button extends its clickable area", () => {
  render(<ChipFiltro onRemove={() => {}}>Stato: attivo</ChipFiltro>);
  expect(screen.getByRole("button", { name: "Rimuovi filtro: Stato: attivo" })).toHaveClass(
    "relative",
    "after:absolute",
    "after:-inset-3",
  );
});

test("PulsanteEsportaCsv exports rows read at click time", async () => {
  const spia = vi.spyOn(csv, "esportaCsv").mockImplementation(() => {});
  const cols = [{ key: "a", header: "A" }];
  render(<PulsanteEsportaCsv nomeFile="report" rows={() => [{ a: 1 }]} columns={cols} />);
  await userEvent.click(screen.getByRole("button", { name: "Esporta CSV" }));
  expect(spia).toHaveBeenCalledWith("report", [{ a: 1 }], cols);
  spia.mockRestore();
});

test("PulsanteEsportaCsv disabled with no rows", () => {
  const { container } = render(<PulsanteEsportaCsv rows={[]} columns={[]} />);
  expect(container.querySelector("button")).toBeDisabled();
});
