import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../atoms/Button.jsx";
import { cn } from "../lib/cn.js";
import { formatNumero } from "../lib/format.js";

export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  className,
}) {
  // A single page needs no controls, unless the caller is stuck past it
  // (e.g. filters shrank the result): then there must be a way back.
  if (total <= pageSize && page <= 1) return null;
  const pagine = Math.max(1, Math.ceil(total / pageSize));
  const p = Math.min(Math.max(1, page), pagine);
  const da = (p - 1) * pageSize + 1;
  const a = Math.min(p * pageSize, total);
  return (
    <nav
      aria-label="Paginazione"
      className={cn("flex items-center justify-between gap-3", className)}
    >
      <p className="text-sm text-muted-foreground tabular-nums">
        {total > 0
          ? `${formatNumero(da)}–${formatNumero(a)} di ${formatNumero(total)}`
          : "Nessun risultato"}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          icon={ChevronLeft}
          disabled={page <= 1}
          onClick={() => onPageChange(Math.min(page - 1, pagine))}
          aria-label="Pagina precedente"
        >
          Precedente
        </Button>
        <Button
          variant="outline"
          size="sm"
          iconRight={ChevronRight}
          disabled={p >= pagine}
          onClick={() => onPageChange(p + 1)}
          aria-label="Pagina successiva"
        >
          Successiva
        </Button>
      </div>
    </nav>
  );
}
