import { useState } from "react";
import { Inbox, Users, Euro, Activity } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  EmptyState,
  KpiCard,
  Pagination,
  Section,
  Skeleton,
  SkeletonCard,
  SkeletonText,
} from "../../src/index.js";

const RIGHE = [
  { id: 1, nome: "Alfa Srl", stato: "Attivo", lead: 1240 },
  { id: 2, nome: "Beta Spa", stato: "In pausa", lead: 310 },
  { id: 3, nome: "Gamma", stato: "Attivo", lead: 87 },
  { id: 4, nome: "Delta", stato: "Errore", lead: 0 },
  { id: 5, nome: "Epsilon", stato: "Attivo", lead: 5120 },
];
const TONO = { Attivo: "success", "In pausa": "warning", Errore: "danger" };
const COLONNE = [
  { key: "nome", header: "Nome", sortable: true },
  {
    key: "stato",
    header: "Stato",
    cell: (r) => (
      <Badge tone={TONO[r.stato]} dot>
        {r.stato}
      </Badge>
    ),
  },
  { key: "lead", header: "Lead", align: "right", sortable: true },
];

export default function Dati() {
  const [page, setPage] = useState(1);
  return (
    <>
      <Section title="KpiCard">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Lead"
            value={12480}
            segnala={{ tipo: "kpi", id: "kpi_lead", nome: "Lead" }}
            icon={Users}
            delta={{ value: 12, label: "vs ieri" }}
          />
          <KpiCard
            label="Ricavi"
            value="€ 4.2k"
            icon={Euro}
            tone="success"
            hint="Mese corrente"
          />
          <KpiCard
            label="Errori"
            value={3}
            icon={Activity}
            tone="danger"
            delta={{ value: -2 }}
            help="Errori ultime 24h"
          />
          <KpiCard label="Caricamento" value={0} loading />
        </div>
      </Section>
      <Section title="DataTable e Pagination">
        <DataTable
          columns={COLONNE}
          rows={RIGHE}
          rowKey={(r) => r.id}
          caption="Esempio"
        />
        <Pagination
          page={page}
          pageSize={5}
          total={23}
          onPageChange={setPage}
        />
        <DataTable columns={COLONNE} rows={[]} rowKey={(r) => r.id} caption="Vuota" />
        <DataTable
          columns={COLONNE}
          rows={[]}
          rowKey={(r) => r.id}
          loading
          caption="In caricamento"
        />
      </Section>
      <Section title="Card, EmptyState, Skeleton">
        <div className="grid gap-4 md:grid-cols-2">
          <Card interactive>
            <CardHeader title="Card" description="Titolo e descrizione" />
            <CardContent>Contenuto della card.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Composta</CardTitle>
              <CardDescription>Parti libere</CardDescription>
            </CardHeader>
            <CardContent>
              <SkeletonText lines={3} />
            </CardContent>
          </Card>
          <Card>
            <EmptyState
              icon={Inbox}
              title="Nessun elemento"
              description="Non c'è ancora nulla da mostrare."
              action={<Button size="sm">Crea</Button>}
            />
          </Card>
          <SkeletonCard />
          <Skeleton className="h-10 w-48" />
        </div>
      </Section>
    </>
  );
}
