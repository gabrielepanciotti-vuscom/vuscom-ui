import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../lib/cn.js";
import IconButton from "../atoms/IconButton.jsx";

const SIZES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const focusables = (root) =>
  Array.from(root.querySelectorAll(FOCUSABLE)).filter(
    (el) =>
      !el.hasAttribute("hidden") && el.getAttribute("aria-hidden") !== "true",
  );

export default function Dialog({
  open,
  onClose,
  title,
  description,
  icon: Icon,
  size = "sm",
  footer,
  children,
  closeOnBackdrop = true,
  className,
}) {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef(null);
  // Always call the latest onClose without re-running the focus effect.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    const opener = document.activeElement;
    const panel = panelRef.current;
    const iniziale =
      panel.querySelector("[data-autofocus]") || focusables(panel)[0] || panel;
    iniziale.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current?.();
        return;
      }
      if (e.key !== "Tab") return;
      const lista = focusables(panel);
      if (lista.length === 0) {
        e.preventDefault();
        panel.focus();
        return;
      }
      const primo = lista[0];
      const ultimo = lista[lista.length - 1];
      const attivo = document.activeElement;
      if (!panel.contains(attivo)) {
        e.preventDefault();
        primo.focus();
      } else if (e.shiftKey && attivo === primo) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && attivo === ultimo) {
        e.preventDefault();
        primo.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (opener && typeof opener.focus === "function") opener.focus();
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        data-testid="dialog-backdrop"
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOnBackdrop ? () => onClose?.() : undefined}
      />
      <div className="flex min-h-full items-start justify-center p-3 sm:items-center sm:p-6">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descId : undefined}
          tabIndex={-1}
          className={cn(
            "relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-xl bg-card text-card-foreground shadow-2xl ring-1 ring-black/5 animate-fade-in focus:outline-none dark:ring-white/10",
            SIZES[size] ?? SIZES.sm,
            className,
          )}
        >
          <div className="flex items-start gap-3 border-b border-border px-6 py-4">
            {Icon && (
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15">
                <Icon className="h-5 w-5 text-primary" aria-hidden />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h2
                id={titleId}
                className="text-base font-semibold leading-tight text-foreground sm:text-lg"
              >
                {title}
              </h2>
              {description && (
                <p id={descId} className="mt-0.5 text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            <IconButton
              icon={X}
              label="Chiudi"
              size="sm"
              onClick={() => onClose?.()}
              className="-mr-1 -mt-1 shrink-0"
            />
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
          {footer && (
            <div className="flex items-center justify-end gap-2 border-t border-border bg-muted/40 px-6 py-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
