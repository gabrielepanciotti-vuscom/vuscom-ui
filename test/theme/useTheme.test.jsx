import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useTheme, ThemeToggle, THEME_INIT_SCRIPT } from "../../src/index.js";

beforeEach(() => {
  localStorage.clear();
  document.documentElement.className = "";
});

test("toggle adds .dark and persists", async () => {
  render(<ThemeToggle />);
  await userEvent.click(screen.getByRole("switch", { name: /tema scuro/i }));
  expect(document.documentElement.classList.contains("dark")).toBe(true);
  expect(localStorage.getItem("theme")).toBe("dark");
});

test("init script applies stored theme before React", () => {
  localStorage.setItem("theme", "dark");
  new Function(THEME_INIT_SCRIPT)();
  expect(document.documentElement.classList.contains("dark")).toBe(true);
});

test("useTheme reads initial class", () => {
  document.documentElement.classList.add("dark");
  let api;
  function Probe() {
    api = useTheme();
    return null;
  }
  render(<Probe />);
  expect(api.theme).toBe("dark");
  act(() => api.setTheme("light"));
  expect(document.documentElement.classList.contains("dark")).toBe(false);
});
