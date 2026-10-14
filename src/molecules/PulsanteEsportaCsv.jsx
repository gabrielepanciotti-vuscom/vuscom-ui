import { Download } from "lucide-react";
import Button from "../atoms/Button.jsx";
import { esportaCsv } from "../lib/esportaCsv.js";

/**
 * "Esporta CSV": downloads `rows` through `columns` (DataTable columns) as an
 * Excel-ready CSV. `rows` may be a function, read at click time (all pages, not
 * just the visible one).
 */
export default function PulsanteEsportaCsv({
  nomeFile = "esportazione",
  rows,
  columns,
  variant = "outline",
  size = "sm",
  children = "Esporta CSV",
  disabled,
  ...props
}) {
  const vuoto = Array.isArray(rows) && rows.length === 0;
  return (
    <Button
      variant={variant}
      size={size}
      icon={Download}
      disabled={disabled || vuoto}
      onClick={() =>
        esportaCsv(nomeFile, typeof rows === "function" ? rows() : rows, columns)
      }
      {...props}
    >
      {children}
    </Button>
  );
}
