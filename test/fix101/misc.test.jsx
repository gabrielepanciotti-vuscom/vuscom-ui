import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Link } from "react-router-dom";
import { FileText, Folder } from "lucide-react";
import {
  AppShell,
  Checkbox,
  Field,
  LoginPage,
  Select,
  Tabs,
  THEME_INIT_SCRIPT,
  Toggle,
  formatNumero,
  formatRelativo,
  useTabIds,
} from "../../src/index.js";

const future = { v7_startTransition: true, v7_relativeSplatPath: true };

test("formatNumero raises the max digits when min exceeds the default", () => {
  expect(
    formatNumero(0.256, { style: "percent", minimumFractionDigits: 1 }),
  ).toBe("25,6%");
});

test("formatRelativo describes future dates", () => {
  const ora = new Date("2026-09-30T10:00:00Z");
  expect(formatRelativo("2026-09-30T10:15:00Z", ora)).toBe("tra 15 min");
  expect(formatRelativo("2026-09-30T13:00:00Z", ora)).toBe("tra 3 ore");
  expect(formatRelativo("2026-10-03T10:00:00Z", ora)).toBe("tra 3 giorni");
  expect(formatRelativo("2026-09-30T10:00:20Z", ora)).toBe("adesso");
});

test("theme init script falls back to matchMedia when storage throws", () => {
  document.documentElement.className = "";
  const getItem = vi
    .spyOn(Storage.prototype, "getItem")
    .mockImplementation(() => {
      throw new Error("blocked");
    });
  const prima = window.matchMedia;
  window.matchMedia = () => ({ matches: true });
  try {
    new Function(THEME_INIT_SCRIPT)();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  } finally {
    getItem.mockRestore();
    window.matchMedia = prima;
    document.documentElement.className = "";
  }
});

test("toggle and checkbox accept Field wiring and clickable labels", async () => {
  const onToggle = vi.fn();
  const onCheck = vi.fn();
  render(
    <>
      <Field label="Notifiche" hint="Via email">
        <Toggle checked={false} onChange={onToggle} data-x="1" />
      </Field>
      <Toggle checked={false} onChange={onToggle} label="Attiva" />
      <Checkbox checked={false} onChange={onCheck} label="Accetto" id="acc" />
    </>,
  );
  const sw = screen.getByRole("switch", { name: "Notifiche" });
  expect(sw).toHaveAttribute("data-x", "1");
  expect(sw.getAttribute("aria-describedby")).toMatch(/hint/);
  await userEvent.click(screen.getByText("Attiva"));
  expect(onToggle).toHaveBeenCalledWith(true);
  expect(screen.getByRole("checkbox", { name: "Accetto" })).toHaveAttribute(
    "id",
    "acc",
  );
  await userEvent.click(screen.getByText("Accetto"));
  expect(onCheck).toHaveBeenCalledWith(true);
});

test("select chains the consumer's onKeyDown", async () => {
  const onKeyDown = vi.fn();
  render(
    <Select
      aria-label="Priorità"
      value="a"
      onKeyDown={onKeyDown}
      options={[{ value: "a", label: "Alta" }]}
    />,
  );
  screen.getByRole("button", { name: "Priorità" }).focus();
  await userEvent.keyboard("{Enter}");
  expect(onKeyDown).toHaveBeenCalled();
  expect(screen.getByRole("listbox")).toBeInTheDocument();
});

test("tabs ids can be scoped per instance", () => {
  function Due() {
    const a = useTabIds();
    const b = useTabIds();
    const items = [{ id: "x", label: "X" }];
    return (
      <>
        <Tabs idPrefix={a.prefix} value="x" items={items} aria-label="A" />
        <div role="tabpanel" id={a.panel("x")} aria-labelledby={a.tab("x")} />
        <Tabs idPrefix={b.prefix} value="x" items={items} aria-label="B" />
      </>
    );
  }
  render(<Due />);
  const tabs = screen.getAllByRole("tab");
  expect(tabs[0].id).not.toBe(tabs[1].id);
  expect(screen.getByRole("tabpanel", { name: "X" })).toBeInTheDocument();
});

test("tabs keep the legacy ids without a prefix", () => {
  render(<Tabs value="x" items={[{ id: "x", label: "X" }]} />);
  expect(screen.getByRole("tab")).toHaveAttribute("id", "tab-x");
});

test("app shell expands the active group and resets scroll on navigation", async () => {
  const sidebar = {
    appName: "Outbound",
    nav: [
      { id: "home", label: "Home", to: "/" },
      {
        id: "doc",
        label: "Documenti",
        icon: Folder,
        children: [
          { id: "d1", label: "Primo", to: "/doc/1", icon: FileText },
          { id: "d2", label: "Secondo", to: "/doc/2", icon: FileText },
        ],
      },
    ],
    user: { username: "g", ruolo: "admin" },
    onLogout: () => {},
  };
  render(
    <MemoryRouter initialEntries={["/"]} future={future}>
      <AppShell sidebar={sidebar}>
        <Link to="/doc/2">Vai</Link>
      </AppShell>
    </MemoryRouter>,
  );
  const main = screen.getByRole("main");
  let top = 300;
  Object.defineProperty(main, "scrollTop", {
    configurable: true,
    get: () => top,
    set: (v) => {
      top = v;
    },
  });
  expect(screen.queryAllByText("Secondo")).toHaveLength(0);
  await userEvent.click(screen.getByText("Vai"));
  expect(screen.getAllByText("Secondo").length).toBeGreaterThan(0);
  expect(top).toBe(0);
});

test("app shell renders without a sidebar prop", () => {
  render(
    <MemoryRouter future={future}>
      <AppShell>
        <p>Solo</p>
      </AppShell>
    </MemoryRouter>,
  );
  expect(screen.getByText("Solo")).toBeInTheDocument();
});

test("login footer is a div so it can hold blocks and links", () => {
  render(
    <LoginPage
      title="Outbound"
      onSubmit={() => {}}
      footer={<div data-testid="piede">© VUS COM</div>}
    />,
  );
  expect(screen.getByTestId("piede").parentElement.tagName).toBe("DIV");
});
