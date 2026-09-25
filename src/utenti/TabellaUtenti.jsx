import { KeyRound, Pencil, RotateCcw, Trash2, UserMinus, UserX } from "lucide-react";
import { BadgeRuolo, ElencoPortali } from "./BadgePortale.jsx";
import { ICONA_AZIONE } from "./stili.js";
import { LIVELLO, livello } from "./ruoli.js";
import { formattaAccesso, nomeCompleto } from "./formato.js";

const COLONNE = ["Nome", "Username", "Email", "Ruolo", "Altri portali", "Ultimo accesso", "Stato", ""];
const CELLA = "px-3 py-2.5 align-middle";

function Azione({ titolo, icona: Icona, onClick, pericolo }) {
  return (
    <button
      type="button"
      title={titolo}
      aria-label={titolo}
      onClick={onClick}
      className={`${ICONA_AZIONE} ${pericolo ? "hover:!bg-red-50 hover:!text-red-600 dark:hover:!bg-red-500/10 dark:hover:!text-red-400" : ""}`}
    >
      <Icona className="h-4 w-4" />
    </button>
  );
}

function Stato({ attivo }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] text-slate-600 dark:text-slate-300">
      <span className={`h-1.5 w-1.5 rounded-full ${attivo ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`} />
      {attivo ? "Attivo" : "Disattivato"}
    </span>
  );
}

function RigaScheletro() {
  return (
    <tr className="animate-pulse">
      {COLONNE.map((c, i) => (
        <td key={i} className={CELLA}>
          <div className="h-3.5 rounded bg-slate-100 dark:bg-white/[0.06]" style={{ width: `${50 + ((i * 17) % 40)}%` }} />
        </td>
      ))}
    </tr>
  );
}

/**
 * Users table. Row actions depend on the actor: admin-only actions (disable,
 * enable, delete) are hidden below admin, and nobody gets "revoke / disable /
 * delete" on their own row. The backend enforces the same rules anyway.
 */
export default function TabellaUtenti({ utenti, caricando, attore, onAzione }) {
  const adminPlus = livello(attore?.ruolo) >= LIVELLO.admin;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900">
      <table className="min-w-full text-left text-[13px]">
        <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-slate-400">
          <tr>
            {COLONNE.map((c, i) => (
              <th key={i} scope="col" className={`${CELLA} ${i === COLONNE.length - 1 ? "text-right" : ""}`}>
                {c || <span className="sr-only">Azioni</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
          {caricando && utenti.length === 0 && [0, 1, 2, 3].map((i) => <RigaScheletro key={i} />)}
          {utenti.map((u) => {
            const io = u.id === attore?.id;
            return (
              <tr
                key={u.id}
                className={`transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.02] ${u.is_active ? "" : "opacity-60"}`}
              >
                <td className={`${CELLA} font-medium text-slate-800 dark:text-slate-100`}>
                  {nomeCompleto(u)}
                  {io && <span className="ml-1.5 text-[11px] font-normal text-slate-400">(tu)</span>}
                </td>
                <td className={`${CELLA} text-slate-600 dark:text-slate-300`}>{u.username}</td>
                <td className={`${CELLA} text-slate-600 dark:text-slate-300`}>{u.email || "—"}</td>
                <td className={CELLA}><BadgeRuolo ruolo={u.ruolo} /></td>
                <td className={CELLA}><ElencoPortali portali={u.altri_portali} /></td>
                <td className={`${CELLA} whitespace-nowrap text-slate-500 dark:text-slate-400`}>{formattaAccesso(u.last_login)}</td>
                <td className={CELLA}><Stato attivo={u.is_active} /></td>
                <td className={`${CELLA} whitespace-nowrap text-right`}>
                  <div className="inline-flex gap-0.5">
                    <Azione titolo="Modifica" icona={Pencil} onClick={() => onAzione("modifica", u)} />
                    <Azione titolo="Password" icona={KeyRound} onClick={() => onAzione("password", u)} />
                    {!io && <Azione titolo="Togli accesso" icona={UserMinus} onClick={() => onAzione("togli", u)} />}
                    {!io && adminPlus && u.is_active && (
                      <Azione titolo="Disattiva" icona={UserX} onClick={() => onAzione("disattiva", u)} />
                    )}
                    {!io && adminPlus && !u.is_active && (
                      <Azione titolo="Riattiva" icona={RotateCcw} onClick={() => onAzione("riattiva", u)} />
                    )}
                    {!io && adminPlus && (
                      <Azione titolo="Elimina" icona={Trash2} pericolo onClick={() => onAzione("elimina", u)} />
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
