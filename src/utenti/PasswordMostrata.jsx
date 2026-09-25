import { useState } from "react";
import { Check, Copy, KeyRound } from "lucide-react";
import { BOTTONE } from "./stili.js";

/** Generated password shown once, with a copy button. */
export default function PasswordMostrata({ password }) {
  const [copiata, setCopiata] = useState(false);

  async function copia() {
    try {
      await navigator.clipboard.writeText(password);
      setCopiata(true);
      setTimeout(() => setCopiata(false), 2000);
    } catch {
      setCopiata(false);
    }
  }

  return (
    <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-500/30 dark:bg-amber-500/10">
      <p className="flex items-center gap-1.5 text-[12.5px] font-medium text-amber-800 dark:text-amber-300">
        <KeyRound className="h-4 w-4" />
        Password generata: viene mostrata una sola volta, consegnala tu alla persona.
      </p>
      <div className="flex items-center gap-2">
        <code className="flex-1 select-all rounded-md bg-white px-3 py-2 font-mono text-[13px] text-slate-800 ring-1 ring-amber-200 dark:bg-slate-900 dark:text-slate-100 dark:ring-amber-500/30">
          {password}
        </code>
        <button type="button" onClick={copia} className={BOTTONE.secondario}>
          {copiata ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
          {copiata ? "Copiata" : "Copia"}
        </button>
      </div>
    </div>
  );
}
