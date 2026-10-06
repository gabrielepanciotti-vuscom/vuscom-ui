import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn } from "../lib/cn.js";
import IconButton from "../atoms/IconButton.jsx";
import { TESTO } from "../atoms/tones.js";

const ToastContext = createContext(null);

const TONI = {
  success: {
    Icona: CheckCircle2,
    accent: "border-l-success",
    icon: TESTO.success,
  },
  danger: {
    Icona: XCircle,
    accent: "border-l-destructive",
    icon: TESTO.danger,
  },
  warning: {
    Icona: AlertTriangle,
    accent: "border-l-warning",
    icon: TESTO.warning,
  },
  info: { Icona: Info, accent: "border-l-info", icon: TESTO.info },
};

function ToastItem({ t, onDismiss }) {
  const s = TONI[t.tone] ?? TONI.info;
  return (
    <div
      className={cn(
        "pointer-events-auto flex w-[360px] max-w-[calc(100vw-2rem)] items-start gap-3 rounded-lg border border-l-4 border-border bg-card p-3 text-card-foreground shadow-lg animate-slide-in",
        s.accent,
      )}
    >
      <s.Icona className={cn("mt-0.5 h-5 w-5 shrink-0", s.icon)} aria-hidden />
      <div className="min-w-0 flex-1 text-sm">
        <p className="font-semibold">{t.title}</p>
        {t.description && (
          <p className="mt-0.5 text-muted-foreground">{t.description}</p>
        )}
      </div>
      <IconButton
        icon={X}
        label="Chiudi notifica"
        size="sm"
        onClick={() => onDismiss(t.id)}
        className="-my-1 -mr-1 shrink-0"
      />
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());
  const seq = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((l) => l.filter((t) => t.id !== id));
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
  }, []);

  const toast = useCallback(
    ({ title, description, tone = "success", duration = 4000 }) => {
      const id = ++seq.current;
      setToasts((l) => [...l, { id, title, description, tone }]);
      if (duration > 0) {
        timers.current.set(
          id,
          setTimeout(() => dismiss(id), duration),
        );
      }
      return id;
    },
    [dismiss],
  );

  // Pending timers must not fire (and set state) after the provider is gone.
  useEffect(() => {
    const attivi = timers.current;
    return () => {
      attivi.forEach(clearTimeout);
      attivi.clear();
    };
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Live regions exist before any toast, or screen readers miss the first one. */}
      <div className="pointer-events-none fixed right-4 top-4 z-[60] flex flex-col gap-2">
        <div aria-live="assertive" className="flex flex-col gap-2">
          {toasts
            .filter((t) => t.tone === "danger")
            .map((t) => (
              <ToastItem key={t.id} t={t} onDismiss={dismiss} />
            ))}
        </div>
        <div aria-live="polite" className="flex flex-col gap-2">
          {toasts
            .filter((t) => t.tone !== "danger")
            .map((t) => (
              <ToastItem key={t.id} t={t} onDismiss={dismiss} />
            ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
