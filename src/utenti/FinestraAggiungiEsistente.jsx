import { useState } from "react";
import { Check, Loader2, Search } from "lucide-react";
import Finestra from "./Finestra.jsx";
import SelettoreRuolo from "./SelettoreRuolo.jsx";
import InterruttoreAvvisa from "./InterruttoreAvvisa.jsx";
import { ElencoPortali } from "./BadgePortale.jsx";
import { Campo, MessaggioErrore, Nota } from "./Campo.jsx";
import { BOTTONE } from "./stili.js";
import { ruoliAssegnabili } from "./ruoli.js";
import { nomeCompleto, testoEsitoAccesso } from "./formato.js";
import { useAzione } from "./useAzione.js";
import { MINIMO_CARATTERI, useRicerca } from "./useRicerca.js";

function Risultato({ utente, scelto, onScegli }) {
  return (
    <li>
      <button
        type="button"
        aria-pressed={scelto}
        onClick={onScegli}
        className={`flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 ${
          scelto
            ? "border-blue-400 bg-blue-50 dark:border-blue-400/60 dark:bg-blue-500/10"
            : "border-slate-200 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/[0.04]"
        }`}
      >
        <span className="min-w-0 flex-1 space-y-1">
          <span className="block text-[13px] font-medium text-slate-800 dark:text-slate-100">
            {nomeCompleto(utente)}
          </span>
          <span className="block truncate text-[12px] text-slate-500 dark:text-slate-400">
            {utente.username}
            {utente.email ? ` · ${utente.email}` : ""}
          </span>
          <ElencoPortali portali={utente.altri_portali} />
        </span>
        {scelto && (
          <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
        )}
      </button>
    </li>
  );
}

export default function FinestraAggiungiEsistente({
  client,
  basePath,
  nomePortale,
  attore,
  onChiudi,
  onFatto,
}) {
  const ruoli = ruoliAssegnabili(attore?.ruolo);
  const [testo, setTesto] = useState("");
  const [scelto, setScelto] = useState(null);
  const [ruolo, setRuolo] = useState("viewer");
  const [avvisa, setAvvisa] = useState(true);
  const [esito, setEsito] = useState(null); // testo dell'esito, o null finché non concesso
  const ricerca = useRicerca({ client, basePath, testo });
  const { inCorso, errore, esegui } = useAzione();

  async function conferma() {
    const r = await esegui(() =>
      client.post(`${basePath}/${scelto.id}/accesso`, {
        ruolo,
        avvisa: Boolean(scelto.email) && avvisa,
      }),
    );
    if (!r.ok) return;
    onFatto?.();
    setEsito(testoEsitoAccesso(r.valore));
  }

  if (esito) {
    return (
      <Finestra
        titolo={`Aggiungi utente esistente a ${nomePortale}`}
        onChiudi={onChiudi}
        piede={
          <button
            type="button"
            onClick={onChiudi}
            className={BOTTONE.secondario}
          >
            Chiudi
          </button>
        }
      >
        <p className="text-[13px] text-slate-700 dark:text-slate-300">
          {esito}
        </p>
      </Finestra>
    );
  }

  return (
    <Finestra
      titolo={`Aggiungi utente esistente a ${nomePortale}`}
      onChiudi={onChiudi}
      piede={
        <>
          <button
            type="button"
            onClick={onChiudi}
            className={BOTTONE.secondario}
          >
            Annulla
          </button>
          <button
            type="button"
            onClick={conferma}
            disabled={!scelto || inCorso}
            className={BOTTONE.primario}
          >
            Dai accesso
          </button>
        </>
      }
    >
      <Campo
        etichetta="Cerca persona"
        valore={testo}
        onCambia={(v) => {
          // A new search invalidates the previous choice.
          setTesto(v);
          setScelto(null);
        }}
        placeholder="Nome, cognome, username o email"
        autoFocus
        autoComplete="off"
        nota={
          testo.trim().length < MINIMO_CARATTERI
            ? `Almeno ${MINIMO_CARATTERI} caratteri.`
            : undefined
        }
      />
      {ricerca.cercando && (
        <p className="flex items-center gap-2 text-[12.5px] text-slate-500 dark:text-slate-400">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Ricerca in corso…
        </p>
      )}
      <MessaggioErrore>{ricerca.errore}</MessaggioErrore>
      {!ricerca.cercando && ricerca.risultati?.length === 0 && (
        <p className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400">
          <Search className="h-4 w-4" /> Nessun risultato
        </p>
      )}
      {ricerca.risultati?.length > 0 && (
        <ul className="max-h-64 space-y-1.5 overflow-y-auto pr-1">
          {ricerca.risultati.map((u) => (
            <Risultato
              key={u.id}
              utente={u}
              scelto={scelto?.id === u.id}
              onScegli={() => setScelto(u)}
            />
          ))}
        </ul>
      )}
      {scelto && (
        <>
          <SelettoreRuolo
            ruoli={ruoli}
            valore={ruolo}
            onCambia={setRuolo}
            etichetta={`Ruolo su ${nomePortale}`}
          />
          <InterruttoreAvvisa
            attivo={avvisa}
            onCambia={setAvvisa}
            haEmail={Boolean(scelto.email)}
          />
          <Nota>
            Dare l'accesso chiude le sessioni della persona su tutti i portali:
            dovrà rifare il login.
          </Nota>
        </>
      )}
      <MessaggioErrore>{errore}</MessaggioErrore>
    </Finestra>
  );
}
