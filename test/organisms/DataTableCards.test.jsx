import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  DataTable,
  DataTableCards,
  contenutoCella,
} from "../../src/index.js";

const rows = [
  { id: 1, nome: "Alfa", lead: 10 },
  { id: 2, nome: "Beta", lead: 20 },
  { id: 3, nome: "Gamma", lead: 30 },
];
const columns = [
  { key: "nome", header: "Nome", cell: (row) => <strong>{row.nome}</strong> },
  { key: "lead", header: "Lead" },
];

test("mobileCards è disattivato per default", () => {
  const { container } = render(
    <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} />,
  );
  expect(container.querySelector(".sm\\:hidden")).toBeNull();
  expect(container.querySelector(".hidden.sm\\:block")).toBeNull();
});

test("mobileCards affianca alla tabella desktop card con etichette e celle", () => {
  const { container } = render(
    <DataTable
      columns={columns}
      rows={rows.slice(0, 1)}
      rowKey={(row) => row.id}
      mobileCards
    />,
  );
  expect(container.querySelector(".hidden.sm\\:block table")).toBeInTheDocument();
  const cards = container.querySelector(".sm\\:hidden");
  expect(cards).toBeInTheDocument();
  expect(within(cards).getByText("Nome").tagName).toBe("DT");
  expect(within(cards).getByText("Alfa").tagName).toBe("STRONG");
  expect(within(cards).getByText("Lead")).toBeInTheDocument();
  expect(within(cards).getByText("10")).toBeInTheDocument();
});

test("riusa barre, renderer e intestazioni sr-only", () => {
  const colonne = [
    { key: "nome", header: "Nome" },
    { key: "lead", header: "Azioni", srOnly: true, bar: true },
  ];
  const { container } = render(
    <DataTableCards
      columns={colonne}
      rows={rows.slice(0, 1)}
      rowKey={(row) => row.id}
      massimi={{ lead: 20 }}
    />,
  );
  expect(screen.getByText("Azioni")).toHaveClass("sr-only");
  expect(container.querySelector("[data-barra] > div")).toHaveStyle({ width: "50%" });
  expect(contenutoCella(columns[0], rows[0], {})).toEqual(
    <strong>Alfa</strong>,
  );
});

test("card cliccabile attiva la riga con click, Invio e Spazio", async () => {
  const onRowClick = vi.fn();
  render(
    <DataTableCards
      columns={columns}
      rows={rows.slice(0, 1)}
      rowKey={(row) => row.id}
      onRowClick={onRowClick}
      massimi={{}}
    />,
  );
  const card = screen.getByRole("button");
  await userEvent.click(card);
  card.focus();
  fireEvent.keyDown(card, { key: "Enter" });
  fireEvent.keyDown(card, { key: " " });
  expect(onRowClick).toHaveBeenCalledTimes(3);
  expect(onRowClick).toHaveBeenNthCalledWith(1, rows[0]);
});

test("link, pulsanti e data-no-row-click non attivano la riga", async () => {
  const onRowClick = vi.fn();
  const onButton = vi.fn();
  render(
    <DataTableCards
      columns={[
        {
          key: "azioni",
          header: "Azioni",
          cell: () => (
            <>
              <a href="#dettaglio"><span>Dettaglio</span></a>
              <button type="button" onClick={onButton}><span>Modifica</span></button>
              <span data-no-row-click>Nota</span>
            </>
          ),
        },
      ]}
      rows={rows.slice(0, 1)}
      rowKey={(row) => row.id}
      onRowClick={onRowClick}
      massimi={{}}
    />,
  );
  await userEvent.click(screen.getByText("Dettaglio"));
  await userEvent.click(screen.getByText("Modifica"));
  await userEvent.click(screen.getByText("Nota"));
  expect(onButton).toHaveBeenCalledTimes(1);
  expect(onRowClick).not.toHaveBeenCalled();
});

test("senza onRowClick le card non fingono di essere pulsanti", () => {
  render(
    <DataTableCards
      columns={columns}
      rows={rows.slice(0, 1)}
      rowKey={(row) => row.id}
      massimi={{}}
    />,
  );
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});

test("la paginazione mostra nelle card solo la pagina corrente", async () => {
  const { container } = render(
    <DataTable
      columns={columns}
      rows={rows}
      rowKey={(row) => row.id}
      pageSize={1}
      mobileCards
    />,
  );
  const cards = container.querySelector(".sm\\:hidden");
  expect(within(cards).getByText("Alfa")).toBeInTheDocument();
  expect(within(cards).queryByText("Beta")).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Pagina successiva" }));
  expect(within(cards).getByText("Beta")).toBeInTheDocument();
  expect(within(cards).queryByText("Alfa")).not.toBeInTheDocument();
});
