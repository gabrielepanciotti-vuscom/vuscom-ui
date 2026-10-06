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
