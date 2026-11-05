import { Database } from "lucide-react";
import { cn } from "../lib/cn.js";
import Editable from "./Editable.jsx";

const CELL = "border-b border-slate-200 px-2 py-1.5 text-left align-top";

// What a block looks like on the email paper (always light, like the real email).
export default function BlockBody({ block, onPatch, catalog, preview, sourceLabel }) {
  const { type } = block;

  if (type === "text")
    return (
      <Editable as="p" rich aria-label="Testo" value={block.html} onChange={(html) => onPatch({ html })} className="my-1.5" />
    );

  if (type === "heading")
    return (
      <Editable
        aria-label="Titolo"
        value={block.text}
        onChange={(text) => onPatch({ text })}
        className={block.level === 1 ? "my-1.5 text-lg font-bold" : "mb-1 mt-2 text-[15px] font-bold"}
      />
    );

  if (type === "table") {
    const setCol = (i, v) => onPatch({ columns: block.columns.map((c, k) => (k === i ? v : c)) });
    const setCell = (r, c, v) =>
      onPatch({ rows: block.rows.map((row, i) => (i === r ? row.map((x, k) => (k === c ? v : x)) : row)) });
    return (
      <div className="overflow-x-auto">
        <table className="my-1 w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {block.columns.map((c, i) => (
                <Editable as="th" key={i} aria-label={`Intestazione ${i + 1}`} value={c} onChange={(v) => setCol(i, v)} className={cn(CELL, "bg-slate-100 text-xs text-slate-600")} />
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, r) => (
              <tr key={r}>
                {row.map((c, i) => (
                  <Editable as="td" key={i} aria-label={`Riga ${r + 1}, colonna ${i + 1}`} value={c} onChange={(v) => setCell(r, i, v)} className={CELL} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (type === "button")
    return (
      <span
        className={cn(
          "my-1 inline-block rounded-md px-4 py-2 font-bold",
          block.style === "secondary" ? "border border-blue-600 bg-white text-blue-600" : "bg-blue-600 text-white",
        )}
      >
        {block.label || "Pulsante"}
      </span>
    );

  if (type === "divider") return <hr className="my-2.5 border-0 border-t border-slate-200" />;

  if (type === "image")
    return (
      <div className="py-1.5">
        <div
          style={{ width: block.width }}
          className="flex h-11 max-w-full items-center justify-center rounded-md bg-gradient-to-r from-blue-900 to-blue-600 font-bold tracking-widest text-white"
        >
          VUS COM
        </div>
      </div>
    );

  if (type === "footer")
    return (
      <div className="rounded border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-600">
        <div className="mb-1.5 inline-block rounded bg-gradient-to-r from-blue-900 to-blue-600 px-2 py-0.5 text-[10px] font-bold tracking-widest text-white">
          VUS COM
        </div>
        <Editable rich aria-label="Piè di pagina" value={block.html} onChange={(html) => onPatch({ html })} />
      </div>
    );

  if (type === "data") {
    const info = catalog?.dataBlocks?.find((d) => d.name === block.ref);
    const part = preview?.parts?.[block.id];
    return (
      <div className="relative rounded-r-md border-l-[3px] border-violet-500 bg-violet-50 px-2 py-1.5">
        <span className="absolute right-1.5 top-1 inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 text-[10.5px] text-violet-700">
          <Database className="h-3 w-3" aria-hidden />
          Calcolato da {sourceLabel} · {info?.label ?? block.ref}
        </span>
        {part ? (
          <div className="pt-4" dangerouslySetInnerHTML={{ __html: part }} />
        ) : (
          <p className="pt-4 text-xs text-slate-600">{info?.description ?? `Dati «${block.ref}»`}</p>
        )}
      </div>
    );
  }

  if (type === "html")
    return (
      <div>
        <p className="mb-1 text-xs text-amber-700">Blocco HTML da un template vecchio</p>
        <iframe title="Anteprima del blocco HTML" sandbox="" srcDoc={block.html} className="h-40 w-full rounded border border-slate-200 bg-white" />
      </div>
    );

  return <p className="text-xs text-slate-500">Blocco sconosciuto ({type})</p>;
}
