import { Bug } from "lucide-react";
import Button from "../atoms/Button.jsx";
import IconButton from "../atoms/IconButton.jsx";
import { cn } from "../lib/cn.js";
import { useSegnalazioni } from "./contesto.js";

const ETICHETTA = "Segnala un problema";

/**
 * «Segnala un problema»: starts the crosshair. Three shapes: `riga` (a full
 * footer row of the sidebar, labelled), `compatto` (icon only) or a ghost
 * button with label. For `AppShell` pass `azioniSegnalazioni`, which picks
 * the row or the icon as the sidebar opens and collapses. Renders nothing
 * when reports are off for this portal (or outside a SegnalazioniProvider),
 * so it never shows a button that fails.
 */
export default function PulsanteSegnala({
  compatto = false,
  riga = false,
  className,
}) {
  const { abilitato, apri, stato } = useSegnalazioni();
  if (!abilitato) return null;
  const occupato = stato !== "inattivo";
  if (compatto)
    return (
      <span data-segnala-ignora className="inline-flex">
        <IconButton
          icon={Bug}
          label={ETICHETTA}
          title={ETICHETTA}
          size="sm"
          onClick={apri}
          disabled={occupato}
          className={className}
        />
      </span>
    );
  if (riga)
    return (
      <button
        type="button"
        data-segnala-ignora
        onClick={apri}
        disabled={occupato}
        className={cn(
          "flex w-full items-center gap-2 rounded-md bg-muted/60 px-2 py-1.5 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
      >
        <Bug className="h-3.5 w-3.5" aria-hidden />
        {ETICHETTA}
      </button>
    );
  return (
    <span data-segnala-ignora className="inline-flex">
      <Button
        variant="ghost"
        size="sm"
        icon={Bug}
        onClick={apri}
        disabled={occupato}
        className={className}
      >
        {ETICHETTA}
      </Button>
    </span>
  );
}

/** `AppShell` `azioniSidebar`: a labelled row when open, the icon when collapsed. */
export function azioniSegnalazioni({ compressa }) {
  return compressa ? <PulsanteSegnala compatto /> : <PulsanteSegnala riga />;
}
