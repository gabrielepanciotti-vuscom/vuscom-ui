import { useMemo, useState } from "react";
import { AlertCircle, Search, UserPlus, Users } from "lucide-react";
import TabellaUtenti from "./TabellaUtenti.jsx";
import Interruttore from "./Interruttore.jsx";
import FinestraNuovoUtente from "./FinestraNuovoUtente.jsx";
import FinestraAggiungiEsistente from "./FinestraAggiungiEsistente.jsx";
import FinestraModifica from "./FinestraModifica.jsx";
import FinestraPassword from "./FinestraPassword.jsx";
import FinestraElimina from "./FinestraElimina.jsx";
import FinestraConferma from "./FinestraConferma.jsx";
import { BOTTONE, INPUT } from "./stili.js";
import { nomeCompleto } from "./formato.js";
import { useUtenti } from "./useUtenti.js";

const NOTA_SESSIONI = "La persona verrà disconnessa da tutti i portali e dovrà rifare il login.";

function corrisponde(u, filtro) {
  if (!filtro) return true;
  const testo = [u.nome, u.cognome, u.username, u.email].filter(Boolean).join(" ").toLowerCase();
  return testo.includes(filtro);
}

// Confirmation dialogs for the one-shot actions, keyed by action name.
function conferme({ client, basePath, nomePortale }) {
  return {
    togli: (u) => ({
      titolo: "Togli accesso",
      messaggio: `${nomeCompleto(u)} (${u.username}) non potrà più entrare in ${nomePortale}. L'account resta attivo sugli altri portali.`,
      nota: NOTA_SESSIONI,
      etichettaConferma: "Togli accesso",
      pericolo: true,
      azione: () => client.del(`${basePath}/${u.id}/accesso`),
    }),
    disattiva: (u) => ({
      titolo: "Disattiva account",
      messaggio: `L'account di ${nomeCompleto(u)} (${u.username}) verrà disattivato: vale per tutti i portali. Gli accessi restano com'erano e tornano validi se lo riattivi.`,
      nota: NOTA_SESSIONI,
      etichettaConferma: "Disattiva",
      pericolo: true,
      azione: () => client.post(`${basePath}/${u.id}/disattiva`, {}),
    }),
    riattiva: (u) => ({
      titolo: "Riattiva account",
      messaggio: `L'account di ${nomeCompleto(u)} (${u.username}) tornerà attivo su tutti i portali a cui ha accesso.`,
      etichettaConferma: "Riattiva",
      azione: () => client.post(`${basePath}/${u.id}/riattiva`, {}),
    }),
  };
}

/**
 * Shared users page for the VUS COM portals. Every action targets the current
 * portal (`portale`) unless it says "account"; the backend router
 * (vuscom-auth) enforces the permission rules, the UI only hides what the
 * actor could never do.
 */
export default function GestioneUtenti({
  portale,
  nomePortale,
  client,
  attore,
  basePath = "/api/utenti",
  SezioneExtra,
}) {
  const [mostraDisattivati, setMostraDisattivati] = useState(false);
  const [filtro, setFiltro] = useState("");
  const [finestra, setFinestra] = useState(null); // { tipo, utente? }
  const { utenti, caricando, errore, ricarica } = useUtenti({ client, basePath, includiDisattivati: mostraDisattivati });

  const visibili = useMemo(() => {
    const f = filtro.trim().toLowerCase();
    return utenti.filter((u) => corrisponde(u, f));
  }, [utenti, filtro]);

  const nome = nomePortale || portale;
  const chiudi = () => setFinestra(null);
  const comuni = { client, basePath, attore, nomePortale: nome, onChiudi: chiudi, onFatto: ricarica };
  const conferma = finestra && conferme({ client, basePath, nomePortale: nome })[finestra.tipo];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="flex items-center gap-2 text-[18px] font-semibold text-slate-800 dark:text-slate-100">
          <Users className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          {`Utenti — ${nome}`}
        </h1>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setFinestra({ tipo: "aggiungi" })} className={BOTTONE.secondario}>
            <Search className="h-4 w-4" />
            Aggiungi utente esistente
          </button>
          <button type="button" onClick={() => setFinestra({ tipo: "nuovo" })} className={BOTTONE.primario}>
            <UserPlus className="h-4 w-4" />
            Nuovo utente
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            aria-label="Filtra utenti"
            placeholder="Filtra per nome, username, email"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className={`${INPUT} pl-9`}
          />
        </div>
        <Interruttore attivo={mostraDisattivati} onCambia={setMostraDisattivati} etichetta="Mostra disattivati" />
      </div>

      {errore && (
        <div role="alert" className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          <span className="flex items-center gap-2"><AlertCircle className="h-4 w-4" />{errore}</span>
          <button type="button" onClick={ricarica} className={BOTTONE.secondario}>Riprova</button>
        </div>
      )}

      {!errore && (
        <TabellaUtenti utenti={visibili} caricando={caricando} attore={attore} onAzione={(tipo, utente) => setFinestra({ tipo, utente })} />
      )}
      {!errore && !caricando && visibili.length === 0 && (
        <p className="py-8 text-center text-[13px] text-slate-500 dark:text-slate-400">
          {filtro.trim() ? "Nessun utente corrisponde al filtro." : `Nessun utente ha accesso a ${nome}.`}
        </p>
      )}

      {finestra?.tipo === "nuovo" && <FinestraNuovoUtente {...comuni} />}
      {finestra?.tipo === "aggiungi" && <FinestraAggiungiEsistente {...comuni} />}
      {finestra?.tipo === "modifica" && <FinestraModifica {...comuni} utente={finestra.utente} SezioneExtra={SezioneExtra} />}
      {finestra?.tipo === "password" && <FinestraPassword {...comuni} utente={finestra.utente} />}
      {finestra?.tipo === "elimina" && <FinestraElimina {...comuni} utente={finestra.utente} />}
      {conferma && <FinestraConferma {...conferma(finestra.utente)} onChiudi={chiudi} onFatto={ricarica} />}
    </div>
  );
}
