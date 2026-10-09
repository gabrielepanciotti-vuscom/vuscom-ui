import { etichettaPortale } from "./ruoli.js";

const RUOLO_COLORE = {
  superadmin: "bg-purple-50 text-purple-700 ring-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:ring-purple-500/30",
  admin: "bg-brand-50 text-brand-700 ring-brand-200 dark:bg-brand-500/10 dark:text-brand-300 dark:ring-brand-500/30",
  manager: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30",
  viewer: "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-white/[0.06] dark:text-slate-300 dark:ring-white/10",
};

const pillola = "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset";

/** Role badge on the current portal. */
export function BadgeRuolo({ ruolo }) {
  if (!ruolo) return <span className="text-slate-400 dark:text-slate-500">—</span>;
  return <span className={`${pillola} capitalize ${RUOLO_COLORE[ruolo] || RUOLO_COLORE.viewer}`}>{ruolo}</span>;
}

/** "Hub Offerte · manager": access the person has on another portal. */
export default function BadgePortale({ portale, ruolo }) {
  return (
    <span className={`${pillola} ${RUOLO_COLORE[ruolo] || RUOLO_COLORE.viewer}`}>
      {etichettaPortale(portale)}
      {ruolo && <span className="opacity-70">· {ruolo}</span>}
    </span>
  );
}

/** Row of portal badges, or a dash when there are none. */
export function ElencoPortali({ portali }) {
  if (!portali?.length) return <span className="text-slate-400 dark:text-slate-500">—</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {portali.map((p) => (
        <BadgePortale key={p.portale} portale={p.portale} ruolo={p.ruolo} />
      ))}
    </div>
  );
}
