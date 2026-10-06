import { cn } from "../lib/cn.js";

export default function Kbd({ children, className }) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-[20px] items-center justify-center rounded border border-border bg-muted px-1.5",
        "font-sans text-[11px] font-medium text-muted-foreground",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
