/**
 * Pure shaping of campaign report snapshots for PaginaReportCampagna.
 *
 * Every row is a *state* at `data_riferimento` (active supplies, cumulative
 * cost…), never a flow: a period is represented by its LAST snapshot, never by
 * a sum. Flows exist only as differences between two states (`variazioni`).
 * `null` means "not available" and stays null all the way to the screen, where
 * it reads "n.d." — never zero.
 */
import { formatData, formatNumero } from "../../lib/format.js";
import { periodOf } from "../../lib/periodi.js";

export const ND = "n.d.";

/** Headline metrics; `meglio` = which direction of the delta is good news. */
export const METRICHE_CAMPAGNA = [
  {
    key: "forniture_attive",
    label: "Forniture attive",
    unita: "numero",
    meglio: "su",
    tono: 1,
    aiuto: "Forniture ancora attive dei beneficiari della campagna.",
  },
  {
    key: "storni",
    label: "Storni",
    unita: "numero",
    meglio: "giu",
    tono: 4,
    aiuto: "Bonus stornati: la fornitura è cessata prima del termine.",
  },
  {
    key: "maturati",
    label: "Maturati",
    unita: "numero",
    meglio: "su",
    tono: 3,
    aiuto: "Bonus maturati, cioè dovuti al beneficiario.",
  },
  {
    key: "costo",
    label: "Costo",
    unita: "euro",
    meglio: "giu",
    aiuto: "Quanto è costata la campagna in bonus riconosciuti.",
  },
  {
    key: "margine",
    label: "Margine",
    unita: "euro",
    meglio: "su",
    aiuto: "Il margine delle forniture della campagna.",
  },
  {
    key: "guadagno_netto",
    label: "Guadagno netto",
    unita: "euro",
    meglio: "su",
    aiuto: "Margine meno costo: quanto ha reso davvero la campagna.",
  },
];

// Indicators are free-form jsonb: amounts are recognised by name, overridable.
const RE_EURO = /^(bonus_|costo|margine|importo|guadagno|ricavo)/;

export const vuoto = (v) =>
  v === null || v === undefined || (typeof v === "number" && Number.isNaN(v));

/** Number from a number or a numeric string (Decimal arrives as "123.45"); else null. */
export function numero(v) {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v)))
    return Number(v);
  return null;
}

