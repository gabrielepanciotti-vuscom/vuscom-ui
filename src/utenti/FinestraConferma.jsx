import Finestra from "./Finestra.jsx";
import { MessaggioErrore, Nota } from "./Campo.jsx";
import { BOTTONE } from "./stili.js";
import { useAzione } from "./useAzione.js";

/**
 * Generic confirmation for one-shot actions (revoke access, disable, enable).
 * `azione` returns the client promise; on success `onFatto` reloads and the
 * dialog closes, on failure the backend message stays inside the dialog.
 */
export default function FinestraConferma({
  titolo,
  messaggio,
  nota,
  etichettaConferma,
  pericolo = false,
  azione,
  onChiudi,
  onFatto,
}) {
  const { inCorso, errore, esegui } = useAzione();

  async function conferma() {
    const esito = await esegui(azione);
    if (esito.ok) {
      onFatto?.();
      onChiudi();
    }
  }

  return (
    <Finestra
      titolo={titolo}
      onChiudi={onChiudi}
      piede={
        <>
          <button type="button" onClick={onChiudi} className={BOTTONE.secondario}>
            Annulla
          </button>
          <button
            type="button"
            onClick={conferma}
            disabled={inCorso}
            className={pericolo ? BOTTONE.pericolo : BOTTONE.primario}
          >
            {etichettaConferma}
          </button>
        </>
      }
    >
      <p className="text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">{messaggio}</p>
      {nota && <Nota>{nota}</Nota>}
      <MessaggioErrore>{errore}</MessaggioErrore>
    </Finestra>
  );
}
