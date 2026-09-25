import { useEffect, useState } from "react";
import { messaggioErrore } from "./formato.js";

export const RITARDO_RICERCA_MS = 300;
export const MINIMO_CARATTERI = 2;

/**
 * Debounced search of existing accounts: one call 300 ms after the last
 * keystroke, only from 2 characters (the backend answers 422 below that).
 * `risultati` is null until a search has completed.
 */
export function useRicerca({ client, basePath, testo }) {
  const [risultati, setRisultati] = useState(null);
  const [cercando, setCercando] = useState(false);
  const [errore, setErrore] = useState(null);

  useEffect(() => {
    const q = testo.trim();
    if (q.length < MINIMO_CARATTERI) {
      setRisultati(null);
      setCercando(false);
      setErrore(null);
      return undefined;
    }
    let annullata = false;
    setCercando(true);
    const timer = setTimeout(async () => {
      try {
        const dati = await client.get(`${basePath}/cerca?q=${encodeURIComponent(q)}`);
        if (annullata) return;
        setRisultati(Array.isArray(dati) ? dati : []);
        setErrore(null);
      } catch (err) {
        if (!annullata) setErrore(messaggioErrore(err));
      } finally {
        if (!annullata) setCercando(false);
      }
    }, RITARDO_RICERCA_MS);
    return () => {
      annullata = true;
      clearTimeout(timer);
    };
  }, [client, basePath, testo]);

  return { risultati, cercando, errore };
}
