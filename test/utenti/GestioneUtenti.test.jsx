import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";
import { GestioneUtenti } from "../../src/utenti/index.js";

const MARIO = {
  id: 7,
  username: "mario.bianchi",
  email: "mario@example.com",
  nome: "Mario",
  cognome: "Bianchi",
  is_active: true,
  last_login: "2026-09-20T08:05:00",
  ruolo: "manager",
  altri_portali: [{ portale: "offerte", ruolo: "admin" }],
};
const IO = {
  ...MARIO,
  id: 21,
  username: "io",
  nome: "Io",
  cognome: "Admin",
  ruolo: "admin",
  altri_portali: [],
  last_login: null,
};

function httpError(status, body) {
  return Object.assign(new Error(`HTTP ${status}`), { status, body });
}

function makeClient(overrides = {}) {
  return {
    get: vi.fn().mockResolvedValue([MARIO, IO]),
    post: vi.fn().mockResolvedValue({}),
    put: vi.fn().mockResolvedValue({}),
    del: vi.fn().mockResolvedValue(null),
    ...overrides,
  };
}

function renderPage(client, attore = { id: 21, ruolo: "admin" }) {
  return render(
    <GestioneUtenti
      portale="cruscotto"
      nomePortale="Cruscotto"
      client={client}
      attore={attore}
    />,
  );
}

afterEach(() => vi.useRealTimers());

