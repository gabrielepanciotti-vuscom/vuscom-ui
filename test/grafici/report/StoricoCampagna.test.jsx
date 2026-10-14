import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StoricoCampagna, { colonneStorico } from "../../../src/grafici/report/StoricoCampagna.jsx";
import { unisciPerGiorno, voci } from "../../../src/grafici/report/datiReport.js";
import { SOLO } from "./fixture.js";

const giorni = unisciPerGiorno(SOLO("bonus_50"));
const colonne = colonneStorico(voci(giorni));

test("sorted newest first, n.d. for null, bars on the headline counts", () => {
  render(<StoricoCampagna righe={giorni} colonne={colonne} soloMensili={false} />);
  const righe = screen.getAllByRole("row").slice(1);
  expect(within(righe[0]).getByText("14/10/2026")).toBeInTheDocument();
  expect(within(righe[0]).getAllByText("n.d.").length).toBeGreaterThan(0);
  expect(righe[0].querySelectorAll("[data-barra]").length).toBe(4);
  expect(screen.getByRole("button", { name: /Esporta CSV/ })).toBeEnabled();
});

test("paginates after sorting", async () => {
  const molte = Array.from({ length: 12 }, (_, i) => ({ ...giorni[0], data_riferimento: `2026-08-${String(i + 1).padStart(2, "0")}` }));
  render(<StoricoCampagna righe={molte} colonne={colonne} pageSize={5} />);
  expect(screen.getAllByRole("row")).toHaveLength(6);
  expect(screen.getByText("1–5 di 12")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: /Data/ }));
  expect(within(screen.getAllByRole("row")[1]).getByText("01/08/2026")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Pagina successiva" }));
  expect(within(screen.getAllByRole("row")[1]).getByText("06/08/2026")).toBeInTheDocument();
});

test("CSV columns keep raw numbers", () => {
  const costo = colonne.find((c) => c.key === "costo");
  expect(costo.csv(giorni[0])).toBe(1000);
  expect(colonne.find((c) => c.key === "mensile").csv(giorni[0])).toBe("mensile");
});
