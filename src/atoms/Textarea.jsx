import { forwardRef } from "react";
import { cn } from "../lib/cn.js";
import { campoClasses } from "./Input.jsx";

const Textarea = forwardRef(function Textarea(
  { invalid, className, rows = 3, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={invalid ? "true" : undefined}
      {...props}
      className={cn(
        campoClasses(invalid),
        "min-h-[80px] resize-y px-3 py-2",
        className,
      )}
    />
  );
});

export default Textarea;
