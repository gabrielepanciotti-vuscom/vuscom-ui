import { RotateCcw } from "lucide-react";
import { cn } from "../../lib/cn.js";
import Button from "../../atoms/Button.jsx";
import CampoData from "../../molecules/CampoData.jsx";
import SegmentedControl from "../../molecules/SegmentedControl.jsx";
import { GRANULARITA_REPORT } from "../../organisms/BarraFiltriPeriodo.jsx";

export const FILTRI_VUOTI = { dal: null, al: null, granularita: "mese" };

/**
 * Period filters of a report in one compact row: from, to, week/month and
 * reset. Controlled: `value` = { dal, al, granularita }, `onChange` gets the
 * whole next value.
 */
export default function FiltriReport({
  value = FILTRI_VUOTI,
  onChange,
  predefinito = FILTRI_VUOTI,
  min,
  max,
  className,
}) {
  const v = { ...FILTRI_VUOTI, ...value };
  const imposta = (patch) => onChange?.({ ...v, ...patch });
  const invertito = Boolean(v.dal && v.al && v.dal > v.al);
  const p = { ...FILTRI_VUOTI, ...predefinito };
  const modificato = v.dal !== p.dal || v.al !== p.al || v.granularita !== p.granularita;
  const etichetta = "text-xs font-medium text-muted-foreground";
  return (
    <div className={cn("space-y-1", className)}>
      <div
        role="group"
        aria-label="Filtri del periodo"
        className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border bg-card px-3 py-2"
      >
        <span className={etichetta}>Periodo</span>
        <div className="w-36">
          <CampoData
            aria-label="Dal"
            value={v.dal}
            onChange={(dal) => imposta({ dal })}
            min={min}
            max={v.al || max}
            invalid={invertito}
          />
        </div>
        <span className={etichetta} aria-hidden>
          –
        </span>
        <div className="w-36">
          <CampoData
            aria-label="Al"
            value={v.al}
            onChange={(al) => imposta({ al })}
            min={v.dal || min}
            max={max}
            invalid={invertito}
          />
        </div>
        <span className={cn(etichetta, "ml-2")} aria-hidden>
          Per
        </span>
        <SegmentedControl
          aria-label="Raggruppa per"
          value={v.granularita}
          onChange={(granularita) => imposta({ granularita })}
          options={GRANULARITA_REPORT}
        />
        <Button
          variant="ghost"
          size="sm"
          icon={RotateCcw}
          onClick={() => onChange?.(p)}
          disabled={!modificato}
          className="ml-auto"
        >
          Azzera
        </Button>
      </div>
      {invertito && (
        <p role="alert" className="text-xs text-destructive">
          La data iniziale è dopo quella finale.
        </p>
      )}
    </div>
  );
}
