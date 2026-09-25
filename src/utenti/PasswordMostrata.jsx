import { useEffect, useRef, useState } from "react";
import { Check, Copy, KeyRound } from "lucide-react";
import { BOTTONE } from "./stili.js";

// Select the node's text and copy it the old way. Needed over plain HTTP
// (INTEGRA), where navigator.clipboard does not exist.
function copiaDaSelezione(nodo) {
  try {
    const selezione = window.getSelection();
    const intervallo = document.createRange();
    intervallo.selectNodeContents(nodo);
    selezione.removeAllRanges();
    selezione.addRange(intervallo);
    return typeof document.execCommand === "function" && document.execCommand("copy") === true;
  } catch {
    return false;
  }
}

async function copia(testo, nodo) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(testo);
      return true;
    } catch {
      // Permission denied or insecure context: try the selection fallback.
    }
  }
  return copiaDaSelezione(nodo);
}

/** Generated password shown once, with a copy button. */
export default function PasswordMostrata({ password }) {
  const [stato, setStato] = useState(null); // null | "copiata" | "impossibile"
  const codice = useRef(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function alClick() {
    const ok = await copia(password, codice.current);
    setStato(ok ? "copiata" : "impossibile");
    if (ok) {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setStato(null), 2000);
    }
  }

  const copiata = stato === "copiata";
  return (
    <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-500/30 dark:bg-amber-500/10">
      <p className="flex items-center gap-1.5 text-[12.5px] font-medium text-amber-800 dark:text-amber-300">
        <KeyRound className="h-4 w-4" />
        Password generata: viene mostrata una sola volta, consegnala tu alla persona.
      </p>
      <div className="flex items-center gap-2">
        <code
          ref={codice}
          className="flex-1 select-all rounded-md bg-white px-3 py-2 font-mono text-[13px] text-slate-800 ring-1 ring-amber-200 dark:bg-slate-900 dark:text-slate-100 dark:ring-amber-500/30"
        >
          {password}
        </code>
        <button type="button" onClick={alClick} className={BOTTONE.secondario}>
          {copiata ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
          {copiata ? "Copiata" : "Copia"}
        </button>
      </div>
      {stato === "impossibile" && (
        <p role="status" className="text-[12px] text-amber-800 dark:text-amber-300">
          Copia non disponibile: seleziona e copia a mano
        </p>
      )}
    </div>
  );
}
