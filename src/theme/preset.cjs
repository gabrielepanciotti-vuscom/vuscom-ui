/** Tailwind preset of the VUS COM design system. Apps add it with `presets: [require("@vuscom/ui/preset")]`. */
const c = (name) => `hsl(var(--${name}))`;
const pair = (name) => ({ DEFAULT: c(name), foreground: c(`${name}-foreground`) });
module.exports = {
  darkMode: "class",
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
    extend: {
      colors: {
        border: c("border"),
        input: c("input"),
        ring: c("ring"),
        background: c("background"),
        foreground: c("foreground"),
        primary: pair("primary"),
        secondary: pair("secondary"),
        muted: pair("muted"),
        accent: pair("accent"),
        destructive: pair("destructive"),
        success: pair("success"),
        warning: pair("warning"),
        info: pair("info"),
        card: pair("card"),
        popover: pair("popover"),
        app: c("app-bg"),
        chart: { 1: c("chart-1"), 2: c("chart-2"), 3: c("chart-3"), 4: c("chart-4"), 5: c("chart-5"), 6: c("chart-6"), 7: c("chart-7"), 8: c("chart-8") },
      },
      // Bare `border` / `divide-y` (preflight) would otherwise fall back to gray-200 in dark mode.
      borderColor: { DEFAULT: c("border") },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },
      keyframes: {
        "fade-in": { from: { opacity: "0", transform: "translateY(4px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "slide-in": { from: { opacity: "0", transform: "translateX(16px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
      },
      animation: {
        "fade-in": "fade-in 180ms ease-out",
        "slide-in": "slide-in 200ms ease-out",
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
};
