import { cn } from "../lib/cn.js";

export function Skeleton({ className, ...props }) {
  return (
    <div
      aria-hidden
      {...props}
      className={cn("animate-pulse rounded-md bg-muted", className)}
    />
  );
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="space-y-2" role="status" aria-label="Caricamento">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 && lines > 1 ? "w-2/3" : "w-full",
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <SkeletonText lines={2} />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-3" role="status" aria-label="Caricamento">
      <div className="flex gap-4">
        {Array.from({ length: cols }, (_, c) => (
          <Skeleton key={c} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="flex gap-4">
          {Array.from({ length: cols }, (_, c) => (
            <Skeleton key={c} className="h-6 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
