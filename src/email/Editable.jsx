import { useLayoutEffect, useRef } from "react";
import { cn } from "../lib/cn.js";
import { useEditorContext } from "./context.js";
import {
  fromEditable,
  fromEditablePlain,
  insertPlainText,
  toEditable,
  toEditablePlain,
} from "./richText.js";

// contenteditable text where `{{name}}` shows as a chip. `rich` keeps b/i/a/br/tone, otherwise plain.
// The DOM is only rewritten when the value changed from outside: typing never resets the caret.
export default function Editable({
  as: Tag = "div",
  value,
  onChange,
  rich = false,
  readOnly = false,
  className,
  ...rest
}) {
  const { labels } = useEditorContext();
  const ref = useRef(null);
  const read = () => (rich ? fromEditable(ref.current) : fromEditablePlain(ref.current));

  useLayoutEffect(() => {
    const el = ref.current;
    if (read() === (value ?? "")) return;
    el.innerHTML = rich ? toEditable(value, labels) : toEditablePlain(value, labels);
  }, [value, labels, rich]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Tag
      {...rest}
      ref={ref}
      data-editable=""
      role="textbox"
      aria-multiline={rich || undefined}
      aria-readonly={readOnly || undefined}
      contentEditable={!readOnly}
      suppressContentEditableWarning
      spellCheck={false}
      className={cn("min-h-[1.4em] outline-none focus-visible:ring-2 focus-visible:ring-blue-500", className)}
      onInput={() => onChange?.(read())}
      onKeyDown={(e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        if (rich) document.execCommand?.("insertLineBreak");
      }}
      onPaste={(e) => {
        e.preventDefault();
        insertPlainText(e.clipboardData.getData("text/plain"));
      }}
    />
  );
}
