import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../atoms/Button.jsx";
import { formatNumero } from "../lib/format.js";

export default function Pagination({ page, pageSize, total, onPageChange }) {
  if (total <= pageSize) return null;
  const pagine = Math.ceil(total / pageSize);
  const da = (page - 1) * pageSize + 1;
  const a = Math.min(page * pageSize, total);
  return (
    <nav
      aria-label="Paginazione"
      className="flex items-center justify-between gap-3"
    >
      <p className="text-sm text-muted-foreground tabular-nums">
        {`${formatNumero(da)}–${formatNumero(a)} di ${formatNumero(total)}`}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          icon={ChevronLeft}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Pagina precedente"
        >
          Precedente
        </Button>
        <Button
          variant="outline"
          size="sm"
          iconRight={ChevronRight}
          disabled={page >= pagine}
          onClick={() => onPageChange(page + 1)}
          aria-label="Pagina successiva"
        >
          Successiva
        </Button>
      </div>
    </nav>
  );
}
