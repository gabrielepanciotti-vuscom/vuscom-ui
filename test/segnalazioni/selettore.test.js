import { descriviElemento } from "../../src/segnalazioni/SelettoreElemento.jsx";
import { segnalaAttr } from "../../src/segnalazioni/segnalaAttr.js";

afterEach(() => {
  document.body.innerHTML = "";
});

test("segnalaAttr produces the data-segnala JSON attribute", () => {
  const attr = segnalaAttr({
    tipo: "kpi",
    id: "kpi_clienti",
    nome: "Clienti attivi",
    contesto: { periodo: "2026-09" },
  });
  expect(Object.keys(attr)).toEqual(["data-segnala"]);
  expect(JSON.parse(attr["data-segnala"])).toEqual({
    tipo: "kpi",
    id: "kpi_clienti",
    nome: "Clienti attivi",
    contesto: { periodo: "2026-09" },
  });
  expect(segnalaAttr(null)).toEqual({});
});

test("selettore climbs to the nearest data-segnala ancestor", () => {
  const esterno = segnalaAttr({ tipo: "tabella", id: "t", nome: "Tabella" })[
    "data-segnala"
  ];
  const interno = segnalaAttr({
    tipo: "kpi",
    id: "kpi_clienti",
    nome: "Clienti attivi",
    contesto: { filtri: { commodity: "ee" } },
  })["data-segnala"];
  const a = document.createElement("section");
  a.setAttribute("data-segnala", esterno);
  const b = document.createElement("div");
  b.setAttribute("data-segnala", interno);
  b.innerHTML = '<span><b id="valore">1.234</b></span>';
  a.appendChild(b);
  document.body.appendChild(a);

  const descritto = descriviElemento(document.getElementById("valore"));
  expect(descritto).toMatchObject({
    tipo: "kpi",
    id: "kpi_clienti",
    nome: "Clienti attivi",
    contesto: { filtri: { commodity: "ee" } },
  });
});

test("selettore without data-segnala returns text, selector and rect", () => {
  document.body.innerHTML =
    '<main><section class="pannello"><p class="nota importante">' +
    "x".repeat(300) +
    "</p></section></main>";
  const p = document.querySelector("p");
  const descritto = descriviElemento(p);
  expect(descritto.tipo).toBeUndefined();
  expect(descritto.testo.length).toBeLessThanOrEqual(200);
  expect(typeof descritto.selettore).toBe("string");
  expect(descritto.selettore).toContain("p");
  expect(document.querySelector(descritto.selettore)).toBe(p);
  expect(descritto.rect).toEqual(
    expect.objectContaining({
      x: expect.any(Number),
      y: expect.any(Number),
      width: expect.any(Number),
      height: expect.any(Number),
    }),
  );
});

test("an invalid data-segnala falls back to the plain description", () => {
  document.body.innerHTML = '<div data-segnala="{rotto"><i>Ciao</i></div>';
  const descritto = descriviElemento(document.querySelector("i"));
  expect(descritto.testo).toBe("Ciao");
});
