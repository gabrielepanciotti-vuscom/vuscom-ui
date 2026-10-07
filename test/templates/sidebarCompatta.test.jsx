import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import { AppShell, useSidebarCompatta } from "../../src/index.js";

const future = { v7_startTransition: true, v7_relativeSplatPath: true };
const KEY = "vuscom.sidebar.collapsed";

function PaginaLarga() {
  useSidebarCompatta();
  return <p>report</p>;
}

function Prova() {
  const [larga, setLarga] = useState(true);
  return (
    <MemoryRouter initialEntries={["/"]} future={future}>
      <AppShell
        sidebar={{
          appName: "Cruscotto",
          nav: [
            { id: "home", label: "Panoramica", to: "/", icon: LayoutDashboard },
          ],
          user: { username: "g" },
          onLogout: () => {},
        }}
      >
        {larga ? <PaginaLarga /> : <p>altra</p>}
        <button type="button" onClick={() => setLarga((v) => !v)}>
          cambia pagina
        </button>
      </AppShell>
    </MemoryRouter>
  );
}

const pulsante = (nome) => screen.getAllByRole("button", { name: nome })[0];

test("a page asking for room compacts the sidebar without saving it", async () => {
  localStorage.removeItem(KEY);
  render(<Prova />);
  expect(pulsante("Espandi menu")).toBeInTheDocument();
  expect(localStorage.getItem(KEY)).toBeNull();

  // leaving the page gives the sidebar back to the user's preference
  await userEvent.click(screen.getByText("cambia pagina"));
  expect(pulsante("Comprimi menu")).toBeInTheDocument();
});

test("the user can reopen it on that page, and the choice sticks", async () => {
  localStorage.removeItem(KEY);
  render(<Prova />);
  await userEvent.click(pulsante("Espandi menu"));
  expect(pulsante("Comprimi menu")).toBeInTheDocument();
  expect(localStorage.getItem(KEY)).toBeNull();
});

test("a saved compact preference is opened by one click while forced", async () => {
  localStorage.setItem(KEY, "true");
  render(<Prova />);
  await userEvent.click(pulsante("Espandi menu"));
  expect(pulsante("Comprimi menu")).toBeInTheDocument();
  expect(localStorage.getItem(KEY)).toBe("false");
});

test("outside an AppShell the hook does nothing", () => {
  render(<PaginaLarga />);
  expect(screen.getByText("report")).toBeInTheDocument();
});
