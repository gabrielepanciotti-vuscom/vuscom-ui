import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import FiltriReport from "../../../src/grafici/report/FiltriReport.jsx";

test("one row: dates, granularity, reset back to the default", async () => {
  const onChange = vi.fn();
  render(<FiltriReport value={{ dal: "2026-09-01", al: null, granularita: "mese" }} onChange={onChange} />);
  expect(screen.getByRole("group", { name: "Filtri del periodo" })).toBeInTheDocument();
  await userEvent.click(screen.getByRole("radio", { name: "Settimana" }));
  expect(onChange).toHaveBeenLastCalledWith({ dal: "2026-09-01", al: null, granularita: "settimana" });
  await userEvent.click(screen.getByRole("button", { name: /Azzera/ }));
  expect(onChange).toHaveBeenLastCalledWith({ dal: null, al: null, granularita: "mese" });
});

test("inverted range is an error, reset disabled at the default", () => {
  const { rerender } = render(<FiltriReport value={{ dal: "2026-10-10", al: "2026-10-01" }} />);
  expect(screen.getByRole("alert")).toHaveTextContent("dopo quella finale");
  rerender(<FiltriReport />);
  expect(screen.getByRole("button", { name: /Azzera/ })).toBeDisabled();
});
