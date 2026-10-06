import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../lib/cn.js";
import { campoClasses } from "../atoms/Input.jsx";
import useFloatingList from "./useFloatingList.js";

const CLEAR = "__clear__";

export default function Select({
  value,
  onChange,
  options = [],
  placeholder = "Seleziona…",
  allowClear = false,
  disabled = false,
  invalid,
  "aria-label": ariaLabel,
  className,
  onKeyDown: onKeyDownProp,
  onKeyUp: onKeyUpProp,
  onClick: onClickProp,
  ...rest
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const listRef = useRef(null);
  const uid = useId();
  // The list lives in a portal so overflow containers (tables, dialogs) cannot clip it.
  const listStyle = useFloatingList(triggerRef, open);

  // Flat list of selectable entries (clear row first) drives keyboard nav.
  const entries = [
    ...(allowClear ? [{ value: CLEAR, label: "Nessuno", clear: true }] : []),
    ...options,
  ];
  const selected = options.find((o) => o.value === value);
  const optId = (i) => `${uid}-opt-${i}`;

  useEffect(() => {
    if (!open) return undefined;
    const fuori = (e) => {
      const dentro =
        rootRef.current?.contains(e.target) ||
        listRef.current?.contains(e.target);
      if (!dentro) setOpen(false);
    };
    document.addEventListener("mousedown", fuori);
    return () => document.removeEventListener("mousedown", fuori);
  }, [open]);

  const apri = () => {
    if (disabled) return;
    const i = entries.findIndex(
      (o) => !o.clear && o.value === value && !o.disabled,
    );
    setActive(i >= 0 ? i : entries.findIndex((o) => !o.disabled));
    setOpen(true);
  };

  const scegli = (o) => {
    if (!o || o.disabled) return;
    onChange?.(o.clear ? null : o.value);
    setOpen(false);
  };

  const muovi = (dir) => {
    let i = active;
    for (let n = 0; n < entries.length; n += 1) {
      i = (i + dir + entries.length) % entries.length;
      if (!entries[i].disabled) {
        setActive(i);
        return;
      }
    }
  };

  const onKeyDown = (e) => {
    onKeyDownProp?.(e);
    if (disabled || e.defaultPrevented) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) apri();
      else muovi(e.key === "ArrowDown" ? 1 : -1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!open) apri();
      else scegli(entries[active]);
    } else if (e.key === "Escape" && open) {
      // preventDefault tells an enclosing Dialog this Esc is already handled.
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        {...rest}
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${uid}-list` : undefined}
        aria-activedescendant={open && active >= 0 ? optId(active) : undefined}
        aria-invalid={invalid ? "true" : undefined}
        onClick={(e) => {
          onClickProp?.(e);
          if (!e.defaultPrevented) open ? setOpen(false) : apri();
        }}
        onKeyDown={onKeyDown}
        onKeyUp={(e) => {
          onKeyUpProp?.(e);
          // Space would otherwise fire a click on keyup in some browsers.
          if (e.key === " ") e.preventDefault();
        }}
        className={cn(
          campoClasses(invalid),
          "flex h-10 items-center justify-between gap-2 px-3 text-left",
        )}
      >
        <span className={cn("truncate", !selected && "text-muted-foreground")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      {open &&
        createPortal(
          <ul
            ref={listRef}
            id={`${uid}-list`}
            role="listbox"
            aria-label={ariaLabel}
            style={listStyle ?? { position: "fixed" }}
            // Keep focus on the trigger: keyboard handling and Dialog focus trap live there.
            onMouseDown={(e) => e.preventDefault()}
            className="z-[70] max-h-64 overflow-y-auto rounded-lg border border-border bg-card py-1 shadow-lg"
          >
            {entries.map((o, i) => {
              const sel = !o.clear && o.value === value;
              return (
                <li
                  key={o.value}
                  id={optId(i)}
                  role="option"
                  aria-selected={sel}
                  aria-disabled={o.disabled || undefined}
                  onMouseEnter={() => !o.disabled && setActive(i)}
                  onClick={() => scegli(o)}
                  className={cn(
                    "flex cursor-pointer items-start gap-2 px-3 py-2 text-sm transition-colors",
                    o.disabled && "cursor-not-allowed opacity-50",
                    i === active && "bg-muted",
                    sel ? "text-primary" : "text-foreground",
                    o.clear && "italic text-muted-foreground",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{o.label}</div>
                    {o.description && (
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {o.description}
                      </div>
                    )}
                  </div>
                  {sel && (
                    <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  )}
                </li>
              );
            })}
          </ul>,
          document.body,
        )}
    </div>
  );
}
