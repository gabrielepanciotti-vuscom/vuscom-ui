import MatriceCalore from "../../organisms/MatriceCalore.jsx";
import { ND } from "./datiReport.js";

/** Fewer periods than this and the matrix would be one column of changes. */
export const PERIODI_MATRICE = 3;

/**
 * Period × voce heat matrix of the changes between consecutive snapshots,
 * like the Euris report: each row coloured against its own maximum (counts
 * and euros side by side), with the net change over the interval as total.
 * Column totals would add euros to counts, so there are none.
 */
export default function VariazioniCampagna({ righe = [], periodi = [] }) {
  if (periodi.length < PERIODI_MATRICE)
    return (
      <p className="text-sm text-muted-foreground">
        La matrice delle variazioni compare con almeno {PERIODI_MATRICE} periodi.
      </p>
    );
  return (
    <MatriceCalore
      righe={righe}
      periodi={periodi}
      etichettaRighe="Indicatore"
      caption="Variazioni per periodo e indicatore"
      scala="riga"
      nd={ND}
      quota={false}
      rigaTotali={false}
    />
  );
}
