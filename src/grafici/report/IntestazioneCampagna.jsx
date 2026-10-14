import Tabs from "../../molecules/Tabs.jsx";

/**
 * Head of a campaign report: the "Campagna" tabs, the campaign name as the
 * page title and the date of the snapshot, so the page always says what it
 * is about. `meta` is a line under the title (last monthly snapshot, source).
 */
export default function IntestazioneCampagna({
  campagne = [],
  campagna,
  onCampagnaChange,
  titolo,
  situazione,
  descrizione,
  meta,
  azioni,
}) {
  return (
    <header className="space-y-4">
      {campagne.length > 0 && (
        <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
          <span className="pb-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Campagna
          </span>
          <Tabs
            aria-label="Campagna"
            value={campagna}
            onChange={onCampagnaChange}
            items={campagne.map((c) => ({ id: c.id, label: c.label }))}
            className="min-w-0 flex-1"
          />
        </div>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{titolo}</h1>
          {situazione && (
            <p className="text-sm font-medium text-foreground">{situazione}</p>
          )}
          {descrizione && (
            <p className="max-w-3xl text-sm text-muted-foreground">{descrizione}</p>
          )}
          {meta && <p className="text-xs text-muted-foreground">{meta}</p>}
        </div>
        {azioni && <div className="flex shrink-0 items-center gap-2">{azioni}</div>}
      </div>
    </header>
  );
}
