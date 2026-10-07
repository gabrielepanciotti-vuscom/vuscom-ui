import { Bug } from "lucide-react";
import Button from "../atoms/Button.jsx";
import IconButton from "../atoms/IconButton.jsx";
import { useSegnalazioni } from "./contesto.js";

const ETICHETTA = "Segnala un problema";

/**
 * «Segnala un problema»: starts the crosshair. Pass it to `AppShell` as
 * `azioniSidebar`. Renders nothing when reports are off for this portal
 * (or outside a SegnalazioniProvider), so it never shows a button that fails.
 */
export default function PulsanteSegnala({ compatto = false, className }) {
  const { abilitato, apri, stato } = useSegnalazioni();
  if (!abilitato) return null;
  const occupato = stato !== "inattivo";
  return (
    <span data-segnala-ignora className="inline-flex">
      {compatto ? (
        <IconButton
          icon={Bug}
          label={ETICHETTA}
          title={ETICHETTA}
          size="sm"
          onClick={apri}
          disabled={occupato}
          className={className}
        />
      ) : (
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
      )}
    </span>
  );
}
