import { render, screen, renderHook, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  DataTable,
  PageHeader,
  Pagination,
  Section,
  useSort,
} from "../../src/index.js";

test("row click ignores clicks on interactive cell content", async () => {
  const onRowClick = vi.fn();
  const onButton = vi.fn();
  const columns = [
    { key: "nome", header: "Nome" },
    {
      key: "azioni",
      header: "Azioni",
      cell: () => (
        <>
          <button onClick={onButton}>
            <span>Apri</span>
          </button>
          <span data-no-row-click>Nota</span>
        </>
      ),
    },
  ];
  render(
    <DataTable
      columns={columns}
      rows={[{ id: 1, nome: "Mario" }]}
      rowKey={(r) => r.id}
      onRowClick={onRowClick}
    />,
  );
  await userEvent.click(screen.getByText("Apri"));
  expect(onButton).toHaveBeenCalledTimes(1);
  await userEvent.click(screen.getByText("Nota"));
  expect(onRowClick).not.toHaveBeenCalled();
  await userEvent.click(screen.getByText("Mario"));
  expect(onRowClick).toHaveBeenCalledTimes(1);
});

function ordina(valori) {
  const rows = valori.map((v, i) => ({ id: i, v }));
  const { result } = renderHook(() => useSort(rows));
  act(() => result.current.toggle("v"));
  return result.current.sorted.map((r) => r.v);
}

test("useSort compares numeric strings numerically", () => {
  expect(ordina(["10", "9", "100"])).toEqual(["9", "10", "100"]);
});

test("useSort compares dates by value and treats NaN as null", () => {
  const a = new Date("2026-01-02");
  const b = new Date("2025-12-31");
  const c = new Date("2026-03-01");
  expect(ordina([a, b, c])).toEqual([b, a, c]);
  expect(ordina([3, NaN, 1, null])).toEqual([1, 3, NaN, null]);
  const bad = new Date("x");
  expect(ordina([bad, b])[0]).toBe(b);
});

test("pagination clamps an out-of-range page", async () => {
  const onPageChange = vi.fn();
  render(
    <Pagination
      page={9}
      pageSize={10}
      total={25}
      onPageChange={onPageChange}
    />,
  );
  expect(screen.getByText("21–25 di 25")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: /precedente/i }));
  expect(onPageChange).toHaveBeenCalledWith(3);
});

test("pagination offers a way back when one page remains but page > 1", async () => {
  const onPageChange = vi.fn();
  render(
    <Pagination page={3} pageSize={10} total={4} onPageChange={onPageChange} />,
  );
  await userEvent.click(screen.getByRole("button", { name: /precedente/i }));
  expect(onPageChange).toHaveBeenCalledWith(1);
});

test("className passes through on layout components", () => {
  const { container } = render(
    <>
      <DataTable
        className="dt-x"
        columns={[{ key: "a", header: "A" }]}
        rows={[{ a: 1 }]}
        rowKey={(r) => r.a}
      />
      <Pagination
        className="pg-x"
        page={1}
        pageSize={1}
        total={2}
        onPageChange={() => {}}
      />
      <Section className="sc-x" title="S" />
      <PageHeader className="ph-x" title="P" />
    </>,
  );
  for (const c of ["dt-x", "pg-x", "sc-x", "ph-x"]) {
    expect(container.querySelector(`.${c}`)).not.toBeNull();
  }
  expect(container.querySelector(".ph-x")).toHaveClass("mb-6");
});
