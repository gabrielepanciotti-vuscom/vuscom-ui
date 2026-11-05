import { useEffect, useMemo, useRef, useState } from "react";
import { Eye, Monitor, Pencil, Send, Smartphone } from "lucide-react";
import Button from "../atoms/Button.jsx";
import SegmentedControl from "../molecules/SegmentedControl.jsx";
import { cn } from "../lib/cn.js";
import Canvas from "./Canvas.jsx";
import Palette from "./Palette.jsx";
import PropertiesPanel from "./PropertiesPanel.jsx";
import { EditorContext } from "./context.js";
import { duplicate, insertAfter, moveBy, moveTo, newBlock, patchBlock } from "./blocks.js";
import { insertVariable } from "./richText.js";

const MODES = [
  { value: "edit", label: "Modifica", icon: Pencil },
  { value: "preview", label: "Anteprima", icon: Eye },
];
const WIDTHS = [
  { value: "desk", label: <span className="sr-only">Computer</span>, icon: Monitor },
  { value: "phone", label: <span className="sr-only">Telefono</span>, icon: Smartphone },
];

// Remembers the last caret/selection made inside an editable text of this editor, so palette and
// format buttons can act on it after the click moved the focus.
function useCaret(rootRef) {
  const last = useRef(null);
  useEffect(() => {
    const onChange = () => {
      const s = document.getSelection();
      if (!s?.rangeCount) return;
      const n = s.anchorNode;
      const el = (n?.nodeType === 1 ? n : n?.parentElement)?.closest?.("[data-editable]");
      if (el && rootRef.current?.contains(el)) last.current = { el, range: s.getRangeAt(0).cloneRange() };
    };
    document.addEventListener("selectionchange", onChange);
    return () => document.removeEventListener("selectionchange", onChange);
  }, [rootRef]);
  return last;
}

export default function EmailTemplateEditor({
  value,
  onChange,
  catalog,
  preview,
  toolbar,
  onSendTest,
  sourceLabel = "progetto",
}) {
  const [mode, setMode] = useState("edit");
  const [width, setWidth] = useState("desk");
  const [selectedId, setSelectedId] = useState(null);
  const rootRef = useRef(null);
  const caret = useCaret(rootRef);
  const blocks = value.blocks;
  const labels = useMemo(
    () => Object.fromEntries((catalog?.variables ?? []).map((v) => [v.name, v.label])),
    [catalog],
  );
  const ctx = useMemo(() => ({ labels }), [labels]);
  const selected = blocks.find((b) => b.id === selectedId) ?? null;

  const setBlocks = (next) => onChange({ ...value, blocks: next });

  const add = (type, extra) => {
    const block = newBlock(type, blocks, extra);
    setBlocks(insertAfter(blocks, selectedId, block));
    setSelectedId(block.id);
    setMode("edit");
  };

  const actions = {
    select: setSelectedId,
    patch: (id, patch) => setBlocks(patchBlock(blocks, id, patch)),
    move: (id, d) => setBlocks(moveBy(blocks, id, d)),
    reorder: (from, to) => {
      setBlocks(moveTo(blocks, from, to));
      setSelectedId(from);
    },
    duplicate: (id) => {
      const r = duplicate(blocks, id);
      setBlocks(r.blocks);
      setSelectedId(r.id);
    },
    remove: (id) => {
      const i = blocks.findIndex((b) => b.id === id);
      const rest = blocks.filter((b) => b.id !== id);
      setBlocks(rest);
      setSelectedId(rest[Math.min(i, rest.length - 1)]?.id ?? null);
    },
  };

  const insertVar = (name) => {
    let { el, range } = caret.current ?? {};
    if (!el?.isConnected)
      [el, range] = [rootRef.current?.querySelector(`[data-block="${selectedId}"] [data-editable]`), null];
    if (el) insertVariable(el, range, name, labels[name]);
  };

  const phone = width === "phone";
  return (
    <EditorContext.Provider value={ctx}>
      <div ref={rootRef} className="overflow-hidden rounded-xl border border-border bg-background text-foreground">
        <div className="flex flex-wrap items-center gap-3 border-b border-border bg-card px-4 py-2.5">
          <SegmentedControl aria-label="Modalità" value={mode} onChange={setMode} options={MODES} />
          <SegmentedControl aria-label="Larghezza" value={width} onChange={setWidth} options={WIDTHS} />
          {toolbar}
          {onSendTest && (
            <Button variant="outline" size="sm" icon={Send} className="ml-auto" onClick={onSendTest}>
              Prova a me
            </Button>
          )}
        </div>
        <div className="grid min-h-[560px] lg:grid-cols-[240px_minmax(0,1fr)_290px]">
          <aside className="border-b border-border bg-card p-3.5 lg:border-b-0 lg:border-r">
            <Palette catalog={catalog} onAdd={add} onInsertVariable={insertVar} />
          </aside>
          <main className="min-w-0 overflow-auto bg-background p-4 lg:p-5">
            {mode === "edit" ? (
              <Canvas
                template={value}
                selectedId={selectedId}
                phone={phone}
                catalog={catalog}
                preview={preview}
                sourceLabel={sourceLabel}
                actions={actions}
                onSubject={(subject) => onChange({ ...value, subject })}
                onAddText={() => add("text")}
              />
            ) : preview?.html ? (
              <iframe
                title="Anteprima dell'email"
                sandbox=""
                srcDoc={preview.html}
                className={cn("mx-auto block h-[640px] w-full rounded-md border border-border bg-white", phone ? "max-w-[375px]" : "max-w-[640px]")}
              />
            ) : (
              <p className="py-10 text-center text-sm text-muted-foreground">Anteprima non disponibile.</p>
            )}
          </main>
          <aside className="border-t border-border bg-card p-3.5 lg:border-l lg:border-t-0">
            <PropertiesPanel
              block={selected}
              catalog={catalog}
              caret={caret}
              mode={mode}
              preview={preview}
              onPatch={(patch) => actions.patch(selectedId, patch)}
            />
          </aside>
        </div>
      </div>
    </EditorContext.Provider>
  );
}
