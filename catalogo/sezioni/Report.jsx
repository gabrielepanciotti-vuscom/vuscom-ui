import { useMemo, useState } from "react";
import {
  BarraFiltriPeriodo,
  ChipFiltro,
  DataTable,
  isPartial,
  MatriceCalore,
  periodsBetween,
  PulsanteEsportaCsv,
  Section,
  useToast,
} from "../../src/index.js";
import { GraficoBarre, PaginaReportCampagna } from "../../src/grafici/index.js";

// Demo snapshots of two campaigns: Bonus 50 with three months of history,
// Segnalatori started this month (the "storico in costruzione" case).
const FOTO = [
  ...["2026-07-01", "2026-08-01", "2026-09-01", "2026-10-01", "2026-10-13", "2026-10-14"].map((d, i) => ({
    campagna: "bonus_50",
    data_riferimento: d,
    mensile: d.endsWith("-01"),
    forniture_attive: 90 + i * 8,
    storni: 1 + i * 2,
    maturati: i * 2,
    costo: 900 + i * 300,
    margine: i < 4 ? 3800 + i * 600 : null,
    guadagno_netto: i < 4 ? 2900 + i * 300 : null,
    indicatori: { beneficiari: 92 + i * 10, senza_fornitura: 3 + (i % 2), bonus_riconosciuto: 4600 + i * 500 },
  })),
  ...["2026-10-12", "2026-10-13", "2026-10-14"].map((d, i) => ({
    campagna: "segnalatori",
    data_riferimento: d,
    mensile: false,
    forniture_attive: 38 + i,
    storni: 1,
    maturati: 2 + i,
    costo: null,
    margine: null,
    guadagno_netto: null,
    indicatori: { contratti: 44 + i, segnalazioni: 60 + i * 2, dati_al: d },
  })),
];

// Demo data: email classifications by day, the shape of a campaign report.
const ESITI = ["Accettata", "Da verificare", "Rifiutata", "Duplicata"];
const giorni = Array.from({ length: 120 }, (_, i) => {
  const d = new Date(Date.UTC(2026, 5, 17) + i * 86400000);
  return d.toISOString().slice(0, 10);
});
const DATI = giorni.flatMap((g, i) =>
  ESITI.map((e, j) => ({ giorno: g, esito: e, n: ((i * 7 + j * 13) % 11) + (3 - j) * 2 })),
);

export default function Report() {
  const { toast } = useToast();
  const [filtri, setFiltri] = useState({ dal: "2026-07-01", al: null, granularita: "mese" });
  const [campagna, setCampagna] = useState("Bonus 50");

  const { periodi, serie, righe, totaliEsito } = useMemo(() => {
    const dal = filtri.dal ?? giorni[0];
    const al = filtri.al ?? giorni.at(-1);
    const keys = periodsBetween(dal, al, filtri.granularita);
    const opz = { from: filtri.dal, to: filtri.al, now: "2026-10-14" };
    const ps = keys.map((key) => ({ key, parziale: isPartial(key, opz) }));
    const dentro = DATI.filter((r) => r.giorno >= dal && r.giorno <= al);
    const somma = {};
    for (const r of dentro) {
      const k = periodsBetween(r.giorno, r.giorno, filtri.granularita)[0];
      somma[r.esito] ??= {};
      somma[r.esito][k] = (somma[r.esito][k] ?? 0) + r.n;
    }
    const s = ESITI.map((e) => ({ id: e, label: e, valori: somma[e] ?? {} }));
    const tot = s.map((x) => ({
      esito: x.label,
      totale: Object.values(x.valori).reduce((a, b) => a + b, 0),
    }));
    return { periodi: ps, serie: s, righe: s, totaliEsito: tot };
  }, [filtri]);

  const colonne = [
    { key: "esito", header: "Esito", sortable: true },
    { key: "totale", header: "Email", align: "right", sortable: true, bar: true },
  ];

  return (
    <>
      <Section title="PaginaReportCampagna (@vuscom/ui/grafici)">
        <div className="rounded-xl border bg-background p-6">
          <PaginaReportCampagna
            campagne={[
              { id: "bonus_50", label: "Bonus 50" },
              { id: "segnalatori", label: "Segnalatori" },
            ]}
            righe={FOTO}
            oggi="2026-10-14"
          />
        </div>
      </Section>
      <Section title="BarraFiltriPeriodo">
        <BarraFiltriPeriodo
          value={filtri}
          onChange={setFiltri}
          predefinito={{ dal: "2026-07-01", al: null, granularita: "mese" }}
          filtri={campagna ? [{ id: "c", label: `Campagna: ${campagna}`, onRemove: () => setCampagna(null) }] : []}
        />
        <div className="flex gap-2">
          <ChipFiltro>ChipFiltro senza rimozione</ChipFiltro>
        </div>
      </Section>
      <Section title="GraficoBarre (@vuscom/ui/grafici)">
        <GraficoBarre
          periodi={periodi}
          serie={serie}
          titolo="Classificazioni email per periodo"
          onPeriodoClick={(k) => toast({ title: `Periodo ${k}` })}
        />
      </Section>
      <Section title="MatriceCalore">
        <MatriceCalore
          righe={righe}
          periodi={periodi}
          etichettaRighe="Esito"
          caption="Classificazioni per periodo"
          onRigaClick={(r) => toast({ title: r.label })}
        />
      </Section>
      <Section title="DataTable con barra inline ed Esporta CSV">
        <div className="flex justify-end">
          <PulsanteEsportaCsv nomeFile="classificazioni" rows={totaliEsito} columns={colonne} />
        </div>
        <DataTable columns={colonne} rows={totaliEsito} rowKey={(r) => r.esito} caption="Totali per esito" />
      </Section>
    </>
  );
}
