import { useCallback, useEffect, useRef, useState } from "react";
import { messaggioErrore } from "./formato.js";

/**
 * Runs one async action for a dialog: tracks `inCorso` and the error text
 * coming from the backend `detail`. Resolves to `{ ok: true, valore }` or
 * `{ ok: false, err }`; on failure the message is already on screen unless
 * `gestisci(err)` returns true (the caller shows something better).
 */
export function useAzione() {
  const [inCorso, setInCorso] = useState(false);
  const [errore, setErrore] = useState(null);
  const montato = useRef(true);

  useEffect(() => {
    montato.current = true;
    return () => {
      montato.current = false;
    };
  }, []);

  const esegui = useCallback(async (fn, gestisci) => {
    setInCorso(true);
    setErrore(null);
    try {
      return { ok: true, valore: await fn() };
    } catch (err) {
      if (montato.current && !gestisci?.(err)) setErrore(messaggioErrore(err));
      return { ok: false, err };
    } finally {
      if (montato.current) setInCorso(false);
    }
  }, []);

  return { inCorso, errore, setErrore, esegui };
}
