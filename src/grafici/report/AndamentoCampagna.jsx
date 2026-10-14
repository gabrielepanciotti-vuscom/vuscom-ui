import { History } from "lucide-react";
import { Card } from "../../organisms/Card.jsx";
import { formatNumero } from "../../lib/format.js";
import GraficoBarre from "../GraficoBarre.jsx";

/**
 * Trend of a campaign: one stacked bar per period (the state at its last
 * snapshot, never a sum). With fewer than two periods a chart would be a few
 * isolated bars that say nothing, so it is not drawn: a note says when the
 * history starts and the table below carries the numbers.
 */
export default function AndamentoCampagna({
  periodi = [],
  serie = [],
  inCostruzione,
  titolo = "Andamento della campagna",
  formatValore = formatNumero,
  altezza = 300,
}) {
  if (periodi.length < 2)
    return (
      <Card className="flex items-start gap-3 p-4" role="status">
        <History
          className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground"
          aria-hidden
        />
        <div className="space-y-0.5 text-sm">
          <p className="font-medium">
            {inCostruzione ?? "Storico in costruzione."}
          </p>
          <p className="text-muted-foreground">
            Il grafico compare dal secondo periodo: per ora i numeri sono nella
            tabella qui sotto.
          </p>
        </div>
      </Card>
    );
  return (
    <GraficoBarre
      titolo={titolo}
      periodi={periodi}
      serie={serie}
      impilate
      altezza={altezza}
      formatValore={formatValore}
    />
  );
}
