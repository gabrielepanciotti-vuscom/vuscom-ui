import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import Button from "../atoms/Button.jsx";
import { cn } from "../lib/cn.js";
import BlockView from "./BlockView.jsx";
import Editable from "./Editable.jsx";

// Subject line + the email paper. The paper stays white in both themes.
export default function Canvas({
  template,
  selectedId,
  phone,
  catalog,
  preview,
  sourceLabel,
  actions,
  onSubject,
  onAddText,
}) {
  const [armed, setArmed] = useState(null);
  const [over, setOver] = useState(null);
  const dragged = useRef(null);
  const { blocks } = template;

  const labelOf = (name) =>
    catalog?.variables?.find((v) => v.name === name)?.label ??
    catalog?.dataBlocks?.find((d) => d.name === name)?.label ??
    name;

  const dnd = {
    ...actions,
    arm: setArmed,
    dragStart: (e, id) => {
      dragged.current = id;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", id);
    },
    dragOver: (e, id) => {
      if (!dragged.current) return;
      e.preventDefault();
      setOver(id);
    },
    drop: (e, id) => {
      if (!dragged.current) return;
      e.preventDefault();
      actions.reorder(dragged.current, id);
    },
    dragEnd: () => {
      dragged.current = null;
      setArmed(null);
      setOver(null);
    },
  };

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <div className="mb-3 flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
        <span className="shrink-0 text-xs text-muted-foreground">Oggetto</span>
        <Editable aria-label="Oggetto" value={template.subject} onChange={onSubject} className="min-w-0 flex-1 font-semibold text-foreground" />
      </div>
      <div className={cn("mx-auto rounded-md border border-border bg-white px-6 py-5 font-sans text-sm text-slate-900 transition-[max-width]", phone ? "max-w-[375px] !px-4 !py-4" : "max-w-[640px]")}>
        {blocks.length === 0 && (
          <p className="py-8 text-center text-slate-600">Email vuota: aggiungi un blocco dalla colonna di sinistra.</p>
        )}
        {blocks.map((b, i) => (
          <BlockView
            key={b.id}
            block={b}
            index={i}
            total={blocks.length}
            selected={b.id === selectedId}
            armed={armed === b.id}
            over={over === b.id && dragged.current !== b.id}
            showIfLabel={b.show_if ? labelOf(b.show_if) : null}
            actions={dnd}
            bodyProps={{ catalog, preview, sourceLabel }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-center">
        <Button variant="outline" size="sm" icon={Plus} className="border-dashed" onClick={onAddText}>
          Aggiungi testo in fondo
        </Button>
      </div>
    </div>
  );
}
