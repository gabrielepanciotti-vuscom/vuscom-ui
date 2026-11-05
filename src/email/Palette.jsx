import { Database } from "lucide-react";
import { cn } from "../lib/cn.js";
import { BASE_BLOCKS } from "./blocks.js";

const TILE =
  "flex items-center gap-2 rounded-lg border border-border bg-card p-2 text-left text-[12.5px] font-medium " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const Titolo = ({ children }) => (
  <h3 className="mb-2 mt-1 text-[11.5px] font-semibold uppercase tracking-wider text-muted-foreground">{children}</h3>
);

// Left column: base blocks, the project's data blocks, variable chips.
export default function Palette({ catalog, onAdd, onInsertVariable }) {
  const dataBlocks = catalog?.dataBlocks ?? [];
  const variables = catalog?.variables ?? [];
  return (
    <div className="space-y-4">
      <section aria-label="Aggiungi un blocco">
        <Titolo>Aggiungi un blocco</Titolo>
        <div className="grid grid-cols-2 gap-1.5">
          {BASE_BLOCKS.map(({ type, label, icon: Icon }) => (
            <button key={type} type="button" onClick={() => onAdd(type)} className={cn(TILE, "hover:border-primary hover:bg-primary/10")}>
              <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              {label}
            </button>
          ))}
        </div>
      </section>
      {dataBlocks.length > 0 && (
        <section aria-label="Dati">
          <Titolo>Dati</Titolo>
          <div className="grid gap-1.5">
            {dataBlocks.map((d) => (
              <button
                key={d.name}
                type="button"
                onClick={() => onAdd("data", { ref: d.name })}
                className={cn(TILE, "hover:border-violet-500 hover:bg-violet-500/10")}
              >
                <Database className="h-4 w-4 shrink-0 text-violet-600 dark:text-violet-300" aria-hidden />
                <span className="min-w-0">
                  {d.label}
                  {d.description && <small className="block text-[11.5px] font-normal leading-tight text-muted-foreground">{d.description}</small>}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
      {variables.length > 0 && (
        <section aria-label="Variabili">
          <Titolo>Variabili</Titolo>
          <div className="flex flex-wrap gap-1.5">
            {variables.map((v) => (
              <button
                key={v.name}
                type="button"
                title={`{{${v.name}}}`}
                // mousedown would move the caret out of the text before the click lands
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onInsertVariable(v.name)}
                className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {v.label}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-[11.5px] text-muted-foreground">
            Clic su una variabile: entra nel testo dove c'è il cursore. Nel testo si vede come etichetta azzurra.
          </p>
        </section>
      )}
    </div>
  );
}
