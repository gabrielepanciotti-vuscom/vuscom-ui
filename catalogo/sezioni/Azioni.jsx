import { useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import {
  Badge,
  Button,
  IconButton,
  Kbd,
  ProgressBar,
  Section,
  Spinner,
  StatusDot,
  VediCome,
} from "../../src/index.js";

const VARIANTI = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
];
const TONI = ["neutral", "primary", "success", "warning", "danger", "info"];

const VISTE = [
  { key: "viewer", label: "Viewer", descrizione: "Sola lettura: elenco offerte, simulatore, tabelle" },
  { key: "manager", label: "Manager", descrizione: "Operativo: crea e modifica offerte, import" },
  { key: "admin", label: "Admin", descrizione: "Completo: anagrafiche, configurazione" },
];

function DemoVediCome() {
  const [attiva, setAttiva] = useState(null);
  return (
    <div className="flex justify-end">
      <VediCome
        viste={VISTE}
        attiva={attiva}
        onSeleziona={setAttiva}
        labelRipristino="Torna alla vista reale (Superadmin)"
        nota="Cambia solo ciò che vedi. I permessi reali sul server restano quelli di superadmin."
      />
    </div>
  );
}

export default function Azioni() {
  return (
    <>
      <Section title="VediCome" description="Selettore «Vedi come» della top bar (topbarRight di AppShell). Senza viste non si vede.">
        <DemoVediCome />
      </Section>
      <Section title="Button" description="Varianti, taglie e stati.">
        <div className="space-y-3">
          {["sm", "md", "lg"].map((size) => (
            <div key={size} className="flex flex-wrap items-center gap-2">
              {VARIANTI.map((v) => (
                <Button key={v} variant={v} size={size}>
                  {v}
                </Button>
              ))}
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-2">
            <Button icon={Plus}>Con icona</Button>
            <Button loading>Caricamento</Button>
            <Button disabled>Disabilitato</Button>
            <IconButton icon={Trash2} label="Elimina" />
            <IconButton icon={Search} label="Cerca" variant="outline" />
          </div>
        </div>
      </Section>
      <Section title="Badge, StatusDot, Kbd, Spinner">
        <div className="flex flex-wrap items-center gap-2">
          {TONI.map((t) => (
            <Badge key={t} tone={t} dot>
              {t}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {TONI.map((t) => (
            <StatusDot key={t} tone={t} label={t} pulse={t === "success"} />
          ))}
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      </Section>
      <Section title="ProgressBar">
        <div className="max-w-md space-y-3">
          <ProgressBar value={35} label="Avanzamento" showValue />
          <ProgressBar value={80} tone="success" />
          <ProgressBar value={95} tone="danger" />
        </div>
      </Section>
    </>
  );
}
