import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, test, vi } from "vitest";
import { AppShell, COLORI_PORTALE, LogoV, TESSERE_PORTALE, useFaviconVuscom } from "../src/index.js";
import { NAVY_ORIGINALE, leggiPortale, ricolora, rgb, svuotaCache, tesseraDaColore } from "../src/brand/colore.js";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  svuotaCache();
});

test("known keys are unchanged: bundled tile, immediate", () => {
  const { container } = render(<LogoV portale="outbound" />);
  expect(container.querySelector("[data-portale]").getAttribute("src")).toBe(TESSERE_PORTALE.outbound);
});

test("no key means the neutral light/dark pair (public navy)", () => {
  const { container } = render(<LogoV />);
  expect(container.querySelectorAll("img")).toHaveLength(2);
  expect(container.querySelector("[data-portale]")).toBeNull();
});

test("leggiPortale accepts key, hex, { colore } and degrades on garbage", () => {
  expect(leggiPortale("offerte")).toEqual({ chiave: "offerte" });
  expect(leggiPortale("#0E7490")).toEqual({ colore: "#0e7490" });
  expect(leggiPortale({ colore: "#0e7490" })).toEqual({ colore: "#0e7490" });
  for (const x of ["#12", "#gggggg", "#0e749", { colore: "red" }, {}, 5, null, undefined, ""])
    expect(leggiPortale(x)).toBeNull();
});

test("ricolora maps the navy background to the new colour and keeps white", () => {
  const px = new Uint8ClampedArray([...NAVY_ORIGINALE, 255, 255, 255, 255, 255, 0, 0, 0, 7]);
  ricolora(px, rgb("#0e7490"));
  expect([...px.slice(0, 4)]).toEqual([14, 116, 144, 255]);
  expect([...px.slice(4, 8)]).toEqual([255, 255, 255, 255]);
  expect(px[11]).toBe(7); // alpha untouched
});

test("without canvas (jsdom) a hex portal falls back to the neutral V and never throws", async () => {
  expect(await tesseraDaColore("#0e7490")).toBeNull();
  const { container } = render(<LogoV portale="#0e7490" />);
  expect(container.querySelectorAll("img")).toHaveLength(2);
  const malformed = render(<LogoV portale="#nope" />);
  expect(malformed.container.querySelector("[data-portale]")).toBeNull();
});

function falsoCanvas() {
  const ctx = {
    drawImage: vi.fn(),
    getImageData: vi.fn(() => ({ data: new Uint8ClampedArray([...NAVY_ORIGINALE, 255]) })),
    putImageData: vi.fn(),
  };
  const creaOriginale = document.createElement.bind(document);
  const creati = [];
  vi.spyOn(document, "createElement").mockImplementation((tag) => {
    if (tag !== "canvas") return creaOriginale(tag);
    creati.push(1);
    return { width: 0, height: 0, getContext: () => ctx, toDataURL: () => "data:image/png;base64,GEN" };
  });
  vi.stubGlobal("navigator", { userAgent: "browser" });
  vi.stubGlobal(
    "Image",
    class {
      naturalWidth = 1;
      naturalHeight = 1;
      set src(_) {
        queueMicrotask(() => this.onload());
      }
    },
  );
  return { ctx, creati };
}

test("with canvas the tile is generated, used by LogoV and the favicon, and cached per colour", async () => {
  const { ctx, creati } = falsoCanvas();
  const { container } = render(<LogoV portale={{ colore: "#0e7490" }} />);
  await waitFor(() => expect(container.querySelector("[data-portale]")).not.toBeNull());
  expect(container.querySelector("[data-portale]").getAttribute("src")).toBe("data:image/png;base64,GEN");
  expect([...ctx.putImageData.mock.calls[0][0].data.slice(0, 3)]).toEqual([14, 116, 144]);

  function F() {
    useFaviconVuscom("#0E7490"); // same colour, different case
    return null;
  }
  render(<F />);
  await waitFor(() =>
    expect(document.head.querySelector('link[rel~="icon"]').getAttribute("href")).toBe("data:image/png;base64,GEN"),
  );
  expect(creati).toHaveLength(1); // one generation for both
  await tesseraDaColore("#0e7490");
  expect(creati).toHaveLength(1);
  await tesseraDaColore("#123456");
  expect(creati).toHaveLength(2);
});

test("AppShell accepts a hex iconaPortale without breaking", () => {
  const { container } = render(
    <MemoryRouter>
      <AppShell sidebar={{ nav: [], iconaPortale: "#0e7490" }}>x</AppShell>
    </MemoryRouter>,
  );
  expect(container.querySelectorAll("img").length).toBeGreaterThan(0);
});

// --- the conformity tester -------------------------------------------------

const BIN = resolve("bin/conformita.mjs");
function tester(iconaPortale) {
  const dir = mkdtempSync(join(tmpdir(), "conf-"));
  mkdirSync(join(dir, "src"));
  writeFileSync(join(dir, "package.json"), JSON.stringify({ name: "x", dependencies: { "@vuscom/ui": "1.10.0" } }));
  writeFileSync(join(dir, "src", "App.jsx"), `const sidebar = { guida: "/g", portali: [], iconaPortale: ${iconaPortale} };\n`);
  let out;
  try {
    out = execFileSync("node", [BIN, "--json", "--offline"], { cwd: dir, encoding: "utf8" });
  } catch (e) {
    out = e.stdout;
  }
  const r = JSON.parse(out);
  return [...r.bloccanti, ...r.avvisi].filter((d) => d.codice.startsWith("icona-portale"));
}

test("tester: a valid distinct hex is accepted", () => {
  expect(tester('"#0e7490"')).toEqual([]);
  expect(tester('{ colore: "#0e7490" }')).toEqual([]);
});

test("tester: known keys still pass, unknown words still block", () => {
  expect(tester('"outbound"')).toEqual([]);
  const r = tester('"inventato"');
  expect(r).toHaveLength(1);
  expect(r[0].gravita).toBe("blocca");
});

test("tester: a malformed hex is blocking", () => {
  for (const v of ['"#12345"', '"#gg0000"', '{ colore: "#abc" }']) {
    const r = tester(v);
    expect(r).toHaveLength(1);
    expect(r[0]).toMatchObject({ codice: "icona-portale", gravita: "blocca" });
  }
});

test("tester: a colour too close to an existing portal or to navy is only a warning", () => {
  const vicino = tester('"#2865e8"'); // ~ offerte
  expect(vicino).toHaveLength(1);
  expect(vicino[0]).toMatchObject({ codice: "icona-portale-vicina", gravita: "avvisa" });
  expect(vicino[0].messaggio).toContain("offerte");
  expect(tester('"#1d3c6a"')[0].gravita).toBe("avvisa"); // ~ navy
});

test("tester rules mirror COLORI_PORTALE", () => {
  const regole = JSON.parse(readFileSync("bin/conformita-regole.json", "utf8"));
  expect(regole.colori_portali).toEqual(COLORI_PORTALE);
  expect(regole.navy_pubblico).toBe("#1b3a69");
  expect(regole.regole.map((r) => r.codice)).toContain("icona-portale-vicina");
});
