import { useState } from "react";
import { Section } from "../../src/index.js";
import { EmailTemplateEditor } from "../../src/email/index.js";

// The Hub "Cliente direzionale da approvare" template, with the catalog the Hub declares.
const CATALOG = {
  variables: [
    { name: "cliente", label: "Ragione sociale" },
    { name: "operatore", label: "Operatore" },
    { name: "consumo_annuo", label: "Consumo annuo" },
    { name: "link_pratica", label: "Link alla pratica" },
    { name: "cerved", label: "Report Cerved" },
    { name: "sede", label: "Sede legale" },
    { name: "cap_citta", label: "CAP e città" },
    { name: "email", label: "Email" },
  ],
  dataBlocks: [
    { name: "riepilogo", label: "Riepilogo", description: "Operatore, cliente, consumo, quota, simulazione, Cerved", kind: "Coppie etichetta / valore" },
    { name: "situazione_cliente", label: "Situazione del cliente", description: "Già cliente, morosità, Cerved", kind: "Coppie etichetta / valore" },
    { name: "tabella_acquisti", label: "Acquisti", description: "Lotti esistenti e nuovi lotti", kind: "Tabella" },
    { name: "tabella_vendita", label: "Vendita e margine", description: "Per lotto: prezzo e margine", kind: "Tabella" },
    { name: "pulsanti", label: "Pulsanti di decisione", description: "Scegli, delega, rifiuta", kind: "Pulsanti" },
  ],
};

const INIZIALE = {
  version: 1,
  subject: "Cliente direzionale da approvare - {{cliente}}",
  blocks: [
    { id: "b1", type: "text", html: "Il cliente <b>{{cliente}}</b> supera la soglia direzionale: prima di inviargli la proposta serve la tua scelta." },
    { id: "b2", type: "data", ref: "riepilogo", missing: "warn" },
    { id: "b3", type: "heading", level: 2, text: "Situazione del cliente" },
    { id: "b4", type: "data", ref: "situazione_cliente", missing: "warn" },
    { id: "b5", type: "heading", level: 2, text: "Vendita e margine" },
    { id: "b6", type: "data", ref: "tabella_vendita", missing: "warn" },
    { id: "b7", type: "text", html: "In allegato il report Cerved.", show_if: "cerved" },
    { id: "b8", type: "button", label: "Apri la pratica", url: "{{link_pratica}}", style: "primary" },
    { id: "b9", type: "divider" },
    { id: "b10", type: "footer", html: "Sede legale: {{sede}}<br>{{cap_citta}}<br>{{email}}" },
  ],
};

const TD = "border-bottom:1px solid #e2e8f0;padding:5px 8px;text-align:left;font-size:13px";
const PARTS = {
  b2: `<table style="width:100%;border-collapse:collapse"><tr><td style="${TD};font-weight:700">Operatore</td><td style="${TD}">Laura Bianchi</td></tr><tr><td style="${TD};font-weight:700">Consumo annuo</td><td style="${TD}">1.240.000 kWh luce</td></tr></table>`,
  b6: `<table style="width:100%;border-collapse:collapse"><tr><th style="${TD}">Offerta</th><th style="${TD}">Margine minimo</th></tr><tr><td style="${TD}">Business Fix 24</td><td style="${TD}">14.880,00 €</td></tr></table>`,
};

export default function Email() {
  const [template, setTemplate] = useState(INIZIALE);
  const preview = {
    subject: "Cliente direzionale da approvare - Ceramiche Marmorea Srl",
    html: `<html><body style="font-family:Arial;padding:16px"><p>Il cliente <b>Ceramiche Marmorea Srl</b> supera la soglia direzionale.</p>${PARTS.b2}</body></html>`,
    parts: PARTS,
  };
  return (
    <Section title="EmailTemplateEditor" description="@vuscom/ui/email: editor a blocchi dei template email. Qui con il template «Cliente direzionale da approvare» dell'Hub e dati di prova finti.">
      <EmailTemplateEditor
        value={template}
        onChange={setTemplate}
        catalog={CATALOG}
        preview={preview}
        sourceLabel="Hub"
        toolbar={<span className="text-xs text-muted-foreground">Dati di prova: #4127 · Ceramiche Marmorea Srl</span>}
        onSendTest={() => {}}
      />
    </Section>
  );
}
