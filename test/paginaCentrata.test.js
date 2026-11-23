import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { expect, test } from "vitest";

const BIN = resolve("bin/conformita.mjs");
function tester(file) {
  const dir = mkdtempSync(join(tmpdir(), "conf-pc-"));
  mkdirSync(join(dir, "src"));
  writeFileSync(join(dir, "package.json"), JSON.stringify({ name: "x", dependencies: { "@vuscom/ui": "1.18.0" } }));
  writeFileSync(join(dir, "src", "P.jsx"), file);
  let out;
  try {
    out = execFileSync("node", [BIN, "--json", "--offline"], { cwd: dir, encoding: "utf8" });
  } catch (e) {
    out = e.stdout;
  }
  const r = JSON.parse(out);
  return [...r.bloccanti, ...r.avvisi].filter((d) => d.codice === "pagina-centrata");
}
const pagina = (cls) => `export const P = () => <div className="${cls}">x</div>;`;

test("tester: pagina in colonna centrata avvisa, dialog stretto o pagina piena no", () => {
  expect(tester(pagina("mx-auto max-w-6xl p-6"))).toHaveLength(1);
  expect(tester(pagina("max-w-[1280px] mx-auto px-4"))).toHaveLength(1);
  expect(tester(pagina("mx-auto max-w-md"))).toEqual([]);
  expect(tester(pagina("space-y-6"))).toEqual([]);
});
