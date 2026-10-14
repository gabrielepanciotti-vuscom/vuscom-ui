// "@vuscom/ui/grafici": charts. Needs the optional peer chart.js 4.4.x; kept out
// of the main entry so a portal without charts never has to install it.
export { default as GraficoBarre } from "./GraficoBarre.jsx";
export { configGraficoBarre, normalizzaPeriodi } from "./configBarre.js";
export { coloriTema, coloreSerie, SERIE_TEMA } from "./coloriTema.js";
