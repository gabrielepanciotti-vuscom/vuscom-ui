import { cn } from "../lib/cn.js";
import { TINTE, PIENI } from "./tones.js";

export default function Badge({
  tone = "neutral",
  dot = false,
  className,
  children,
  ...props
}) {
  return (
    <span
      {...props}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        TINTE[tone],
        className,
      )}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", PIENI[tone])}
          aria-hidden
        />
      )}
      {children}
    </span>
  );
}
