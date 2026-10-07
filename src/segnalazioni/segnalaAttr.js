/**
 * The `data-segnala` attribute for a reportable element, as props to spread:
 * `<div {...segnalaAttr({ tipo: "kpi", id: "kpi_clienti", nome: "Clienti attivi" })}>`.
 * Nobody writes the JSON by hand. A missing descriptor gives no attribute.
 */
export function segnalaAttr(descrittore) {
  if (!descrittore || typeof descrittore !== "object") return {};
  const { tipo, id, nome, contesto } = descrittore;
  const pulito = {};
  if (tipo !== undefined) pulito.tipo = tipo;
  if (id !== undefined) pulito.id = id;
  if (nome !== undefined) pulito.nome = nome;
  if (contesto !== undefined) pulito.contesto = contesto;
  return { "data-segnala": JSON.stringify(pulito) };
}

/** Reads a `data-segnala` value back; `null` when it is not valid JSON. */
export function leggiSegnala(valore) {
  if (!valore) return null;
  try {
    const letto = JSON.parse(valore);
    return letto && typeof letto === "object" && !Array.isArray(letto)
      ? letto
      : null;
  } catch {
    return null;
  }
}
