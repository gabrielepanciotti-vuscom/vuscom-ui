import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable } from "../../src/index.js";

const rows = [
  { id: 1, nome: "Beta", lead: 10 },
  { id: 2, nome: "alfa", lead: 200 },
  { id: 3, nome: "Gamma", lead: null },
];
const columns = [
  { key: "nome", header: "Nome", sortable: true },
  { key: "lead", header: "Lead", sortable: true, align: "right" },
];

const nomi = () =>
  screen
    .getAllByRole("row")
    .slice(1)
    .map((r) => within(r).getAllByRole("cell")[0].textContent);

test("sorts by column and toggles direction, nulls last", async () => {
  render(<DataTable columns={columns} rows={rows} rowKey={(r) => r.id} />);
  await userEvent.click(screen.getByRole("button", { name: "Lead" }));
  expect(nomi()).toEqual(["Beta", "alfa", "Gamma"]);
  await userEvent.click(screen.getByRole("button", { name: "Lead" }));
  expect(nomi()).toEqual(["alfa", "Beta", "Gamma"]);
});

test("string sort is case-insensitive italian", async () => {
  render(<DataTable columns={columns} rows={rows} rowKey={(r) => r.id} />);
  await userEvent.click(screen.getByRole("button", { name: "Nome" }));
  expect(nomi()).toEqual(["alfa", "Beta", "Gamma"]);
});

test("aria-sort follows the active column", async () => {
  render(<DataTable columns={columns} rows={rows} rowKey={(r) => r.id} />);
  const th = screen.getByRole("columnheader", { name: "Nome" });
  expect(th).toHaveAttribute("aria-sort", "none");
  await userEvent.click(screen.getByRole("button", { name: "Nome" }));
  expect(th).toHaveAttribute("aria-sort", "ascending");
});

test("row click and keyboard", async () => {
  const onRowClick = vi.fn();
  render(
    <DataTable
      columns={columns}
      rows={rows}
      rowKey={(r) => r.id}
      onRowClick={onRowClick}
    />,
  );
  const riga = screen.getAllByRole("row")[1];
  riga.focus();
  await userEvent.keyboard("{Enter}");
  expect(onRowClick).toHaveBeenCalledWith(rows[0]);
});

test("empty state", () => {
  render(
    <DataTable
      columns={columns}
      rows={[]}
      rowKey={(r) => r.id}
      empty="Niente qui"
    />,
  );
  expect(screen.getByText("Niente qui")).toBeInTheDocument();
});

test("default empty state and loading skeleton", () => {
  const { rerender } = render(
    <DataTable columns={columns} rows={[]} rowKey={(r) => r.id} />,
  );
  expect(screen.getByText("Nessun dato")).toBeInTheDocument();
  rerender(
    <DataTable columns={columns} rows={[]} rowKey={(r) => r.id} loading />,
  );
  expect(screen.queryByText("Nessun dato")).not.toBeInTheDocument();
});

test("annuncia il caricamento sulla tabella", () => {
  render(
    <DataTable
      columns={columns}
      rows={rows}
      rowKey={(r) => r.id}
      loading
      caption="Elenco contatti"
    />,
  );
  expect(screen.getByRole("table")).toHaveAttribute("aria-busy", "true");
});

test("mostra l'errore e consente di riprovare", async () => {
  const onRetry = vi.fn();
  render(
    <DataTable
      columns={columns}
      rows={rows}
      rowKey={(r) => r.id}
      error="Impossibile caricare i dati"
      onRetry={onRetry}
    />,
  );
  expect(screen.getByRole("alert")).toHaveTextContent("Impossibile caricare i dati");
  await userEvent.click(screen.getByRole("button", { name: "Riprova" }));
  expect(onRetry).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole("table")).toBeNull();
});

test("mobileCards conserva la resa della cella e rende cliccabile ogni Card", async () => {
  const onRowClick = vi.fn();
  render(
    <DataTable
      columns={[...columns, { key: "descrizione", header: "Descrizione", cell: (r) => <strong>{r.nome} esteso</strong> }]}
      rows={rows}
      rowKey={(r) => r.id}
      onRowClick={onRowClick}
      mobileCards
    />,
  );
  const cards = screen.getAllByRole("button", { name: /nome.*beta.*lead.*10.*descrizione.*beta esteso/i });
  expect(cards).toHaveLength(1);
  await userEvent.click(cards[0]);
  await userEvent.keyboard("{Enter}");
  expect(onRowClick).toHaveBeenCalledWith(rows[0]);
  expect(screen.getAllByText("Beta esteso")).toHaveLength(2);
  expect(screen.getByRole("table").parentElement).toHaveClass("hidden", "sm:block");
});
