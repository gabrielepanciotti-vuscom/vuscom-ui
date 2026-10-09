import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

/**
 * "Guida" button in the sidebar header, next to the collapse button: every
 * portal links its general guide here (Gabriele, 09/10/2026). A page-specific
 * guide goes in PageHeader (`helpHref`), not here.
 *
 * `guida` is a path inside the portal ("/guida") or an absolute URL (opened in
 * a new tab), or `{ href, label }` to rename it.
 */
export default function PulsanteGuida({ guida, compressa = false }) {
  if (!guida) return null;
  const { href, label = "Guida" } = typeof guida === "string" ? { href: guida } : guida;
  const esterna = /^https?:\/\//.test(href);
  const className = compressa
    ? "flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-slate-800 dark:hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 transition-colors"
    : "flex items-center justify-center w-7 h-7 rounded-md text-slate-400 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-slate-700 dark:hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 transition-colors";
  const icona = <BookOpen className={compressa ? "w-5 h-5" : "w-4 h-4"} aria-hidden />;
  const comuni = { className, title: label, "aria-label": label };
  return esterna ? (
    <a href={href} target="_blank" rel="noreferrer" {...comuni}>
      {icona}
    </a>
  ) : (
    <Link to={href} {...comuni}>
      {icona}
    </Link>
  );
}
