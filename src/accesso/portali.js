/**
 * The internal portals and how to reach them, in one place (vuscom-db#89).
 *
 * Before this list every login page carried its own copy of the sibling links,
 * so each portal knew a different subset and none knew the user's permissions.
 *
 * Each portal has an internal address (`*.vuscom.dev`, LAN/Tailscale, where
 * «Accedi con Microsoft» works) and, where it exists, a public one (`*.vuscom.it`).
 * A link always stays in the zone the user is already in: from `*.vuscom.it` an
 * internal-only portal is not offered, because its name would not resolve.
 *
 * Keys are the portal codes of `user_progetto_ruolo` (and of COLORI_PORTALE).
 */
export const PORTALI_INTERNI = Object.freeze([
  {
    codice: "offerte",
    nome: "Hub Offerte",
    interno: "https://offerte.vuscom.dev",
    pubblico: "https://offerte.vuscom.it",
  },
  {
    codice: "cruscotto",
    nome: "Cruscotto",
    interno: "https://cruscotto.vuscom.dev",
    pubblico: "https://cruscotto.vuscom.it",
  },
  {
    codice: "outbound",
    nome: "Campagne",
    interno: "https://campagne.vuscom.dev",
  },
  {
    codice: "configuratore",
    nome: "Configuratore",
    interno: "https://configuratore.vuscom.dev/dashboard",
  },
  {
    codice: "dataapi",
    nome: "Admin Data API",
    interno: "https://api.vuscom.dev/admin/",
  },
]);

/** Query parameter that makes the destination start «Accedi con Microsoft» by itself. */
export const PARAMETRO_ACCEDI = "accedi";

const CHIAVE_RICORDATI = "vuscom.portali";

function zonaPubblica(hostname) {
  return /\.vuscom\.it$/i.test(hostname || "");
}

/**
 * Where to send the user for `portale`, or null when that portal is not reachable
 * from the zone of the current page. The internal address carries `?accedi=microsoft`:
 * with a Microsoft session already open the user lands logged in.
 */
export function indirizzoPortale(
  portale,
  hostname = globalThis.location?.hostname,
) {
  if (zonaPubblica(hostname)) return portale.pubblico || null;
  const url = new URL(portale.interno);
  url.searchParams.set(PARAMETRO_ACCEDI, "microsoft");
  return url.toString();
}

/** Remembers, in this browser, the portals of the user who just logged in. */
export function ricordaPortali(codici) {
  if (!Array.isArray(codici)) return;
  try {
    localStorage.setItem(CHIAVE_RICORDATI, JSON.stringify(codici));
  } catch {
    // Private window or blocked storage: the login page falls back to every portal.
  }
}

/** The portals of the last user who logged in from this browser, or null if unknown. */
export function portaliRicordati() {
  try {
    const valore = JSON.parse(localStorage.getItem(CHIAVE_RICORDATI) || "null");
    return Array.isArray(valore) ? valore : null;
  } catch {
    return null;
  }
}

/**
 * The other portals to offer: all internal ones but the current, filtered by
 * `codici` when known (the user's access), and reachable from this zone.
 *
 * With nobody known (`codici` null) the internal zone offers every portal, as the
 * hand-written lists did; a public zone (`*.vuscom.it`) offers none, because the
 * person in front of it may be an external agent or a client.
 */
export function altriPortali({ corrente, codici, hostname = globalThis.location?.hostname } = {}) {
  if (!codici && zonaPubblica(hostname)) return [];
  return PORTALI_INTERNI.filter((p) => p.codice !== corrente)
    .filter((p) => !codici || codici.includes(p.codice))
    .map((p) => ({ ...p, url: indirizzoPortale(p, hostname) }))
    .filter((p) => p.url);
}
