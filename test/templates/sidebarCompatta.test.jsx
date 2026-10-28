import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import { afterEach, expect, test, vi } from "vitest";
import { AppShell, useSidebarCompatta } from "../../src/index.js";

const future = { v7_startTransition: true, v7_relativeSplatPath: true };
const KEY = "vuscom.sidebar.collapsed";

function PaginaLarga({ attiva = true }) {
  useSidebarCompatta(attiva);
  return <p>report</p>;
}

function Prova({ richiesteIniziali = 1 }) {
  const [larga, setLarga] = useState(true);
  const [seconda, setSeconda] = useState(richiesteIniziali > 1);
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
        {seconda && <PaginaLarga />}
        <button type="button" onClick={() => setLarga((v) => !v)}>
          cambia prima pagina
        </button>
        <button type="button" onClick={() => setSeconda((v) => !v)}>
          cambia seconda pagina
        </button>
      </AppShell>
    </MemoryRouter>
  );
}

const pulsante = (nome) => screen.getAllByRole("button", { name: nome })[0];

afterEach(() => {
  localStorage.removeItem(KEY);
  vi.restoreAllMocks();
});

test("a page asking for room compacts the sidebar and restores the saved preference on unmount", async () => {
  localStorage.setItem(KEY, "false");
  render(<Prova />);
  expect(pulsante("Espandi menu")).toBeInTheDocument();
  expect(localStorage.getItem(KEY)).toBe("false");

  // leaving the page gives the sidebar back to the user's preference
  await userEvent.click(screen.getByText("cambia prima pagina"));
  expect(pulsante("Comprimi menu")).toBeInTheDocument();
  expect(localStorage.getItem(KEY)).toBe("false");
});

test("forcing and toggling while forced leave the saved preference untouched", async () => {
  localStorage.setItem(KEY, "true");
  const salva = vi.spyOn(Storage.prototype, "setItem");
  render(<Prova />);
  await userEvent.click(pulsante("Espandi menu"));
  expect(pulsante("Comprimi menu")).toBeInTheDocument();
  expect(localStorage.getItem(KEY)).toBe("true");
  await userEvent.click(pulsante("Comprimi menu"));
  expect(pulsante("Espandi menu")).toBeInTheDocument();
  expect(localStorage.getItem(KEY)).toBe("true");
  await userEvent.click(screen.getByText("cambia prima pagina"));
  expect(pulsante("Espandi menu")).toBeInTheDocument();
  expect(salva).not.toHaveBeenCalled();
});

test("two simultaneous requests keep the sidebar compact until both end", async () => {
  localStorage.setItem(KEY, "false");
  render(<Prova richiesteIniziali={2} />);
  expect(pulsante("Espandi menu")).toBeInTheDocument();
  await userEvent.click(screen.getByText("cambia prima pagina"));
  expect(pulsante("Espandi menu")).toBeInTheDocument();
  await userEvent.click(screen.getByText("cambia seconda pagina"));
  expect(pulsante("Comprimi menu")).toBeInTheDocument();
});

test("outside an AppShell the hook is a no-op", () => {
  render(<PaginaLarga />);
  expect(screen.getByText("report")).toBeInTheDocument();
});
