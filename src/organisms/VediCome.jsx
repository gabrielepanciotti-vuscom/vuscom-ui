import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, Eye, RotateCcw } from "lucide-react";
import { cn } from "../lib/cn.js";

// "Vedi come" selector for the AppShell top bar (topbarRight). Presentation
// only: the portal decides which views exist and what switching means (a
// client-side role disguise in Hub Offerte, a real demo account in Portale
// Segnalazioni). No views → nothing rendered, so who cannot switch never sees it.
export default function VediCome({
  viste = [],
  attiva = null,
  onSeleziona,
  labelAttiva,
  nota,
  labelRipristino = "Torna alla vista reale",
  titolo = "Vedi l'app come",
  className,
}) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const uid = useId();

  useEffect(() => {
    if (!open) return undefined;
    const fuori = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    const esc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", fuori);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", fuori);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  if (!viste.length) return null;

  const corrente = viste.find((v) => v.key === attiva);
  const attivo = attiva != null;
  const etichetta = labelAttiva ?? corrente?.label ?? attiva;

  const scegli = (key) => {
    setOpen(false);
    onSeleziona?.(key);
  };

  return (
    <div className={cn("relative", className)} ref={boxRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `${uid}-menu` : undefined}
        title={
          attivo
            ? `Stai vedendo l'app come ${etichetta}`
            : "Vedi l'app come un altro ruolo"
        }
        className={cn(
          "flex items-center gap-1.5 h-8 pl-2.5 pr-2 rounded-md text-[12px] font-medium border transition-colors",
          attivo
            ? "border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/[0.12] text-amber-800 dark:text-amber-300"
            : "border-transparent text-slate-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/[0.06]",
        )}
      >
        <Eye className="w-4 h-4" aria-hidden="true" />
        <span className="hidden sm:inline">
          {attivo ? `Vista: ${etichetta}` : "Vedi come"}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "w-3.5 h-3.5 transition-transform duration-150",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          id={`${uid}-menu`}
          role="menu"
          aria-label={titolo}
          className="absolute right-0 mt-2 w-72 z-30 bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-lg shadow-xl py-1.5"
        >
          <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
            {titolo}
          </div>

          {viste.map((v) => {
            const selected = v.key === attiva;
            return (
              <button
                key={v.key}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => scegli(v.key)}
                className={cn(
                  "w-full text-left px-3 py-2 flex items-start gap-2 transition-colors",
                  selected
                    ? "bg-brand-50 dark:bg-brand-500/[0.12]"
                    : "hover:bg-gray-50 dark:hover:bg-white/[0.06]",
                )}
              >
                <Check
                  aria-hidden="true"
                  className={cn(
                    "w-3.5 h-3.5 mt-0.5 flex-shrink-0",
                    selected
                      ? "text-brand-600 dark:text-brand-400"
                      : "text-transparent",
                  )}
                />
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block text-[13px]",
                      selected
                        ? "font-semibold text-brand-700 dark:text-brand-300"
                        : "text-slate-700 dark:text-slate-200",
                    )}
                  >
                    {v.label}
                  </span>
                  {v.descrizione && (
                    <span className="block text-[11px] text-slate-400 dark:text-slate-500 leading-snug">
                      {v.descrizione}
                    </span>
                  )}
                </span>
              </button>
            );
          })}

          <div className="border-t border-gray-100 dark:border-white/[0.06] my-1" />

          <button
            type="button"
            role="menuitem"
            onClick={() => scegli(null)}
            disabled={!attivo}
            className={cn(
              "w-full text-left px-3 py-2 text-[13px] flex items-center gap-2 transition-colors",
              attivo
                ? "text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-white/[0.06]"
                : "text-slate-300 dark:text-slate-600 cursor-not-allowed",
            )}
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            {labelRipristino}
          </button>

          {nota && (
            <p className="px-3 pt-1 pb-1.5 text-[10px] text-slate-400 dark:text-slate-500 leading-snug">
              {nota}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
