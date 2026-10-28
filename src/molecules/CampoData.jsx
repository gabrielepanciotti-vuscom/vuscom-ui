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
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    id,
    className,
    onBlur: onBlurProp,
    onKeyDown: onKeyDownProp,
    ...rest
  },
  ref,
) {
  const [testo, setTesto] = useState(formatDataIt(value));
  // null | "formato" (unparseable text) | "limiti" (outside min/max)
  const [errore, setErrore] = useState(null);
  const [aperto, setAperto] = useState(false);
  const radice = useRef(null);
  const pannello = useId();
  const erroreId = useId();
  const errato = errore !== null;
  const nonValido = invalid || errato || ariaInvalid === true || ariaInvalid === "true";
  const descritto =
    [ariaDescribedBy, errore === "formato" ? erroreId : null].filter(Boolean).join(" ") ||
    undefined;

  // An outside change (reset, chip removed) rewrites the text.
  useEffect(() => {
    setTesto(formatDataIt(value));
    setErrore(null);
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
      setErrore(iso === undefined ? "formato" : "limiti");
      return;
    }
    setErrore(null);
    if (iso !== (value ?? null)) onChange?.(iso);
  };

  const scegli = (iso) => {
    setAperto(false);
    setErrore(null);
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
        {...rest}
        ref={ref}
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={testo}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-describedby={descritto}
        aria-invalid={nonValido ? "true" : ariaInvalid}
        onChange={(e) => setTesto(e.target.value)}
        onBlur={(e) => {
          onBlurProp?.(e);
          conferma();
        }}
        onKeyDown={(e) => {
          onKeyDownProp?.(e);
          if (e.key === "Enter") conferma();
          if (e.key === "ArrowDown" && e.altKey) setAperto(true);
        }}
        className={cn(
          campoClasses(nonValido),
          "h-9 max-sm:min-h-11 pl-3 pr-9 tabular-nums",
        )}
      />
      {errore === "formato" && (
        <span id={erroreId} className="sr-only">
          Data non valida, usa il formato gg/mm/aaaa
        </span>
      )}
      <IconButton
        icon={CalendarDays}
        label="Apri calendario"
        size="sm"
        disabled={disabled}
        aria-expanded={aperto}
        aria-controls={aperto ? pannello : undefined}
        onClick={() => setAperto((a) => !a)}
        className="absolute right-0.5 top-1/2 h-8 w-8 max-sm:min-h-11 max-sm:min-w-11 -translate-y-1/2"
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
