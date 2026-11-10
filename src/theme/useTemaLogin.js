import { useState } from "react";

/**
 * Applies the saved theme (else the system one) to <html> before the login first paints, so the
 * dark logos and ThemeToggle start right without the portal wiring it. A class already set by the
 * portal's own init (THEME_INIT_SCRIPT) is kept: only runs when no `theme` was ever saved or when
 * the class is missing for a saved "dark".
 */
export default function useTemaLogin() {
  useState(() => {
    if (typeof document === "undefined") return;
    let salvato = null;
    try {
      salvato = window.localStorage.getItem("theme");
    } catch {
      /* storage blocked: follow the system */
    }
    const scuro = salvato
      ? salvato === "dark"
      : (window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false);
    document.documentElement.classList.toggle("dark", scuro);
  });
}
