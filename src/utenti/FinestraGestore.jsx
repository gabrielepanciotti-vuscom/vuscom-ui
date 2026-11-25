import { useState } from "react";
import Finestra from "./Finestra.jsx";
import { MessaggioErrore, Nota } from "./Campo.jsx";
import { BOTTONE } from "./stili.js";
import { nomeCompleto } from "./formato.js";
import { useAzione } from "./useAzione.js";

/** «Cambia» the portal manager: pick one of the portal's active admins (custom list, no native select). */
export default function FinestraGestore({ client, basePath, utenti, gestore, nomePortale, onChiudi, onFatto }) {
  const candidati = utenti.filter((u) => u.is_active && ["admin", "superadmin"].includes(u.ruolo));
  const [scelto, setScelto] = useState(gestore?.id ?? null);
  const { inCorso, errore, esegui } = useAzione();

  async function salva() {
    const esito = await esegui(() => client.put(`${basePath}/gestore`, { user_id: scelto }));
    if (esito.ok) {
      onFatto?.();
      onChiudi();
    }
  }

  return (
    <Finestra
      titolo="Gestore del portale"
      onChiudi={onChiudi}
      piede={
        <>
          <button type="button" onClick={onChiudi} className={BOTTONE.secondario}>
            Annulla
          </button>
          <button type="button" onClick={salva} disabled={inCorso || scelto == null || scelto === gestore?.id} className={BOTTONE.primario}>
            Imposta gestore
          </button>
        </>
      }
    >
      <Nota>{`Il gestore riceve le richieste di accesso a ${nomePortale}. Le vedono comunque tutti gli admin.`}</Nota>
      <ul role="radiogroup" aria-label="Admin del portale" className="space-y-1">
        {candidati.map((u) => (
          <li key={u.id}>
            <button
              type="button"
              role="radio"
              aria-checked={scelto === u.id}
              onClick={() => setScelto(u.id)}
              className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-[13px] ${
                scelto === u.id
                  ? "border-brand-500 bg-brand-50 text-slate-900 dark:border-brand-400 dark:bg-brand-500/10 dark:text-slate-100"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/[0.04]"
              }`}
            >
              <span>{nomeCompleto(u) === "—" ? u.username : nomeCompleto(u)}</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">{u.email}</span>
            </button>
          </li>
        ))}
      </ul>
      <MessaggioErrore>{errore}</MessaggioErrore>
    </Finestra>
  );
}
