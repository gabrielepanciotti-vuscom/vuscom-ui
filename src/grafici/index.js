// "@vuscom/ui/grafici": charts. Needs the optional peer chart.js 4.4.x; kept out
// of the main entry so a portal without charts never has to install it.
export { default as GraficoBarre } from "./GraficoBarre.jsx";
export { configGraficoBarre, normalizzaPeriodi } from "./configBarre.js";
export { coloriTema, coloreSerie, SERIE_TEMA } from "./coloriTema.js";
export { default as Sparkline } from "./Sparkline.jsx";
export { default as PaginaReportCampagna } from "./PaginaReportCampagna.jsx";
export { default as TesseraKpi } from "./report/TesseraKpi.jsx";
export { default as IntestazioneCampagna } from "./report/IntestazioneCampagna.jsx";
export { default as FiltriReport, FILTRI_VUOTI } from "./report/FiltriReport.jsx";
export { default as AndamentoCampagna } from "./report/AndamentoCampagna.jsx";
export { default as StoricoCampagna, colonneStorico } from "./report/StoricoCampagna.jsx";
export { default as VariazioniCampagna, PERIODI_MATRICE } from "./report/VariazioniCampagna.jsx";
export {
  METRICHE_CAMPAGNA,
  ND,
  unisciPerGiorno,
  voci as vociReport,
  ultimaFoto,
  variazioni as variazioniReport,
  formatta as formattaReport,
} from "./report/datiReport.js";
