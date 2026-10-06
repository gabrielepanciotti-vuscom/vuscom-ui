import { cn } from "../../src/lib/cn.js";
test("merges and dedupes tailwind classes", () => {
  expect(cn("px-2 py-1", false && "hidden", "px-4")).toBe("py-1 px-4");
});
