import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";

const FOCUSABILI =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Base modal: overlay, Esc closes, simple focus trap (Tab cycles inside),
 * focus restored to the opener on close.
 * `bloccata`: only an explicit button in the dialog can close it (no Esc, no
 * backdrop, no X) - used while a one-time password is on screen.
 */
export default function Finestra({ titolo, onChiudi, children, piede, larghezza = "max-w-lg", bloccata = false }) {
  const pannello = useRef(null);
  const idTitolo = useId();
  const chiudiRef = useRef(onChiudi);
  chiudiRef.current = onChiudi;
  // Captured during the first render, before any child is committed and can
  // steal focus: this is the element that opened the dialog.
  const [apritore] = useState(() => (typeof document !== "undefined" ? document.activeElement : null));

  useEffect(() => {
    const nodo = pannello.current;
    if (nodo && !nodo.contains(document.activeElement)) {
      const iniziale = nodo.querySelector("[data-autofocus]") || nodo.querySelector(FOCUSABILI);
      (iniziale || nodo).focus();
    }
    return () => {
      if (apritore && apritore !== document.body && document.contains(apritore)) apritore.focus();
    };
  }, [apritore]);

  const chiudibile = !bloccata;

  function tasto(e) {
    if (e.key === "Escape") {
      e.stopPropagation();
      if (chiudibile) chiudiRef.current?.();
      return;
    }
    if (e.key !== "Tab") return;
    const elementi = Array.from(pannello.current?.querySelectorAll(FOCUSABILI) || []);
    if (!elementi.length) return;
    const primo = elementi[0];
    const ultimo = elementi[elementi.length - 1];
    if (e.shiftKey && document.activeElement === primo) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primo.focus();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onKeyDown={tasto}
    >
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] dark:bg-black/60"
        onMouseDown={() => chiudibile && chiudiRef.current?.()}
        aria-hidden="true"
      />
      <div
        ref={pannello}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitolo}
        tabIndex={-1}
        className={`relative flex max-h-[90vh] w-full ${larghezza} flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl focus:outline-none dark:border-white/10 dark:bg-slate-900`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-white/[0.06]">
          <h2 id={idTitolo} className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
            {titolo}
          </h2>
          {chiudibile && (
            <button
              type="button"
              onClick={() => chiudiRef.current?.()}
              aria-label="Chiudi finestra"
              className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/[0.06] dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">{children}</div>
        {piede && (
          <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3 dark:border-white/[0.06] dark:bg-white/[0.02]">
            {piede}
          </div>
        )}
      </div>
    </div>
  );
}
