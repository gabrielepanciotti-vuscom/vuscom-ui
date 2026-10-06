import { useState } from "react";
import { Send } from "lucide-react";
import {
  Alert,
  Button,
  ConfirmDialog,
  Dialog,
  PageHeader,
  Section,
  useToast,
} from "../../src/index.js";

const TONI = ["info", "success", "warning", "danger"];

export default function Feedback() {
  const { toast } = useToast();
  const [dlg, setDlg] = useState(false);
  const [conf, setConf] = useState(false);
  const [dng, setDng] = useState(false);
  return (
    <>
      <Section title="Alert">
        <div className="space-y-3">
          {TONI.map((t) => (
            <Alert
              key={t}
              tone={t}
              title={`Alert ${t}`}
              onClose={t === "info" ? () => {} : undefined}
            >
              Messaggio di esempio per il tono {t}.
            </Alert>
          ))}
        </div>
      </Section>
      <Section title="Dialog, ConfirmDialog, Toast">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setDlg(true)}>
            Apri Dialog
          </Button>
          <Button variant="outline" onClick={() => setConf(true)}>
            ConfirmDialog
          </Button>
          <Button variant="destructive" onClick={() => setDng(true)}>
            Conferma con testo
          </Button>
          {TONI.map((t) => (
            <Button
              key={t}
              variant="secondary"
              onClick={() =>
                toast({ title: `Toast ${t}`, description: "Esempio", tone: t })
              }
            >
              Toast {t}
            </Button>
          ))}
        </div>
        <Dialog
          open={dlg}
          onClose={() => setDlg(false)}
          title="Dialog"
          description="Descrizione"
          icon={Send}
          footer={<Button onClick={() => setDlg(false)}>Chiudi</Button>}
        >
          Contenuto della finestra.
        </Dialog>
        <ConfirmDialog
          open={conf}
          onClose={() => setConf(false)}
          onConfirm={async () => {}}
          title="Confermi?"
        >
          L'azione parte solo dopo la conferma.
        </ConfirmDialog>
        <ConfirmDialog
          open={dng}
          onClose={() => setDng(false)}
          onConfirm={async () => {}}
          tone="danger"
          title="Eliminare?"
          confirmLabel="Elimina"
          requireText="ELIMINA"
        >
          Scrivi ELIMINA per proseguire.
        </ConfirmDialog>
      </Section>
      <Section title="PageHeader">
        <PageHeader
          title="Titolo pagina"
          description="Descrizione"
          help="Aiuto"
          actions={<Button size="sm">Azione</Button>}
        />
      </Section>
    </>
  );
}
