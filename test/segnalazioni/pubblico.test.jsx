import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  SegnalazioniProvider,
  PulsanteSegnala,
} from "../../src/segnalazioni/index.js";

vi.mock("rrweb", () => ({ record: vi.fn(() => () => {}) }));
vi.mock("../../src/segnalazioni/cattura.js", () => ({
  catturaSchermata: vi.fn(async () => ({
    mascherato: new Blob(["m"], { type: "image/png" }),
    privato: new Blob(["p"], { type: "image/png" }),
  })),
}));

const json = (status, corpo) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => corpo,
});

function monta(config, risposta) {
  const chiamate = [];
  const fetchImpl = vi.fn(async (url, opzioni = {}) => {
    chiamate.push({ url, opzioni });
    return url.endsWith("/config") ? json(200, config) : risposta;
  });
  render(
    <SegnalazioniProvider pubblico getToken={() => "T"} fetchImpl={fetchImpl}>
      <PulsanteSegnala />
    </SegnalazioniProvider>,
  );
  return chiamate;
}

describe("segnalazioni pubbliche", () => {
  it("nasconde il pulsante se la config non è pubblica", async () => {
    const c = monta({ abilitato: true }, null);
    await waitFor(() => expect(c).toHaveLength(1));
    expect(screen.queryByRole("button", { name: /segnala/i })).toBeNull();
  });

  it("usa testi da pagina di accesso, senza azioni né video", async () => {
    monta({ abilitato: true, pubblico: true }, json(200, {}));
    const u = userEvent.setup();
    await u.click(await screen.findByRole("button", { name: /segnala/i }));
    expect(screen.queryByText(/ultime azioni/)).toBeNull();
    expect(screen.getByPlaceholderText(/codice di accesso/)).toBeTruthy();
  });

  it("invia senza Authorization a /pubblica, con email e nome", async () => {
    const c = monta(
      { abilitato: true, pubblico: true },
      json(200, { ticket_id: 7 }),
    );
    const u = userEvent.setup();
    await u.click(await screen.findByRole("button", { name: /segnala/i }));
    expect(c[0].opzioni.credentials).toBe("omit");
    expect(screen.queryByText("Evolutiva")).toBeNull();
    const invia = await screen.findByRole("button", { name: "Invia" });
    expect(invia).toBeDisabled();
    await u.type(screen.getByLabelText(/La tua email/), "mario@x.it");
    await u.type(screen.getByLabelText(/Il tuo nome/), "Mario");
    await u.type(
      screen.getByLabelText(/Cosa non va/),
      "il codice non arriva mai",
    );
    await u.click(invia);
    await waitFor(() => expect(c).toHaveLength(2));
    const post = c[1];
    expect(post.url).toBe("/api/segnalazioni/pubblica");
    expect(post.opzioni.headers).toBeUndefined();
    const report = JSON.parse(post.opzioni.body.get("report"));
    expect(report).toMatchObject({ natura: "problema" });
    expect(post.opzioni.body.get("email")).toBe("mario@x.it");
    expect(post.opzioni.body.get("nome")).toBe("Mario");
    expect(post.opzioni.body.get("sito_web")).toBe("");
    expect(post.opzioni.body.get("video")).toBeNull();
  });

  it("dice di attendere sul 429", async () => {
    monta({ abilitato: true, pubblico: true }, json(429, {}));
    const u = userEvent.setup();
    await u.click(await screen.findByRole("button", { name: /segnala/i }));
    await u.type(await screen.findByLabelText(/La tua email/), "m@x.it");
    await u.type(
      screen.getByLabelText(/Cosa non va/),
      "il codice non arriva mai",
    );
    await u.click(screen.getByRole("button", { name: "Invia" }));
    expect(await screen.findByText(/Troppe segnalazioni/)).toBeInTheDocument();
  });
});
