import { creaRegistroAzioni } from "../../src/segnalazioni/useRegistroAzioni.js";

let registro;
afterEach(() => {
  registro?.stop();
  registro = null;
});

test("registro keeps the last 200 actions", () => {
  registro = creaRegistroAzioni(window);
  for (let i = 0; i < 250; i += 1) {
    registro.aggiungi({ tipo: "click", elemento: `n${i}` });
  }
  const azioni = registro.azioni();
  expect(azioni).toHaveLength(200);
  expect(azioni[0].elemento).toBe("n50");
  expect(azioni[199].elemento).toBe("n249");
  expect(typeof azioni[0].ts).toBe("string");
  expect(new Date(azioni[0].ts).toISOString()).toBe(azioni[0].ts);
});

test("fetch patch records method, url without query, status, duration and never the body", async () => {
  const originale = vi.fn(async () => ({ status: 201 }));
  window.fetch = originale;
  registro = creaRegistroAzioni(window);
  expect(window.fetch).not.toBe(originale);

  await window.fetch("/api/clienti?token=abc123#frammento", {
    method: "post",
    body: JSON.stringify({ password: "segreto" }),
  });

  expect(originale).toHaveBeenCalledTimes(1);
  const richieste = registro.azioni().filter((a) => a.tipo === "richiesta");
  expect(richieste).toHaveLength(1);
  const [r] = richieste;
  expect(r.metodo).toBe("POST");
  expect(r.url).toBe("/api/clienti");
  expect(r.stato).toBe(201);
  expect(typeof r.durata_ms).toBe("number");
  const testo = JSON.stringify(registro.azioni());
  expect(testo).not.toContain("segreto");
  expect(testo).not.toContain("abc123");
  expect(testo).not.toContain("frammento");

  registro.stop();
  registro = null;
  expect(window.fetch).toBe(originale);
});

test("fetch failures are recorded as network errors and still rethrown", async () => {
  window.fetch = vi.fn(async () => {
    throw new TypeError("Failed to fetch");
  });
  registro = creaRegistroAzioni(window);
  await expect(window.fetch("/api/x")).rejects.toThrow("Failed to fetch");
  const [r] = registro.azioni().filter((a) => a.tipo === "richiesta");
  expect(r.metodo).toBe("GET");
  expect(r.stato).toBeNull();
  expect(r.errore).toBe("rete");
});

test("console.error and navigation are recorded", () => {
  const errore = console.error;
  const muto = () => {};
  console.error = muto;
  registro = creaRegistroAzioni(window);
  console.error("Qualcosa è andato storto", { a: 1 });
  window.history.pushState({}, "", "/report?segreto=1");
  const tipi = registro.azioni().map((a) => a.tipo);
  expect(tipi).toContain("errore");
  expect(tipi).toContain("navigazione");
  const nav = registro
    .azioni()
    .filter((a) => a.tipo === "navigazione")
    .at(-1);
  expect(nav.url).toBe("/report");
  registro.stop();
  registro = null;
  expect(console.error).toBe(muto);
  console.error = errore;
});

test("clicks inside data-segnala-ignora are not recorded", () => {
  document.body.innerHTML =
    '<button id="a">Salva</button><div data-segnala-ignora><button id="b">Segnala</button></div>';
  registro = creaRegistroAzioni(window);
  document.getElementById("a").click();
  document.getElementById("b").click();
  const click = registro.azioni().filter((a) => a.tipo === "click");
  expect(click).toHaveLength(1);
  expect(click[0].elemento).toBe("Salva");
});
