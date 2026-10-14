import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "../../lib/cn.js";
import { TESTO } from "../../atoms/tones.js";
import InfoTip from "../../molecules/InfoTip.jsx";
import { Card } from "../../organisms/Card.jsx";
import { Skeleton } from "../../organisms/Skeleton.jsx";
import Sparkline from "../Sparkline.jsx";

/**
 * One KPI tile of a report: label, value, delta and sparkline in a fixed
 * layout, so a row of metrics and indicators reads as one grid — same height,
 * same type sizes, whatever is missing. `meglio` ("su" | "giu") says which
 * direction of the delta is good news; without it the delta stays neutral.
 */
export default function TesseraKpi({
  label,
  valore,
  aiuto,
  delta,
  deltaTesto,
  deltaNota,
  meglio,
  andamento,
  tono,
  loading = false,
  className,
}) {
  const su = delta > 0;
  const giu = delta < 0;
  const buono = meglio && (su || giu) ? (meglio === "su") === su : null;
  const Freccia = giu ? ArrowDownRight : ArrowUpRight;
  return (
    <Card className={cn("flex min-h-[8.5rem] flex-col p-4", className)}>
      <div className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <span className="truncate" title={label}>
          {label}
        </span>
        {aiuto && <InfoTip>{aiuto}</InfoTip>}
      </div>
      {loading ? (
        <Skeleton className="mt-2 h-7 w-24" />
      ) : (
        <p
          className={cn(
            "mt-1 truncate text-2xl font-semibold tabular-nums tracking-tight",
            tono && TESTO[tono],
          )}
        >
          {valore}
        </p>
      )}
      <div className="mt-auto flex items-end justify-between gap-2 pt-2">
        <div className="min-w-0 text-xs">
          {!loading && deltaTesto ? (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-medium tabular-nums",
                buono === true && TESTO.success,
                buono === false && TESTO.danger,
                buono === null && "text-muted-foreground",
              )}
            >
              {(su || giu) && <Freccia className="h-3.5 w-3.5" aria-hidden />}
              {deltaTesto}
            </span>
          ) : null}
          {!loading && deltaNota && (
            <span className="block truncate text-muted-foreground">
              {deltaNota}
            </span>
          )}
        </div>
        <Sparkline
          valori={andamento}
          titolo={andamento?.length > 1 ? `Andamento di ${label}` : undefined}
        />
      </div>
    </Card>
  );
}
