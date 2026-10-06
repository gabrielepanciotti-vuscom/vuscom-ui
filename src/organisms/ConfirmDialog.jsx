import { useEffect, useRef, useState } from "react";
import Button from "../atoms/Button.jsx";
import Input from "../atoms/Input.jsx";
import Field from "../molecules/Field.jsx";
import Alert from "./Alert.jsx";
import Dialog from "./Dialog.jsx";

// Safety gate for actions with external effects (spending credit, bulk writes).
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  children,
  confirmLabel = "Conferma",
  cancelLabel = "Annulla",
  tone = "primary",
  requireText,
}) {
  // A ref, not state: two clicks in the same tick both see the stale `loading`.
  const inCorso = useRef(false);
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState(null);
  const [testo, setTesto] = useState("");

  useEffect(() => {
    if (!open) {
      setErrore(null);
      setTesto("");
    }
  }, [open]);

  const sbloccato = !requireText || testo === requireText;

  async function conferma() {
    if (inCorso.current || !sbloccato) return; // a second click while pending must not fire again
    inCorso.current = true;
    setLoading(true);
    setErrore(null);
    try {
      await onConfirm();
      onClose();
    } catch (e) {
      setErrore(e?.message || "Operazione non riuscita");
    } finally {
      inCorso.current = false;
      setLoading(false);
    }
  }

  // While the request is pending, closing would hide an outcome the user must see.
  const chiudi = () => {
    if (!inCorso.current) onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={chiudi}
      title={title}
      size="sm"
      closeOnBackdrop={!loading}
      footer={
        <>
          <Button variant="outline" onClick={chiudi} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={tone === "danger" ? "destructive" : "primary"}
            onClick={conferma}
            loading={loading}
            disabled={!sbloccato}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-sm text-muted-foreground">
        {children}
        {requireText && (
          <Field label={`Scrivi ${requireText} per confermare`}>
            <Input
              value={testo}
              onChange={(e) => setTesto(e.target.value)}
              autoComplete="off"
              disabled={loading}
              data-autofocus
            />
          </Field>
        )}
        {errore && <Alert tone="danger">{errore}</Alert>}
      </div>
    </Dialog>
  );
}
