const VUOTO = <span className="text-muted-foreground">—</span>;

/**
 * Data e ora su due righe (giorno sopra, hh:mm sotto, più chiaro): in una
 * cella di tabella occupa la metà della larghezza di toLocaleString.
 * Con `soloData` mostra solo il giorno (per le colonne di sola data).
 */
export default function DataOra({ value, soloData = false }) {
  if (!value) return VUOTO;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return VUOTO;
  return (
    <span className="inline-block whitespace-nowrap tabular-nums leading-tight">
      <span className="block">{d.toLocaleDateString("it-IT")}</span>
      {!soloData && (
        <span className="block text-xs text-muted-foreground">
          {d.toLocaleTimeString("it-IT", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      )}
    </span>
  );
}
