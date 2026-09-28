import { useState } from "react";
import { UserCheck } from "lucide-react";
import Finestra from "./Finestra.jsx";
import SelettoreRuolo from "./SelettoreRuolo.jsx";
import PasswordMostrata from "./PasswordMostrata.jsx";
import InterruttoreAvvisa from "./InterruttoreAvvisa.jsx";
import { ElencoPortali } from "./BadgePortale.jsx";
import { Campo, MessaggioErrore, Nota } from "./Campo.jsx";
import { BOTTONE } from "./stili.js";
import { ruoliAssegnabili } from "./ruoli.js";
import {
  nomeCompleto,
  testoONull,
  testoEsitoAccesso,
  vuoto,
} from "./formato.js";
import { useAzione } from "./useAzione.js";

const NOTA_SESSIONI =
  "Dare l'accesso chiude le sessioni della persona su tutti i portali: dovrà rifare il login.";

/** Existing person found by the 409 "esiste": offer access instead of an error. */
function PersonaEsistente({
  utente,
  nomePortale,
  onDaiAccesso,
  inCorso,
  selettore,
  avvisa,
  onCambiaAvvisa,
}) {
  let stato = null;
  if (utente.ruolo) stato = "Ha già accesso a questo portale.";
  else if (!utente.is_active)
    stato = "L'account è disattivato: riattivalo prima di dargli accesso.";
  return (
    <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50/60 p-4 dark:border-blue-500/30 dark:bg-blue-500/10">
      <p className="flex items-center gap-2 text-[14px] font-semibold text-slate-800 dark:text-slate-100">
        <UserCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        {`${nomeCompleto(utente) === "—" ? utente.username : nomeCompleto(utente)} esiste già`}
      </p>
      <ElencoPortali portali={utente.altri_portali} />
      {stato ? (
        <p className="text-[13px] text-slate-600 dark:text-slate-300">
          {stato}
        </p>
      ) : (
        <>
          {selettore}
          <InterruttoreAvvisa
            attivo={avvisa}
            onCambia={onCambiaAvvisa}
            haEmail={Boolean(utente.email)}
          />
          <Nota>{NOTA_SESSIONI}</Nota>
          <button
            type="button"
            onClick={onDaiAccesso}
            disabled={inCorso}
            className={BOTTONE.primario}
          >
            {`Dai accesso a ${nomePortale}`}
          </button>
        </>
      )}
    </div>
  );
}

export default function FinestraNuovoUtente({
  client,
  basePath,
  nomePortale,
  attore,
  onChiudi,
  onFatto,
}) {
  const ruoli = ruoliAssegnabili(attore?.ruolo);
  const [campi, setCampi] = useState({
    username: "",
    email: "",
    nome: "",
    cognome: "",
    password: "",
  });
  const [ruolo, setRuolo] = useState("viewer");
  const [esistente, setEsistente] = useState(null);
  const [avvisa, setAvvisa] = useState(true);
  const [esito, setEsito] = useState(null); // { password_generata, email_inviata } | { accesso: true, testo }
  const { inCorso, errore, esegui } = useAzione();
  const imposta = (k) => (v) => setCampi((c) => ({ ...c, [k]: v }));
  const nomeIncompleto = vuoto(campi.nome) || vuoto(campi.cognome);

  async function crea(e) {
    e.preventDefault();
    const corpo = {
      username: campi.username.trim(),
      email: testoONull(campi.email),
      nome: campi.nome.trim(),
      cognome: campi.cognome.trim(),
      ruolo,
      password: campi.password ? campi.password : null,
    };
    const r = await esegui(
      () => client.post(basePath, corpo),
      (err) => {
        const d = err?.body?.detail;
        if (err?.status === 409 && d?.codice === "esiste" && d.utente) {
          setEsistente(d.utente);
          return true;
        }
        return false;
      },
    );
    if (!r.ok) return;
    onFatto?.();
    setEsito({
      password_generata: r.valore?.password_generata,
      email_inviata: r.valore?.email_inviata,
    });
  }

  async function daiAccesso() {
    const r = await esegui(() =>
      client.post(`${basePath}/${esistente.id}/accesso`, {
        ruolo,
        avvisa: Boolean(esistente.email) && avvisa,
      }),
    );
    if (!r.ok) return;
    onFatto?.();
    setEsito({ accesso: true, testo: testoEsitoAccesso(r.valore) });
  }

  const chiudi = (
    <button type="button" onClick={onChiudi} className={BOTTONE.secondario}>
      Chiudi
    </button>
  );

  if (esito) {
    return (
      <Finestra
        titolo="Nuovo utente"
        onChiudi={onChiudi}
        piede={chiudi}
        bloccata={Boolean(esito.password_generata)}
      >
        {esito.accesso && (
          <p className="text-[13px] text-slate-700 dark:text-slate-300">
            {esito.testo}
          </p>
        )}
        {!esito.accesso && (
          <p className="text-[13px] text-slate-700 dark:text-slate-300">
            Utente creato.
          </p>
        )}
        {esito.password_generata && (
          <PasswordMostrata password={esito.password_generata} />
        )}
        {!esito.password_generata && esito.email_inviata && (
          <p className="text-[13px] text-slate-600 dark:text-slate-400">
            Le credenziali sono state inviate per email.
          </p>
        )}
      </Finestra>
    );
  }

  if (esistente) {
    return (
      <Finestra titolo="Nuovo utente" onChiudi={onChiudi} piede={chiudi}>
        <PersonaEsistente
          utente={esistente}
          nomePortale={nomePortale}
          onDaiAccesso={daiAccesso}
          inCorso={inCorso}
          selettore={
            <SelettoreRuolo ruoli={ruoli} valore={ruolo} onCambia={setRuolo} />
          }
          avvisa={avvisa}
          onCambiaAvvisa={setAvvisa}
        />
        <MessaggioErrore>{errore}</MessaggioErrore>
      </Finestra>
    );
  }

  return (
    <Finestra
      titolo="Nuovo utente"
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
            type="submit"
            form="vuscom-nuovo-utente"
            disabled={
              inCorso || campi.username.trim().length < 3 || nomeIncompleto
            }
            className={BOTTONE.primario}
          >
            Crea utente
          </button>
        </>
      }
    >
      <form id="vuscom-nuovo-utente" onSubmit={crea} className="space-y-3">
        <Campo
          etichetta="Username"
          valore={campi.username}
          onCambia={imposta("username")}
          autoFocus
          autoComplete="off"
        />
        <Campo
          etichetta="Email"
          tipo="email"
          valore={campi.email}
          onCambia={imposta("email")}
          autoComplete="off"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Campo
            etichetta="Nome"
            valore={campi.nome}
            onCambia={imposta("nome")}
            obbligatorio
          />
          <Campo
            etichetta="Cognome"
            valore={campi.cognome}
            onCambia={imposta("cognome")}
            obbligatorio
          />
        </div>
        <SelettoreRuolo ruoli={ruoli} valore={ruolo} onCambia={setRuolo} />
        <Campo
          etichetta="Password (facoltativa)"
          tipo="password"
          valore={campi.password}
          onCambia={imposta("password")}
          autoComplete="new-password"
          nota="Se vuota viene generata e inviata per email. Almeno 8 caratteri."
        />
        <MessaggioErrore>{errore}</MessaggioErrore>
      </form>
    </Finestra>
  );
}
