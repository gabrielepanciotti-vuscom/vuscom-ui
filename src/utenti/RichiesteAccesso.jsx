import { useCallback, useEffect, useState } from "react";
import { BOTTONE } from "./stili.js";
import { messaggioErrore } from "./formato.js";
import DataOra from "../atoms/DataOra.jsx";

/**
 * «Richieste di accesso»: people who asked to register with an address that has no account yet.
 * Hidden when there are none (or the endpoint fails: the page works without it).
 * `versione` changes whenever the users list reloads, so a created user clears its request.
 */
export default function RichiesteAccesso({ client, basePath, versione, onCrea }) {
  const [richieste, setRichieste] = useState([]);
  const [errore, setErrore] = useState(null);

  const carica = useCallback(async () => {
    try {
      const dati = await client.get(`${basePath}/richieste`);
      setRichieste(Array.isArray(dati) ? dati : []);
    } catch {
      setRichieste([]);
    }
  }, [client, basePath]);

  useEffect(() => {
    carica();
  }, [carica, versione]);

  async function rifiuta(r) {
    setErrore(null);
    try {
      await client.post(`${basePath}/richieste/${r.id}/rifiuta`, {});
      await carica();
    } catch (err) {
      setErrore(messaggioErrore(err));
    }
  }

  if (richieste.length === 0) return null;
  return (
    <section
      aria-label="Richieste di accesso"
      className="space-y-2 rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-500/30 dark:bg-amber-500/10"
    >
      <h2 className="text-[13px] font-semibold text-slate-800 dark:text-slate-100">Richieste di accesso</h2>
      <ul className="divide-y divide-amber-200/70 dark:divide-amber-500/20">
        {richieste.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-[13px]">
            <span className="text-slate-700 dark:text-slate-200">
              {r.email}
              {r.created_at && <span className="ml-2 text-[11px] text-slate-500 dark:text-slate-400"><DataOra value={r.created_at} /></span>}
            </span>
            <span className="flex gap-2">
              <button type="button" className={BOTTONE.primario} onClick={() => onCrea(r)}>Crea utente…</button>
              <button type="button" className={BOTTONE.secondario} onClick={() => rifiuta(r)}>Rifiuta</button>
            </span>
          </li>
        ))}
      </ul>
      {errore && <p role="alert" className="text-[12px] text-red-700 dark:text-red-300">{errore}</p>}
    </section>
  );
}
