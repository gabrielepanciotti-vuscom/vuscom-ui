import { forwardRef, useEffect, useId, useRef, useState } from "react";
import { CalendarDays } from "lucide-react";
import { cn } from "../lib/cn.js";
import { formatDataIt, parseDataIt } from "../lib/dataIt.js";
import { campoClasses } from "../atoms/Input.jsx";
import IconButton from "../atoms/IconButton.jsx";
import CalendarioMese from "./CalendarioMese.jsx";

/**
 * Date field: typed as "gg/mm/aaaa" or picked from the calendar, never a native
 * date input. `value` and `onChange` speak ISO days ("YYYY-MM-DD", null = empty).
 * Unparseable text stays in the field marked invalid and is not sent.
 */
const CampoData = forwardRef(function CampoData(
  {
    value,
    onChange,
    min,
    max,
    placeholder = "gg/mm/aaaa",
    invalid,
    disabled,
    "aria-label": ariaLabel,
    id,
    className,
  },
  ref,
) {
  const [testo, setTesto] = useState(formatDataIt(value));
  const [errato, setErrato] = useState(false);
  const [aperto, setAperto] = useState(false);
  const radice = useRef(null);
  const pannello = useId();

  // An outside change (reset, chip removed) rewrites the text.
  useEffect(() => {
    setTesto(formatDataIt(value));
    setErrato(false);
  }, [value]);

  useEffect(() => {
    if (!aperto) return undefined;
    const fuori = (e) => {
      if (!radice.current?.contains(e.target)) setAperto(false);
    };
    document.addEventListener("mousedown", fuori);
    return () => document.removeEventListener("mousedown", fuori);
  }, [aperto]);

  const conferma = () => {
    const iso = parseDataIt(testo);
    const fuoriLimiti = iso && ((min && iso < min) || (max && iso > max));
    if (iso === undefined || fuoriLimiti) {
      setErrato(true);
      return;
    }
    setErrato(false);
    if (iso !== (value ?? null)) onChange?.(iso);
  };

  const scegli = (iso) => {
    setAperto(false);
    setErrato(false);
    setTesto(formatDataIt(iso));
    onChange?.(iso);
    radice.current?.querySelector("input")?.focus();
  };

  return (
    <div
      ref={radice}
      className={cn("relative w-40", className)}
      onKeyDown={(e) => {
        if (e.key === "Escape" && aperto) {
          e.stopPropagation();
          setAperto(false);
          radice.current?.querySelector("input")?.focus();
        }
      }}
    >
      <input
        ref={ref}
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={testo}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-invalid={invalid || errato ? "true" : undefined}
        onChange={(e) => setTesto(e.target.value)}
        onBlur={conferma}
        onKeyDown={(e) => {
          if (e.key === "Enter") conferma();
          if (e.key === "ArrowDown" && e.altKey) setAperto(true);
        }}
        className={cn(campoClasses(invalid || errato), "h-9 pl-3 pr-9 tabular-nums")}
      />
      <IconButton
        icon={CalendarDays}
        label="Apri calendario"
        size="sm"
        disabled={disabled}
        aria-expanded={aperto}
        aria-controls={aperto ? pannello : undefined}
        onClick={() => setAperto((a) => !a)}
        className="absolute right-0.5 top-1/2 h-8 w-8 -translate-y-1/2"
      />
      {aperto && (
        <div
          id={pannello}
          role="dialog"
          aria-label="Scegli una data"
          className="absolute left-0 top-full z-50 mt-1 animate-fade-in rounded-lg border bg-popover text-popover-foreground shadow-lg"
        >
          <CalendarioMese value={value} onChange={scegli} min={min} max={max} autoFocus />
        </div>
      )}
    </div>
  );
});

export default CampoData;
