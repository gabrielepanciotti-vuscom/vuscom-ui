import { defineConfig } from "vitest/config";

export default defineConfig({
  oxc: { jsx: { runtime: "automatic" } },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.js"],
    // The dev box is shared (load often above the core count): interaction tests
    // with several round trips overran the 5 s default without being wrong.
    testTimeout: 20000,
  },
});
