import { useState } from "react";
import Finestra from "./Finestra.jsx";
import SelettoreRuolo from "./SelettoreRuolo.jsx";
import { ElencoPortali } from "./BadgePortale.jsx";
import { Campo, MessaggioErrore, Nota } from "./Campo.jsx";
import { BOTTONE, ETICHETTA } from "./stili.js";
import { RUOLI, ruoliAssegnabili } from "./ruoli.js";
import { useAzione } from "./useAzione.js";

const ANAGRAFICA = ["nome", "cognome", "email"];

// Only the fields that differ from the loaded user: the backend treats every
// field present in the body as "to be written" (and "" as "clear").
export function campiCambiati(utente, bozza) {
  const cambiati = {};
  for (const k of ANAGRAFICA) {
    if ((bozza[k] || "").trim() !== (utente[k] || "")) cambiati[k] = bozza[k].trim();
  }
  if (bozza.ruolo !== utente.ruolo) cambiati.ruolo = bozza.ruolo;
  return cambiati;
}

export default function FinestraModifica({ client, basePath, attore, utente, SezioneExtra, onChiudi, onFatto }) {
  const [bozza, setBozza] = useState({
    nome: utente.nome || "",
    cognome: utente.cognome || "",
    email: utente.email || "",
    ruolo: utente.ruolo,
  });
  const { inCorso, errore, esegui } = useAzione();
  const imposta = (k) => (v) => setBozza((b) => ({ ...b, [k]: v }));

  // The current role stays visible even if the actor could not assign it.
  const assegnabili = ruoliAssegnabili(attore?.ruolo);
  const ruoli = RUOLI.filter((r) => assegnabili.includes(r) || r === utente.ruolo);
  const cambiati = campiCambiati(utente, bozza);
  const nessunCambio = Object.keys(cambiati).length === 0;

  async function salva(e) {
    e.preventDefault();
    if (nessunCambio) return;
    const r = await esegui(() => client.put(`${basePath}/${utente.id}`, cambiati));
    if (!r.ok) return;
    onFatto?.();
    onChiudi();
  }

  return (
    <Finestra
      titolo={`Modifica ${utente.username}`}
      onChiudi={onChiudi}
      piede={
        <>
          <button type="button" onClick={onChiudi} className={BOTTONE.secondario}>Annulla</button>
          <button type="submit" form="vuscom-modifica-utente" disabled={inCorso || nessunCambio} className={BOTTONE.primario}>
            Salva
          </button>
        </>
      }
    >
      <form id="vuscom-modifica-utente" onSubmit={salva} className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Campo etichetta="Nome" valore={bozza.nome} onCambia={imposta("nome")} autoFocus />
          <Campo etichetta="Cognome" valore={bozza.cognome} onCambia={imposta("cognome")} />
        </div>
        <Campo etichetta="Email" tipo="email" valore={bozza.email} onCambia={imposta("email")} />
        {bozza.ruolo && <SelettoreRuolo ruoli={ruoli} valore={bozza.ruolo} onCambia={imposta("ruolo")} />}
        <Nota>Cambiare il ruolo chiude le sessioni della persona su tutti i portali.</Nota>
        <div>
          <span className={ETICHETTA}>Altri portali (sola lettura)</span>
          <ElencoPortali portali={utente.altri_portali} />
        </div>
        <MessaggioErrore>{errore}</MessaggioErrore>
      </form>
      {SezioneExtra && (
        <div className="border-t border-slate-100 pt-4 dark:border-white/[0.06]">
          <SezioneExtra utente={utente} />
        </div>
      )}
    </Finestra>
  );
}
