import { useCallback, useLayoutEffect, useState } from "react";

const GAP = 4;
const MAX_HEIGHT = 256; // matches max-h-64
const MARGIN = 8;

/**
 * Fixed-position style for a dropdown rendered in a portal, anchored to
 * `triggerRef`. Opens downward, flips upward when there is not enough room
 * below and more room above, and follows scroll (any ancestor) and resize.
 */
export default function useFloatingList(triggerRef, open) {
  const [style, setStyle] = useState(null);

  const misura = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const sotto = vh - r.bottom - GAP - MARGIN;
    const sopra = r.top - GAP - MARGIN;
    const suSu = sotto < MAX_HEIGHT && sopra > sotto;
    const spazio = Math.max(suSu ? sopra : sotto, 0);
    setStyle({
      position: "fixed",
      left: r.left,
      width: r.width,
      maxHeight: Math.min(MAX_HEIGHT, spazio) || MAX_HEIGHT,
      ...(suSu ? { bottom: vh - r.top + GAP } : { top: r.bottom + GAP }),
    });
  }, [triggerRef]);

  useLayoutEffect(() => {
    if (!open) return undefined;
    misura();
    // Capture: a scroll inside any ancestor (table, dialog body) moves the trigger.
    window.addEventListener("scroll", misura, true);
    window.addEventListener("resize", misura);
    return () => {
      window.removeEventListener("scroll", misura, true);
      window.removeEventListener("resize", misura);
    };
  }, [open, misura]);

  return style;
}
