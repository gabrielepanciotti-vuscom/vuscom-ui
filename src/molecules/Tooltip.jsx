import {
  Children,
  cloneElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn.js";

const DELAY_MS = 150;
const SIDE = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
  right: "left-full top-1/2 ml-2 -translate-y-1/2",
};

export default function Tooltip({
  content,
  side = "top",
  wide = false,
  children,
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const timer = useRef(null);
  const child = Children.only(children);

  const show = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), DELAY_MS);
  }, []);
  const hide = useCallback(() => {
    clearTimeout(timer.current);
    setOpen(false);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);

  const chain = (name, fn) => (e) => {
    child.props[name]?.(e);
    fn(e);
  };

  const proprio = child.props["aria-describedby"];
  const trigger = cloneElement(child, {
    "aria-describedby": open
      ? [proprio, id].filter(Boolean).join(" ")
      : proprio,
    onMouseEnter: chain("onMouseEnter", show),
    onMouseLeave: chain("onMouseLeave", hide),
    onFocus: chain("onFocus", show),
    onBlur: chain("onBlur", hide),
    onKeyDown: chain("onKeyDown", (e) => {
      if (e.key !== "Escape" || !open) return;
      // Consumed here: an enclosing Dialog must not close on the same Esc.
      e.preventDefault();
      hide();
    }),
  });

  return (
    <span className="relative inline-flex">
      {trigger}
      {open && content != null && (
        <span
          id={id}
          role="tooltip"
          className={cn(
            "pointer-events-none absolute z-50 rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-md",
            wide
              ? "w-max max-w-xs whitespace-normal text-left"
              : "whitespace-nowrap",
            SIDE[side] || SIDE.top,
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
