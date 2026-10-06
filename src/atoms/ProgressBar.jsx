import { cn } from "../lib/cn.js";
import { PIENI } from "./tones.js";

export default function ProgressBar({
  value,
  max = 100,
  tone = "primary",
  label,
  showValue = false,
  className,
  "aria-label": ariaLabel,
}) {
  const tetto = max > 0 ? max : 0;
  const now = tetto > 0 ? Math.min(Math.max(Number(value) || 0, 0), tetto) : 0;
  const pct = tetto > 0 ? (now / tetto) * 100 : 0;
  // A tiny non-zero value must still be visible, and must not read as 0%.
  const larghezza = pct > 0 && pct < 2 ? 2 : pct;
  const testo = pct > 0 && pct < 1 ? "<1%" : `${Math.round(pct)}%`;
  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-medium text-foreground">{label}</span>
          {showValue && (
            <span className="tabular-nums text-muted-foreground">{testo}</span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-label={ariaLabel ?? label}
        aria-valuenow={now}
        aria-valuemin={0}
        aria-valuemax={tetto}
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            PIENI[tone],
          )}
          style={{ width: `${larghezza}%` }}
        />
      </div>
    </div>
  );
}
