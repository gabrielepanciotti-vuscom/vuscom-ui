import { useId } from "react";
import { AlertCircle, Info } from "lucide-react";
import { ETICHETTA, INPUT } from "./stili.js";

/** Labelled text input; `nota` is a hint under the field. */
export function Campo({ etichetta, valore, onCambia, tipo = "text", nota, autoFocus, ...resto }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={ETICHETTA}>
        {etichetta}
      </label>
      <input
        id={id}
        type={tipo}
        value={valore}
        onChange={(e) => onCambia(e.target.value)}
        autoFocus={autoFocus}
        className={INPUT}
        {...resto}
      />
      {nota && <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{nota}</p>}
    </div>
  );
}

/** Error text of an action, shown inside the dialog that ran it. */
export function MessaggioErrore({ children }) {
  if (!children) return null;
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12.5px] text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
      <span>{children}</span>
    </div>
  );
}

/** Neutral informational note (e.g. "sessions are closed on every portal"). */
export function Nota({ children }) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-[12px] text-slate-600 dark:bg-white/[0.04] dark:text-slate-400">
      <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-400 dark:text-slate-500" />
      <span>{children}</span>
    </div>
  );
}
