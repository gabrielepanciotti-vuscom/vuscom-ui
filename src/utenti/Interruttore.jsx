/** Custom switch (never a native checkbox). */
export default function Interruttore({
  attivo,
  onCambia,
  etichetta,
  disabilitato = false,
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={attivo}
      disabled={disabilitato}
      onClick={() => onCambia(!attivo)}
      className="group inline-flex items-center gap-2 text-[13px] text-slate-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-300"
    >
      <span
        className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-200 group-focus-visible:ring-2 group-focus-visible:ring-brand-500/60 ${
          attivo
            ? "bg-brand-600 dark:bg-brand-500"
            : "bg-slate-300 dark:bg-white/15"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
            attivo ? "translate-x-[18px]" : "translate-x-0.5"
          }`}
        />
      </span>
      {etichetta}
    </button>
  );
}
