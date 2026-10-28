import { forwardRef, useEffect } from "react";
import { cn } from "../lib/cn.js";
import { buttonClasses } from "./Button.jsx";

const QUADRATI = {
  sm: "h-8 w-8 max-sm:min-h-11 max-sm:min-w-11",
  md: "h-10 w-10 max-sm:min-h-11 max-sm:min-w-11",
  lg: "h-12 w-12",
};

let haAvvisatoSenzaEtichetta = false;

const ambienteNode =
  typeof process !== "undefined" ? process.env : undefined;

const IconButton = forwardRef(function IconButton(
  {
    icon: Icon,
    label,
    "aria-label": ariaLabel,
    variant = "ghost",
    size = "md",
    className,
    type = "button",
    ...props
  },
  ref,
) {
  useEffect(() => {
    if (
      !label &&
      !ariaLabel &&
      !haAvvisatoSenzaEtichetta &&
      ambienteNode &&
      ambienteNode.NODE_ENV !== "production"
    ) {
      console.warn("IconButton richiede label o aria-label per essere accessibile.");
      haAvvisatoSenzaEtichetta = true;
    }
  }, [ariaLabel, label]);

  return (
    <button
      ref={ref}
      type={type}
      aria-label={ariaLabel || label}
      {...props}
      className={cn(
        buttonClasses(variant, size),
        "px-0 gap-0",
        QUADRATI[size],
        className,
      )}
    >
      {Icon && <Icon className="h-4 w-4" aria-hidden />}
    </button>
  );
});

export default IconButton;
