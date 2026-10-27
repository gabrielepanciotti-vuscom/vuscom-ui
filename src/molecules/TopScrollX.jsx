import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/cn.js";

/**
 * Contenitore a scorrimento orizzontale con una seconda barra in alto,
 * sincronizzata con quella in fondo: su una tabella lunga la barra in fondo
 * sta sotto l'ultima riga e non si vede senza scendere fino in basso.
 * La barra in alto compare solo quando il contenuto deborda davvero.
 */
export default function TopScrollX({ children, className }) {
  const topRef = useRef(null);
  const bodyRef = useRef(null);
  const syncing = useRef(false);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [overflow, setOverflow] = useState(false);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return undefined;
    const measure = () => {
      setScrollWidth(body.scrollWidth);
      setOverflow(body.scrollWidth > body.clientWidth + 1);
    };
    measure();
    // jsdom (test) has no ResizeObserver: the initial measure is enough
    if (typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(body);
    if (body.firstElementChild) ro.observe(body.firstElementChild);
    return () => ro.disconnect();
  }, [children]);

  // Keep the two bars in step without bouncing between scroll events
  const follow = (from, to) => {
    if (syncing.current) {
      syncing.current = false;
      return;
    }
    if (
      to.current &&
      from.current &&
      to.current.scrollLeft !== from.current.scrollLeft
    ) {
      syncing.current = true;
      to.current.scrollLeft = from.current.scrollLeft;
    }
  };

  return (
    <>
      {overflow && (
        <div
          ref={topRef}
          data-testid="top-scroll-x"
          onScroll={() => follow(topRef, bodyRef)}
          className="overflow-x-auto overflow-y-hidden border-b"
          aria-hidden="true"
        >
          <div style={{ width: scrollWidth, height: 1 }} />
        </div>
      )}
      <div
        ref={bodyRef}
        onScroll={() => follow(bodyRef, topRef)}
        className={cn("overflow-x-auto", className)}
      >
        {children}
      </div>
    </>
  );
}
