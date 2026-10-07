import { useEffect, useRef } from "react";
import { IGNORA, MASCHERA, PRIVATO } from "./maschera.js";

// rrweb 2.x event kind that opens every checkout (followed by a full snapshot).
const EVENTO_META = 4;
const CHECKOUT_MS = 10000;

// Every input type goes through maskInputFn, which masks only private fields:
// the user's «Maschera i dati» is applied at send time, not while recording.
const TUTTI_GLI_INPUT = Object.fromEntries(
  [
    "color",
    "date",
    "datetime-local",
    "email",
    "month",
    "number",
    "range",
    "search",
    "tel",
    "text",
    "time",
    "url",
    "week",
    "textarea",
    "select",
    "password",
  ].map((t) => [t, true]),
);
const mascheraPrivati = (testo, elemento) =>
  elemento?.type === "password" || elemento?.closest?.(PRIVATO)
    ? MASCHERA
    : testo;

/**
 * Sliding window over rrweb events: keeps the last `durataMs` plus the
 * checkout (Meta + full snapshot) right before them, so the slice always
 * starts from a full snapshot and replays on its own.
 */
export function creaFinestraVideo({ durataMs }) {
  let eventi = [];
  const pota = (adesso) => {
    const limite = adesso - durataMs;
    let inizio = 0;
    eventi.forEach((e, i) => {
      if (e.type === EVENTO_META && e.timestamp <= limite) inizio = i;
    });
    if (inizio > 0) eventi = eventi.slice(inizio);
  };
  return {
    aggiungi(evento) {
      eventi.push(evento);
      if (evento.type === EVENTO_META) pota(evento.timestamp);
    },
    estrai(adesso = Date.now()) {
      pota(adesso);
      return eventi.slice();
    },
  };
}

const misura = (valore) => new Blob([JSON.stringify(valore)]).size;

/**
 * Cuts a recording down to `maxByte`, keeping the final seconds: whole
 * checkouts are dropped from the start. `null` when not even the last one fits.
 */
export function troncaVideo(eventi, maxByte) {
  let resto = eventi;
  while (resto.length > 0 && misura(resto) > maxByte) {
    const prossimo = resto.findIndex((e, i) => i > 0 && e.type === EVENTO_META);
    if (prossimo === -1) return null;
    resto = resto.slice(prossimo);
  }
  return resto.length > 0 ? resto : null;
}

/**
 * Records the page with rrweb while `attivo`, in memory only, keeping the
 * last `durataSec` seconds. rrweb is loaded on demand: a portal with reports
 * switched off never downloads it.
 */
export function useRegistrazione(attivo, durataSec) {
  const finestra = useRef(null);
  useEffect(() => {
    if (!attivo || typeof window === "undefined") return undefined;
    let ferma = null;
    let annullato = false;
    const f = creaFinestraVideo({ durataMs: durataSec * 1000 });
    finestra.current = f;
    import("rrweb")
      .then(({ record }) => {
        if (annullato) return;
        ferma = record({
          emit: (evento) => f.aggiungi(evento),
          checkoutEveryNms: CHECKOUT_MS,
          blockSelector: IGNORA,
          maskTextSelector: PRIVATO,
          maskInputOptions: TUTTI_GLI_INPUT,
          maskInputFn: mascheraPrivati,
        });
      })
      .catch(() => {
        /* no recording available: reports go without video */
      });
    return () => {
      annullato = true;
      ferma?.();
      finestra.current = null;
    };
  }, [attivo, durataSec]);
  const api = useRef({ eventi: () => finestra.current?.estrai() ?? [] });
  return api.current;
}
