// @vitest-environment node
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const css = readFileSync(
  new URL("../../src/theme/theme.css", import.meta.url),
  "utf8",
);
const blocco = (sel) => {
  const i = css.indexOf(sel);
  const body = css.slice(css.indexOf("{", i) + 1, css.indexOf("}", i));
  return new Set([...body.matchAll(/--([\w-]+)\s*:/g)].map((m) => m[1]));
};
test("light and dark define the same token set", () => {
  const light = blocco(":root {");
  const dark = blocco(".dark {");
  expect(light.size).toBeGreaterThan(20);
  expect([...light].filter((t) => !dark.has(t))).toEqual([]);
  expect([...dark].filter((t) => !light.has(t))).toEqual([]);
});
test("primary is the portals blue; vuscom.it yellow only as accento", () => {
  expect(css).toMatch(/--primary:\s*221\.2 83\.2% 53\.3%/);
  expect(css).toMatch(/--accento:\s*45 97% 58%/);
  expect(css).toMatch(/--brand-from:\s*288 45% 35%/);
});
test("preset uses class dark mode and system font", () => {
  const preset = require("../../src/theme/preset.cjs");
  expect(preset.darkMode).toBe("class");
  expect(preset.theme.extend.colors.primary.DEFAULT).toBe(
    "hsl(var(--primary))",
  );
  expect(JSON.stringify(preset.theme.extend.fontFamily ?? {})).not.toMatch(
    /Inter/,
  );
});
