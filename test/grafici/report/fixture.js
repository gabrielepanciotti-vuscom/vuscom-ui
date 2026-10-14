// Snapshots of a campaign: three monthly photos plus two daily ones in October.
export const RIGHE = [
  { campagna: "bonus_50", data_riferimento: "2026-08-01", mensile: true, forniture_attive: 100, storni: 2, maturati: 0, costo: "1000.00", margine: "4000.00", guadagno_netto: "3000.00", indicatori: { beneficiari: 102, bonus_riconosciuto: 5100, dati_al: "2026-07-31" } },
  { campagna: "bonus_50", data_riferimento: "2026-09-01", mensile: true, forniture_attive: 110, storni: 5, maturati: 3, costo: "1500.00", margine: "5200.00", guadagno_netto: "3700.00", indicatori: { beneficiari: 118, bonus_riconosciuto: 5900 } },
  { campagna: "bonus_50", data_riferimento: "2026-10-01", mensile: true, forniture_attive: 120, storni: 7, maturati: 6, costo: "2000.00", margine: null, guadagno_netto: null, indicatori: { beneficiari: 133, bonus_riconosciuto: 6650 } },
  { campagna: "bonus_50", data_riferimento: "2026-10-13", mensile: false, forniture_attive: 124, storni: 8, maturati: 6, costo: "2100.00", margine: null, guadagno_netto: null, indicatori: { beneficiari: 138 } },
  { campagna: "bonus_50", data_riferimento: "2026-10-14", mensile: false, forniture_attive: 125, storni: 8, maturati: 7, costo: "2150.00", margine: null, guadagno_netto: null, indicatori: { beneficiari: 140 } },
  { campagna: "segnalatori", data_riferimento: "2026-10-14", mensile: false, forniture_attive: 40, storni: 1, maturati: 2, costo: null, margine: null, guadagno_netto: null, indicatori: { contratti: 45 } },
];
export const SOLO = (c) => RIGHE.filter((r) => r.campagna === c);
