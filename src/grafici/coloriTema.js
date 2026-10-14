/**
 * Chart colours read from the theme tokens at runtime, so a chart follows the
 * portal theme (light/dark) without a single hard-coded colour. Series use the
 * categorical tokens --chart-1 … --chart-8, cycling past the eighth.
 */
export const SERIE_TEMA = 8;

const leggi = (stile, nome, riserva) => {
  const v = stile?.getPropertyValue(`--${nome}`).trim();
  return v ? v : riserva;
};
const hsl = (v, alfa) => (alfa === undefined ? `hsl(${v})` : `hsl(${v} / ${alfa})`);

/** Colours of the current theme: series palette plus text, grid and tooltip. */
export function coloriTema(el = typeof document !== "undefined" ? document.documentElement : null) {
  const stile = el && typeof getComputedStyle === "function" ? getComputedStyle(el) : null;
  const serie = Array.from({ length: SERIE_TEMA }, (_, i) => hsl(leggi(stile, `chart-${i + 1}`, "0 0% 50%")));
  return {
    serie,
    testo: hsl(leggi(stile, "muted-foreground", "0 0% 45%")),
    primoPiano: hsl(leggi(stile, "foreground", "0 0% 10%")),
    griglia: hsl(leggi(stile, "border", "0 0% 90%")),
    sfondoTooltip: hsl(leggi(stile, "popover", "0 0% 100%")),
    testoTooltip: hsl(leggi(stile, "popover-foreground", "0 0% 10%")),
  };
}

/** Colour of series `i`: its own `tono` (1…8, a chart token) or the next one in order. */
export const coloreSerie = (colori, i, tono) =>
  colori.serie[((tono ? tono - 1 : i) % SERIE_TEMA + SERIE_TEMA) % SERIE_TEMA];
