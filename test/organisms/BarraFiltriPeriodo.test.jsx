import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { BarraFiltriPeriodo } from "../../src/index.js";

function Prova({ iniziale, onChange = () => {}, ...props }) {
  const [v, setV] = useState(iniziale);
  return (
    <BarraFiltriPeriodo
      value={v}
      onChange={(n) => {
        setV(n);
        onChange(n);
      }}
      {...props}
    />
  );
}

test("typing gg/mm/aaaa sets ISO days and shows chips", async () => {
  const onChange = vi.fn();
  render(<Prova iniziale={{ dal: null, al: null, granularita: "mese" }} onChange={onChange} />);
  const dal = screen.getByLabelText("Dal");
  await userEvent.type(dal, "1/9/2026{Enter}");
  expect(onChange).toHaveBeenLastCalledWith({ dal: "2026-09-01", al: null, granularita: "mese" });
  expect(dal).toHaveValue("01/09/2026");
  expect(screen.getByText("Dal 01/09/2026")).toBeInTheDocument();
  expect(document.querySelector('input[type="date"]')).toBeNull();
});

test("invalid text is flagged and not sent", async () => {
  const onChange = vi.fn();
  render(<Prova iniziale={{ dal: null, al: null, granularita: "mese" }} onChange={onChange} />);
  const al = screen.getByLabelText("Al");
  await userEvent.type(al, "31/02/2026");
  await userEvent.tab();
  expect(al).toHaveAttribute("aria-invalid", "true");
  expect(onChange).not.toHaveBeenCalled();
});

test("calendar picks a date without a native input", async () => {
  const onChange = vi.fn();
  render(<Prova iniziale={{ dal: "2026-10-05", al: null, granularita: "mese" }} onChange={onChange} />);
  await userEvent.click(screen.getAllByRole("button", { name: "Apri calendario" })[0]);
  const dialogo = screen.getByRole("dialog", { name: "Scegli una data" });
  expect(dialogo).toBeInTheDocument();
  expect(screen.getByRole("gridcell", { selected: true })).toHaveTextContent("5");
  await userEvent.keyboard("{ArrowRight}{Enter}");
  expect(onChange).toHaveBeenLastCalledWith({ dal: "2026-10-06", al: null, granularita: "mese" });
  expect(screen.queryByRole("dialog")).toBeNull();
});

test("granularity, chip removal and reset", async () => {
  const onChange = vi.fn();
  const rimuovi = vi.fn();
  render(
    <Prova
      iniziale={{ dal: "2026-09-01", al: "2026-09-30", granularita: "mese" }}
      onChange={onChange}
      filtri={[{ id: "camp", label: "Campagna: Bonus 50", onRemove: rimuovi }]}
    />,
  );
  await userEvent.click(screen.getByRole("radio", { name: "Settimana" }));
  expect(onChange).toHaveBeenLastCalledWith({ dal: "2026-09-01", al: "2026-09-30", granularita: "settimana" });
  await userEvent.click(screen.getByRole("button", { name: "Rimuovi filtro: Al 30/09/2026" }));
  expect(onChange).toHaveBeenLastCalledWith({ dal: "2026-09-01", al: null, granularita: "settimana" });
  await userEvent.click(screen.getByRole("button", { name: "Rimuovi filtro: Campagna: Bonus 50" }));
  expect(rimuovi).toHaveBeenCalled();
  await userEvent.click(screen.getByRole("button", { name: "Azzera filtri" }));
  expect(onChange).toHaveBeenLastCalledWith({ dal: null, al: null, granularita: "mese" });
});

test("reset is disabled at default; inverted range warns", () => {
  const { rerender } = render(
    <BarraFiltriPeriodo value={{ dal: null, al: null, granularita: "mese" }} onChange={() => {}} />,
  );
  expect(screen.getByRole("button", { name: "Azzera filtri" })).toBeDisabled();
  rerender(
    <BarraFiltriPeriodo value={{ dal: "2026-10-10", al: "2026-10-01", granularita: "mese" }} onChange={() => {}} />,
  );
  expect(screen.getByRole("alert")).toHaveTextContent("dopo quella finale");
});
