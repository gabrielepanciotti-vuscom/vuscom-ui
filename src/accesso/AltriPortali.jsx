import { useMemo } from "react";
import { altriPortali, portaliRicordati } from "./portali.js";

/**
 * «Accedi ad altri portali» under a login form. Shows the portals of the last user
 * who logged in from this browser (remembered at login); with nobody remembered,
 * every internal portal, as the hand-written lists did before.
 */
export default function AltriPortali({ corrente }) {
  const portali = useMemo(
    () => altriPortali({ corrente, codici: portaliRicordati() }),
    [corrente],
  );
  if (!portali.length) return null;

  return (
    <div className="space-y-3 border-t border-border pt-4 text-center">
      <p className="text-sm text-muted-foreground">Accedi ad altri portali</p>
      <div className="flex flex-wrap justify-center gap-2">
        {portali.map((p) => (
          <a
            key={p.codice}
            href={p.url}
            className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {p.nome}
          </a>
        ))}
      </div>
    </div>
  );
}
