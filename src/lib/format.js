const LOCALE = "it-IT";

const valida = (v) => {
  if (v === null || v === undefined || v === "") return null;
  const d = v instanceof Date ? v : new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};

export function formatNumero(v, opts = {}) {
  const predefinito = opts.style === "percent" ? 0 : 2;
  // Intl throws a RangeError when min > max: an explicit min raises the default max.
  const maximumFractionDigits = Math.max(
    opts.minimumFractionDigits ?? 0,
    predefinito,
  );
  return Number(v ?? 0).toLocaleString(LOCALE, {
    maximumFractionDigits,
    // it-IT skips the thousands separator on 4-digit numbers (1581); we want 1.581.
    useGrouping: "always",
    ...opts,
  });
}

export function formatData(v) {
  const d = valida(v);
  return d
    ? d.toLocaleDateString(LOCALE, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "—";
}

export function formatDataOra(v) {
  const d = valida(v);
  return d
    ? d.toLocaleString(LOCALE, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";
}

export function formatRelativo(v, ora = new Date()) {
  const d = valida(v);
  if (!d) return "—";
  const diff = Math.round((ora - d) / 1000);
  const futuro = diff < 0;
  const sec = Math.abs(diff);
  if (sec < 60) return "adesso";
  const min = Math.round(sec / 60);
  if (min < 60) return futuro ? `tra ${min} min` : `${min} min fa`;
  const ore = Math.round(min / 60);
  if (ore < 24) {
    const n = ore === 1 ? "1 ora" : `${ore} ore`;
    return futuro ? `tra ${n}` : `${n} fa`;
  }
  const giorni = Math.round(ore / 24);
  if (futuro) return giorni === 1 ? "domani" : `tra ${giorni} giorni`;
  return giorni === 1 ? "ieri" : `${giorni} giorni fa`;
}
