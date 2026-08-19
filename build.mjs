import { build } from "esbuild";

// Bundled as ESM with every runtime dependency left external: the consuming app
// already ships React, the router and the icons, and duplicating React here
// would give the package its own hook dispatcher (the classic "invalid hook
// call" crash).
await build({
  entryPoints: ["src/index.js"],
  outfile: "dist/index.js",
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2020",
  jsx: "automatic",
  loader: { ".js": "jsx", ".jsx": "jsx" },
  external: ["react", "react-dom", "react/jsx-runtime", "react-router-dom", "lucide-react"],
});
