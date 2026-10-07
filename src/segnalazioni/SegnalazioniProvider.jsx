import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ToastProvider } from "../organisms/Toast.jsx";
import { catturaSchermata } from "./cattura.js";
import { SegnalazioniContext } from "./contesto.js";
import { nuovoId } from "./invio.js";
import ModaleSegnalazione from "./ModaleSegnalazione.jsx";
import SelettoreElemento from "./SelettoreElemento.jsx";
import { useRegistrazione } from "./useRegistrazione.js";
import { useRegistroAzioni } from "./useRegistroAzioni.js";

const fetchPredefinito = (...args) => globalThis.fetch(...args);

/**
 * Wraps the portal. Asks `GET {configEndpoint}` whether reports are on; when
 * they are, keeps the action log and the rolling rrweb recording, and owns
 * the crosshair → screenshot → modal flow. When they are off it mounts
 * nothing and records nothing.
 */
export default function SegnalazioniProvider({
  endpoint = "/api/segnalazioni",
  configEndpoint = "/api/segnalazioni/config",
  durataVideoSec = 30,
  fetchImpl = fetchPredefinito,
  children,
}) {
  const [config, setConfig] = useState(null);
  const [stato, setStato] = useState("inattivo");
  const [bozza, setBozza] = useState(null);
  const fetchRef = useRef(fetchImpl);
  fetchRef.current = fetchImpl;

  useEffect(() => {
    let annullato = false;
    (async () => {
      try {
        const r = await fetchRef.current(configEndpoint, {
          credentials: "include",
        });
        const corpo = r.ok ? await r.json() : {};
        if (!annullato)
          setConfig({
            abilitato: corpo.abilitato === true,
            durata:
              Number(corpo.durata_video_sec) > 0
                ? Number(corpo.durata_video_sec)
                : null,
          });
      } catch {
        // No answer, no button: never offer a report that cannot be sent.
        if (!annullato) setConfig({ abilitato: false, durata: null });
      }
    })();
    return () => {
      annullato = true;
    };
  }, [configEndpoint]);

  const abilitato = config?.abilitato === true;
  const durata = config?.durata ?? durataVideoSec;
  const registro = useRegistroAzioni(abilitato, {
    ignoraUrl: [endpoint, configEndpoint],
  });
  const registrazione = useRegistrazione(abilitato, durata);

  const apri = useCallback(() => {
    if (!abilitato) return;
    setStato((s) => (s === "inattivo" ? "mirino" : s));
  }, [abilitato]);

  const annulla = useCallback(() => setStato("inattivo"), []);

  const scegli = useCallback(
    async (elemento) => {
      setStato("cattura");
      // Frozen now: the video and the log end where the user saw the problem.
      const azioni = registro.azioni();
      const eventi = registrazione.eventi();
      const page_url = window.location.href;
      let catture = null;
      try {
        catture = await catturaSchermata();
      } catch {
        /* the report goes without a screenshot */
      }
      setBozza({
        segnalazione_id: nuovoId(),
        elemento,
        azioni,
        eventi,
        catture,
        page_url,
      });
      setStato("modale");
    },
    [registro, registrazione],
  );

  const chiudi = useCallback(() => {
    setBozza(null);
    setStato("inattivo");
  }, []);

  const valore = useMemo(
    () => ({ abilitato, apri, stato }),
    [abilitato, apri, stato],
  );

  return (
    <SegnalazioniContext.Provider value={valore}>
      {children}
      {abilitato && (
        <ToastProvider>
          {stato === "mirino" && (
            <SelettoreElemento onScegli={scegli} onAnnulla={annulla} />
          )}
          {stato === "cattura" && (
            <div
              data-segnala-ignora
              role="status"
              className="fixed bottom-6 left-1/2 z-[71] -translate-x-1/2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-muted-foreground shadow-2xl"
            >
              Preparo lo screenshot…
            </div>
          )}
          {stato === "modale" && bozza && (
            <ModaleSegnalazione
              bozza={bozza}
              endpoint={endpoint}
              fetchImpl={fetchRef.current}
              onChiudi={chiudi}
            />
          )}
        </ToastProvider>
      )}
    </SegnalazioniContext.Provider>
  );
}
