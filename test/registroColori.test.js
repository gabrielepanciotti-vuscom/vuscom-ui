import { expect, test } from "vitest";
import {
  COLORI_PORTALE,
  DISTANZA_MINIMA_COLORI,
  NAVY_PUBBLICO,
  coloreAutomatico,
  distanzaRgb,
  isCodicePortale,
} from "../src/brand/registroColori.js";
import { leggiPortale } from "../src/brand/colore.js";

const occupati = [...Object.values(COLORI_PORTALE), NAVY_PUBBLICO];

test("registered portals keep their colour", () => {
  for (const [codice, colore] of Object.entries(COLORI_PORTALE)) expect(coloreAutomatico(codice)).toBe(colore);
});

test("an unregistered code gets a stable colour far from every registered one", () => {
  for (const codice of ["vicky", "distributori", "emailmanager", "callmanager", "gestionesharepoint", "x"]) {
    const colore = coloreAutomatico(codice);
    expect(colore).toMatch(/^#[0-9a-f]{6}$/);
    expect(coloreAutomatico(codice)).toBe(colore);
    for (const o of occupati) expect(distanzaRgb(colore, o)).toBeGreaterThanOrEqual(DISTANZA_MINIMA_COLORI);
  }
});

test("different codes usually get different colours", () => {
  expect(coloreAutomatico("vicky")).not.toBe(coloreAutomatico("distributori"));
});

test("only lower-case slugs are portal codes", () => {
  for (const v of ["vicky", "portale-distributori", "a_b2"]) expect(isCodicePortale(v)).toBe(true);
  for (const v of ["", "Vicky", "#b45309", "1abc", "a b", null, 5]) expect(isCodicePortale(v)).toBe(false);
  expect(coloreAutomatico("Vicky")).toBeNull();
});

test("leggiPortale gives an unregistered code its automatic colour", () => {
  expect(leggiPortale("vicky")).toEqual({ chiave: "vicky", colore: coloreAutomatico("vicky") });
  expect(leggiPortale("offerte")).toEqual({ chiave: "offerte" });
});
