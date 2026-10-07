// Fixes from the final review (2026-10-07): private/masked text never leaks
// through the picked element or the click log; Bearer portals use getToken.
import { render, screen, waitFor } from "@testing-library/react";
import { componiInvio } from "../../src/segnalazioni/invio.js";
import {
  mascheraAzioni,
  mascheraElemento,
} from "../../src/segnalazioni/maschera.js";
import { descriviElemento } from "../../src/segnalazioni/SelettoreElemento.jsx";
import { creaRegistroAzioni } from "../../src/segnalazioni/useRegistroAzioni.js";
import {
  PulsanteSegnala,
  SegnalazioniProvider,
} from "../../src/segnalazioni/index.js";

vi.mock("rrweb", () => ({ record: vi.fn(() => () => {}) }));

const M = "•••";

const bozza = (elemento) => ({
  segnalazione_id: "00000000-0000-4000-8000-000000000000",
  elemento,
  azioni: [],
  eventi: [],
  catture: null,
  page_url: "https://portale.example/x",
});

const reportDi = (form) => JSON.parse(form.get("report"));

test("with the mask on, the picked element's free text is masked", () => {
  const form = componiInvio(
    bozza({ testo: "Mario Rossi IT001E123", selettore: "td" }),
    { commento: "sbagliato", video: false, maschera: true },
  );
  expect(reportDi(form).element).toEqual({ testo: M, selettore: "td" });
});

test("with the mask on, data-segnala names stay readable", () => {
  const elemento = { tipo: "kpi", id: "kpi_x", nome: "Clienti attivi" };
  expect(mascheraElemento(elemento)).toEqual(elemento);
});

test("with the mask off, the element text is sent as is", () => {
  const form = componiInvio(bozza({ testo: "1.234" }), {
    commento: "sbagliato",
    video: false,
    maschera: false,
  });
  expect(reportDi(form).element.testo).toBe("1.234");
});

test("an element inside data-segnala-privato is described masked, always", () => {
  document.body.innerHTML =
    '<div data-segnala-privato><span id="s">segreto-123</span></div>';
  expect(descriviElemento(document.getElementById("s")).testo).toBe(M);
});

test("a click inside data-segnala-privato is logged masked, always", () => {
  document.body.innerHTML =
    '<div data-segnala-privato><button id="b">segreto-123</button></div>';
  const registro = creaRegistroAzioni(window);
  try {
    document.getElementById("b").click();
    const click = registro.azioni().filter((a) => a.tipo === "click");
    expect(click[0].elemento).toBe(M);
  } finally {
    registro.stop();
  }
});

test("with the mask on, error messages are masked too", () => {
  const [errore] = mascheraAzioni([
    { tipo: "errore", messaggio: "cliente Rossi non trovato" },
  ]);
  expect(errore.messaggio).toBe(M);
});

test("getToken adds the Bearer header to every widget call", async () => {
  const fetchImpl = vi.fn(async () => ({
    ok: true,
    status: 200,
    json: async () => ({ abilitato: true, durata_video_sec: 30 }),
  }));
  render(
    <SegnalazioniProvider getToken={() => "tok-1"} fetchImpl={fetchImpl}>
      <PulsanteSegnala />
    </SegnalazioniProvider>,
  );
  await screen.findByRole("button", { name: /segnala un problema/i });
  const [, opzioni] = fetchImpl.mock.calls[0];
  expect(new Headers(opzioni.headers).get("Authorization")).toBe(
    "Bearer tok-1",
  );
});

test("a 401 on config hides the button and warns in the console", async () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  const fetchImpl = vi.fn(async () => ({
    ok: false,
    status: 401,
    json: async () => ({}),
  }));
  render(
    <SegnalazioniProvider fetchImpl={fetchImpl}>
      <PulsanteSegnala />
    </SegnalazioniProvider>,
  );
  await waitFor(() => expect(warn).toHaveBeenCalled());
  expect(
    screen.queryByRole("button", { name: /segnala un problema/i }),
  ).toBeNull();
  warn.mockRestore();
});
