import {
  creaFinestraVideo,
  troncaVideo,
} from "../../src/segnalazioni/useRegistrazione.js";
import { componiInvio, nuovoId } from "../../src/segnalazioni/invio.js";

const meta = (t) => ({ type: 4, timestamp: t, data: {} });
const full = (t, testo = "x") => ({
  type: 2,
  timestamp: t,
  data: {
    node: {
      type: 0,
      id: 1,
      childNodes: [
        {
          type: 2,
          id: 2,
          tagName: "p",
          attributes: {},
          childNodes: [{ type: 3, id: 3, textContent: testo }],
        },
      ],
    },
  },
});
// jsdom's File has no .text(): read it the old way.
const testoDi = (file) =>
  new Promise((risolvi) => {
    const r = new FileReader();
    r.onload = () => risolvi(r.result);
    r.readAsText(file);
  });
const mossa = (t) => ({
  type: 3,
  timestamp: t,
  data: { source: 1, positions: [] },
});

test("the window keeps the last seconds plus the checkout right before them", () => {
  const f = creaFinestraVideo({ durataMs: 30000 });
  for (const t of [0, 10000, 20000, 30000, 40000, 50000]) {
    f.aggiungi(meta(t));
    f.aggiungi(full(t + 1));
    f.aggiungi(mossa(t + 5000));
  }
  const eventi = f.estrai(55000);
  // Window starts at 25 s: the checkout at 20 s opens the slice.
  expect(eventi[0]).toMatchObject({ type: 4, timestamp: 20000 });
  expect(eventi[1].type).toBe(2);
  expect(eventi.at(-1).timestamp).toBe(55000);
});

test("troncaVideo drops whole checkouts from the start and keeps the end", () => {
  const eventi = [meta(0), full(1, "a".repeat(5000)), meta(10), full(11, "b")];
  const tagliati = troncaVideo(eventi, 1000);
  expect(tagliati).toHaveLength(2);
  expect(tagliati[0].timestamp).toBe(10);
  expect(troncaVideo([meta(0), full(1, "a".repeat(5000))], 100)).toBeNull();
});

test("componiInvio masks the video and the clicks when maschera is on", async () => {
  const bozza = {
    segnalazione_id: nuovoId(),
    elemento: null,
    azioni: [
      { ts: "t", tipo: "click", elemento: "Mario Rossi", fonte: "testo" },
    ],
    eventi: [meta(0), full(1, "Mario Rossi")],
    catture: null,
    page_url: "http://portale/clienti?cf=RSSMRA",
  };
  const form = componiInvio(bozza, {
    commento: " Non va ",
    video: true,
    maschera: true,
  });
  const report = JSON.parse(form.get("report"));
  expect(report).toEqual({
    report_id: bozza.segnalazione_id,
    element: null,
    comment: "Non va",
    page_url: "http://portale/clienti",
  });
  const video = await testoDi(form.get("video"));
  const azioni = await testoDi(form.get("azioni"));
  expect(video).not.toContain("Mario");
  expect(azioni).not.toContain("Mario");
  expect(form.get("screenshot")).toBeNull();
  expect(form.get("video").type).toBe("application/json");

  const chiaro = componiInvio(bozza, {
    commento: "x",
    video: true,
    maschera: false,
  });
  expect(await testoDi(chiaro.get("video"))).toContain("Mario");
});

test("nuovoId falls back to getRandomValues outside secure contexts", () => {
  const originale = globalThis.crypto.randomUUID;
  Object.defineProperty(globalThis.crypto, "randomUUID", {
    value: undefined,
    configurable: true,
  });
  try {
    expect(nuovoId()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  } finally {
    Object.defineProperty(globalThis.crypto, "randomUUID", {
      value: originale,
      configurable: true,
    });
  }
});
