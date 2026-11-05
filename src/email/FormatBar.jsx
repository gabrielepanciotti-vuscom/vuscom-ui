import { useState } from "react";
import { Bold, Italic, Link as LinkIcon } from "lucide-react";
import Button from "../atoms/Button.jsx";
import IconButton from "../atoms/IconButton.jsx";
import Input from "../atoms/Input.jsx";
import { applyFormat } from "./richText.js";

// b / i / red / link on the selection last made in a text. Buttons never take the focus away.
export default function FormatBar({ caret }) {
  const [asking, setAsking] = useState(false);
  const [url, setUrl] = useState("");
  const keep = (e) => e.preventDefault();
  const run = (cmd, arg) => caret.current && applyFormat(caret.current, cmd, arg);
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1" onMouseDown={keep}>
        <IconButton icon={Bold} variant="outline" size="sm" aria-label="Grassetto" onClick={() => run("bold")} />
        <IconButton icon={Italic} variant="outline" size="sm" aria-label="Corsivo" onClick={() => run("italic")} />
        <Button variant="outline" size="sm" aria-label="Rosso" className="font-bold text-red-700" onClick={() => run("tone")}>A</Button>
        <Button variant="outline" size="sm" icon={LinkIcon} aria-expanded={asking} onClick={() => setAsking((a) => !a)}>Link</Button>
      </div>
      {asking && (
        <div className="flex gap-1">
          <Input aria-label="Indirizzo del link" placeholder="https://… o {{variabile}}" value={url} onChange={(e) => setUrl(e.target.value)} />
          <Button
            size="sm"
            className="shrink-0"
            onMouseDown={keep}
            onClick={() => {
              if (run("link", url.trim())) {
                setAsking(false);
                setUrl("");
              }
            }}
          >
            Applica
          </Button>
        </div>
      )}
    </div>
  );
}
