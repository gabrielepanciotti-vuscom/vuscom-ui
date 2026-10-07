/**
 * Masking of what leaves the browser with a report: rrweb events, the
 * screenshot's DOM clone and the action log. Pure functions, no I/O.
 *
 * Two levels: `tutto` (the user's «Maschera i dati», default on) hides every
 * text and input value; without it only the private elements are hidden,
 * and those are hidden ALWAYS (password fields, `data-segnala-privato`).
 * Structure, ids, classes and positions are kept, so the replay and the
 * screenshot still show the layout.
 */

export const MASCHERA = "•••";
export const PRIVATO = '[data-segnala-privato], input[type="password"]';
/** Elements excluded from recording, screenshot and action log (our own UI). */
export const IGNORA = "[data-segnala-ignora]";

// rrweb 2.x serialized node and event kinds.
const NODO_ELEMENTO = 2;
const NODO_TESTO = 3;
const EVENTO_FULL_SNAPSHOT = 2;
const EVENTO_INCREMENTALE = 3;
const SORGENTE_MUTAZIONE = 0;
const SORGENTE_INPUT = 5;

// Their text is CSS or code, not data: masking it would break the replay.
const TAG_CODICE = new Set(["style", "script", "noscript"]);

const pieno = (v) => typeof v === "string" && v.trim() !== "";
const maschera = (v) => (pieno(v) ? MASCHERA : v);

function privatoDaAttributi(tag, attributi = {}) {
  if (Object.prototype.hasOwnProperty.call(attributi, "data-segnala-privato"))
    return true;
  return (
    tag === "input" && String(attributi.type ?? "").toLowerCase() === "password"
  );
}

/**
 * Deep copy of the rrweb events with text nodes and input values replaced by
 * «•••». With `{ tutto: false }` only private elements are masked.
 */
export function mascheraEventi(eventi, { tutto = true } = {}) {
  const copia = JSON.parse(JSON.stringify(eventi ?? []));
  const privati = new Set(); // element ids inside a private subtree
  const testiPrivati = new Set(); // text node ids inside a private subtree
  const testiCodice = new Set(); // text node ids inside style/script

  const visita = (nodo, ereditaPrivato, dentroCodice) => {
    if (!nodo || typeof nodo !== "object") return;
    if (nodo.type === NODO_ELEMENTO) {
      const tag = String(nodo.tagName ?? "").toLowerCase();
      const attributi = nodo.attributes ?? {};
      const privato = ereditaPrivato || privatoDaAttributi(tag, attributi);
      if (privato) privati.add(nodo.id);
      if ((tutto || privato) && "value" in attributi)
        attributi.value = maschera(attributi.value);
      const codice = dentroCodice || TAG_CODICE.has(tag);
      for (const figlio of nodo.childNodes ?? [])
        visita(figlio, privato, codice);
      return;
    }
    if (nodo.type === NODO_TESTO) {
      if (dentroCodice || nodo.isStyle) {
        testiCodice.add(nodo.id);
        return;
      }
      if (ereditaPrivato) testiPrivati.add(nodo.id);
      if (tutto || ereditaPrivato)
        nodo.textContent = maschera(nodo.textContent);
      return;
    }
    for (const figlio of nodo.childNodes ?? [])
      visita(figlio, ereditaPrivato, dentroCodice);
  };

  for (const evento of copia) {
    if (evento?.type === EVENTO_FULL_SNAPSHOT) {
      visita(evento.data?.node, false, false);
      continue;
    }
    if (evento?.type !== EVENTO_INCREMENTALE) continue;
    const dati = evento.data ?? {};
    if (dati.source === SORGENTE_INPUT) {
      if (tutto || privati.has(dati.id)) dati.text = maschera(dati.text);
      continue;
    }
    if (dati.source !== SORGENTE_MUTAZIONE) continue;
    for (const aggiunta of dati.adds ?? [])
      visita(aggiunta.node, privati.has(aggiunta.parentId), false);
    for (const testo of dati.texts ?? []) {
      if (testiCodice.has(testo.id)) continue;
      if (tutto || testiPrivati.has(testo.id))
        testo.value = maschera(testo.value);
    }
    for (const modifica of dati.attributes ?? []) {
      const attributi = modifica.attributes ?? {};
      // rrweb sends `null` for a removed attribute: only an added one counts.
      if (typeof attributi["data-segnala-privato"] === "string")
        privati.add(modifica.id);
      if ((tutto || privati.has(modifica.id)) && "value" in attributi)
        attributi.value = maschera(attributi.value);
    }
  }
  return copia;
}

const CAMPI = new Set(["input", "textarea", "select"]);

/**
 * Masks a DOM clone in place (the screenshot's copy, never the live page).
 * With `{ tutto: false }` only private elements are masked.
 */
export function mascheraDom(radice, { tutto = true } = {}) {
  const visita = (nodo, ereditaPrivato) => {
    if (nodo.nodeType === 3) {
      if ((tutto || ereditaPrivato) && pieno(nodo.nodeValue))
        nodo.nodeValue = MASCHERA;
      return;
    }
    if (nodo.nodeType !== 1) return;
    const tag = nodo.tagName.toLowerCase();
    if (TAG_CODICE.has(tag)) return;
    const privato =
      ereditaPrivato ||
      (typeof nodo.matches === "function" && nodo.matches(PRIVATO));
    if (CAMPI.has(tag) && (tutto || privato)) {
      if (tag === "textarea") nodo.textContent = MASCHERA;
      if (tag !== "select") {
        try {
          nodo.value = MASCHERA;
        } catch {
          /* inputs like type=file refuse a value: the attribute is enough */
        }
        nodo.setAttribute("value", MASCHERA);
      }
    }
    for (const figlio of Array.from(nodo.childNodes)) visita(figlio, privato);
  };
  visita(radice, false);
}

/**
 * Action log as sent with the mask on: the free text of a click (what the
 * user clicked on, e.g. a customer's name in a row) is hidden; names coming
 * from `data-segnala` are chosen by developers and stay.
 */
export function mascheraAzioni(azioni) {
  return (azioni ?? []).map((a) =>
    a.tipo === "click" && a.fonte !== "data-segnala"
      ? { ...a, elemento: maschera(a.elemento) }
      : { ...a },
  );
}
