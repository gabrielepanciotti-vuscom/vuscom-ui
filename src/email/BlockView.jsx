import { ChevronDown, ChevronUp, Copy, GripVertical, Trash2 } from "lucide-react";
import IconButton from "../atoms/IconButton.jsx";
import { cn } from "../lib/cn.js";
import BlockBody from "./BlockBody.jsx";
import { TYPE_LABEL } from "./blocks.js";

// One block on the paper: selection frame, hover/selected toolbar, drag source and target.
export default function BlockView({
  block,
  index,
  total,
  selected,
  armed,
  over,
  showIfLabel,
  actions,
  bodyProps,
}) {
  const { select, move, duplicate, remove, arm, dragStart, dragOver, drop, dragEnd } = actions;
  const name = TYPE_LABEL[block.type] ?? block.type;
  const bar = "h-7 w-7 max-sm:min-h-9 max-sm:min-w-9";
  return (
    <div
      data-block={block.id}
      role="group"
      aria-label={`Blocco ${index + 1} di ${total}: ${name}`}
      aria-current={selected || undefined}
      tabIndex={0}
      draggable={armed}
      onClick={() => select(block.id)}
      onFocusCapture={() => select(block.id)}
      onKeyDown={(e) => e.target === e.currentTarget && e.key === "Enter" && select(block.id)}
      onDragStart={(e) => dragStart(e, block.id)}
      onDragOver={(e) => dragOver(e, block.id)}
      onDrop={(e) => drop(e, block.id)}
      onDragEnd={dragEnd}
      className={cn(
        "group relative -mx-1.5 my-0.5 rounded-md border px-1.5 py-1 outline-none",
        "focus-visible:ring-2 focus-visible:ring-blue-500",
        selected ? "border-blue-600 shadow-[0_0_0_3px_rgb(37_99_235/0.15)]" : "border-dashed border-transparent hover:border-slate-300",
        over && "border-t-4 border-t-blue-600",
      )}
    >
      <div
        className={cn(
          "absolute -top-4 right-1 z-10 gap-0.5 rounded-md border border-border bg-card p-0.5 text-foreground shadow-sm",
          selected ? "flex" : "hidden group-focus-within:flex group-hover:flex",
        )}
      >
        <IconButton icon={GripVertical} size="sm" aria-label="Trascina per spostare" className={cn(bar, "cursor-grab")} onMouseDown={() => arm(block.id)} onMouseUp={() => arm(null)} />
        <IconButton icon={ChevronUp} size="sm" aria-label="Sposta su" disabled={index === 0} className={bar} onClick={(e) => { e.stopPropagation(); move(block.id, -1); }} />
        <IconButton icon={ChevronDown} size="sm" aria-label="Sposta giù" disabled={index === total - 1} className={bar} onClick={(e) => { e.stopPropagation(); move(block.id, 1); }} />
        <IconButton icon={Copy} size="sm" aria-label="Duplica" className={bar} onClick={(e) => { e.stopPropagation(); duplicate(block.id); }} />
        <IconButton icon={Trash2} size="sm" aria-label="Elimina" className={bar} onClick={(e) => { e.stopPropagation(); remove(block.id); }} />
      </div>
      <BlockBody block={block} {...bodyProps} onPatch={(patch) => actions.patch(block.id, patch)} />
      {showIfLabel && (
        <span className="mt-1 inline-block rounded-full bg-amber-100 px-2 text-[11px] text-amber-800">
          Solo se: {showIfLabel}
        </span>
      )}
    </div>
  );
}
