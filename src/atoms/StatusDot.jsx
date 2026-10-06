import { cn } from "../lib/cn.js";
import { PIENI } from "./tones.js";

export default function StatusDot({
  tone = "neutral",
  label,
  pulse = false,
  className,
}) {
  const a11y = label
    ? { role: "img", "aria-label": label }
    : { "aria-hidden": true };
  return (
    <span
      {...a11y}
      className={cn("relative inline-flex h-2.5 w-2.5", className)}
    >
      {pulse && (
        <span
          className={cn(
            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
            PIENI[tone],
          )}
        />
      )}
      <span
        className={cn(
          "relative inline-flex h-2.5 w-2.5 rounded-full",
          PIENI[tone],
        )}
      />
    </span>
  );
}
