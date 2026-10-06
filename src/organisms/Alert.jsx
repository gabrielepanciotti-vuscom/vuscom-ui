import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn } from "../lib/cn.js";
import IconButton from "../atoms/IconButton.jsx";

// Darker text in light mode keeps contrast on the tinted background.
const TONI = {
  info: {
    box: "border-info/30 bg-info/10 text-sky-900 dark:text-sky-100",
    icon: "text-info",
    Icona: Info,
  },
  success: {
    box: "border-success/30 bg-success/10 text-green-900 dark:text-green-100",
    icon: "text-success",
    Icona: CheckCircle2,
  },
  warning: {
    box: "border-warning/40 bg-warning/10 text-amber-900 dark:text-amber-100",
    icon: "text-warning",
    Icona: AlertTriangle,
  },
  danger: {
    box: "border-destructive/30 bg-destructive/10 text-red-900 dark:text-red-100",
    icon: "text-destructive",
    Icona: XCircle,
  },
};

export default function Alert({
  tone = "info",
  title,
  children,
  onClose,
  className,
}) {
  const t = TONI[tone] ?? TONI.info;
  const urgente = tone === "danger" || tone === "warning";
  return (
    <div
      role={urgente ? "alert" : "status"}
      className={cn(
        "flex gap-3 rounded-lg border p-4 text-sm",
        t.box,
        className,
      )}
    >
      <t.Icona className={cn("mt-0.5 h-5 w-5 shrink-0", t.icon)} aria-hidden />
      <div className="min-w-0 flex-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={cn(title && "mt-0.5")}>{children}</div>}
      </div>
      {onClose && (
        <IconButton
          icon={X}
          label="Chiudi"
          size="sm"
          onClick={onClose}
          className="-my-1 -mr-1 shrink-0"
        />
      )}
    </div>
  );
}
