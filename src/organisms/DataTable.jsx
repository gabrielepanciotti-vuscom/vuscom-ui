import { ChevronDown, ChevronUp, ChevronsUpDown, Inbox } from "lucide-react";
import { cn } from "../lib/cn.js";
import { Card } from "./Card.jsx";
import { SkeletonTable } from "./Skeleton.jsx";
import EmptyState from "./EmptyState.jsx";
import useSort from "./useSort.js";
import { segnalaAttr } from "../segnalazioni/segnalaAttr.js";

// Clicks on these (or inside them) belong to the control, not to the row.
const INTERATTIVI =
  "a,button,input,textarea,select,[role=listbox],[role=option],[role=switch],[role=checkbox],[data-no-row-click]";

const ALIGN = { left: "text-left", right: "text-right", center: "text-center" };
const JUSTIFY = {
  left: "justify-start",
  right: "justify-end",
  center: "justify-center",
};

function SortIcon({ dir }) {
  const Icon =
    dir === "asc" ? ChevronUp : dir === "desc" ? ChevronDown : ChevronsUpDown;
  return (
    <Icon className={cn("h-3.5 w-3.5", !dir && "opacity-40")} aria-hidden />
  );
}

export default function DataTable({
  columns,
  rows,
  rowKey,
  onRowClick,
  loading = false,
  empty,
  initialSort,
  dense = false,
  caption,
  segnala,
  className,
}) {
  const accessors = {};
  columns.forEach((c) => {
    if (c.sortAccessor) accessors[c.key] = c.sortAccessor;
  });
  const { sorted, sort, toggle } = useSort(rows, {
    initial: initialSort,
    accessors,
  });

  const pad = dense ? "px-3 py-1.5" : "px-4 py-3";

  let body;
  if (loading && rows.length === 0) {
    body = (
      <div className="p-4">
        <SkeletonTable rows={5} cols={columns.length} />
      </div>
    );
  } else if (rows.length === 0) {
    body =
      empty === undefined ? (
        <EmptyState icon={Inbox} title="Nessun dato" />
      ) : typeof empty === "string" ? (
        <p className="px-6 py-12 text-center text-sm text-muted-foreground">
          {empty}
        </p>
      ) : (
        empty
      );
  }

  return (
    <Card className={cn("p-0", className)} {...segnalaAttr(segnala)}>
      <div className="overflow-x-auto">
        {body ? (
          body
        ) : (
          <table className="w-full text-sm">
            {caption && <caption className="sr-only">{caption}</caption>}
            <thead className="border-b bg-muted/50 font-medium text-muted-foreground">
              <tr>
                {columns.map((c) => {
                  const active = sort && sort.key === c.key ? sort.dir : null;
                  const align = ALIGN[c.align] || ALIGN.left;
                  return (
                    <th
                      key={c.key}
                      scope="col"
                      {...segnalaAttr(c.segnala)}
                      style={c.width ? { width: c.width } : undefined}
                      aria-sort={
                        c.sortable
                          ? active === "asc"
                            ? "ascending"
                            : active === "desc"
                              ? "descending"
                              : "none"
                          : undefined
                      }
                      className={cn(
                        pad,
                        "whitespace-nowrap font-medium",
                        align,
                        c.className,
                      )}
                    >
                      {c.sortable ? (
                        <button
                          type="button"
                          onClick={() => toggle(c.key)}
                          className={cn(
                            "inline-flex items-center gap-1 rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            JUSTIFY[c.align] || JUSTIFY.left,
                            active && "text-foreground",
                          )}
                        >
                          {c.header}
                          <SortIcon dir={active} />
                        </button>
                      ) : (
                        c.header
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y">
              {sorted.map((row) => (
                <tr
                  key={rowKey(row)}
                  tabIndex={onRowClick ? 0 : undefined}
                  onClick={
                    onRowClick
                      ? (e) => {
                          const hit = e.target.closest?.(INTERATTIVI);
                          if (hit && e.currentTarget.contains(hit)) return;
                          onRowClick(row);
                        }
                      : undefined
                  }
                  onKeyDown={
                    onRowClick
                      ? (e) => {
                          if (e.key === "Enter" && e.target === e.currentTarget)
                            onRowClick(row);
                        }
                      : undefined
                  }
                  className={cn(
                    "transition-colors hover:bg-muted/40",
                    onRowClick &&
                      "cursor-pointer focus-visible:outline-none focus-visible:bg-muted/60 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                  )}
                >
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      {...segnalaAttr(c.segnala)}
                      className={cn(
                        pad,
                        ALIGN[c.align] || ALIGN.left,
                        c.className,
                      )}
                    >
                      {c.cell ? c.cell(row) : (row[c.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
}