/** "storni_da_determinare" → "Storni da determinare". */
export function etichetta(codice) {
  if (!codice) return "";
  const s = String(codice).replace(/_/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Strings or { id|codice, label|nome } → [{ id, label }]. */
export const normalizzaCampagne = (campagne = []) =>
  campagne.map((c) =>
    typeof c === "string"
      ? { id: c, label: etichetta(c) }
      : {
          id: c.id ?? c.codice,
          label: c.label ?? c.nome ?? etichetta(c.id ?? c.codice),
        },
  );

/** A value for the screen: "n.d." when missing, euros without cents for amounts. */
export function formatta(v, unita = "numero", { centesimi = false } = {}) {
  if (vuoto(v)) return ND;
  const n = numero(v);
  if (n === null) {
    if (typeof v === "boolean") return v ? "sì" : "no";
    // An ISO day among the indicators ("dati_al") reads like every other date.
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return formatData(`${v}T12:00:00Z`);
    return String(v);
  }
  if (unita === "euro")
    return formatNumero(n, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: centesimi ? 2 : 0,
      minimumFractionDigits: centesimi ? 2 : 0,
    });
  return formatNumero(n);
}

/**
 * Several producers can write the same (campaign, day): for each metric the
 * first non-null value wins, indicators are merged. One row per day, by date.
 */
export function unisciPerGiorno(righe = []) {
  const perGiorno = new Map();
  for (const r of righe) {
    const k = String(r.data_riferimento).slice(0, 10);
    const prima = perGiorno.get(k);
    if (!prima) {
      perGiorno.set(k, {
        ...r,
        data_riferimento: k,
        indicatori: { ...r.indicatori },
      });
      continue;
    }
    for (const { key } of METRICHE_CAMPAGNA)
      if (vuoto(prima[key]) && !vuoto(r[key])) prima[key] = r[key];
    prima.indicatori = { ...r.indicatori, ...prima.indicatori };
    prima.mensile = Boolean(prima.mensile || r.mensile);
  }
  return [...perGiorno.values()].sort((a, b) =>
    a.data_riferimento.localeCompare(b.data_riferimento),
  );
}

/**
 * Every value shown by the page, metrics and indicators alike: one shape, one
 * accessor, so KPI tiles, table columns and matrix rows treat them the same.
 * `formati` = { [indicatore]: "euro" | "numero" } overrides the name heuristic.
 */
export function voci(
  giorni,
  { metriche = METRICHE_CAMPAGNA, etichette = {}, formati = {} } = {},
) {
  const viste = new Map();
  for (const g of giorni)
    for (const [k, v] of Object.entries(g.indicatori ?? {})) {
      const numerico = numero(v) !== null;
      viste.set(k, (viste.get(k) ?? false) || numerico);
    }
  const indicatori = [...viste].map(([k, numerico]) => ({
    key: `indicatori.${k}`,
    label: etichette[k] ?? etichetta(k),
    unita: numerico
      ? (formati[k] ?? (RE_EURO.test(k) ? "euro" : "numero"))
      : "testo",
    indicatore: true,
    leggi: (g) => g.indicatori?.[k] ?? null,
  }));
  return [
    ...metriche.map((m) => ({ ...m, leggi: (g) => g[m.key] ?? null })),
    ...indicatori,
  ];
}

/**
 * The latest snapshot, with the delta of each numeric voce against the latest
 * monthly snapshot before it (the one that went out by email). No delta when
 * either side is n.d.: a difference with a missing value is not a number.
 */
export function ultimaFoto(giorni, elenco) {
  const ultima = giorni.at(-1);
  if (!ultima) return null;
  const riferimento =
    [...giorni]
      .reverse()
      .find((g) => g.mensile && g.data_riferimento < ultima.data_riferimento) ??
    null;
  const delta = {};
  for (const v of elenco) {
    if (v.unita === "testo" || !riferimento) continue;
    const a = numero(v.leggi(ultima));
    const b = numero(v.leggi(riferimento));
    if (a !== null && b !== null) delta[v.key] = a - b;
  }
  return { ultima, riferimento, delta };
}

/** Rows within [dal, al] (ISO days, either may be null). */
export const filtra = (giorni, { dal, al } = {}) =>
  giorni.filter(
    (g) =>
      (!dal || g.data_riferimento >= dal) && (!al || g.data_riferimento <= al),
  );

/** [{ key, riga }]: the last snapshot of each period, in order. */
export function perPeriodo(giorni, granularita = "mese") {
  const ultimo = new Map();
  for (const g of giorni)
    ultimo.set(periodOf(g.data_riferimento, granularita), g);
  return [...ultimo].map(([key, riga]) => ({ key, riga }));
}

/** GraficoBarre series of the stacked voci over `periodi` ({ key, riga }). */
export const serieAndamento = (periodi, elenco) =>
  elenco.map((v, i) => {
    const valori = {};
    for (const p of periodi) {
      const n = numero(v.leggi(p.riga));
      if (n !== null) valori[p.key] = n;
    }
    return { id: v.key, label: v.label, valori, tono: v.tono ?? i + 1 };
  });

/**
 * MatriceCalore rows: per numeric voce, the change in each period against the
 * previous one (the flow the states imply). The first period has no previous
 * state, so it is null — "n.d.", not zero — and so is any side that is missing.
 */
export function variazioni(periodi, elenco) {
  return elenco
    .filter((v) => v.unita !== "testo")
    .map((v) => {
      const valori = {};
      periodi.forEach((p, i) => {
        const a = numero(v.leggi(p.riga));
        const b = i > 0 ? numero(v.leggi(periodi[i - 1].riga)) : null;
        valori[p.key] = a !== null && b !== null ? a - b : null;
      });
      return {
        id: v.key,
        label: v.label,
        valori,
        format: (n) => (n > 0 ? "+" : "") + formatta(n, v.unita),
      };
    });
}

/** Trend of a voce for its sparkline: the last snapshot of each month, last `n`. */
export function andamentoVoce(giorni, voce, n = 12) {
  return perPeriodo(giorni, "mese")
    .map((p) => numero(voce.leggi(p.riga)))
    .filter((x) => x !== null)
    .slice(-n);
}

/** The first day of the month after `data`, as "1/11". */
export function prossimaFotoMensile(data) {
  const d = new Date(`${String(data).slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return "";
  const m = (d.getUTCMonth() + 1) % 12;
  return `1/${m + 1}`;
}

/** "Situazione al 14/10/2026". */
export const situazioneAl = (riga) =>
  riga
    ? `Situazione al ${formatData(`${riga.data_riferimento}T12:00:00Z`)}`
    : "Situazione";
