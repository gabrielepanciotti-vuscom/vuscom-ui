import { useEffect, useState } from "react";

export const BASE_SSO = "/api/auth/sso";

// Concurrent 401s (several requests failing together) share one exchange.
let inCorso = null;

/**
 * Trades the VUS COM session cookie (`vuscom_auth.sso`) for this portal's login
 * answer. Resolves to that answer, or `null` when there is no valid session
 * (401) or no access to this portal (403): then show the login form.
 */
export function scambiaSessioneVuscom({ base = BASE_SSO } = {}) {
  if (!inCorso) {
    inCorso = (async () => {
      try {
        const res = await fetch(`${base}/scambia`, { method: "POST", credentials: "same-origin" });
        return res.ok ? await res.json() : null;
      } catch {
        return null;
      } finally {
        inCorso = null;
      }
    })();
  }
  return inCorso;
}

/** Ends the VUS COM session on this browser (every portal). Never throws. */
export async function esciSessioneVuscom({ base = BASE_SSO } = {}) {
  try {
    await fetch(`${base}/esci`, { method: "POST", credentials: "same-origin" });
  } catch {
    // offline: the portal logout still happens
  }
}

/**
 * On mount, when the portal has no session of its own (`autenticato` false),
 * tries the VUS COM session before the login form is shown.
 * `onAccesso(risposta)` receives exactly what the password login returns.
 * Returns `{ verificando }`: render a loader, not the form, while true.
 */
export function useSessioneVuscom({ autenticato, onAccesso, base = BASE_SSO } = {}) {
  const [verificando, setVerificando] = useState(!autenticato);

  useEffect(() => {
    if (autenticato) {
      setVerificando(false);
      return undefined;
    }
    let attivo = true;
    setVerificando(true);
    scambiaSessioneVuscom({ base }).then(async (dati) => {
      if (dati && attivo) await onAccesso?.(dati);
      if (attivo) setVerificando(false);
    });
    return () => {
      attivo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autenticato, base]);

  return { verificando };
}
