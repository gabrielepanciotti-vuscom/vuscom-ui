import { useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";
import { formatData } from "../lib/format.js";
import { isPartial } from "../lib/periodi.js";
import Alert from "../organisms/Alert.jsx";
import EmptyState from "../organisms/EmptyState.jsx";
import Section from "../templates/Section.jsx";
import AndamentoCampagna from "./report/AndamentoCampagna.jsx";
import FiltriReport, { FILTRI_VUOTI } from "./report/FiltriReport.jsx";
import IntestazioneCampagna from "./report/IntestazioneCampagna.jsx";
import StoricoCampagna, { colonneStorico } from "./report/StoricoCampagna.jsx";
import TesseraKpi from "./report/TesseraKpi.jsx";
import VariazioniCampagna from "./report/VariazioniCampagna.jsx";
import {
  andamentoVoce,
  filtra,
  formatta,
  METRICHE_CAMPAGNA,
  normalizzaCampagne,
  perPeriodo,
  prossimaFotoMensile,
  serieAndamento,
  situazioneAl,
  ultimaFoto,
  unisciPerGiorno,
  variazioni,
  voci,
} from "./report/datiReport.js";

const NESSUNA = [];
const IMPILATE = ["forniture_attive", "maturati", "storni"];
const giornoIt = (iso) => formatData(`${iso}T12:00:00Z`);

/**
 * The campaign report page, identical on every portal. It never fetches: the
 * portal passes the snapshots it already read. `righe` = snapshots
 * { data_riferimento, mensile, forniture_attive, storni, maturati, costo,
 * margine, guadagno_netto, indicatori, dettaglio, campagna? } — rows with a
 * `campagna` field are filtered by the selected one. NULL reads "n.d.", never 0.
 * The campaign is controlled with `campagna` + `onCampagnaChange` (the portal
 * reloads), or left to the page when only `campagne` is given.
 */
export default function PaginaReportCampagna({
  campagne = NESSUNA,
  campagna: campagnaControllata,
  onCampagnaChange,
  righe = NESSUNA,
  caricando = false,
  errore,
  descrizione = "I numeri della campagna, fotografati ogni notte. Solo lettura.",
  etichetteIndicatori,
  formatiIndicatori,
  azioni,
  filtriIniziali = FILTRI_VUOTI,
  oggi,
}) {
  const elenco = useMemo(() => normalizzaCampagne(campagne), [campagne]);
  const [sceltaInterna, setSceltaInterna] = useState(null);
  const campagna =
    campagnaControllata ?? sceltaInterna ?? elenco[0]?.id ?? null;
  const scegli = (id) =>
    onCampagnaChange ? onCampagnaChange(id) : setSceltaInterna(id);
  const nome =
    elenco.find((c) => c.id === campagna)?.label ?? "Report campagna";

  const [filtri, setFiltri] = useState({ ...FILTRI_VUOTI, ...filtriIniziali });
  const [soloMensili, setSoloMensili] = useState(null);

  const giorni = useMemo(
    () =>
      unisciPerGiorno(
        righe.filter(
          (r) => !r.campagna || !campagna || r.campagna === campagna,
        ),
      ),
    [righe, campagna],
  );
  const tutte = useMemo(
    () =>
      voci(giorni, {
        etichette: etichetteIndicatori,
        formati: formatiIndicatori,
      }),
    [giorni, etichetteIndicatori, formatiIndicatori],
  );
  const foto = useMemo(() => ultimaFoto(giorni, tutte), [giorni, tutte]);

  const filtrati = useMemo(() => filtra(giorni, filtri), [giorni, filtri]);
  const periodi = useMemo(() => {
    const opz = { from: filtri.dal, to: filtri.al, now: oggi ?? new Date() };
    return perPeriodo(filtrati, filtri.granularita).map((p) => ({
      ...p,
      parziale: isPartial(p.key, opz),
    }));
  }, [filtrati, filtri, oggi]);
  const impilate = tutte.filter((v) => IMPILATE.includes(v.key));
  const matrice = useMemo(() => variazioni(periodi, tutte), [periodi, tutte]);

  const ciSonoMensili = filtrati.some((g) => g.mensile);
  const mensili = soloMensili ?? ciSonoMensili;
  const storico = useMemo(
    () => (mensili ? filtrati.filter((g) => g.mensile) : filtrati),
    [filtrati, mensili],
  );
  const colonne = useMemo(() => colonneStorico(tutte), [tutte]);

  const ultima = foto?.ultima;
  const rif = foto?.riferimento;
  const prossima = ultima ? prossimaFotoMensile(ultima.data_riferimento) : "";
  const inCostruzione = `Storico in costruzione, ${giorni.some((g) => g.mensile) ? "prossima" : "prima"} foto mensile il ${prossima}.`;

  const intestazione = (
    <IntestazioneCampagna
      campagne={elenco}
      campagna={campagna}
      onCampagnaChange={scegli}
      titolo={nome}
      situazione={ultima ? situazioneAl(ultima) : undefined}
      descrizione={descrizione}
      meta={
        rif
          ? `Variazioni rispetto all'ultima foto mensile, del ${giornoIt(rif.data_riferimento)}.`
          : undefined
      }
      azioni={azioni}
    />
  );

  if (!caricando && !errore && giorni.length === 0)
    return (
      <div className="space-y-6">
        {intestazione}
        <EmptyState
          icon={BarChart3}
          title="Nessuna foto ancora"
          description="Le foto della campagna arrivano ogni notte: la prima compare il giorno dopo l'avvio."
        />
      </div>
    );

  return (
    <div className="space-y-8">
      {intestazione}
      {errore && (
        <Alert tone="danger" title="Report non disponibile">
          {errore}
        </Alert>
      )}

      <section
        aria-label="Indicatori"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {(caricando && !ultima ? METRICHE_CAMPAGNA : tutte).map((v) => {
          const d = foto?.delta?.[v.key];
          const valore = ultima ? v.leggi(ultima) : null;
          const negativo = v.key === "guadagno_netto" && Number(valore) < 0;
          return (
            <TesseraKpi
              key={v.key}
              label={v.label}
              aiuto={v.aiuto}
              loading={caricando && !ultima}
              valore={formatta(valore, v.unita)}
              tono={negativo ? "danger" : undefined}
              delta={d}
              meglio={v.meglio}
              deltaTesto={
                d === undefined
                  ? undefined
                  : `${d > 0 ? "+" : ""}${formatta(d, v.unita)}`
              }
              deltaNota={
                d === undefined
                  ? v.unita === "testo"
                    ? undefined
                    : "senza confronto"
                  : `dal ${giornoIt(rif.data_riferimento)}`
              }
              andamento={
                v.unita === "testo" || !v.leggi ? [] : andamentoVoce(giorni, v)
              }
            />
          );
        })}
      </section>

      <FiltriReport
        value={filtri}
        onChange={setFiltri}
        predefinito={{ ...FILTRI_VUOTI, ...filtriIniziali }}
      />

      <Section
        title="Andamento"
        description="Una barra per periodo: lo stato all'ultima foto del periodo, non una somma. * = periodo non ancora chiuso o tagliato dal filtro."
      >
        <AndamentoCampagna
          periodi={periodi}
          serie={serieAndamento(periodi, impilate)}
          inCostruzione={inCostruzione}
          titolo={`Andamento di ${nome}`}
        />
      </Section>

      <StoricoCampagna
        righe={storico}
        colonne={colonne}
        soloMensili={mensili}
        onSoloMensili={setSoloMensili}
        nomeFile={`report_${campagna ?? "campagna"}`}
      />

      <Section
        title="Variazioni per periodo"
        description="Di quanto è cambiato ogni indicatore rispetto alla foto del periodo prima; il colore è proporzionale al valore della riga. Totale = variazione netta nell'intervallo."
      >
        <VariazioniCampagna righe={matrice} periodi={periodi} />
      </Section>
    </div>
  );
}
