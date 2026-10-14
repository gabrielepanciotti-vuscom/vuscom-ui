import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { vi } from "vitest";
import { VediCome } from "../../src/index.js";

const viste = [
  { key: "viewer", label: "Viewer", descrizione: "Sola lettura" },
  { key: "manager", label: "Manager", descrizione: "Operativo" },
];

test("no views → nothing rendered", () => {
  const { container } = render(<VediCome viste={[]} onSeleziona={() => {}} />);
  expect(container).toBeEmptyDOMElement();
});

test("closed by default, opens with title, views and descriptions", async () => {
  render(<VediCome viste={viste} onSeleziona={() => {}} nota="Solo ciò che vedi." />);
  expect(screen.queryByRole("menu")).toBeNull();
  const bottone = screen.getByRole("button", { name: /Vedi come/ });
  expect(bottone).toHaveAttribute("aria-expanded", "false");
  await userEvent.click(bottone);
  expect(screen.getByRole("menu", { name: "Vedi l'app come" })).toBeInTheDocument();
  expect(screen.getByRole("menuitemradio", { name: /Viewer.*Sola lettura/ })).toHaveAttribute("aria-checked", "false");
  expect(screen.getByText("Solo ciò che vedi.")).toBeInTheDocument();
  // Nothing active: the reset entry is disabled.
  expect(screen.getByRole("menuitem", { name: "Torna alla vista reale" })).toBeDisabled();
});

test("selecting a view calls onSeleziona and closes", async () => {
  const onSeleziona = vi.fn();
  render(<VediCome viste={viste} onSeleziona={onSeleziona} />);
  await userEvent.click(screen.getByRole("button", { name: /Vedi come/ }));
  await userEvent.click(screen.getByRole("menuitemradio", { name: /Manager/ }));
  expect(onSeleziona).toHaveBeenCalledWith("manager");
  expect(screen.queryByRole("menu")).toBeNull();
});

test("active view: amber trigger, checked entry, reset to null", async () => {
  const onSeleziona = vi.fn();
  render(
    <VediCome viste={viste} attiva="viewer" onSeleziona={onSeleziona} labelRipristino="Torna alla vista reale (Superadmin)" />,
  );
  const bottone = screen.getByRole("button", { name: /Vista: Viewer/ });
  expect(bottone.className).toMatch(/amber/);
  await userEvent.click(bottone);
  expect(screen.getByRole("menuitemradio", { name: /Viewer/ })).toHaveAttribute("aria-checked", "true");
  await userEvent.click(screen.getByRole("menuitem", { name: "Torna alla vista reale (Superadmin)" }));
  expect(onSeleziona).toHaveBeenCalledWith(null);
});

test("labelAttiva overrides the active label", () => {
  render(<VediCome viste={viste} attiva="viewer" labelAttiva="Mario (demo)" onSeleziona={() => {}} />);
  expect(screen.getByRole("button", { name: /Vista: Mario \(demo\)/ })).toBeInTheDocument();
});

test("click outside and Escape close the panel", async () => {
  render(
    <div>
      <span>fuori</span>
      <VediCome viste={viste} onSeleziona={() => {}} />
    </div>,
  );
  const bottone = screen.getByRole("button", { name: /Vedi come/ });
  await userEvent.click(bottone);
  await userEvent.click(screen.getByText("fuori"));
  expect(screen.queryByRole("menu")).toBeNull();
  await userEvent.click(bottone);
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("menu")).toBeNull();
});

// --- conformity tester: a private copy of the selector blocks --------------

const BIN = resolve("bin/conformita.mjs");
function tester(file) {
  const dir = mkdtempSync(join(tmpdir(), "conf-vc-"));
  mkdirSync(join(dir, "src"));
  writeFileSync(join(dir, "package.json"), JSON.stringify({ name: "x", dependencies: { "@vuscom/ui": "1.14.0" } }));
  writeFileSync(join(dir, "src", "Top.jsx"), file);
  let out;
  try {
    out = execFileSync("node", [BIN, "--json", "--offline"], { cwd: dir, encoding: "utf8" });
  } catch (e) {
    out = e.stdout;
  }
  const r = JSON.parse(out);
  return [...r.bloccanti, ...r.avvisi].filter((d) => d.codice === "vedi-come");
}

test("tester: a hand-written switcher blocks", () => {
  const offerte = `export default function ViewAsSwitcher() { return <span>Vedi come</span>; }`;
  const portale = `export default function VediComeMenu() { return <div>Vedi il portale come</div>; }`;
  for (const f of [offerte, portale]) {
    const r = tester(f);
    expect(r).toHaveLength(1);
    expect(r[0].gravita).toBe("blocca");
  }
});

test("tester: VediCome from the package passes", () => {
  const ok = `import { VediCome } from "@vuscom/ui";\nexport const T = () => <VediCome titolo="Vedi il portale come" viste={[]} />;`;
  expect(tester(ok)).toEqual([]);
  expect(tester(`export const X = 1;`)).toEqual([]);
});

test("tester: prose comments about the view are not a copy", () => {
  const auth = `/** Ruoli selezionabili nella vista "vedi come". */\n// with a "vedi come" view active\nexport const R = [];`;
  expect(tester(auth)).toEqual([]);
  expect(tester(`export const T = () => <button>Vedi come</button>;`)).toHaveLength(1);
});
