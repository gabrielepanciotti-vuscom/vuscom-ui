import {
  andamentoVoce, etichetta, filtra, formatta, ND, normalizzaCampagne, numero, perPeriodo,
  prossimaFotoMensile, serieAndamento, situazioneAl, ultimaFoto, unisciPerGiorno, variazioni, voci,
} from "../../../src/grafici/report/datiReport.js";
import { SOLO } from "./fixture.js";

const giorni = unisciPerGiorno(SOLO("bonus_50"));
const tutte = voci(giorni);
const voce = (k) => tutte.find((v) => v.key === k);

test("null is n.d., never zero; numeric strings are numbers", () => {
  expect(formatta(null)).toBe(ND);
  expect(formatta(undefined, "euro")).toBe(ND);
  expect(formatta(0)).toBe("0");
  expect(formatta("2026-10-14", "testo")).toBe("14/10/2026");
  expect(numero("1500.00")).toBe(1500);
  expect(numero("abc")).toBeNull();
  expect(formatta("1500.00", "euro")).toMatch(/1\.500\s?€/);
});

test("labels and campaigns", () => {
  expect(etichetta("storni_da_determinare")).toBe("Storni da determinare");
  expect(normalizzaCampagne(["bonus_50", { codice: "segnalatori", nome: "Segnalatori" }])).toEqual([
    { id: "bonus_50", label: "Bonus 50" },
    { id: "segnalatori", label: "Segnalatori" },
  ]);
});

test("merge per day: first non-null wins, indicators merged", () => {
  const g = unisciPerGiorno([
    { data_riferimento: "2026-10-14", storni: null, indicatori: { a: 1 } },
    { data_riferimento: "2026-10-14T00:00:00", storni: 3, mensile: true, indicatori: { b: 2 } },
  ]);
  expect(g).toHaveLength(1);
  expect(g[0]).toMatchObject({ storni: 3, mensile: true, indicatori: { a: 1, b: 2 } });
});

test("voci: metrics first, then indicators with a unit", () => {
  expect(tutte.slice(0, 6).map((v) => v.key)).toEqual([
    "forniture_attive", "storni", "maturati", "costo", "margine", "guadagno_netto",
  ]);
  expect(voce("indicatori.bonus_riconosciuto").unita).toBe("euro");
  expect(voce("indicatori.beneficiari").unita).toBe("numero");
  expect(voce("indicatori.dati_al").unita).toBe("testo");
  expect(voci(giorni, { formati: { beneficiari: "euro" } }).find((v) => v.key === "indicatori.beneficiari").unita).toBe("euro");
});

test("delta against the last monthly photo, none when a side is n.d.", () => {
  const f = ultimaFoto(giorni, tutte);
  expect(f.ultima.data_riferimento).toBe("2026-10-14");
  expect(f.riferimento.data_riferimento).toBe("2026-10-01");
  expect(f.delta.forniture_attive).toBe(5);
  expect(f.delta.costo).toBe(150);
  expect(f.delta).not.toHaveProperty("margine");
  expect(f.delta["indicatori.beneficiari"]).toBe(7);
  expect(situazioneAl(f.ultima)).toBe("Situazione al 14/10/2026");
});

test("periods keep the last photo; changes are differences, first is n.d.", () => {
  const p = perPeriodo(giorni, "mese");
  expect(p.map((x) => x.key)).toEqual(["2026-08", "2026-09", "2026-10"]);
  expect(p[2].riga.data_riferimento).toBe("2026-10-14");
  const s = serieAndamento(p, [voce("storni")]);
  expect(s[0].valori).toEqual({ "2026-08": 2, "2026-09": 5, "2026-10": 8 });
  const m = variazioni(p, tutte);
  const fa = m.find((r) => r.id === "forniture_attive");
  expect(fa.valori).toEqual({ "2026-08": null, "2026-09": 10, "2026-10": 15 });
  expect(fa.format(10)).toBe("+10");
  expect(m.find((r) => r.id === "margine").valori["2026-10"]).toBeNull();
  expect(m.some((r) => r.id === "indicatori.dati_al")).toBe(false);
});

test("filters, sparkline trend and next monthly photo", () => {
  expect(filtra(giorni, { dal: "2026-10-01", al: "2026-10-13" })).toHaveLength(2);
  expect(andamentoVoce(giorni, voce("forniture_attive"))).toEqual([100, 110, 125]);
  expect(prossimaFotoMensile("2026-10-14")).toBe("1/11");
  expect(prossimaFotoMensile("2026-12-03")).toBe("1/1");
});
