import { forwardRef } from "react";
import { cn } from "../lib/cn.js";
import { buttonClasses } from "./Button.jsx";

const QUADRATI = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-12 w-12" };

const IconButton = forwardRef(function IconButton(
  {
    icon: Icon,
    label,
    variant = "ghost",
    size = "md",
    className,
    type = "button",
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
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
