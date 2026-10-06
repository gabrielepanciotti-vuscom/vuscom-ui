import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { LayoutDashboard, Users } from "lucide-react";
import { AppShell, DataTable, ToastProvider } from "../../src/index.js";

const future = { v7_startTransition: true, v7_relativeSplatPath: true };

// Inline `nav` (a new array each render) must not scroll <main> to the top.
function Shell() {
  const [n, setN] = useState(0);
  return (
    <AppShell
      sidebar={{
        appName: "Hub",
        nav: [
          {
            id: "g",
            label: "Gruppo",
            icon: Users,
            children: [{ id: "a", label: "Voce A", to: "/a" }],
          },
          { id: "home", label: "Home", to: "/", icon: LayoutDashboard },
        ],
        user: { username: "g" },
        onLogout: () => {},
      }}
    >
      <button onClick={() => setN(n + 1)}>rerender {n}</button>
    </AppShell>
  );
}

test("app shell keeps the scroll position across re-renders", async () => {
  render(
    <MemoryRouter initialEntries={["/a"]} future={future}>
      <Shell />
    </MemoryRouter>,
  );
  const main = document.querySelector("main");
  main.scrollTop = 120;
  await userEvent.click(screen.getByText("rerender 0"));
  expect(screen.getByText("rerender 1")).toBeInTheDocument();
  expect(main.scrollTop).toBe(120);
});

test("row click works when a no-row-click wrapper encloses the table", async () => {
  const onRowClick = vi.fn();
  render(
    <div data-no-row-click>
      <DataTable
        columns={[{ key: "nome", header: "Nome" }]}
        rows={[{ id: 1, nome: "Mario" }]}
        rowKey={(r) => r.id}
        onRowClick={onRowClick}
      />
    </div>,
  );
  await userEvent.click(screen.getByText("Mario"));
  expect(onRowClick).toHaveBeenCalledTimes(1);
});

test("empty toast live regions add no spacing", () => {
  render(
    <ToastProvider>
      <p>x</p>
    </ToastProvider>,
  );
  const polite = document.querySelector('[aria-live="polite"]');
  expect(polite.className).not.toMatch(/mt-2/);
  expect(polite.parentElement.className).not.toMatch(/gap-2/);
});
