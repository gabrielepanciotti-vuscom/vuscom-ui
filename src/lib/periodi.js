/**
 * Reporting periods: ISO weeks ("2026-W42") and months ("2026-10").
 * Everything is UTC midnight, so a key never shifts with the browser's time zone.
 * A key carries its own granularity: span, label and partial check need no extra argument.
 */
const GIORNO = 86400000;
const GRANULARITA = {
  settimana: "settimana",
  week: "settimana",
  mese: "mese",
  month: "mese",
};
const RE_SETTIMANA = /^(\d{4})-W(\d{2})$/;
const RE_MESE = /^(\d{4})-(\d{2})$/;
const RE_ISO = /^(\d{4})-(\d{2})-(\d{2})/;

const mese = (stile) =>
  new Intl.DateTimeFormat("it-IT", { month: stile, timeZone: "UTC" });
const MESE_BREVE = mese("short");
const MESE_LUNGO = mese("long");
const due = (n) => String(n).padStart(2, "0");

/** Date | "YYYY-MM-DD" | timestamp → UTC midnight of that day (null if invalid). */
export function toUtcDay(v) {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "string") {
    const m = RE_ISO.exec(v);
    if (m) return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  }
  const d = v instanceof Date ? v : new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
}

function granularita(g) {
  const n = GRANULARITA[g];
  if (!n) throw new Error(`granularità sconosciuta: ${g}`);
  return n;
}

/** Key of the period containing `date`: "2026-W42" (ISO week) or "2026-10". */
export function periodOf(date, gran = "mese") {
  const d = toUtcDay(date);
  if (!d) return null;
  if (granularita(gran) === "mese")
    return `${d.getUTCFullYear()}-${due(d.getUTCMonth() + 1)}`;
  // ISO week: the week belongs to the year of its Thursday.
  const giovedi = new Date(
    d.getTime() + (3 - ((d.getUTCDay() + 6) % 7)) * GIORNO,
  );
  const anno = giovedi.getUTCFullYear();
  const settimana =
    Math.floor((giovedi - Date.UTC(anno, 0, 1)) / GIORNO / 7) + 1;
  return `${anno}-W${due(settimana)}`;
}

/** { start, end } of a period key: UTC midnights, `end` exclusive. */
export function periodSpan(key) {
  let m = RE_SETTIMANA.exec(key);
  if (m) {
    const gen4 = Date.UTC(+m[1], 0, 4);
    const lunedi1 = gen4 - ((new Date(gen4).getUTCDay() + 6) % 7) * GIORNO;
    const start = new Date(lunedi1 + (+m[2] - 1) * 7 * GIORNO);
    return { start, end: new Date(start.getTime() + 7 * GIORNO) };
  }
  m = RE_MESE.exec(key);
  if (m)
    return {
      start: new Date(Date.UTC(+m[1], +m[2] - 1, 1)),
      end: new Date(Date.UTC(+m[1], +m[2], 1)),
    };
  throw new Error(`periodo non valido: ${key}`);
}

/**
 * Italian label: "ottobre 2026", "12–18 ott 2026", "28 set – 4 ott 2026".
 * `breve` drops the year and shortens the month ("ott 2026" stays for months).
 */
export function periodLabel(key, { breve = false } = {}) {
  const { start, end } = periodSpan(key);
  if (RE_MESE.test(key)) {
    const nome = (breve ? MESE_BREVE : MESE_LUNGO).format(start);
    return `${nome} ${start.getUTCFullYear()}`;
  }
  const fine = new Date(end.getTime() - GIORNO);
  const g1 = start.getUTCDate();
  const g2 = fine.getUTCDate();
  const m1 = MESE_BREVE.format(start);
  const m2 = MESE_BREVE.format(fine);
  const a1 = start.getUTCFullYear();
  const a2 = fine.getUTCFullYear();
  if (breve) return m1 === m2 ? `${g1}–${g2} ${m2}` : `${g1} ${m1}–${g2} ${m2}`;
  if (a1 !== a2) return `${g1} ${m1} ${a1} – ${g2} ${m2} ${a2}`;
  if (m1 !== m2) return `${g1} ${m1} – ${g2} ${m2} ${a2}`;
  return `${g1}–${g2} ${m2} ${a2}`;
}

/** Every period key from the one containing `from` to the one containing `to`, inclusive. */
export function periodsBetween(from, to, gran = "mese") {
  const primo = periodOf(from, gran);
  const ultimo = periodOf(to, gran);
  if (!primo || !ultimo) return [];
  const fine = periodSpan(ultimo).start.getTime();
  const out = [];
  for (let k = primo; periodSpan(k).start.getTime() <= fine;) {
    out.push(k);
    k = periodOf(periodSpan(k).end, gran);
  }
  return out;
}

/**
 * A period is partial when the filter cuts it (`from` after its first day,
 * `to` before its last) or when it is not over yet (it contains `now` or lies
 * in the future). Pass `now: null` to ignore the calendar.
 */
export function isPartial(key, { from, to, now = new Date() } = {}) {
  const { start, end } = periodSpan(key);
  const ultimo = end.getTime() - GIORNO;
  const dal = toUtcDay(from);
  const al = toUtcDay(to);
  const oggi = now === null ? null : toUtcDay(now);
  if (dal && dal.getTime() > start.getTime()) return true;
  if (al && al.getTime() < ultimo) return true;
  return Boolean(oggi && oggi.getTime() <= ultimo);
}
