import { useState } from "react";
import { Search } from "lucide-react";
import {
  Button,
  Checkbox,
  Field,
  InfoTip,
  Input,
  SegmentedControl,
  Section,
  Select,
  Tabs,
  Textarea,
  Toggle,
  Tooltip,
} from "../../src/index.js";

const OPZIONI = [
  { value: "a", label: "Prima opzione" },
  { value: "b", label: "Seconda opzione" },
  { value: "c", label: "Disabilitata", disabled: true },
];

export default function Moduli() {
  const [sel, setSel] = useState("a");
  const [on, setOn] = useState(true);
  const [chk, setChk] = useState(true);
  const [tab, setTab] = useState("uno");
  const [seg, setSeg] = useState("m");
  return (
    <>
      <Section title="Campi" description="Input, Textarea, Field, Select.">
        <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
          <Field label="Nome" hint="Come compare nel portale" required>
            <Input placeholder="Mario Rossi" />
          </Field>
          <Field label="Con errore" error="Campo obbligatorio">
            <Input invalid />
          </Field>
          <Field label="Con icona">
            <Input icon={Search} placeholder="Cerca…" />
          </Field>
          <Field label="Note">
            <Textarea placeholder="Scrivi qui" />
          </Field>
          <Select
            value={sel}
            onChange={setSel}
            options={OPZIONI}
            aria-label="Select"
            allowClear
          />
          <Select
            value={null}
            onChange={() => {}}
            options={OPZIONI}
            aria-label="Vuota"
          />
          <Select
            value="a"
            onChange={() => {}}
            options={OPZIONI}
            disabled
            aria-label="Disabilitata"
          />
        </div>
      </Section>
      <Section title="Controlli">
        <div className="flex flex-wrap items-start gap-8">
          <Toggle
            checked={on}
            onChange={setOn}
            label="Toggle"
            description="Con descrizione"
          />
          <Toggle
            checked={false}
            onChange={() => {}}
            label="Disabilitato"
            disabled
          />
          <Checkbox checked={chk} onChange={setChk} label="Checkbox" />
          <Checkbox indeterminate onChange={() => {}} label="Indeterminata" />
          <SegmentedControl
            value={seg}
            onChange={setSeg}
            aria-label="Densità"
            options={[
              { value: "s", label: "S" },
              { value: "m", label: "M" },
              { value: "l", label: "L" },
            ]}
          />
          <Tooltip content="Suggerimento">
            <Button variant="outline">Passa sopra</Button>
          </Tooltip>
          <InfoTip>Testo di aiuto contestuale.</InfoTip>
        </div>
      </Section>
      <Section title="Tabs">
        <Tabs
          value={tab}
          onChange={setTab}
          aria-label="Esempio"
          items={[
            { id: "uno", label: "Uno" },
            { id: "due", label: "Due" },
            { id: "tre", label: "Tre" },
          ]}
        />
      </Section>
    </>
  );
}
