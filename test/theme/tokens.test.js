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
test("dark focus tokens and reduced motion support accessibility", () => {
  const darkStart = css.indexOf(".dark {");
  const dark = css.slice(darkStart, css.indexOf("}", darkStart));
  expect(dark).toMatch(/--input:\s*217\.2 32\.6% 45%/);
  expect(dark).toMatch(/--ring:\s*217 91% 60%/);
  expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
  expect(css).toMatch(/animation-duration:\s*0\.01ms/);
  expect(css).toMatch(/transition-duration:\s*0\.01ms/);
  expect(css).toMatch(/scroll-behavior:\s*auto/);
});
test("focus ring token is never made transparent", () => {
  const files = [
    "../../src/atoms/Input.jsx",
    "../../src/molecules/Checkbox.jsx",
    "../../src/molecules/InfoTip.jsx",
    "../../src/molecules/SegmentedControl.jsx",
    "../../src/molecules/Toggle.jsx",
    "../../src/templates/PageHeader.jsx",
    "../../src/PulsanteGuida.jsx",
  ];
  for (const file of files) {
    const source = readFileSync(new URL(file, import.meta.url), "utf8");
    expect(source).not.toMatch(/focus-visible:ring-ring\/\d+/);
  }
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
