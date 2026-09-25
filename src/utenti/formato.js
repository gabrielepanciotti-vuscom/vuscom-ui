// Pure helpers for texts shown by the users page.

// Message to show for a failed client call: the backend puts a string in
// `detail` (or an object with `messaggio`, or pydantic's list on 422).
export function messaggioErrore(err) {
  const detail = err?.body?.detail;
  if (typeof detail === "string") return detail;
  if (detail && typeof detail.messaggio === "string") return detail.messaggio;
  if (Array.isArray(detail) && detail.length) {
    return detail.map((d) => d?.msg || String(d)).join("; ");
  }
  return err?.message || "Errore imprevisto";
}

export function nomeCompleto(utente) {
  const n = [utente?.nome, utente?.cognome].filter(Boolean).join(" ");
  return n || "—";
}

const due = (n) => String(n).padStart(2, "0");

// dd/mm/yyyy hh:mm in local time, "mai" when the person never logged in.
export function formattaAccesso(iso) {
  if (!iso) return "mai";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "mai";
  return `${due(d.getDate())}/${due(d.getMonth() + 1)}/${d.getFullYear()} ${due(d.getHours())}:${due(d.getMinutes())}`;
}

// Empty or whitespace-only text is sent as null, like the backend stores it.
export function testoONull(valore) {
  const v = (valore || "").trim();
  return v || null;
}
