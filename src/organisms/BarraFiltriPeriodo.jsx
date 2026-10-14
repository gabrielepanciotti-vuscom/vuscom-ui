import { useId } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "../lib/cn.js";
import { formatDataIt } from "../lib/dataIt.js";
import Button from "../atoms/Button.jsx";
import CampoData from "../molecules/CampoData.jsx";
import ChipFiltro from "../molecules/ChipFiltro.jsx";
import SegmentedControl from "../molecules/SegmentedControl.jsx";
import { segnalaAttr } from "../segnalazioni/segnalaAttr.js";

export const GRANULARITA_REPORT = [
  { value: "settimana", label: "Settimana" },
  { value: "mese", label: "Mese" },
];

const VUOTO = { dal: null, al: null, granularita: "mese" };

/**
 * Filter bar of a report: date range (ISO days), week/month granularity, reset
 * and the chips of the active filters. Controlled: `value` = { dal, al,
 * granularita }, `onChange` gets the whole next value. `filtri` adds chips for
 * the page's own filters ({ id, label, onRemove }); `children` is the slot for
 * their controls.
 */
export default function BarraFiltriPeriodo({
  value = VUOTO,
  onChange,
  predefinito = VUOTO,
  onReset,
  granularita = GRANULARITA_REPORT,
  filtri = [],
  min,
  max,
  children,
  segnala,
  className,
}) {
  const uid = useId();
  const v = { ...VUOTO, ...value };
  const imposta = (patch) => onChange?.({ ...v, ...patch });
  const invertito = v.dal && v.al && v.dal > v.al;

  const chips = [
    v.dal && {
      id: "dal",
      label: `Dal ${formatDataIt(v.dal)}`,
      onRemove: () => imposta({ dal: null }),
    },
    v.al && {
      id: "al",
      label: `Al ${formatDataIt(v.al)}`,
      onRemove: () => imposta({ al: null }),
    },
    ...filtri,
  ].filter(Boolean);
  const modificato =
    chips.length > 0 ||
    v.dal !== (predefinito.dal ?? null) ||
    v.al !== (predefinito.al ?? null) ||
    v.granularita !== (predefinito.granularita ?? VUOTO.granularita);

  const azzera = () =>
    onReset ? onReset() : onChange?.({ ...VUOTO, ...predefinito });

  return (
    <div className={cn("space-y-3", className)} {...segnalaAttr(segnala)}>
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <label
            htmlFor={`${uid}-dal`}
            className="block text-xs font-medium text-muted-foreground"
          >
            Dal
          </label>
          <CampoData
            id={`${uid}-dal`}
            value={v.dal}
            onChange={(dal) => imposta({ dal })}
            min={min}
            max={v.al || max}
            invalid={invertito}
          />
        </div>
        <div className="space-y-1">
          <label
            htmlFor={`${uid}-al`}
            className="block text-xs font-medium text-muted-foreground"
          >
            Al
          </label>
          <CampoData
            id={`${uid}-al`}
            value={v.al}
            onChange={(al) => imposta({ al })}
            min={v.dal || min}
            max={max}
            invalid={invertito}
          />
        </div>
        <div className="space-y-1">
          <span
            className="block text-xs font-medium text-muted-foreground"
            aria-hidden
          >
            Raggruppa per
          </span>
          <SegmentedControl
            aria-label="Raggruppa per"
            value={v.granularita}
            onChange={(g) => imposta({ granularita: g })}
            options={granularita}
            size="md"
          />
        </div>
        {children}
        <Button
          variant="ghost"
          size="md"
          icon={RotateCcw}
          onClick={azzera}
          disabled={!modificato}
          className="ml-auto"
        >
          Azzera filtri
        </Button>
      </div>
      {invertito && (
        <p role="alert" className="text-xs text-destructive">
          La data iniziale è dopo quella finale.
        </p>
      )}
      {chips.length > 0 && (
        <div
          className="flex flex-wrap items-center gap-2"
          aria-label="Filtri attivi"
          role="group"
        >
          {chips.map((c) => (
            <ChipFiltro key={c.id} onRemove={c.onRemove}>
              {c.label}
            </ChipFiltro>
          ))}
        </div>
      )}
    </div>
  );
}
