import { useId, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "../lib/cn.js";
import Button from "../atoms/Button.jsx";
import Spinner from "../atoms/Spinner.jsx";
import Alert from "../organisms/Alert.jsx";

const mb = (n) => `${+(n / 1048576).toFixed(1)} MB`;

// Same rules as <input accept>: ".pdf", "image/*", "application/pdf".
export function accettato(file, accept) {
  const regole = (accept || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (!regole.length) return true;
  const nome = file.name.toLowerCase();
  const tipo = (file.type || "").toLowerCase();
  return regole.some((r) =>
    r.startsWith(".")
      ? nome.endsWith(r)
      : r.endsWith("/*")
        ? tipo.startsWith(r.slice(0, -1))
        : tipo === r,
  );
}

// Drag-and-drop area plus a button. The native file input is hidden: the Button
// (keyboard-reachable) opens the picker. `onFiles` gets only the valid files;
// the rejected ones are listed in an Alert and passed to `onReject`.
export default function FileDrop({
  accept,
  maxSize,
  multiple = false,
  disabled = false,
  loading = false,
  error,
  onFiles,
  onReject,
  label = "Trascina qui il file",
  buttonLabel = "Scegli file",
  hint,
  className,
}) {
  const uid = useId();
  const inputRef = useRef(null);
  const [sopra, setSopra] = useState(false);
  const [scartati, setScartati] = useState([]);
  const bloccato = disabled || loading;

  const gestisci = (lista) => {
    let files = Array.from(lista || []);
    if (!files.length) return;
    if (!multiple) files = files.slice(0, 1);
    const validi = [];
    const respinti = [];
    for (const f of files) {
      if (!accettato(f, accept)) respinti.push({ file: f, motivo: "tipo non ammesso" });
      else if (maxSize && f.size > maxSize)
        respinti.push({ file: f, motivo: `supera ${mb(maxSize)}` });
      else validi.push(f);
    }
    setScartati(respinti);
    if (respinti.length) onReject?.(respinti);
    if (validi.length) onFiles?.(validi);
  };

  const trascina = (e, dentro) => {
    e.preventDefault();
    if (!bloccato) setSopra(dentro);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        data-testid="filedrop-zona"
        onDragOver={(e) => trascina(e, true)}
        onDragLeave={(e) => trascina(e, false)}
        onDrop={(e) => {
          trascina(e, false);
          if (!bloccato) gestisci(e.dataTransfer?.files);
        }}
        aria-busy={loading || undefined}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-input bg-background p-6 text-center transition-colors",
          sopra && "border-primary bg-primary/5",
          disabled && "opacity-50",
        )}
      >
        {loading ? (
          <Spinner size="md" label="Caricamento in corso" />
        ) : (
          <UploadCloud className="h-8 w-8 text-muted-foreground" aria-hidden />
        )}
        <p id={`${uid}-t`} className="text-sm font-medium text-foreground">
          {label}
        </p>
        {hint && (
          <p id={`${uid}-h`} className="text-xs text-muted-foreground">
            {hint}
          </p>
        )}
        <Button
          variant="outline"
          disabled={bloccato}
          aria-describedby={hint ? `${uid}-h` : undefined}
          onClick={() => inputRef.current?.click()}
        >
          {buttonLabel}
        </Button>
        <input
          ref={inputRef}
          type="file"
          hidden
          tabIndex={-1}
          aria-hidden="true"
          data-testid="filedrop-input"
          accept={accept}
          multiple={multiple}
          disabled={bloccato}
          onChange={(e) => {
            gestisci(e.target.files);
            e.target.value = ""; // lets the same file be picked again
          }}
        />
      </div>
      {error && <Alert tone="danger">{error}</Alert>}
      {scartati.length > 0 && (
        <Alert tone="warning" title="File non caricati">
          <ul className="list-disc pl-4">
            {scartati.map((r, i) => (
              <li key={i}>
                {r.file.name}: {r.motivo}
              </li>
            ))}
          </ul>
        </Alert>
      )}
    </div>
  );
}
