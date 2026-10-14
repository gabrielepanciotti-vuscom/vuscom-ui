import { vi } from "vitest";
import { esportaCsv, toCsv } from "../../src/lib/esportaCsv.js";

const BOM = String.fromCharCode(0xfeff);

test("BOM, semicolon, CRLF, decimal comma, no grouping", () => {
  const csv = toCsv(
    [{ nome: "Alfa", importo: 1234.5, n: 3 }],
    [
      { key: "nome", header: "Nome" },
      { key: "importo", header: "Importo" },
      { key: "n", header: "N" },
    ],
  );
  expect(csv.startsWith(BOM)).toBe(true);
  expect(csv.slice(1)).toBe("Nome;Importo;N\r\nAlfa;1234,5;3");
});

test("escapes separators, quotes and newlines", () => {
  const csv = toCsv([{ t: 'a;b "c"\nd' }], [{ key: "t", header: "T" }]);
  expect(csv.slice(1).split("\r\n")[1]).toBe('"a;b ""c""\nd"');
});

test("empty values, dates, booleans, non-finite numbers", () => {
  const csv = toCsv(
    [{ a: null, b: undefined, c: new Date(Date.UTC(2026, 9, 4)), d: true, e: NaN }],
    ["a", "b", "c", "d", "e"].map((key) => ({ key, header: key })),
  );
  expect(csv.slice(1).split("\r\n")[1]).toBe(";;04/10/2026;sì;");
});

test("neutralises formulas but keeps negative numbers as text", () => {
  const csv = toCsv(
    [{ a: "=SUM(A1)", b: "@cmd", c: "-12,5", d: -3.25, e: "-x" }],
    ["a", "b", "c", "d", "e"].map((key) => ({ key, header: key })),
  );
  expect(csv.slice(1).split("\r\n")[1]).toBe("'=SUM(A1);'@cmd;-12,5;-3,25;'-x");
});

test("follows DataTable columns: csv(), sortAccessor, csvHeader, csv:false", () => {
  const csv = toCsv(
    [{ id: 1, nome: "Alfa", lead: 10 }],
    [
      { key: "nome", header: <b>Nome</b> },
      { key: "lead", header: "Lead", sortAccessor: (r) => r.lead * 2 },
      { key: "x", csvHeader: "Codice", csv: (r) => `C${r.id}` },
      { key: "azioni", header: "", csv: false },
    ],
  );
  expect(csv.slice(1)).toBe("nome;Lead;Codice\r\nAlfa;20;C1");
});

test("esportaCsv downloads a .csv blob", () => {
  const click = vi.fn();
  const crea = vi.spyOn(document, "createElement");
  URL.createObjectURL = vi.fn(() => "blob:x");
  URL.revokeObjectURL = vi.fn();
  crea.mockImplementationOnce(() => {
    const a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
    a.click = click;
    return a;
  });
  esportaCsv("report", [{ a: 1 }], [{ key: "a", header: "A" }]);
  const a = crea.mock.results[0].value;
  expect(a.download).toBe("report.csv");
  expect(click).toHaveBeenCalled();
  expect(URL.createObjectURL.mock.calls[0][0]).toBeInstanceOf(Blob);
  crea.mockRestore();
});