describe("GestioneUtenti", () => {
  it("renders the list with other-portal badges", async () => {
    const client = makeClient();
    renderPage(client);
    expect(await screen.findByText("mario.bianchi")).toBeInTheDocument();
    expect(screen.getByText("Utenti — Cruscotto")).toBeInTheDocument();
    expect(screen.getAllByText(/Hub Offerte/).length).toBeGreaterThan(0);
    expect(screen.getByText("20/09/2026 08:05")).toBeInTheDocument();
    expect(screen.getByText("mai")).toBeInTheDocument();
    expect(client.get).toHaveBeenCalledWith(
      "/api/utenti?includi_disattivati=false",
    );
  });

  it("offers access when the new user already exists", async () => {
    const user = userEvent.setup();
    const esistente = {
      id: 5,
      username: "mrossi",
      email: "mrossi@example.com",
      nome: "Mario",
      cognome: "Rossi",
      ruolo: null,
      is_active: true,
      altri_portali: [{ portale: "offerte", ruolo: "manager" }],
    };
    const client = makeClient({
      post: vi
        .fn()
        .mockRejectedValueOnce(
          httpError(409, {
            detail: { codice: "esiste", messaggio: "x", utente: esistente },
          }),
        )
        .mockResolvedValueOnce({
          utente: { ...esistente, ruolo: "viewer" },
          email_inviata: true,
        }),
    });
    renderPage(client);
    await screen.findByText("mario.bianchi");
    await user.click(screen.getByRole("button", { name: "Nuovo utente" }));
    await user.type(screen.getByLabelText("Username"), "mrossi");
    await user.type(screen.getByLabelText(/^Nome/), "Mario");
    await user.type(screen.getByLabelText(/^Cognome/), "Rossi");
    await user.click(screen.getByRole("button", { name: "Crea utente" }));
    expect(client.post).toHaveBeenCalledWith("/api/utenti", {
      username: "mrossi",
      email: null,
      nome: "Mario",
      cognome: "Rossi",
      ruolo: "viewer",
      password: null,
    });
    expect(
      await screen.findByText("Mario Rossi esiste già"),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Dai accesso a Cruscotto" }),
    );
    expect(client.post).toHaveBeenLastCalledWith("/api/utenti/5/accesso", {
      ruolo: "viewer",
      avvisa: true,
    });
    expect(
      await screen.findByText(
        "Accesso concesso. Email inviata a mrossi@example.com.",
      ),
    ).toBeInTheDocument();
    await waitFor(() => expect(client.get).toHaveBeenCalledTimes(2));
  });

  it("disables the avvisa switch when the existing person has no email", async () => {
    const user = userEvent.setup();
    const esistente = {
      id: 5,
      username: "mrossi",
      email: null,
      nome: "Mario",
      cognome: "Rossi",
      ruolo: null,
      is_active: true,
      altri_portali: [],
    };
    const client = makeClient({
      post: vi
        .fn()
        .mockRejectedValueOnce(
          httpError(409, {
            detail: { codice: "esiste", messaggio: "x", utente: esistente },
          }),
        )
        .mockResolvedValueOnce({
          utente: { ...esistente, ruolo: "viewer" },
          email_inviata: false,
        }),
    });
    renderPage(client);
    await screen.findByText("mario.bianchi");
    await user.click(screen.getByRole("button", { name: "Nuovo utente" }));
    await user.type(screen.getByLabelText("Username"), "mrossi");
    await user.type(screen.getByLabelText(/^Nome/), "Mario");
    await user.type(screen.getByLabelText(/^Cognome/), "Rossi");
    await user.click(screen.getByRole("button", { name: "Crea utente" }));
    expect(
      await screen.findByText("Mario Rossi esiste già"),
    ).toBeInTheDocument();
    const interruttore = screen.getByRole("switch", {
      name: "Avvisa via email",
    });
    expect(interruttore).toBeDisabled();
    expect(interruttore).toHaveAttribute("aria-checked", "false");
    expect(
      screen.getByText(/nessuna email in anagrafica/i),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Dai accesso a Cruscotto" }),
    );
    expect(client.post).toHaveBeenLastCalledWith("/api/utenti/5/accesso", {
      ruolo: "viewer",
      avvisa: false,
    });
    expect(
      await screen.findByText("Accesso concesso. Email non inviata."),
    ).toBeInTheDocument();
  });

  it("disables Crea utente until nome and cognome are filled", async () => {
    const user = userEvent.setup();
    renderPage(makeClient());
    await screen.findByText("mario.bianchi");
    await user.click(screen.getByRole("button", { name: "Nuovo utente" }));
    const crea = screen.getByRole("button", { name: "Crea utente" });
    await user.type(screen.getByLabelText("Username"), "mrossi");
    expect(crea).toBeDisabled();
    await user.type(screen.getByLabelText(/^Nome/), "Mario");
    expect(crea).toBeDisabled();
    await user.type(screen.getByLabelText(/^Cognome/), "   ");
    expect(crea).toBeDisabled();
    await user.type(screen.getByLabelText(/^Cognome/), "Rossi");
    expect(crea).toBeEnabled();
  });

  it("shows the generated password once", async () => {
    const user = userEvent.setup();
    const client = makeClient({
      post: vi.fn().mockResolvedValue({
        utente: MARIO,
        email_inviata: false,
        password_generata: "abc123XYZ-secret",
      }),
    });
    renderPage(client);
    await screen.findByText("mario.bianchi");
    await user.click(screen.getByRole("button", { name: "Nuovo utente" }));
    await user.type(screen.getByLabelText("Username"), "nuovo");
    await user.type(screen.getByLabelText(/^Nome/), "Nuovo");
    await user.type(screen.getByLabelText(/^Cognome/), "Utente");
    await user.click(screen.getByRole("button", { name: "Crea utente" }));
    expect(await screen.findByText("abc123XYZ-secret")).toBeInTheDocument();
    expect(screen.getByText(/mostrata una sola volta/)).toBeInTheDocument();
    await waitFor(() => expect(client.get).toHaveBeenCalledTimes(2));
  });

  it("searches existing users with a 300 ms debounce", async () => {
    vi.useFakeTimers();
    const client = makeClient();
    client.get.mockImplementation((path) =>
      Promise.resolve(path.includes("/cerca") ? [] : [MARIO, IO]),
    );
    renderPage(client);
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Aggiungi utente esistente" }),
    );
    fireEvent.change(screen.getByLabelText("Cerca persona"), {
      target: { value: "m" },
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(400);
    });
    expect(client.get).not.toHaveBeenCalledWith(
      expect.stringContaining("/cerca"),
    );
    fireEvent.change(screen.getByLabelText("Cerca persona"), {
      target: { value: "ma" },
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(299);
    });
    expect(client.get).not.toHaveBeenCalledWith("/api/utenti/cerca?q=ma");
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });
    expect(client.get).toHaveBeenCalledWith("/api/utenti/cerca?q=ma");
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(screen.getByText("Nessun risultato")).toBeInTheDocument();
  });

  it("previews anonymisation before deleting", async () => {
    const user = userEvent.setup();
    const client = makeClient();
    client.get.mockImplementation((path) =>
      Promise.resolve(
        path.endsWith("/eliminazione")
          ? { esito: "anonimizzato", riferimenti: { "estrazione.user_id": 12 } }
          : [MARIO, IO],
      ),
    );
    renderPage(client);
    const riga = (await screen.findByText("mario.bianchi")).closest("tr");
    await user.click(within(riga).getByTitle("Elimina"));
    expect(client.get).toHaveBeenCalledWith("/api/utenti/7/eliminazione");
    expect(await screen.findByText(/dati collegati/)).toBeInTheDocument();
    expect(screen.getByText(/estrazione: 12/)).toBeInTheDocument();
    const conferma = screen.getByRole("button", { name: "Elimina account" });
    expect(conferma).toBeDisabled();
    await user.type(
      screen.getByLabelText(/Digita lo username/),
      "mario.bianchi",
    );
    await user.click(conferma);
    expect(client.del).toHaveBeenCalledWith("/api/utenti/7");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("hides admin-only actions from a manager and self-actions from the actor", async () => {
    const client = makeClient();
    renderPage(client, { id: 21, ruolo: "manager" });
    await screen.findByText("mario.bianchi");
    expect(screen.queryByTitle("Elimina")).toBeNull();
    expect(screen.queryByTitle("Disattiva")).toBeNull();
    const mia = screen.getByText("io").closest("tr");
    expect(within(mia).queryByTitle("Togli accesso")).toBeNull();
    const sua = screen.getByText("mario.bianchi").closest("tr");
    expect(within(sua).getByTitle("Togli accesso")).toBeInTheDocument();
  });

  it("sends only the changed fields on edit", async () => {
    const user = userEvent.setup();
    const client = makeClient({ put: vi.fn().mockResolvedValue(MARIO) });
    renderPage(client);
    const riga = (await screen.findByText("mario.bianchi")).closest("tr");
    await user.click(within(riga).getByTitle("Modifica"));
    const nome = screen.getByLabelText(/^Nome/);
    await user.clear(nome);
    await user.type(nome, "Marco");
    await user.click(screen.getByRole("radio", { name: "admin" }));
    await user.click(screen.getByRole("button", { name: "Salva" }));
    expect(client.put).toHaveBeenCalledWith("/api/utenti/7", {
      nome: "Marco",
      ruolo: "admin",
    });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("disables Salva when nome or cognome is cleared", async () => {
    const user = userEvent.setup();
    const client = makeClient();
    renderPage(client);
    const riga = (await screen.findByText("mario.bianchi")).closest("tr");
    await user.click(within(riga).getByTitle("Modifica"));
    const salva = screen.getByRole("button", { name: "Salva" });
    await user.clear(screen.getByLabelText(/^Nome/));
    expect(salva).toBeDisabled();
    await user.type(screen.getByLabelText(/^Nome/), "Marco");
    expect(salva).toBeEnabled();
    await user.clear(screen.getByLabelText(/^Cognome/));
    expect(salva).toBeDisabled();
  });

  it("shows the backend error string inside the dialog", async () => {
    const user = userEvent.setup();
    const client = makeClient({
      post: vi.fn().mockRejectedValue(
        httpError(409, {
          detail: "Non si toglie l'accesso all'ultimo admin",
        }),
      ),
      del: vi.fn().mockRejectedValue(
        httpError(409, {
          detail: "Non si toglie l'accesso all'ultimo admin",
        }),
      ),
    });
    renderPage(client);
    const riga = (await screen.findByText("mario.bianchi")).closest("tr");
    await user.click(within(riga).getByTitle("Togli accesso"));
    const dialogo = screen.getByRole("dialog");
    expect(
      within(dialogo).getByText(/disconnessa da tutti i portali/),
    ).toBeInTheDocument();
    await user.click(
      within(dialogo).getByRole("button", { name: "Togli accesso" }),
    );
    expect(client.del).toHaveBeenCalledWith("/api/utenti/7/accesso");
    expect(
      await within(dialogo).findByText(
        "Non si toglie l'accesso all'ultimo admin",
      ),
    ).toBeInTheDocument();
  });

  it("never renders native select, checkbox or radio", async () => {
    const user = userEvent.setup();
    const client = makeClient();
    const { container } = renderPage(client);
    await screen.findByText("mario.bianchi");
    const nativi = "select, input[type=checkbox], input[type=radio]";
    expect(container.querySelector(nativi)).toBeNull();
    await user.click(screen.getByRole("button", { name: "Nuovo utente" }));
    expect(document.body.querySelector(nativi)).toBeNull();
  });

  it("focuses the first field on open and restores focus to the opener on close", async () => {
    const user = userEvent.setup();
    renderPage(makeClient());
    await screen.findByText("mario.bianchi");
    const apri = screen.getByRole("button", { name: "Nuovo utente" });
    await user.click(apri);
    expect(screen.getByLabelText("Username")).toHaveFocus();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(apri).toHaveFocus();
  });

  it.each([
    [
      "already has access here",
      { ruolo: "viewer", is_active: true },
      /ha già accesso a questo portale/i,
    ],
    [
      "is disabled",
      { ruolo: null, is_active: false },
      /account è disattivato/i,
    ],
  ])(
    "offers no access when the existing person %s",
    async (_nome, stato, testo) => {
      const user = userEvent.setup();
      const esistente = {
        id: 5,
        username: "mrossi",
        nome: "Mario",
        cognome: "Rossi",
        altri_portali: [],
        ...stato,
      };
      const client = makeClient({
        post: vi
          .fn()
          .mockRejectedValue(
            httpError(409, { detail: { codice: "esiste", utente: esistente } }),
          ),
      });
      renderPage(client);
      await screen.findByText("mario.bianchi");
      await user.click(screen.getByRole("button", { name: "Nuovo utente" }));
      await user.type(screen.getByLabelText("Username"), "mrossi");
      await user.type(screen.getByLabelText(/^Nome/), "Mario");
      await user.type(screen.getByLabelText(/^Cognome/), "Rossi");
      await user.click(screen.getByRole("button", { name: "Crea utente" }));
      expect(await screen.findByText(testo)).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /Dai accesso/ })).toBeNull();
    },
  );

  it("keeps the generated password dialog open on Esc, closes only with Chiudi", async () => {
    const user = userEvent.setup();
    const client = makeClient({
      post: vi.fn().mockResolvedValue({
        utente: MARIO,
        email_inviata: false,
        password_generata: "abc123XYZ-secret",
      }),
    });
    renderPage(client);
    await screen.findByText("mario.bianchi");
    await user.click(screen.getByRole("button", { name: "Nuovo utente" }));
    await user.type(screen.getByLabelText("Username"), "nuovo");
    await user.type(screen.getByLabelText(/^Nome/), "Nuovo");
    await user.type(screen.getByLabelText(/^Cognome/), "Utente");
    await user.click(screen.getByRole("button", { name: "Crea utente" }));
    await screen.findByText("abc123XYZ-secret");
    await user.keyboard("{Escape}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Chiudi finestra" }),
    ).toBeNull();
    await user.click(screen.getByRole("button", { name: "Chiudi" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("clears the chosen person when the search text changes", async () => {
    const user = userEvent.setup();
    const client = makeClient();
    client.get.mockImplementation((path) =>
      Promise.resolve(path.includes("/cerca") ? [MARIO] : [MARIO, IO]),
    );
    renderPage(client);
    await screen.findByText("mario.bianchi");
    await user.click(
      screen.getByRole("button", { name: "Aggiungi utente esistente" }),
    );
    await user.type(screen.getByLabelText("Cerca persona"), "ma");
    const dialogo = screen.getByRole("dialog");
    await user.click(
      await within(dialogo).findByRole("button", { pressed: false }),
    );
    const conferma = within(dialogo).getByRole("button", {
      name: "Dai accesso",
    });
    expect(conferma).toBeEnabled();
    await user.type(screen.getByLabelText("Cerca persona"), "r");
    expect(conferma).toBeDisabled();
    await within(dialogo).findByRole("button", { pressed: false });
  });

  it("grants access to an existing person with avvisa on by default", async () => {
    const user = userEvent.setup();
    const client = makeClient({
      post: vi.fn().mockResolvedValueOnce({
        utente: { ...MARIO, ruolo: "viewer" },
        email_inviata: true,
      }),
    });
    client.get.mockImplementation((path) =>
      Promise.resolve(path.includes("/cerca") ? [MARIO] : [MARIO, IO]),
    );
    renderPage(client);
    await screen.findByText("mario.bianchi");
    await user.click(
      screen.getByRole("button", { name: "Aggiungi utente esistente" }),
    );
    await user.type(screen.getByLabelText("Cerca persona"), "ma");
    const dialogo = screen.getByRole("dialog");
    await user.click(
      await within(dialogo).findByRole("button", { pressed: false }),
    );
    const interruttore = within(dialogo).getByRole("switch", {
      name: "Avvisa via email",
    });
    expect(interruttore).toBeEnabled();
    expect(interruttore).toHaveAttribute("aria-checked", "true");
    await user.click(
      within(dialogo).getByRole("button", { name: "Dai accesso" }),
    );
    expect(client.post).toHaveBeenCalledWith("/api/utenti/7/accesso", {
      ruolo: "viewer",
      avvisa: true,
    });
    expect(
      await screen.findByText(
        "Accesso concesso. Email inviata a mario@example.com.",
      ),
    ).toBeInTheDocument();
  });

  it("sends avvisa false when the switch is turned off", async () => {
    const user = userEvent.setup();
    const client = makeClient({
      post: vi.fn().mockResolvedValueOnce({
        utente: { ...MARIO, ruolo: "viewer" },
        email_inviata: false,
      }),
    });
    client.get.mockImplementation((path) =>
      Promise.resolve(path.includes("/cerca") ? [MARIO] : [MARIO, IO]),
    );
    renderPage(client);
    await screen.findByText("mario.bianchi");
    await user.click(
      screen.getByRole("button", { name: "Aggiungi utente esistente" }),
    );
    await user.type(screen.getByLabelText("Cerca persona"), "ma");
    const dialogo = screen.getByRole("dialog");
    await user.click(
      await within(dialogo).findByRole("button", { pressed: false }),
    );
    await user.click(
      within(dialogo).getByRole("switch", { name: "Avvisa via email" }),
    );
    await user.click(
      within(dialogo).getByRole("button", { name: "Dai accesso" }),
    );
    expect(client.post).toHaveBeenCalledWith("/api/utenti/7/accesso", {
      ruolo: "viewer",
      avvisa: false,
    });
    expect(
      await screen.findByText("Accesso concesso. Email non inviata."),
    ).toBeInTheDocument();
  });

  it("disables avvisa when the found person has no email", async () => {
    const user = userEvent.setup();
    const SENZA_EMAIL = { ...MARIO, id: 9, username: "no.email", email: null };
    const client = makeClient({
      post: vi.fn().mockResolvedValueOnce({
        utente: { ...SENZA_EMAIL, ruolo: "viewer" },
        email_inviata: false,
      }),
    });
    client.get.mockImplementation((path) =>
      Promise.resolve(path.includes("/cerca") ? [SENZA_EMAIL] : [MARIO, IO]),
    );
    renderPage(client);
    await screen.findByText("mario.bianchi");
    await user.click(
      screen.getByRole("button", { name: "Aggiungi utente esistente" }),
    );
    await user.type(screen.getByLabelText("Cerca persona"), "no");
    const dialogo = screen.getByRole("dialog");
    await user.click(
      await within(dialogo).findByRole("button", { pressed: false }),
    );
    const interruttore = within(dialogo).getByRole("switch", {
      name: "Avvisa via email",
    });
    expect(interruttore).toBeDisabled();
    expect(interruttore).toHaveAttribute("aria-checked", "false");
    expect(
      within(dialogo).getByText(/nessuna email in anagrafica/i),
    ).toBeInTheDocument();
    await user.click(
      within(dialogo).getByRole("button", { name: "Dai accesso" }),
    );
    expect(client.post).toHaveBeenCalledWith("/api/utenti/9/accesso", {
      ruolo: "viewer",
      avvisa: false,
    });
    expect(
      await screen.findByText("Accesso concesso. Email non inviata."),
    ).toBeInTheDocument();
  });

  it("does not offer a lower role on the actor's own row", async () => {
    const user = userEvent.setup();
    renderPage(makeClient());
    const mia = (await screen.findByText("io")).closest("tr");
    await user.click(within(mia).getByTitle("Modifica"));
    expect(screen.queryByRole("radio", { name: "viewer" })).toBeNull();
    expect(screen.queryByRole("radio", { name: "manager" })).toBeNull();
    expect(screen.getByRole("radio", { name: "admin" })).toBeInTheDocument();
    expect(screen.getByText(/tuo account/)).toBeInTheDocument();
  });
});
