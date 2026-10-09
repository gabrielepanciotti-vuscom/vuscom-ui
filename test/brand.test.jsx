import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppShell, LoginPage, LOGHI_VUSCOM } from "../src/index.js";

afterEach(() => document.head.querySelectorAll('link[rel~="icon"]').forEach((l) => l.remove()));

test("AppShell shows the VUS COM V when the portal passes no appIcon", () => {
  const { getAllByAltText } = render(
    <MemoryRouter>
      <AppShell sidebar={{ appName: "Prova", nav: [] }}>contenuto</AppShell>
    </MemoryRouter>,
  );
  const srcs = getAllByAltText("VUS COM").map((i) => i.getAttribute("src"));
  expect(srcs).toEqual(expect.arrayContaining([LOGHI_VUSCOM.vChiaro, LOGHI_VUSCOM.vScuro]));
});

test("AppShell sets the VUS COM favicon, replacing the portal's one", () => {
  const vecchia = document.createElement("link");
  vecchia.rel = "icon";
  vecchia.href = "/favicon.svg";
  document.head.appendChild(vecchia);
  render(
    <MemoryRouter>
      <AppShell sidebar={{ nav: [] }}>x</AppShell>
    </MemoryRouter>,
  );
  const link = document.head.querySelector('link[rel~="icon"]');
  expect(link.getAttribute("href")).toBe(LOGHI_VUSCOM.favicon);
});

test("LoginPage uses the VUS COM wordmark and favicon by default", () => {
  const { getAllByAltText } = render(<LoginPage title="Prova" onSubmit={async () => {}} />);
  const srcs = getAllByAltText("VUS COM").map((i) => i.getAttribute("src"));
  expect(srcs).toEqual([LOGHI_VUSCOM.marchioChiaro, LOGHI_VUSCOM.marchioScuro]);
  expect(document.head.querySelector('link[rel~="icon"]').getAttribute("href")).toBe(LOGHI_VUSCOM.favicon);
});

test("the sidebar shows the general guide button next to collapse", () => {
  const { getAllByRole } = render(
    <MemoryRouter>
      <AppShell sidebar={{ nav: [], guida: "/guida" }}>x</AppShell>
    </MemoryRouter>,
  );
  const link = getAllByRole("link", { name: "Guida" })[0];
  expect(link.getAttribute("href")).toBe("/guida");
});

test("an external guide opens in a new tab, and no guide means no button", () => {
  const { getAllByRole, unmount } = render(
    <MemoryRouter>
      <AppShell sidebar={{ nav: [], guida: { href: "https://example.org/g", label: "Manuale" } }}>x</AppShell>
    </MemoryRouter>,
  );
  expect(getAllByRole("link", { name: "Manuale" })[0].getAttribute("target")).toBe("_blank");
  unmount();
  const { queryByRole } = render(
    <MemoryRouter>
      <AppShell sidebar={{ nav: [] }}>x</AppShell>
    </MemoryRouter>,
  );
  expect(queryByRole("link", { name: "Guida" })).toBeNull();
});
