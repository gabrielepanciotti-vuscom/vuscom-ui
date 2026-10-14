import { render, screen } from "@testing-library/react";
import TesseraKpi from "../../../src/grafici/report/TesseraKpi.jsx";

test("value, delta coloured by what is good news, sparkline", () => {
  render(
    <TesseraKpi label="Storni" valore="8" delta={1} deltaTesto="+1" deltaNota="dal 01/10/2026" meglio="giu" andamento={[2, 5, 8]} />,
  );
  expect(screen.getByText("8")).toBeInTheDocument();
  expect(screen.getByText("+1").className).toMatch(/text-red-700/);
  expect(screen.getByText("dal 01/10/2026")).toBeInTheDocument();
  expect(screen.getByRole("img", { name: "Andamento di Storni" })).toBeInTheDocument();
});

test("same layout without delta or trend; neutral delta without `meglio`", () => {
  const { container, rerender } = render(<TesseraKpi label="Dati al" valore="n.d." />);
  expect(container.firstChild.className).toMatch(/min-h-\[8\.5rem\]/);
  expect(screen.queryByRole("img")).toBeNull();
  rerender(<TesseraKpi label="Beneficiari" valore="140" delta={7} deltaTesto="+7" />);
  expect(screen.getByText("+7").className).toMatch(/text-muted-foreground/);
});
