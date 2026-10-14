/**
 * CSV for Italian Excel: UTF-8 BOM (accents survive), `;` separator, decimal
 * comma, CRLF rows. Columns are DataTable columns: the value is `csv(row)`, else
 * `sortAccessor(row)`, else `row[key]`; the title is `csvHeader`, else a string
 * `header`, else `key`. `csv: false` leaves a column out (actions, icons).
 */
const BOM = String.fromCharCode(0xfeff);
const SEP = ";";
const DA_QUOTARE = /[;"\r\n]/;
// A cell starting with one of these is run as a formula by Excel (CSV injection).
const FORMULA = /^[=+\-@\t\r]/;

const NUMERO = new Intl.NumberFormat("it-IT", {
  useGrouping: false,
  maximumFractionDigits: 10,
});

function cella(v) {
  if (v === null || v === undefined) return "";
  if (typeof v === "number") return Number.isFinite(v) ? NUMERO.format(v) : "";
  if (typeof v === "boolean") return v ? "sì" : "no";
  if (v instanceof Date) {
    if (Number.isNaN(v.getTime())) return "";
    const g = String(v.getUTCDate()).padStart(2, "0");
    const m = String(v.getUTCMonth() + 1).padStart(2, "0");
    return `${g}/${m}/${v.getUTCFullYear()}`;
  }
  let s = String(v);
  if (FORMULA.test(s) && !/^-?\d+([.,]\d+)?$/.test(s)) s = `'${s}`;
  return DA_QUOTARE.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const valore = (c, row) =>
  typeof c.csv === "function"
    ? c.csv(row)
    : c.sortAccessor
      ? c.sortAccessor(row)
      : row[c.key];
const titolo = (c) =>
  c.csvHeader ?? (typeof c.header === "string" ? c.header : c.key);

/** CSV text (with BOM) of `rows` through `columns`. */
export function toCsv(rows, columns) {
  const cols = columns.filter((c) => c.csv !== false);
  const righe = [
    cols.map((c) => cella(titolo(c))).join(SEP),
    ...rows.map((r) => cols.map((c) => cella(valore(c, r))).join(SEP)),
  ];
  return BOM + righe.join("\r\n");
}

/** Downloads `rows` as `nomeFile` (".csv" added when missing). */
export function esportaCsv(nomeFile, rows, columns) {
  const nome = /\.csv$/i.test(nomeFile) ? nomeFile : `${nomeFile}.csv`;
  const blob = new Blob([toCsv(rows, columns)], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
