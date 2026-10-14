/** Italian date text "gg/mm/aaaa" ⇄ ISO day "YYYY-MM-DD" (UTC calendar, no time). */
const RE_IT = /^\s*(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})\s*$/;
const RE_ISO = /^(\d{4})-(\d{2})-(\d{2})$/;
const due = (n) => String(n).padStart(2, "0");

/** "4/10/2026" → "2026-10-04"; "" → null; anything else (31/02, 1/13) → undefined. */
export function parseDataIt(testo) {
  if (!testo || !testo.trim()) return null;
  const m = RE_IT.exec(testo);
  if (!m) return undefined;
  const [g, me, a] = [+m[1], +m[2], +m[3]];
  const d = new Date(Date.UTC(a, me - 1, g));
  if (d.getUTCFullYear() !== a || d.getUTCMonth() !== me - 1 || d.getUTCDate() !== g)
    return undefined;
  return `${a}-${due(me)}-${due(g)}`;
}

/** "2026-10-04" → "04/10/2026"; empty or invalid → "". */
export function formatDataIt(iso) {
  const m = RE_ISO.exec(iso ?? "");
  return m ? `${m[3]}/${m[2]}/${m[1]}` : "";
}

/** Date → "YYYY-MM-DD" of its UTC calendar day. */
export const isoGiorno = (d) =>
  `${d.getUTCFullYear()}-${due(d.getUTCMonth() + 1)}-${due(d.getUTCDate())}`;
