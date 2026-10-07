import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppShell, DataTable, KpiCard } from "../../src/index.js";

const future = { v7_startTransition: true, v7_relativeSplatPath: true };

test("AppShell renders azioniSidebar next to the theme toggle", () => {
  render(
    <MemoryRouter initialEntries={["/"]} future={future}>
      <AppShell
        sidebar={{ appName: "Cruscotto", nav: [], user: { username: "g" } }}
        azioniSidebar={<button type="button">Segnala un problema</button>}
      >
        <p>Contenuto</p>
      </AppShell>
    </MemoryRouter>,
  );
  const azioni = screen.getAllByRole("button", { name: "Segnala un problema" });
  expect(azioni.length).toBeGreaterThan(0);
  // Same row as the theme toggle.
  const riga = azioni[0].parentElement;
  expect(
    riga.querySelector('[aria-label*="tema" i], [title*="tema" i]'),
  ).not.toBeNull();
});

test("KpiCard with segnala prop exposes data-segnala", () => {
  const { container } = render(
    <KpiCard
      label="Clienti attivi"
      value={12}
      segnala={{ tipo: "kpi", id: "kpi_clienti", nome: "Clienti attivi" }}
    />,
  );
  const nodo = container.querySelector("[data-segnala]");
  expect(nodo).not.toBeNull();
  expect(JSON.parse(nodo.getAttribute("data-segnala"))).toEqual({
    tipo: "kpi",
    id: "kpi_clienti",
    nome: "Clienti attivi",
  });
  const { container: senza } = render(<KpiCard label="X" value={1} />);
  expect(senza.querySelector("[data-segnala]")).toBeNull();
});

test("DataTable with segnala exposes it on the table and on its columns", () => {
  const { container } = render(
    <DataTable
      segnala={{ tipo: "tabella", id: "t_clienti", nome: "Clienti" }}
      columns={[
        { key: "nome", header: "Nome" },
        {
          key: "margine",
          header: "Margine",
          segnala: { tipo: "colonna", id: "margine", nome: "Margine" },
        },
      ]}
      rows={[{ id: 1, nome: "A", margine: 3 }]}
      rowKey={(r) => r.id}
    />,
  );
  const nodi = [...container.querySelectorAll("[data-segnala]")].map((n) =>
    JSON.parse(n.getAttribute("data-segnala")),
  );
  expect(nodi[0]).toMatchObject({ tipo: "tabella", id: "t_clienti" });
  // Header cell and body cell of the column.
  expect(nodi.filter((n) => n.tipo === "colonna")).toHaveLength(2);
});
