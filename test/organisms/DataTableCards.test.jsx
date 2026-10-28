import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DataTableCards from "../../src/organisms/DataTableCards.jsx";

test("rende una Card accessibile con etichetta e valore per ogni colonna", async () => {
  const onRowClick = vi.fn();
  const riga = { id: 1, nome: "Ada", ruolo: "Tecnica" };
  render(
    <DataTableCards
      columns={[
        { key: "nome", header: "Nome" },
        { key: "ruolo", header: "Ruolo", cell: (r) => <strong>{r.ruolo}</strong> },
      ]}
      rows={[riga]}
      rowKey={(r) => r.id}
      massimi={{}}
      onRowClick={onRowClick}
    />,
  );
  const card = screen.getByRole("button", { name: /nome.*ada.*ruolo.*tecnica/i });
  await userEvent.keyboard("{Tab}{Enter}");
  expect(onRowClick).toHaveBeenCalledWith(riga);
  expect(card).toHaveClass("focus-visible:ring-2");
});
