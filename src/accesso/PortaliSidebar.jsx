import { useEffect, useMemo } from "react";
import { LogoV } from "../brand/Brand.jsx";
import { altriPortali, ricordaPortali } from "./portali.js";

/**
 * The other portals the logged-in user can open, as their coloured tiles at the
 * bottom of the sidebar. `codici` comes from the portal's `/me` (the user's enabled
 * portals): it is also remembered, so the next login page in this browser offers
 * the same portals. A tile opens the destination with `?accedi=microsoft`, which
 * logs the user in there through Microsoft when a session is already open.
 */
export default function PortaliSidebar({
  corrente,
  codici,
  compressa = false,
}) {
  useEffect(() => {
    if (codici) ricordaPortali(codici);
  }, [codici]);
  const portali = useMemo(
    () => (codici ? altriPortali({ corrente, codici }) : []),
    [corrente, codici],
  );
  if (!portali.length) return null;

  return (
    <div className={compressa ? "flex flex-col items-center gap-1.5" : "px-2"}>
      {!compressa && (
        <div className="mb-1.5 text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
          Altri portali
        </div>
      )}
      <div
        className={
          compressa
            ? "flex flex-col items-center gap-1.5"
            : "flex flex-wrap gap-1.5"
        }
      >
        {portali.map((p) => (
          <a
            key={p.codice}
            href={p.url}
            title={p.nome}
            aria-label={`Apri ${p.nome}`}
            className="rounded-[9px] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <LogoV portale={p.codice} size={26} />
          </a>
        ))}
      </div>
    </div>
  );
}
