import { render, screen, fireEvent, act } from "@testing-library/react";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { TopScrollX, DataOra, DataTable } from "../../src/index.js";

test("senza ResizeObserver (jsdom) misura una volta e non si rompe", () => {
  expect(typeof ResizeObserver).toBe("undefined");
  render(<TopScrollX><p>contenuto</p></TopScrollX>);
  expect(screen.getByText("contenuto")).toBeInTheDocument();
  expect(screen.queryByTestId("top-scroll-x")).toBeNull();
});

describe("con overflow e ResizeObserver", () => {
  let osservati;
  beforeEach(() => {
    osservati = [];
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(cb) { this.cb = cb; osservati.push(this); }
        observe() {}
        disconnect() {}
      },
    );
    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(1000);
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(400);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  test("mostra la barra in alto, larga quanto il contenuto, e le due si seguono", () => {
    const { container } = render(<TopScrollX className="x"><table /></TopScrollX>);
    const top = screen.getByTestId("top-scroll-x");
    expect(top.firstChild).toHaveStyle({ width: "1000px" });
    const body = container.querySelector(".x");
    top.scrollLeft = 120;
    fireEvent.scroll(top);
    expect(body.scrollLeft).toBe(120);
    // l'eco dell'evento sull'altra barra non rimbalza
    fireEvent.scroll(body);
    expect(top.scrollLeft).toBe(120);
    body.scrollLeft = 300;
    fireEvent.scroll(body);
    expect(top.scrollLeft).toBe(300);
  });

  test("la barra sparisce quando il contenuto torna a stare", () => {
    render(<TopScrollX><table /></TopScrollX>);
    expect(screen.getByTestId("top-scroll-x")).toBeInTheDocument();
    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(400);
    act(() => osservati[0].cb());
    expect(screen.queryByTestId("top-scroll-x")).toBeNull();
  });
});

test("DataTable usa TopScrollX e la colonna srOnly nasconde l'intestazione", () => {
  render(
    <DataTable
      columns={[{ key: "a", header: "A" }, { key: "az", header: "Azioni", srOnly: true }]}
      rows={[{ id: 1, a: "x" }]}
      rowKey={(r) => r.id}
    />,
  );
  expect(screen.getByText("Azioni")).toHaveClass("sr-only");
  expect(screen.getAllByRole("cell")[0]).toHaveClass("px-3", "py-2.5");
});

describe("DataOra", () => {
  test("giorno sopra, hh:mm sotto, niente secondi", () => {
    render(<DataOra value="2026-03-05T14:07:59" />);
    expect(screen.getByText("05/03/2026")).toBeInTheDocument();
    expect(screen.getByText("14:07")).toBeInTheDocument();
  });
  test("soloData omette l'ora", () => {
    render(<DataOra value="2026-03-05T14:07:59" soloData />);
    expect(screen.queryByText("14:07")).toBeNull();
  });
  test.each([null, "", "non-una-data"])("trattino per %p", (v) => {
    const { container } = render(<DataOra value={v} />);
    expect(container.textContent).toBe("—");
  });
});

// --- tester di conformità: tabella larga senza TopScrollX -------------------

const BIN = resolve("bin/conformita.mjs");
function tester(file) {
  const dir = mkdtempSync(join(tmpdir(), "conf-tl-"));
  mkdirSync(join(dir, "src"));
  writeFileSync(join(dir, "package.json"), JSON.stringify({ name: "x", dependencies: { "@vuscom/ui": "1.18.0" } }));
  writeFileSync(join(dir, "src", "T.jsx"), file);
  let out;
  try {
    out = execFileSync("node", [BIN, "--json", "--offline"], { cwd: dir, encoding: "utf8" });
  } catch (e) {
    out = e.stdout;
  }
  const r = JSON.parse(out);
  return [...r.bloccanti, ...r.avvisi].filter((d) => d.codice === "tabella-larga");
}
const tabella = (n, extra = "") =>
  `${extra}export const T = () => <table><thead><tr>${"<th>c</th>".repeat(n)}</tr></thead></table>;`;

test("tester: 7+ colonne senza TopScrollX avvisa, 6 o con TopScrollX no", () => {
  const r = tester(tabella(7));
  expect(r).toHaveLength(1);
  expect(r[0].gravita).toBe("avvisa");
  expect(tester(tabella(6))).toEqual([]);
  expect(tester(tabella(9, 'import { TopScrollX } from "@vuscom/ui";\n'))).toEqual([]);
});
