import { useState } from "react";
import { MailCheck } from "lucide-react";
import Finestra from "./Finestra.jsx";
import PasswordMostrata from "./PasswordMostrata.jsx";
import { Campo, MessaggioErrore, Nota } from "./Campo.jsx";
import { BOTTONE } from "./stili.js";
import { useAzione } from "./useAzione.js";

export default function FinestraPassword({ client, basePath, utente, onChiudi, onFatto }) {
  const [password, setPassword] = useState("");
  const [esito, setEsito] = useState(null);
  const { inCorso, errore, esegui } = useAzione();

  async function conferma(e) {
    e.preventDefault();
    const r = await esegui(() => client.put(`${basePath}/${utente.id}/password`, { password: password || null }));
    if (!r.ok) return;
    onFatto?.();
    setEsito(r.valore || {});
  }

  if (esito) {
    return (
      <Finestra
        titolo={`Password di ${utente.username}`}
        onChiudi={onChiudi}
        bloccata={Boolean(esito.password_generata)}
        piede={<button type="button" onClick={onChiudi} className={BOTTONE.secondario}>Chiudi</button>}
      >
        {esito.password_generata ? (
          <PasswordMostrata password={esito.password_generata} />
        ) : (
          <p className="flex items-center gap-2 text-[13px] text-slate-700 dark:text-slate-300">
            <MailCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            {esito.email_inviata ? "Email inviata" : "Password aggiornata"}
          </p>
        )}
      </Finestra>
    );
  }

  return (
    <Finestra
      titolo={`Reimposta password di ${utente.username}`}
      onChiudi={onChiudi}
      piede={
        <>
          <button type="button" onClick={onChiudi} className={BOTTONE.secondario}>Annulla</button>
          <button type="submit" form="vuscom-password-utente" disabled={inCorso} className={BOTTONE.primario}>
            Reimposta
          </button>
        </>
      }
    >
      <form id="vuscom-password-utente" onSubmit={conferma} className="space-y-3">
        <Campo
          etichetta="Nuova password (facoltativa)"
          tipo="password"
          valore={password}
          onCambia={setPassword}
          autoFocus
          autoComplete="new-password"
          nota="Se vuota viene generata e inviata per email. Almeno 8 caratteri."
        />
        <Nota>Vale per l'account su tutti i portali: le sessioni aperte vengono chiuse e al prossimo accesso la persona dovrà cambiarla.</Nota>
        <MessaggioErrore>{errore}</MessaggioErrore>
      </form>
    </Finestra>
  );
}
