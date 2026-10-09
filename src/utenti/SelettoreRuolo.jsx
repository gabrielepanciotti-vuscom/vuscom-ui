import { useRef } from "react";

/**
 * Segmented role picker (role="radiogroup"), never a native <select>.
 * Arrow keys move the selection like a native radio group.
 */
export default function SelettoreRuolo({ ruoli, valore, onCambia, etichetta = "Ruolo" }) {
  const gruppo = useRef(null);

  function tasto(e, indice) {
    const passo = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!passo) return;
    e.preventDefault();
    const prossimo = (indice + passo + ruoli.length) % ruoli.length;
    onCambia(ruoli[prossimo]);
    gruppo.current?.querySelectorAll('[role="radio"]')[prossimo]?.focus();
  }

  return (
    <div>
      <span className="mb-1 block text-[12px] font-medium text-slate-600 dark:text-slate-300">{etichetta}</span>
      <div
        ref={gruppo}
        role="radiogroup"
        aria-label={etichetta}
        className="inline-flex flex-wrap gap-0.5 rounded-lg bg-slate-100 p-0.5 dark:bg-white/[0.06]"
      >
        {ruoli.map((r, i) => {
          const scelto = r === valore;
          return (
            <button
              key={r}
              type="button"
              role="radio"
              aria-checked={scelto}
              tabIndex={scelto || (!valore && i === 0) ? 0 : -1}
              onClick={() => onCambia(r)}
              onKeyDown={(e) => tasto(e, i)}
              className={`rounded-md px-3 py-1.5 text-[12.5px] font-medium capitalize transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 ${
                scelto
                  ? "bg-white text-brand-700 shadow-sm dark:bg-slate-800 dark:text-brand-300"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {r}
            </button>
          );
        })}
      </div>
    </div>
  );
}
