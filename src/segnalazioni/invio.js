import { mascheraAzioni, mascheraEventi } from "./maschera.js";
import { troncaVideo } from "./useRegistrazione.js";

// The portal's limits (vuscom_auth.segnalazioni): 4 MB per file, 5 MB in all.
const MAX_ALLEGATO = 4 * 1024 * 1024;
const MAX_TOTALE = 5 * 1024 * 1024;
const MARGINE = 64 * 1024; // multipart envelope, report JSON

export const MESSAGGI = {
  riprova: "Non sono riuscito a inviarla. Riprova.",
  non_disponibile: "Segnalazione non disponibile al momento",
  troppo_grande:
    "Gli allegati sono troppo grandi: togli il video e invia di nuovo.",
  sessione: "La sessione è scaduta: accedi di nuovo e invia la segnalazione.",
  non_valida: "Segnalazione non valida",
};

/**
 * UUID v4 for the report. `crypto.randomUUID` exists only in secure contexts,
 * and some portals are served over plain http on the LAN: fall back to
 * `getRandomValues`, which is available everywhere.
 */
export function nuovoId() {
  const c = globalThis.crypto;
  if (typeof c?.randomUUID === "function") return c.randomUUID();
  const b = new Uint8Array(16);
  if (typeof c?.getRandomValues === "function") c.getRandomValues(b);
  else for (let i = 0; i < 16; i += 1) b[i] = Math.floor(Math.random() * 256);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

const jsonBlob = (valore) =>
  new Blob([JSON.stringify(valore)], { type: "application/json" });

/** Page URL as reported: without query and fragment when the data is masked. */
export function urlPagina(href, maschera) {
  if (!maschera) return href;
  try {
    const u = new URL(href);
    return `${u.origin}${u.pathname}`;
  } catch {
    return String(href).split(/[?#]/)[0];
  }
}

/**
 * The multipart body for a draft. The user's choices are applied here, at
 * send time: masking (private elements are always masked) and the video.
 */
export function componiInvio(bozza, { commento, video, maschera }) {
  const form = new FormData();
  form.append(
    "report",
    JSON.stringify({
      report_id: bozza.segnalazione_id,
      element: bozza.elemento ?? null,
      comment: commento.trim(),
      page_url: urlPagina(bozza.page_url ?? "", maschera),
    }),
  );
  const schermata = bozza.catture
    ? maschera
      ? bozza.catture.mascherato
      : bozza.catture.privato
    : null;
  const azioni = jsonBlob(
    maschera ? mascheraAzioni(bozza.azioni) : (bozza.azioni ?? []),
  );
  let usato = azioni.size + MARGINE;
  if (schermata) {
    form.append(
      "screenshot",
      new Blob([schermata], { type: "image/png" }),
      "screenshot.png",
    );
    usato += schermata.size;
  }
  form.append("azioni", azioni, "azioni.json");
  if (video && (bozza.eventi?.length ?? 0) >= 2) {
    const eventi = troncaVideo(
      mascheraEventi(bozza.eventi, { tutto: maschera }),
      Math.min(MAX_ALLEGATO - MARGINE, MAX_TOTALE - usato),
    );
    if (eventi) form.append("video", jsonBlob(eventi), "video.rrweb.json");
  }
  return form;
}

async function leggiJson(risposta) {
  try {
    return await risposta.json();
  } catch {
    return {};
  }
}

/**
 * POSTs a report and translates the answer:
 * `{ esito: "inviata", ticket_id, url, duplicato }` · `{ esito: "riprova" }`
 * (503 retryable, network down, other 5xx) · `{ esito: "non_disponibile" }`
 * (503 not configured) · `{ esito: "errore", messaggio }` (413, 422, 401/403).
 * Never throws.
 */
export async function inviaSegnalazione({ endpoint, fetchImpl, form }) {
  let risposta;
  try {
    risposta = await fetchImpl(endpoint, {
      method: "POST",
      body: form,
      credentials: "include",
    });
  } catch {
    return { esito: "riprova", messaggio: MESSAGGI.riprova };
  }
  const corpo = await leggiJson(risposta);
  const s = risposta.status;
  if (s >= 200 && s < 300)
    return {
      esito: "inviata",
      ticket_id: corpo.ticket_id,
      url: corpo.url,
      duplicato: Boolean(corpo.duplicato),
    };
  if (s === 503 && corpo.riprova === false)
    return { esito: "non_disponibile", messaggio: MESSAGGI.non_disponibile };
  if (s === 413) return { esito: "errore", messaggio: MESSAGGI.troppo_grande };
  if (s === 401 || s === 403)
    return { esito: "errore", messaggio: MESSAGGI.sessione };
  if (s === 422)
    return {
      esito: "errore",
      messaggio:
        typeof corpo.detail === "string" ? corpo.detail : MESSAGGI.non_valida,
    };
  // 404/405: the portal has no POST route, reports are switched off there.
  if (s === 404 || s === 405)
    return { esito: "non_disponibile", messaggio: MESSAGGI.non_disponibile };
  return { esito: "riprova", messaggio: MESSAGGI.riprova };
}
