import { useEffect, useMemo, useRef, useState } from "react";
import { Bug, ImageOff, MousePointerClick, RotateCw, Send } from "lucide-react";
import Button from "../atoms/Button.jsx";
import Textarea from "../atoms/Textarea.jsx";
import Checkbox from "../molecules/Checkbox.jsx";
import Field from "../molecules/Field.jsx";
import Alert from "../organisms/Alert.jsx";
import Dialog from "../organisms/Dialog.jsx";
import { useToast } from "../organisms/Toast.jsx";
import { cn } from "../lib/cn.js";
import { componiInvio, inviaSegnalazione } from "./invio.js";

const MAX_COMMENTO = 5000;

function nomeElemento(elemento) {
  if (!elemento) return null;
  return (
    elemento.nome || elemento.id || elemento.testo || elemento.selettore || null
  );
}

// Object URL for the preview, revoked when it changes or the modal closes.
function useAnteprima(blob) {
  const url = useMemo(() => {
    if (!blob || typeof URL?.createObjectURL !== "function") return null;
    return URL.createObjectURL(blob);
  }, [blob]);
  useEffect(
    () => () => {
      if (url) URL.revokeObjectURL?.(url);
    },
    [url],
  );
  return url;
}

/**
 * The report form for a draft taken when the element was picked. The draft
 * (comment, flags) lives here until the report is sent or the user closes
 * it: a failed send keeps everything and retries with the same id.
 */
export default function ModaleSegnalazione({
  bozza,
  endpoint,
  fetchImpl,
  onChiudi,
}) {
  const { toast } = useToast();
  const [commento, setCommento] = useState("");
  const [video, setVideo] = useState(true);
  const [maschera, setMaschera] = useState(true);
  // pronto · invio · riprova · non_disponibile · errore
  const [esito, setEsito] = useState({ stato: "pronto" });
  const inCorso = useRef(false);

  const anteprima = useAnteprima(
    bozza.catture
      ? maschera
        ? bozza.catture.mascherato
        : bozza.catture.privato
      : null,
  );
  const nome = nomeElemento(bozza.elemento);
  const vuoto = commento.trim() === "";
  const bloccato = esito.stato === "non_disponibile";

  const invia = async () => {
    // A double click must not post twice; the id is the same anyway.
    if (inCorso.current || vuoto || bloccato) return;
    inCorso.current = true;
    setEsito({ stato: "invio" });
    const form = componiInvio(bozza, { commento, video, maschera });
    const r = await inviaSegnalazione({ endpoint, fetchImpl, form });
    inCorso.current = false;
    if (r.esito === "inviata") {
      toast({
        title: `Segnalazione #${r.ticket_id} inviata`,
        description: r.url ? (
          <a
            href={r.url}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Apri il ticket
          </a>
        ) : undefined,
        tone: "success",
        duration: 8000,
      });
      onChiudi();
      return;
    }
    setEsito({ stato: r.esito, messaggio: r.messaggio });
  };

  const invio = esito.stato === "invio";
  const footer = (
    <>
      <Button variant="outline" onClick={onChiudi} disabled={invio}>
        Annulla
      </Button>
      {esito.stato === "riprova" ? (
        <Button icon={RotateCw} onClick={invia} disabled={vuoto}>
          Riprova
        </Button>
      ) : (
        <Button
          icon={Send}
          onClick={invia}
          loading={invio}
          disabled={vuoto || bloccato}
        >
          Invia
        </Button>
      )}
    </>
  );

  return (
    <Dialog
      open
      onClose={onChiudi}
      closeDisabled={invio}
      closeOnBackdrop={false}
      title="Segnala un problema"
      description="Arriva a chi segue il portale, con le ultime azioni e uno screenshot della pagina."
      icon={Bug}
      size="lg"
      footer={footer}
    >
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
          <MousePointerClick
            className="mt-0.5 h-4 w-4 shrink-0 text-primary"
            aria-hidden
          />
          <div className="min-w-0 text-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Elemento
            </p>
            <p
              className={cn(
                "truncate",
                nome ? "font-medium text-foreground" : "text-muted-foreground",
              )}
            >
              {nome ?? "Altro (nessun elemento scelto)"}
            </p>
          </div>
        </div>

        <Field
          label="Cosa non va?"
          required
          hint={`${commento.length}/${MAX_COMMENTO} · cosa ti aspettavi e cosa vedi invece`}
        >
          <Textarea
            data-autofocus
            rows={4}
            maxLength={MAX_COMMENTO}
            value={commento}
            onChange={(e) => setCommento(e.target.value)}
            placeholder="Es. il totale dei clienti attivi non torna con l'estrazione di ieri"
          />
        </Field>

        <div className="space-y-2.5">
          <Checkbox
            checked={video}
            onChange={setVideo}
            label="Allega il video delle ultime azioni"
          />
          <Checkbox
            checked={maschera}
            onChange={setMaschera}
            label="Maschera i dati"
          />
          <p className="pl-6 text-xs text-muted-foreground">
            Password e campi riservati sono sempre nascosti.
          </p>
        </div>

        <figure className="overflow-hidden rounded-lg border border-border bg-muted/30">
          {anteprima ? (
            <img
              src={anteprima}
              alt="Anteprima dello screenshot"
              className="max-h-56 w-full object-contain object-top"
            />
          ) : (
            <div className="flex h-24 items-center justify-center gap-2 text-sm text-muted-foreground">
              <ImageOff className="h-4 w-4" aria-hidden />
              {bozza.catture
                ? "Anteprima non disponibile"
                : "Screenshot non disponibile"}
            </div>
          )}
          <figcaption className="border-t border-border px-3 py-1.5 text-xs text-muted-foreground">
            Screenshot{" "}
            {maschera ? "con i dati mascherati" : "con i dati visibili"}
          </figcaption>
        </figure>

        {(esito.stato === "riprova" ||
          esito.stato === "non_disponibile" ||
          esito.stato === "errore") && (
          <Alert
            tone={esito.stato === "non_disponibile" ? "warning" : "danger"}
          >
            {esito.messaggio}
          </Alert>
        )}
      </div>
    </Dialog>
  );
}
