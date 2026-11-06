import { Plus } from "lucide-react";
import Button from "../atoms/Button.jsx";
import Input from "../atoms/Input.jsx";
import Textarea from "../atoms/Textarea.jsx";
import Select from "../molecules/Select.jsx";
import SegmentedControl from "../molecules/SegmentedControl.jsx";
import FormatBar from "./FormatBar.jsx";
import { TYPE_LABEL } from "./blocks.js";

const Row = ({ label, children, hint }) => (
  <div className="grid gap-1.5">
    <span className="text-xs font-semibold">{label}</span>
    {children}
    {hint && <p className="text-[11.5px] text-muted-foreground">{hint}</p>}
  </div>
);

const ALWAYS = "";

// Right column: only the selected block's properties.
export default function PropertiesPanel({ block, catalog, caret, onPatch, mode, preview }) {
  if (mode === "preview")
    return (
      <div className="space-y-2">
        <h3 className="text-[11.5px] font-semibold uppercase tracking-wider text-muted-foreground">Anteprima</h3>
        <div className="rounded-lg border border-border bg-muted p-2.5 text-[12.5px]">
          <b className="block">Com'è l'email con i dati di prova</b>
          Oggetto: {preview?.subject ?? "—"}
        </div>
      </div>
    );
  if (!block)
    return (
      <div>
        <h3 className="mb-2 text-[11.5px] font-semibold uppercase tracking-wider text-muted-foreground">Proprietà</h3>
        <p className="text-sm text-muted-foreground">Scegli un blocco nell'email per vederne le proprietà.</p>
      </div>
    );

  const showIf = [
    { value: ALWAYS, label: "Sempre" },
    ...(catalog?.variables ?? []).map((v) => ({ value: v.name, label: `Variabile · ${v.label}` })),
    ...(catalog?.dataBlocks ?? []).map((d) => ({ value: d.name, label: `Dati · ${d.label}` })),
  ];
  if (block.show_if && !showIf.some((o) => o.value === block.show_if))
    showIf.push({ value: block.show_if, label: block.show_if });
  const info = block.type === "data" ? catalog?.dataBlocks?.find((d) => d.name === block.ref) : null;

  return (
    <div className="space-y-3">
      <h3 className="text-[11.5px] font-semibold uppercase tracking-wider text-muted-foreground">
        {TYPE_LABEL[block.type] ?? block.type}
      </h3>

      {(block.type === "text" || block.type === "footer") && (
        <Row label="Formato del testo selezionato" hint="Scrivi direttamente nell'email. Per una variabile, clic su un'etichetta a sinistra.">
          <FormatBar caret={caret} />
        </Row>
      )}

      {block.type === "footer" && (
        <Row label="Stile del piè di pagina">
          <SegmentedControl aria-label="Stile del piè di pagina" value={block.style ?? "full"} onChange={(style) => onPatch({ style: style === "full" ? undefined : style })} options={[{ value: "full", label: "Completo (firma e banner)" }, { value: "short", label: "Corto (logo e nome del portale)" }]} />
        </Row>
      )}

      {block.type === "code" && (
        <Row label="Testo" hint="Testo semplice su più righe, per errori e log. Le variabili si scrivono come {{nome}}.">
          <Textarea aria-label="Testo del dettaglio tecnico" rows={6} className="font-mono text-xs" value={block.text} onChange={(e) => onPatch({ text: e.target.value })} />
        </Row>
      )}

      {block.type === "heading" && (
        <Row label="Grandezza">
          <SegmentedControl aria-label="Grandezza" value={block.level} onChange={(level) => onPatch({ level })} options={[{ value: 1, label: "Titolo" }, { value: 2, label: "Sottotitolo" }]} />
        </Row>
      )}

      {block.type === "table" && (
        <Row label="Tabella" hint="Scrivi nelle celle, anche con variabili.">
          <div className="flex flex-wrap gap-1.5">
            <Button variant="outline" size="sm" icon={Plus} onClick={() => onPatch({ rows: [...block.rows, block.columns.map(() => "")] })}>Riga</Button>
            <Button variant="outline" size="sm" icon={Plus} onClick={() => onPatch({ columns: [...block.columns, "Nuova"], rows: block.rows.map((r) => [...r, ""]) })}>Colonna</Button>
            <Button variant="outline" size="sm" disabled={block.rows.length < 2} onClick={() => onPatch({ rows: block.rows.slice(0, -1) })}>Togli riga</Button>
          </div>
        </Row>
      )}

      {block.type === "button" && (
        <>
          <Row label="Testo del pulsante">
            <Input aria-label="Testo del pulsante" value={block.label} onChange={(e) => onPatch({ label: e.target.value })} />
          </Row>
          <Row label="Link" hint="Accetta variabili, es. {{link_pratica}}.">
            <Input aria-label="Link del pulsante" value={block.url} onChange={(e) => onPatch({ url: e.target.value })} />
          </Row>
          <Row label="Stile">
            <SegmentedControl aria-label="Stile" value={block.style} onChange={(style) => onPatch({ style })} options={[{ value: "primary", label: "Pieno" }, { value: "secondary", label: "Contorno" }]} />
          </Row>
        </>
      )}

      {block.type === "image" && (
        <Row label="Larghezza" hint="Immagini da vuscom-email-assets, mai caricate a mano.">
          <SegmentedControl aria-label="Larghezza" value={block.width} onChange={(width) => onPatch({ width })} options={[{ value: 120, label: "Piccolo" }, { value: 160, label: "Medio" }, { value: 220, label: "Grande" }]} />
        </Row>
      )}

      {block.type === "data" && (
        <>
          <div className="rounded-lg border border-border bg-muted p-2.5 text-[12.5px]">
            <b className="block">{info?.label ?? block.ref}</b>
            {info?.description}
            {info?.kind && <span className="block text-[11.5px] text-muted-foreground">{info.kind}</span>}
          </div>
          <Row label="Se i dati mancano" hint="Il contenuto lo calcola il progetto: qui scegli solo cosa succede se manca.">
            <SegmentedControl aria-label="Se i dati mancano" value={block.missing ?? "warn"} onChange={(missing) => onPatch({ missing })} options={[{ value: "warn", label: "Mostra l'avviso" }, { value: "hide", label: "Nascondi il blocco" }]} />
          </Row>
        </>
      )}

      {block.type === "html" && (
        <p className="text-sm text-muted-foreground">Blocco HTML da un template vecchio: non si modifica, si può eliminare.</p>
      )}

      <Row label="Mostra solo se" hint="Il blocco compare solo quando il valore scelto è pieno.">
        <Select aria-label="Mostra solo se" value={block.show_if ?? ALWAYS} onChange={(v) => onPatch({ show_if: v || undefined })} options={showIf} />
      </Row>
    </div>
  );
}
