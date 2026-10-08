import Alert from "../organisms/Alert.jsx";
import Button from "../atoms/Button.jsx";
import { cn } from "../lib/cn.js";
import useAccessoMicrosoft, { BASE_MICROSOFT } from "./useAccessoMicrosoft.js";

function LogoMicrosoft() {
  return (
    <svg viewBox="0 0 21 21" className="h-4 w-4" aria-hidden="true">
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  );
}

/**
 * Microsoft sign-in block for a login page: renders nothing outside the VUS COM
 * network (the backend says so in `/disponibile`), except an error coming back
 * from the callback. `onAccesso` stores the session like the password login.
 */
export default function AccessoMicrosoft({ base = BASE_MICROSOFT, onAccesso, className }) {
  const { disponibile, inCorso, errore, accedi } = useAccessoMicrosoft({ base, onAccesso });
  if (!disponibile && !errore && !inCorso) return null;

  return (
    <div className={cn("space-y-4", className)}>
      {errore && <Alert tone="danger">{errore}</Alert>}
      {(disponibile || inCorso) && (
        <>
          <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            oppure
            <span className="h-px flex-1 bg-border" />
          </div>
          <Button
            type="button"
            variant="outline"
            size="lg"
            fullWidth
            loading={inCorso}
            icon={LogoMicrosoft}
            onClick={accedi}
          >
            Accedi con Microsoft
          </Button>
        </>
      )}
    </div>
  );
}
