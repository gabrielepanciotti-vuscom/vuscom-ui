import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Finestra from "./Finestra.jsx";
import { Campo, MessaggioErrore } from "./Campo.jsx";
import { BOTTONE } from "./stili.js";
import { messaggioErrore } from "./formato.js";
import { useAzione } from "./useAzione.js";

// "estrazione.user_id: 12" -> "estrazione: 12" (the column adds nothing for the admin).
export function descriviRiferimenti(riferimenti) {
  return Object.entries(riferimenti || {})
    .map(([chiave, n]) => `${chiave.split(".")[0]}: ${n}`)
    .join(", ");
}

function Anteprima({ anteprima }) {
  if (anteprima.esito === "eliminato") {
    return (
      <p className="text-[13px] text-slate-700 dark:text-slate-300">
        L'account non è mai stato usato: verrà cancellato definitivamente.
      </p>
    );
  }
  return (
    <p className="text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">
      {`L'account ha dati collegati (${descriviRiferimenti(anteprima.riferimenti)}): i dati personali verranno cancellati e l'account disattivato. I dati collegati restano.`}
    </p>
  );
}

export default function FinestraElimina({ client, basePath, utente, onChiudi, onFatto }) {
  const [anteprima, setAnteprima] = useState(null);
  const [erroreAnteprima, setErroreAnteprima] = useState(null);
  const [digitato, setDigitato] = useState("");
  const { inCorso, errore, esegui } = useAzione();

  useEffect(() => {
    let annullata = false;
    client
      .get(`${basePath}/${utente.id}/eliminazione`)
      .then((d) => !annullata && setAnteprima(d))
      .catch((err) => !annullata && setErroreAnteprima(messaggioErrore(err)));
    return () => {
      annullata = true;
    };
  }, [client, basePath, utente.id]);

  async function elimina() {
    const r = await esegui(() => client.del(`${basePath}/${utente.id}`));
    if (!r.ok) return;
    onFatto?.();
    onChiudi();
  }

  const pronto = anteprima && digitato === utente.username;

  return (
    <Finestra
      titolo={`Elimina ${utente.username}`}
      onChiudi={onChiudi}
      piede={
        <>
          <button type="button" onClick={onChiudi} className={BOTTONE.secondario}>Annulla</button>
          <button type="button" onClick={elimina} disabled={!pronto || inCorso} className={BOTTONE.pericolo}>
            Elimina account
          </button>
        </>
      }
    >
      <p className="text-[12.5px] text-slate-500 dark:text-slate-400">Vale per l'account su tutti i portali.</p>
      {!anteprima && !erroreAnteprima && (
        <p className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" /> Verifica dei dati collegati…
        </p>
      )}
      <MessaggioErrore>{erroreAnteprima}</MessaggioErrore>
      {anteprima && <Anteprima anteprima={anteprima} />}
      {anteprima && (
        <Campo
          etichetta={`Digita lo username (${utente.username}) per confermare`}
          valore={digitato}
          onCambia={setDigitato}
          autoComplete="off"
        />
      )}
      <MessaggioErrore>{errore}</MessaggioErrore>
    </Finestra>
  );
}
