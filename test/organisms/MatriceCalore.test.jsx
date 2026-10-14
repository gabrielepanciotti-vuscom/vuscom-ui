import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { MatriceCalore, intensita } from "../../src/index.js";

const righe = [
  { id: "a", label: "Alfa", valori: { "2026-09": 100, "2026-10": 25 } },
  { id: "b", label: "Beta", valori: { "2026-09": 0, "2026-10": 75 } },
];
const periodi = ["2026-09", { key: "2026-10", parziale: true }];

test("sqrt intensity scale on the maximum", () => {
  expect(intensita(100, 100)).toBe(1);
  expect(intensita(25, 100)).toBe(0.5);
  expect(intensita(0, 100)).toBe(0);
  expect(intensita(5, 0)).toBe(0);
  expect(intensita(200, 100)).toBe(1);
});

test("totals, shares, totals row and partial headers", () => {
  render(<MatriceCalore righe={righe} periodi={periodi} caption="Esiti" />);
  const tabella = screen.getByRole("table", { name: "Esiti" });
  const alfa = within(tabella).getByRole("row", { name: /Alfa/ });
  const celle = within(alfa).getAllByRole("cell").map((c) => c.textContent);
  expect(celle).toEqual(["100", "25", "125", "62,5%"]);
  const totali = within(tabella).getAllByRole("row").at(-1);
  expect(within(totali).getAllByRole("cell").map((c) => c.textContent)).toEqual([
    "100",
    "100",
    "200",
    "100%",
  ]);
  const parziale = screen.getByRole("columnheader", { name: /ott 2026.*parziale/ });
  expect(parziale).toHaveAttribute("title", "Periodo parziale");
  expect(screen.getByText(/periodo parziale/)).toBeInTheDocument();
});

test("cells are coloured from the primary token, empty cells are not", () => {
  const { container } = render(<MatriceCalore righe={righe} periodi={periodi} />);
  const celle = container.querySelectorAll("td[data-intensita]");
  expect(celle[0].getAttribute("data-intensita")).toBe("1.000");
  expect(celle[0].style.backgroundColor).toContain("var(--primary)");
  expect(celle[1].getAttribute("data-intensita")).toBe("0.500");
  expect(celle[2].style.backgroundColor).toBe("");
  expect(container.innerHTML).not.toMatch(/#[0-9a-f]{3,6}\b/i);
});

test("row click and keyboard call back with the row", async () => {
  const onRigaClick = vi.fn();
  render(<MatriceCalore righe={righe} periodi={periodi} onRigaClick={onRigaClick} />);
  await userEvent.click(screen.getByRole("rowheader", { name: "Beta" }));
  expect(onRigaClick).toHaveBeenLastCalledWith(righe[1]);
  screen.getByRole("row", { name: /Alfa/ }).focus();
  await userEvent.keyboard("{Enter}");
  expect(onRigaClick).toHaveBeenLastCalledWith(righe[0]);
});

test("optional columns off, empty state", () => {
  const { rerender } = render(
    <MatriceCalore righe={righe} periodi={periodi} totale={false} quota={false} rigaTotali={false} />,
  );
  expect(screen.queryByRole("columnheader", { name: "Quota" })).toBeNull();
  expect(screen.getAllByRole("row")).toHaveLength(3);
  rerender(<MatriceCalore righe={[]} periodi={periodi} />);
  expect(screen.getByText("Nessun dato nel periodo")).toBeInTheDocument();
});
