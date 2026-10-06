import { HelpCircle } from "lucide-react";
import Tooltip from "./Tooltip.jsx";

const LONG = 40;

export default function InfoTip({
  children,
  label = "Maggiori informazioni",
  side = "top",
  wide,
}) {
  // Long strings wrap on their own; JSX content opts in with `wide`.
  const long = wide ?? (typeof children === "string" && children.length > LONG);
  return (
    <Tooltip content={children} side={side} wide={long}>
      <button
        type="button"
        aria-label={label}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <HelpCircle className="h-4 w-4" aria-hidden />
      </button>
    </Tooltip>
  );
}
