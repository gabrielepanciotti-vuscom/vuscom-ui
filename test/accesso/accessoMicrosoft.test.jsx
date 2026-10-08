import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccessoMicrosoft, LoginPage } from "../../src/index.js";

function rispondi(mappa) {
  return vi.fn(async (url, opzioni) => {
    const voce = mappa[url];
    if (!voce) return { ok: false, status: 404, json: async () => ({}) };
    const { status = 200, body = {} } = typeof voce === "function" ? voce(opzioni) : voce;
    return { ok: status < 400, status, json: async () => body };
  });
}

beforeEach(() => {
  window.history.replaceState(null, "", "/login");
});

afterEach(() => {
  vi.unstubAllGlobals();
});

test("fuori rete non mostra niente", async () => {
  const fetch = rispondi({ "/api/auth/microsoft/disponibile": { body: { disponibile: false } } });
  vi.stubGlobal("fetch", fetch);
  const { container } = render(<AccessoMicrosoft onAccesso={() => {}} />);
  await waitFor(() => expect(fetch).toHaveBeenCalled());
  expect(container).toBeEmptyDOMElement();
});

test("backend irraggiungibile = nessun pulsante", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("rete"); }));
  const { container } = render(<AccessoMicrosoft onAccesso={() => {}} />);
  await waitFor(() => expect(fetch).toHaveBeenCalled());
  expect(container).toBeEmptyDOMElement();
});

test("dentro la rete il pulsante porta al login Microsoft", async () => {
  vi.stubGlobal("fetch", rispondi({ "/api/auth/microsoft/disponibile": { body: { disponibile: true } } }));
  const assign = vi.fn();
  const originale = window.location;
  Object.defineProperty(window, "location", { configurable: true, value: { ...originale, assign } });
  try {
    render(<AccessoMicrosoft onAccesso={() => {}} />);
    await userEvent.click(await screen.findByRole("button", { name: /accedi con microsoft/i }));
    expect(assign).toHaveBeenCalledWith("/api/auth/microsoft/login");
  } finally {
    Object.defineProperty(window, "location", { configurable: true, value: originale });
  }
});

test("al ritorno scambia il biglietto, pulisce l'URL e passa la sessione", async () => {
  window.history.replaceState(null, "", "/login#microsoft=BIGLIETTO");
  const fetch = rispondi({
    "/api/auth/microsoft/disponibile": { body: { disponibile: true } },
    "/api/auth/microsoft/scambia": (o) => ({ body: { token: "jwt", ricevuto: JSON.parse(o.body) } }),
  });
  vi.stubGlobal("fetch", fetch);
  const onAccesso = vi.fn();
  render(<AccessoMicrosoft onAccesso={onAccesso} />);
  await waitFor(() => expect(onAccesso).toHaveBeenCalledTimes(1));
  expect(onAccesso).toHaveBeenCalledWith({ token: "jwt", ricevuto: { biglietto: "BIGLIETTO" } });
  expect(window.location.hash).toBe("");
});

test("biglietto scaduto mostra il messaggio del backend", async () => {
  window.history.replaceState(null, "", "/login#microsoft=VECCHIO");
  vi.stubGlobal("fetch", rispondi({
    "/api/auth/microsoft/disponibile": { body: { disponibile: true } },
    "/api/auth/microsoft/scambia": { status: 401, body: { detail: "Accesso con Microsoft scaduto: riprova" } },
  }));
  const onAccesso = vi.fn();
  render(<AccessoMicrosoft onAccesso={onAccesso} />);
  expect(await screen.findByText(/scaduto: riprova/i)).toBeInTheDocument();
  expect(onAccesso).not.toHaveBeenCalled();
});

test("errore dal callback anche fuori rete", async () => {
  window.history.replaceState(null, "", "/login#microsoft_errore=non_abilitato");
  vi.stubGlobal("fetch", rispondi({ "/api/auth/microsoft/disponibile": { body: { disponibile: false } } }));
  render(<AccessoMicrosoft onAccesso={() => {}} />);
  expect(await screen.findByText(/non è abilitato a questo portale/i)).toBeInTheDocument();
  expect(window.location.hash).toBe("");
  expect(screen.queryByRole("button", { name: /microsoft/i })).not.toBeInTheDocument();
});

test("LoginPage con microsoft mostra il pulsante sotto il modulo", async () => {
  vi.stubGlobal("fetch", rispondi({ "/api/auth/microsoft/disponibile": { body: { disponibile: true } } }));
  render(<LoginPage title="Cruscotto" onSubmit={async () => {}} microsoft={{ onAccesso: () => {} }} />);
  expect(await screen.findByRole("button", { name: /accedi con microsoft/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /^accedi$/i })).toBeInTheDocument();
});
