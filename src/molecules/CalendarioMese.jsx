import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/cn.js";
import { isoGiorno } from "../lib/dataIt.js";
import IconButton from "../atoms/IconButton.jsx";

const GIORNO = 86400000;
const SETTIMANA = ["lu", "ma", "me", "gi", "ve", "sa", "do"];
const TITOLO = new Intl.DateTimeFormat("it-IT", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const LUNGO = new Intl.DateTimeFormat("it-IT", {
  dateStyle: "full",
  timeZone: "UTC",
});

const daIso = (iso) => (iso ? new Date(`${iso}T00:00:00Z`) : null);
const primoDelMese = (d) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
const spostaMese = (d, n) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1));

/** 42 days (6 weeks, Monday first) covering the month of `mese`. */
function griglia(mese) {
  const inizio = mese.getTime() - ((mese.getUTCDay() + 6) % 7) * GIORNO;
  return Array.from({ length: 42 }, (_, i) => new Date(inizio + i * GIORNO));
}

/**
 * Month calendar, Monday first, ISO days in and out ("YYYY-MM-DD").
 * Arrows move by day/week, PageUp/PageDown by month, Enter picks.
 */
export default function CalendarioMese({
  value,
  onChange,
  min,
  max,
  oggi = isoGiorno(new Date()),
  autoFocus = false,
  className,
}) {
  const [fuoco, setFuoco] = useState(value || oggi);
  const [mese, setMese] = useState(() => primoDelMese(daIso(value || oggi)));
  const griglia$ = useRef(null);
  const daFocalizzare = useRef(autoFocus);

  useEffect(() => {
    if (!daFocalizzare.current) return;
    daFocalizzare.current = false;
    griglia$.current?.querySelector(`[data-giorno="${fuoco}"]`)?.focus();
  });

  const fuori = (iso) => (min && iso < min) || (max && iso > max);
  const vai = (iso) => {
    setFuoco(iso);
    setMese(primoDelMese(daIso(iso)));
    daFocalizzare.current = true;
  };
  const sposta = (giorni) => vai(isoGiorno(new Date(daIso(fuoco).getTime() + giorni * GIORNO)));
  const tasto = (e) => {
    const passi = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (passi[e.key]) {
      e.preventDefault();
      sposta(passi[e.key]);
    } else if (e.key === "PageUp" || e.key === "PageDown") {
      e.preventDefault();
      const d = daIso(fuoco);
      const n = e.key === "PageUp" ? -1 : 1;
      const dest = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1));
      const ultimo = new Date(Date.UTC(dest.getUTCFullYear(), dest.getUTCMonth() + 1, 0)).getUTCDate();
      dest.setUTCDate(Math.min(d.getUTCDate(), ultimo));
      vai(isoGiorno(dest));
    }
  };

  const giorni = griglia(mese);
  // The roving tab stop stays on the focused day, or on the 1st when the month changed.
  const tabbabile = giorni.some((d) => isoGiorno(d) === fuoco) ? fuoco : isoGiorno(mese);
  return (
    <div className={cn("w-72 select-none p-3", className)}>
      <div className="mb-2 flex items-center justify-between">
        <IconButton icon={ChevronLeft} label="Mese precedente" size="sm" onClick={() => setMese(spostaMese(mese, -1))} />
        <span className="text-sm font-semibold capitalize" aria-live="polite">
          {TITOLO.format(mese)}
        </span>
        <IconButton icon={ChevronRight} label="Mese successivo" size="sm" onClick={() => setMese(spostaMese(mese, 1))} />
      </div>
      <div role="grid" aria-label={TITOLO.format(mese)} ref={griglia$} onKeyDown={tasto}>
        <div role="row" className="grid grid-cols-7 text-center text-xs text-muted-foreground">
          {SETTIMANA.map((g) => (
            <span key={g} role="columnheader" className="py-1">
              {g}
            </span>
          ))}
        </div>
        {[0, 1, 2, 3, 4, 5].map((s) => (
          <div role="row" key={s} className="grid grid-cols-7">
            {giorni.slice(s * 7, s * 7 + 7).map((d) => {
              const iso = isoGiorno(d);
              const scelto = iso === value;
              const altroMese = d.getUTCMonth() !== mese.getUTCMonth();
              const disattivo = fuori(iso);
              return (
                <button
                  key={iso}
                  type="button"
                  role="gridcell"
                  data-giorno={iso}
                  aria-selected={scelto}
                  aria-label={LUNGO.format(d)}
                  aria-current={iso === oggi ? "date" : undefined}
                  disabled={disattivo}
                  tabIndex={iso === tabbabile ? 0 : -1}
                  onClick={() => onChange?.(iso)}
                  onFocus={() => setFuoco(iso)}
                  className={cn(
                    "m-0.5 h-8 rounded-md text-sm tabular-nums transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    "disabled:pointer-events-none disabled:opacity-30",
                    scelto
                      ? "bg-primary font-semibold text-primary-foreground shadow-sm"
                      : "hover:bg-accent hover:text-accent-foreground",
                    !scelto && altroMese && "text-muted-foreground/60",
                    !scelto && iso === oggi && "font-semibold text-primary",
                  )}
                >
                  {d.getUTCDate()}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
