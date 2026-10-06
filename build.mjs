import { copyFileSync } from "node:fs";
import { build } from "esbuild";

// Bundled as ESM with every runtime dependency left external: the consuming app
// already ships React, the router and the icons, and duplicating React here
// would give the package its own hook dispatcher (the classic "invalid hook
// call" crash).
const common = {
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2020",
  jsx: "automatic",
  loader: { ".js": "jsx", ".jsx": "jsx" },
};

await build({
  ...common,
  entryPoints: ["src/index.js"],
  outfile: "dist/index.js",
  external: ["react", "react-dom", "react/jsx-runtime", "react-router-dom", "lucide-react"],
});

// Second entry "@vuscom/ui/utenti": no react-router-dom here, Outbound has no
// router. Keep it a separate file so importing the users page never pulls the
// sidebar (and its router import) in.
await build({
  ...common,
  entryPoints: ["src/utenti/index.js"],
  outfile: "dist/utenti.js",
  external: ["react", "react-dom", "react/jsx-runtime", "lucide-react"],
});

// Theme assets ship as-is: the preset is CommonJS (Tailwind configs are loaded
// with require) and theme.css is plain CSS, so neither goes through esbuild.
copyFileSync("src/theme/preset.cjs", "dist/preset.cjs");
copyFileSync("src/theme/theme.css", "dist/theme.css");
