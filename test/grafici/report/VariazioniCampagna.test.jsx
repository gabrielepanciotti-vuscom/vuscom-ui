import { render, screen } from "@testing-library/react";
import VariazioniCampagna from "../../../src/grafici/report/VariazioniCampagna.jsx";

const periodi = ["2026-08", "2026-09", "2026-10"];
const righe = [
  { id: "a", label: "Forniture attive", valori: { "2026-08": null, "2026-09": 10, "2026-10": 0 } },
  { id: "c", label: "Costo", valori: { "2026-08": null, "2026-09": 500, "2026-10": 1000 } },
];

test("per-row scale, n.d. for missing, real zero shown, net total", () => {
  render(<VariazioniCampagna righe={righe} periodi={periodi} />);
  expect(screen.getAllByText("n.d.")).toHaveLength(2);
  const celle = document.querySelectorAll("td[data-intensita]");
  // Row max: 10 is full intensity in its row even next to 1000.
  expect(celle[1].dataset.intensita).toBe("1.000");
  expect(celle[2]).toHaveTextContent("0");
  expect(screen.getByText("Totale")).toBeInTheDocument();
  expect(document.querySelector("tfoot")).toBeNull();
});

test("too few periods: a note instead of the matrix", () => {
  render(<VariazioniCampagna righe={righe} periodi={periodi.slice(0, 2)} />);
  expect(screen.getByText(/almeno 3 periodi/)).toBeInTheDocument();
  expect(screen.queryByRole("table")).toBeNull();
});
