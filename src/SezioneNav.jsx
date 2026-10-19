/**
 * Sezione della sidebar: titolo fisso sopra un blocco di voci.
 *
 * A differenza di un gruppo non si chiude mai, quindi i badge delle voci restano
 * sempre in vista (serve alle code di lavoro). Da compressa il titolo non ci sta:
 * al suo posto un divisore sottile, come quello prima delle voci di amministrazione.
 */
export default function SezioneNav({ section, collapsed, children }) {
  return (
    <div role="group" aria-label={section} className="mb-1">
      {collapsed ? (
        <div className="flex justify-center py-2" aria-hidden="true">
          <div className="w-6 border-t border-slate-200 dark:border-white/[0.08]" />
        </div>
      ) : (
        <div className="px-2.5 pt-3 pb-1 text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 truncate">
          {section}
        </div>
      )}
      {children}
    </div>
  );
}
