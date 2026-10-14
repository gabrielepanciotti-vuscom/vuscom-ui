import { useEffect, useMemo, useState } from "react";
import { ChevronDown, LayoutGrid } from "lucide-react";
import { LogoV } from "../brand/Brand.jsx";
import { altriPortali, ricordaPortali } from "./portali.js";

const STORAGE_KEY = "vuscom.portali.collapsed";

function readCollapsed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

/**
 * The other portals the logged-in user can open, as their coloured tiles at the
 * bottom of the sidebar. `codici` comes from the portal's `/me` (the user's enabled
 * portals): it is also remembered, so the next login page in this browser offers
 * the same portals. A tile opens the destination with `?accedi=microsoft`, which
 * logs the user in there through Microsoft when a session is already open.
 *
 * The section is collapsible (`richiudibile`, on by default): the «Altri portali»
 * label is a button that hides the tiles to leave room to the menu items, and the
 * choice sticks in localStorage (same scheme as «comprimi menu»). Collapsed, a
 * single icon replaces the tiles.
 */
export default function PortaliSidebar({
  corrente,
  codici,
  compressa = false,
  richiudibile = true,
}) {
  const [chiuso, setChiuso] = useState(readCollapsed);

  useEffect(() => {
    if (codici) ricordaPortali(codici);
  }, [codici]);

  const portali = useMemo(
    () => (codici ? altriPortali({ corrente, codici }) : []),
    [corrente, codici],
  );
  if (!portali.length) return null;

  const aperto = !richiudibile || !chiuso;

  const toggle = () =>
    setChiuso((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // Storage unavailable: the preference just won't persist.
      }
      return next;
    });

  const tessere = (
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
  );

  if (compressa) {
    return (
      <div className="flex flex-col items-center gap-1.5">
        {richiudibile && (
          <button
            type="button"
            onClick={toggle}
            aria-expanded={aperto}
            aria-label={aperto ? "Nascondi altri portali" : "Mostra altri portali"}
            title={aperto ? "Nascondi altri portali" : "Mostra altri portali"}
            className="flex items-center justify-center rounded-md p-1 text-slate-400 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-slate-700 dark:hover:text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        )}
        {aperto && tessere}
      </div>
    );
  }

  return (
    <div className="px-2">
      {richiudibile ? (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={aperto}
          className="w-full mb-1.5 flex items-center justify-between gap-1 text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          <span>Altri portali</span>
          <ChevronDown
            className={`w-3 h-3 shrink-0 transition-transform duration-150 ${aperto ? "rotate-180" : ""}`}
          />
        </button>
      ) : (
        <div className="mb-1.5 text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
          Altri portali
        </div>
      )}
      {aperto && tessere}
    </div>
  );
}
