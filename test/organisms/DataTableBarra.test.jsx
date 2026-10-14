import { render } from "@testing-library/react";
import { DataTable } from "../../src/index.js";

test("bar column: width proportional to the column maximum", () => {
  const rows = [
    { id: 1, nome: "A", lead: 50 },
    { id: 2, nome: "B", lead: 200 },
    { id: 3, nome: "C", lead: null },
  ];
  const { container } = render(
    <DataTable
      columns={[
        { key: "nome", header: "Nome" },
        { key: "lead", header: "Lead", bar: true, cell: (r) => `${r.lead ?? 0} lead` },
      ]}
      rows={rows}
      rowKey={(r) => r.id}
    />,
  );
  const barre = [...container.querySelectorAll("[data-barra] > div")].map((b) => b.style.width);
  expect(barre).toEqual(["25%", "100%", "0%"]);
  expect(container.querySelector("[data-barra]")).toHaveAttribute("aria-hidden");
  expect(container.textContent).toContain("200 lead");
});

test("barValue overrides the value used for the bar", () => {
  const { container } = render(
    <DataTable
      columns={[{ key: "x", header: "X", bar: true, barValue: (r) => r.n }]}
      rows={[
        { id: 1, x: "uno", n: 1 },
        { id: 2, x: "quattro", n: 4 },
      ]}
      rowKey={(r) => r.id}
    />,
  );
  const barre = [...container.querySelectorAll("[data-barra] > div")].map((b) => b.style.width);
  expect(barre).toEqual(["25%", "100%"]);
});
