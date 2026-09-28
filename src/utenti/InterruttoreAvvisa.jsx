import Interruttore from "./Interruttore.jsx";
import { Nota } from "./Campo.jsx";

/**
 * "Avvisa via email" switch reused by every window that grants access.
 * Forced off (and disabled) when the target person has no email: the
 * backend would not send anything anyway, so the switch would lie.
 */
export default function InterruttoreAvvisa({ attivo, onCambia, haEmail }) {
  return (
    <div className="space-y-1">
      <Interruttore
        attivo={haEmail && attivo}
        onCambia={onCambia}
        etichetta="Avvisa via email"
        disabilitato={!haEmail}
      />
      {!haEmail && (
        <Nota>Nessuna email in anagrafica: non è possibile avvisare.</Nota>
      )}
    </div>
  );
}
