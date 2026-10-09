import { Moon, Sun } from "lucide-react";
import { cn } from "../lib/cn.js";
import { useTheme } from "./useTheme.js";

/** Light/dark switch: slate track in light, indigo in dark, knob carrying the icon of the target theme. */
export default function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Tema scuro"
      onClick={toggleTheme}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
        "bg-slate-200 hover:bg-slate-300 active:bg-slate-400/70",
        "dark:bg-brand-600 dark:hover:bg-brand-500 dark:active:bg-brand-700",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 flex h-5 w-5 items-center justify-center rounded-full shadow-sm transition-all duration-200",
          dark ? "left-[22px] bg-brand-950" : "left-0.5 bg-white",
        )}
      >
        {dark ? (
          <Sun className="h-3 w-3 text-amber-400" />
        ) : (
          <Moon className="h-3 w-3 text-slate-500" />
        )}
      </span>
    </button>
  );
}
