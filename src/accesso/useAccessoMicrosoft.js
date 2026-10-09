import { useCallback, useEffect, useState } from "react";
import { PARAMETRO_ACCEDI } from "./portali.js";

export const BASE_MICROSOFT = "/api/auth/microsoft";

// Codes sent back by vuscom-auth's callback in `#microsoft_errore=<code>`.
export const MESSAGGI_ERRORE_MICROSOFT = {
  annullato: "Accesso con Microsoft annullato.",
  scaduto: "La richiesta di accesso è scaduta: riprova.",
  non_abilitato:
    "Il tuo account Microsoft non è abilitato a questo portale. Chiedi l'accesso a un amministratore.",
  errore: "Accesso con Microsoft non riuscito. Riprova o usa la password.",
};

/** Reads and removes the callback's result from the URL fragment. */
function leggiFrammento() {
  if (typeof window === "undefined") return {};
  const frammento = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const biglietto = frammento.get("microsoft");
  const errore = frammento.get("microsoft_errore");
  if (biglietto || errore) {
    // Cleared before anything else: the ticket must not stay in history, and a
    // second effect run (StrictMode) must not trade it again.
    const { pathname, search } = window.location;
    window.history.replaceState(window.history.state, "", pathname + search);
  }
  return { biglietto, errore };
}

/**
 * True once if the page was opened with `?accedi=microsoft` (a tile of another
 * portal): the parameter is removed so a reload or a failed login does not loop.
 */
function chiestoDaAltroPortale() {
  if (typeof window === "undefined") return false;
  const url = new URL(window.location.href);
  if (url.searchParams.get(PARAMETRO_ACCEDI) !== "microsoft") return false;
  url.searchParams.delete(PARAMETRO_ACCEDI);
  window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  return true;
}

/**
 * "Accedi con Microsoft" against `vuscom_auth.entra`.
 * `onAccesso(risposta)` receives exactly what the portal's password login returns
 * and must store it the same way. Returns `{ disponibile, inCorso, errore, accedi }`.
 */
export default function useAccessoMicrosoft({ base = BASE_MICROSOFT, onAccesso } = {}) {
  const [disponibile, setDisponibile] = useState(false);
  const [inCorso, setInCorso] = useState(false);
  const [errore, setErrore] = useState("");

  useEffect(() => {
    let attivo = true;
    const automatico = chiestoDaAltroPortale();
    const { biglietto, errore: codice } = leggiFrammento();
    if (codice) {
      setErrore(MESSAGGI_ERRORE_MICROSOFT[codice] || MESSAGGI_ERRORE_MICROSOFT.errore);
    }
    if (biglietto) {
      setInCorso(true);
      (async () => {
        try {
          const res = await fetch(`${base}/scambia`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ biglietto }),
          });
          const dati = await res.json().catch(() => ({}));
          if (!res.ok) {
            throw new Error(
              typeof dati?.detail === "string" ? dati.detail : MESSAGGI_ERRORE_MICROSOFT.errore,
            );
          }
          await onAccesso?.(dati);
        } catch (err) {
          if (attivo) setErrore(err?.message || MESSAGGI_ERRORE_MICROSOFT.errore);
        } finally {
          if (attivo) setInCorso(false);
        }
      })();
    }
    (async () => {
      try {
        const res = await fetch(`${base}/disponibile`);
        const dati = res.ok ? await res.json() : {};
        if (!attivo) return;
        setDisponibile(dati?.disponibile === true);
        // Coming from another portal: start the Microsoft login right away. With a
        // Microsoft session already open the user comes back logged in, no click.
        if (automatico && dati?.disponibile === true && !biglietto && !codice) {
          setInCorso(true);
          window.location.assign(`${base}/login`);
        }
      } catch {
        if (attivo) setDisponibile(false); // no answer = no button
      }
    })();
    return () => {
      attivo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base]);

  const accedi = useCallback(() => {
    setInCorso(true);
    window.location.assign(`${base}/login`);
  }, [base]);

  return { disponibile, inCorso, errore, accedi };
}
