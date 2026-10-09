import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { readFileSync } from "node:fs";
import { AppShell, COLORI_PORTALE, LoginPage, LOGHI_VUSCOM, TESSERE_PORTALE } from "../src/index.js";

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

test("each internal portal has its own tile colour, shown in the sidebar", () => {
  expect(new Set(Object.values(COLORI_PORTALE)).size).toBe(Object.keys(COLORI_PORTALE).length);
  const { container } = render(
    <MemoryRouter>
      <AppShell sidebar={{ nav: [], iconaPortale: "outbound" }}>x</AppShell>
    </MemoryRouter>,
  );
  const tessera = container.querySelector("[data-portale]");
  expect(tessera.getAttribute("data-portale")).toBe("outbound");
  expect(tessera.getAttribute("src")).toBe(TESSERE_PORTALE.outbound);
  expect(Object.keys(TESSERE_PORTALE).sort()).toEqual(Object.keys(COLORI_PORTALE).sort());
});

test("the tab icon is the portal's own tile", () => {
  render(
    <MemoryRouter>
      <AppShell sidebar={{ nav: [], iconaPortale: "cruscotto" }}>x</AppShell>
    </MemoryRouter>,
  );
  expect(document.head.querySelector('link[rel~="icon"]').getAttribute("href")).toBe(TESSERE_PORTALE.cruscotto);
});

test("the conformity tester knows exactly the portals that have a colour", () => {
  const regole = JSON.parse(readFileSync("bin/conformita-regole.json", "utf8"));
  expect([...regole.portali_interni].sort()).toEqual(Object.keys(COLORI_PORTALE).sort());
});
