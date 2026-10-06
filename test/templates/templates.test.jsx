import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { LayoutDashboard, Users } from "lucide-react";
import { AppShell, PageHeader, Section, LoginPage } from "../../src/index.js";

const future = { v7_startTransition: true, v7_relativeSplatPath: true };

test("app shell renders nav, content and mobile menu button", () => {
  render(
    <MemoryRouter initialEntries={["/"]} future={future}>
      <AppShell
        sidebar={{
          appName: "Outbound",
          nav: [
            { id: "home", label: "Panoramica", to: "/", icon: LayoutDashboard },
          ],
          adminNav: [{ id: "u", label: "Utenti", to: "/utenti", icon: Users }],
          user: { username: "g", ruolo: "admin" },
          onLogout: () => {},
        }}
      >
        <p>Contenuto</p>
      </AppShell>
    </MemoryRouter>,
  );
  expect(screen.getByText("Contenuto")).toBeInTheDocument();
  expect(screen.getAllByText("Panoramica").length).toBeGreaterThan(0);
  expect(
    screen.getByRole("button", { name: /apri menu/i }),
  ).toBeInTheDocument();
});

test("app shell shows topbarRight and persists the collapsed state", async () => {
  localStorage.removeItem("vuscom.sidebar.collapsed");
  render(
    <MemoryRouter initialEntries={["/"]} future={future}>
      <AppShell
        topbarRight={<span>Destra</span>}
        sidebar={{
          appName: "Outbound",
          nav: [
            { id: "home", label: "Panoramica", to: "/", icon: LayoutDashboard },
          ],
          user: { username: "g" },
          onLogout: () => {},
        }}
      >
        <p>x</p>
      </AppShell>
    </MemoryRouter>,
  );
  expect(screen.getByText("Destra")).toBeInTheDocument();
  await userEvent.click(
    screen.getAllByRole("button", { name: "Comprimi menu" })[0],
  );
  expect(localStorage.getItem("vuscom.sidebar.collapsed")).toBe("true");
});

test("page header with actions and help link", () => {
  render(
    <PageHeader
      title="Campagne"
      description="Tutte le campagne"
      helpHref="/guida#campagne"
      actions={<button>Nuova</button>}
    />,
  );
  expect(
    screen.getByRole("heading", { level: 1, name: "Campagne" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /guida/i })).toHaveAttribute(
    "href",
    "/guida#campagne",
  );
});

test("section renders title and actions", () => {
  render(
    <Section title="Dettagli" actions={<button>Azione</button>}>
      <p>corpo</p>
    </Section>,
  );
  expect(
    screen.getByRole("heading", { level: 2, name: "Dettagli" }),
  ).toBeInTheDocument();
  expect(screen.getByText("corpo")).toBeInTheDocument();
});

test("login submits credentials and shows error", async () => {
  const onSubmit = vi
    .fn()
    .mockRejectedValue(new Error("Credenziali non valide"));
  render(
    <LoginPage
      title="Outbound"
      logoLight="/l.png"
      logoDark="/d.png"
      onSubmit={onSubmit}
    />,
  );
  await userEvent.type(screen.getByLabelText(/username/i), "mario");
  await userEvent.type(screen.getByLabelText(/^password/i), "x");
  await userEvent.click(screen.getByRole("button", { name: /accedi/i }));
  expect(onSubmit).toHaveBeenCalledWith("mario", "x");
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Credenziali non valide",
  );
});

test("login keeps autocomplete attributes for password managers", () => {
  render(
    <LoginPage title="X" logoLight="/l" logoDark="/d" onSubmit={vi.fn()} />,
  );
  expect(screen.getByLabelText(/username/i)).toHaveAttribute(
    "autocomplete",
    "username",
  );
  expect(screen.getByLabelText(/^password/i)).toHaveAttribute(
    "autocomplete",
    "current-password",
  );
});

test("login toggles password visibility", async () => {
  render(
    <LoginPage title="X" logoLight="/l" logoDark="/d" onSubmit={vi.fn()} />,
  );
  const pw = screen.getByLabelText(/^password/i);
  expect(pw).toHaveAttribute("type", "password");
  await userEvent.click(
    screen.getByRole("button", { name: "Mostra password" }),
  );
  expect(pw).toHaveAttribute("type", "text");
});
