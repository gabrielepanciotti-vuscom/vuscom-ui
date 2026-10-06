import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "../lib/cn.js";
import { formatNumero } from "../lib/format.js";
import InfoTip from "../molecules/InfoTip.jsx";
import { Card } from "./Card.jsx";
import { Skeleton } from "./Skeleton.jsx";

const ICONE = {
  neutral: "bg-muted text-muted-foreground",
  primary: "bg-primary/15 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-destructive/15 text-destructive",
};

function Delta({ delta }) {
  const su = delta.value > 0;
  const giu = delta.value < 0;
  const Icona = giu ? ArrowDownRight : ArrowUpRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium",
        su && "text-success",
        giu && "text-destructive",
        !su && !giu && "text-muted-foreground",
      )}
    >
      {(su || giu) && <Icona className="h-3.5 w-3.5" aria-hidden />}
      {su ? "+" : ""}
      {formatNumero(delta.value)}
      {delta.label && (
        <span className="ml-1 font-normal text-muted-foreground">
          {delta.label}
        </span>
      )}
    </span>
  );
}

export default function KpiCard({
  label,
  value,
  hint,
  delta,
  tone = "neutral",
  icon: Icon,
  loading = false,
  help,
  className,
}) {
  const mostrato = typeof value === "number" ? formatNumero(value) : value;
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="truncate">{label}</span>
            {help && <InfoTip>{help}</InfoTip>}
          </div>
          {loading ? (
            <Skeleton className="mt-2 h-8 w-24" />
          ) : (
            <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight">
              {mostrato}
            </p>
          )}
        </div>
        {Icon && (
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              ICONE[tone] ?? ICONE.neutral,
            )}
          >
            <Icon className="h-5 w-5" aria-hidden />
          </span>
        )}
      </div>
      {!loading && (delta || hint) && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {delta && <Delta delta={delta} />}
          {hint && (
            <span className="text-xs text-muted-foreground">{hint}</span>
          )}
        </div>
      )}
    </Card>
  );
}
