import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bug,
  ImageOff,
  Lightbulb,
  MousePointerClick,
  RotateCw,
  Send,
} from "lucide-react";
import Button from "../atoms/Button.jsx";
import Textarea from "../atoms/Textarea.jsx";
import Checkbox from "../molecules/Checkbox.jsx";
import SegmentedControl from "../molecules/SegmentedControl.jsx";
import Field from "../molecules/Field.jsx";
import Alert from "../organisms/Alert.jsx";
import Dialog from "../organisms/Dialog.jsx";
import { useToast } from "../organisms/Toast.jsx";
import { cn } from "../lib/cn.js";
import CampiAnonimi, { EMAIL_VALIDA } from "./CampiAnonimi.jsx";
import { NATURE, nomeElemento } from "./testiModale.js";
import { componiInvio, inviaSegnalazione } from "./invio.js";

// A bare "." woke an agent for nothing (ticket #59): require a real sentence.
const MIN_COMMENTO = 10;
const MAX_COMMENTO = 5000;

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
  mascheraDefault = false,
  pubblico = false,
}) {
  const { toast } = useToast();
  const [natura, setNatura] = useState("problema");
  // Anonymous mode (login page): who writes, and the honeypot bots fill in.
  const [email, setEmail] = useState("");
  const [nomeUtente, setNomeUtente] = useState("");
  const [website, setWebsite] = useState("");
  const emailOk = EMAIL_VALIDA.test(email.trim());
  const testo = NATURE[natura];
  const [commento, setCommento] = useState("");
  const [screenshot, setScreenshot] = useState(true);
  // The video is only needed now and then: the user turns it on.
  const [video, setVideo] = useState(false);
  const [maschera, setMaschera] = useState(mascheraDefault);
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
  const mancano = Math.max(0, MIN_COMMENTO - commento.trim().length);
  const vuoto = mancano > 0 || (pubblico && !emailOk);
  const bloccato = esito.stato === "non_disponibile";

  const invia = async () => {
    // A double click must not post twice; the id is the same anyway.
    if (inCorso.current || vuoto || bloccato) return;
    inCorso.current = true;
    setEsito({ stato: "invio" });
    const form = componiInvio(bozza, {
      commento,
      screenshot,
      video,
      maschera,
      natura,
      anonimo: pubblico ? { email, nome: nomeUtente, website } : null,
    });
    const r = await inviaSegnalazione({
      endpoint: pubblico ? `${endpoint}/pubblica` : endpoint,
      fetchImpl,
      form,
      credentials: pubblico ? "omit" : "include",
    });
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
      title={testo.title}
      description={testo.description}
      icon={testo.icon}
      size="lg"
      footer={footer}
    >
      <div className="space-y-5">
        {pubblico ? (
          <>
            <CampiAnonimi
              email={email}
              onEmail={setEmail}
              emailOk={emailOk}
              nome={nomeUtente}
              onNome={setNomeUtente}
              website={website}
              onWebsite={setWebsite}
            />
          </>
        ) : (
          <SegmentedControl
            aria-label="Tipo di segnalazione"
            size="md"
            value={natura}
            onChange={setNatura}
            options={[
              { value: "problema", label: "Problema", icon: Bug },
              { value: "evolutiva", label: "Evolutiva", icon: Lightbulb },
            ]}
          />
        )}
        {!pubblico && (
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
                  nome
                    ? "font-medium text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {nome ?? "Altro (nessun elemento scelto)"}
              </p>
            </div>
          </div>
        )}

        <Field
          label={testo.label}
          required
          hint={`${
            mancano > 0
              ? `ancora ${mancano} ${mancano === 1 ? "carattere" : "caratteri"}`
              : `${commento.length}/${MAX_COMMENTO}`
          } · ${testo.hint}`}
        >
          <Textarea
            data-autofocus={pubblico ? undefined : true}
            rows={4}
            maxLength={MAX_COMMENTO}
            value={commento}
            onChange={(e) => setCommento(e.target.value)}
            placeholder={testo.placeholder}
          />
        </Field>

        <div className="space-y-2.5">
          <Checkbox
            checked={screenshot}
            onChange={setScreenshot}
            label="Allega lo screenshot della pagina"
          />
          {!pubblico && (
            <>
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
            </>
          )}
          <p className="pl-6 text-xs text-muted-foreground">
            Password e campi riservati sono sempre nascosti, anche con la
            casella spenta.
          </p>
        </div>

        {screenshot && (
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
        )}

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
