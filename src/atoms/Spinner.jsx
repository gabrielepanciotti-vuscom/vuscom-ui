import { Loader2 } from "lucide-react";
import { cn } from "../lib/cn.js";

const TAGLIE = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" };

export default function Spinner({
  size = "sm",
  label = "Caricamento",
  className,
}) {
  return (
    <span
      role="status"
      className={cn("inline-flex items-center text-primary", className)}
    >
      <Loader2 className={cn("animate-spin", TAGLIE[size])} aria-hidden />
      <span className="sr-only">{label}</span>
    </span>
  );
}
