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

function ToastItem({ t, onDismiss, onPause, onResume }) {
  const s = TONI[t.tone] ?? TONI.info;
  return (
    <div
      className={cn(
        "pointer-events-auto flex w-[360px] max-w-[calc(100vw-2rem)] items-start gap-3 rounded-lg border border-l-4 border-border bg-card p-3 text-card-foreground shadow-lg animate-slide-in",
        s.accent,
      )}
      onMouseEnter={() => onPause(t.id)}
      onMouseLeave={() => onResume(t.id)}
      onFocus={() => onPause(t.id)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) onResume(t.id);
      }}
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
    clearTimeout(timers.current.get(id)?.timer);
    timers.current.delete(id);
  }, []);

  const avviaTimer = useCallback(
    (id) => {
      const timer = timers.current.get(id);
      if (!timer || timer.timer || timer.remaining <= 0) return;
      timer.startedAt = Date.now();
      timer.timer = setTimeout(() => dismiss(id), timer.remaining);
    },
    [dismiss],
  );

  const pausaTimer = useCallback((id) => {
    const timer = timers.current.get(id);
    if (!timer?.timer) return;
    clearTimeout(timer.timer);
    timer.remaining = Math.max(0, timer.remaining - (Date.now() - timer.startedAt));
    timer.timer = null;
  }, []);

  const toast = useCallback(
    ({ title, description, tone = "success", duration }) => {
      const id = ++seq.current;
      setToasts((l) => [...l, { id, title, description, tone }]);
      const durata = duration === undefined ? (tone === "danger" ? 0 : 4000) : duration;
      if (durata > 0) {
        timers.current.set(id, { remaining: durata, timer: null, startedAt: 0 });
        avviaTimer(id);
      }
      return id;
    },
    [avviaTimer],
  );

  // Pending timers must not fire (and set state) after the provider is gone.
  useEffect(() => {
    const attivi = timers.current;
    return () => {
      attivi.forEach((timer) => clearTimeout(timer.timer));
      attivi.clear();
    };
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);
  const urgenti = toasts.filter((t) => t.tone === "danger");
  const altri = toasts.filter((t) => t.tone !== "danger");

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Live regions exist before any toast, or screen readers miss the first one. */}
      <div className="pointer-events-none fixed right-4 top-4 z-[60] flex flex-col">
        <div aria-live="assertive" className="flex flex-col gap-2">
          {urgenti.map((t) => (
            <ToastItem
              key={t.id}
              t={t}
              onDismiss={dismiss}
              onPause={pausaTimer}
              onResume={avviaTimer}
            />
          ))}
        </div>
        {/* No container gap: two empty live regions would push the stack down. */}
        <div
          aria-live="polite"
          className={cn(
            "flex flex-col gap-2",
            urgenti.length > 0 && altri.length > 0 && "mt-2",
          )}
        >
          {altri.map((t) => (
            <ToastItem
              key={t.id}
              t={t}
              onDismiss={dismiss}
              onPause={pausaTimer}
              onResume={avviaTimer}
            />
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
