import { useCallback, useEffect, useState } from "react";

const leggi = () =>
  typeof document !== "undefined" &&
  document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";

export function useTheme() {
  const [theme, setThemeState] = useState(leggi);
  useEffect(() => {
    // Keep several hook instances (sidebar toggle, login page) in sync.
    const obs = new MutationObserver(() => setThemeState(leggi()));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);
  const setTheme = useCallback((t) => {
    document.documentElement.classList.toggle("dark", t === "dark");
    try {
      localStorage.setItem("theme", t);
    } catch {
      /* storage blocked: theme still applies for this page */
    }
    setThemeState(t);
  }, []);
  const toggleTheme = useCallback(
    () => setTheme(leggi() === "dark" ? "light" : "dark"),
    [setTheme],
  );
  return { theme, setTheme, toggleTheme };
}
