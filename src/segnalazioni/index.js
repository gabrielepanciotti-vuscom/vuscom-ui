// Entry "@vuscom/ui/segnalazioni": bug reports from the portals. Kept apart from
// the main entry so rrweb and modern-screenshot are pulled in (and loaded on
// demand) only by the portals that mount the provider.
export { default as SegnalazioniProvider } from "./SegnalazioniProvider.jsx";
export { default as PulsanteSegnala } from "./PulsanteSegnala.jsx";
export { segnalaAttr } from "./segnalaAttr.js";
export { useSegnalazioni } from "./contesto.js";
export {
  PRIVATO,
  mascheraEventi,
  mascheraDom,
  mascheraAzioni,
} from "./maschera.js";
