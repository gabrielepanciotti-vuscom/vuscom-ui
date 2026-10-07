import { createContext, useContext } from "react";

export const SegnalazioniContext = createContext(null);

const SPENTO = Object.freeze({
  abilitato: false,
  apri: () => {},
  stato: "inattivo",
});

/**
 * `{ abilitato, apri(), stato }` of the nearest SegnalazioniProvider.
 * `stato`: `inattivo` · `mirino` (picking an element) · `cattura` (taking the
 * screenshot) · `modale`. Outside a provider: switched off, `apri` does nothing.
 */
export function useSegnalazioni() {
  return useContext(SegnalazioniContext) ?? SPENTO;
}
