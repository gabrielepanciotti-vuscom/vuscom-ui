import Badge from "../../atoms/Badge.jsx";
import { formatData } from "../../lib/format.js";
import PulsanteEsportaCsv from "../../molecules/PulsanteEsportaCsv.jsx";
import Toggle from "../../molecules/Toggle.jsx";
import DataTable from "../../organisms/DataTable.jsx";
import Section from "../../templates/Section.jsx";
import { formatta, numero } from "./datiReport.js";

/** DataTable columns of the history: date, kind, then every voce. */
export function colonneStorico(elenco) {
  return [
    {
      key: "data_riferimento",
      header: "Data",
      sortable: true,
      cell: (r) => formatData(`${r.data_riferimento}T12:00:00Z`),
      csv: (r) => r.data_riferimento,
      className: "whitespace-nowrap",
    },
    {
      key: "mensile",
      header: "Foto",
      cell: (r) =>
        r.mensile ? <Badge tone="primary">mensile</Badge> : <span className="text-muted-foreground">giornaliera</span>,
      csv: (r) => (r.mensile ? "mensile" : "giornaliera"),
    },
    ...elenco.map((v) => {
      const n = (r) => numero(v.leggi(r));
      return {
        key: v.key,
        header: v.label,
        align: v.unita === "testo" ? "left" : "right",
        sortable: true,
        sortAccessor: v.unita === "testo" ? (r) => v.leggi(r) : n,
        // Bars only where a length means something: non-negative headline counts and costs.
        bar: !v.indicatore && v.key !== "margine" && v.key !== "guadagno_netto",
        barValue: (r) => n(r) ?? 0,
        cell: (r) => formatta(v.leggi(r), v.unita),
        csv: (r) => (v.unita === "testo" ? v.leggi(r) : n(r)),
        className: "whitespace-nowrap",
      };
    }),
  ];
}

/**
 * History of the snapshots: sortable, paginated, with inline bars and CSV
 * export of every row (not just the page). `soloMensili` keeps the monthly
 * snapshots, the ones that went out in the report email.
 */
export default function StoricoCampagna({
  righe = [],
  colonne,
  soloMensili,
  onSoloMensili,
  nomeFile = "storico_campagna",
  pageSize = 10,
}) {
  return (
    <Section
      title="Storico delle foto"
      description="Una riga per foto: lo stato della campagna in quel giorno. Clicca un'intestazione per ordinare."
      actions={
        <>
          <Toggle checked={soloMensili} onChange={onSoloMensili} label="Solo foto mensili" />
          <PulsanteEsportaCsv nomeFile={nomeFile} rows={righe} columns={colonne} />
        </>
      }
    >
      <DataTable
        columns={colonne}
        rows={righe}
        rowKey={(r) => r.data_riferimento}
        initialSort={{ key: "data_riferimento", dir: "desc" }}
        pageSize={pageSize}
        dense
        caption="Storico delle foto della campagna"
        empty={soloMensili ? "Nessuna foto mensile nel periodo: togli «Solo foto mensili» per vedere quelle giornaliere." : "Nessuna foto nel periodo"}
      />
    </Section>
  );
}
