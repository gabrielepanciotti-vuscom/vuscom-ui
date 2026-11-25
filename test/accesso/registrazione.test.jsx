import { afterEach, expect, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginPage, RegistrazionePage } from "../../src/index.js";

afterEach(() => {
  vi.unstubAllGlobals();
  sessionStorage.clear();
  localStorage.clear();
  document.documentElement.classList.remove("dark");
});

const risposta = (ok, body) => ({ ok, json: async () => body });

async function accedi(onSubmit) {
  render(<LoginPage title="X" onSubmit={onSubmit} registrazione recupero />);
  await userEvent.type(screen.getByLabelText(/username/i), "mario");
  await userEvent.type(screen.getByLabelText(/^password/i), "p");
  await userEvent.click(screen.getByRole("button", { name: "Accedi" }));
}

test("non_registrato shows a yellow notice and resends the invitation once", async () => {
  const err = Object.assign(new Error("HTTP 403"), {
    detail: { codice: "non_registrato", messaggio: "Non hai ancora completato la registrazione.", login: "mario@x.it" },
  });
  const fetchMock = vi.fn().mockResolvedValue(risposta(true, { message: "Email inviata" }));
  vi.stubGlobal("fetch", fetchMock);
  await accedi(vi.fn().mockRejectedValue(err));
  expect(await screen.findByText(/Non hai ancora completato/)).toBeInTheDocument();
  expect(screen.queryByText(/credenziali/i)).toBeNull();
  const bottone = screen.getByRole("button", { name: "Rimandami l'email di registrazione" });
  await userEvent.click(bottone);
  expect(await screen.findByText("Email inviata")).toBeInTheDocument();
  expect(fetchMock).toHaveBeenCalledWith("/api/auth/invito/rimanda", expect.objectContaining({ body: JSON.stringify({ login: "mario@x.it" }) }));
  expect(bottone).toBeDisabled();
});

test("a plain login error still shows the message", async () => {
  await accedi(vi.fn().mockRejectedValue(new Error("Credenziali errate")));
  expect(await screen.findByText("Credenziali errate")).toBeInTheDocument();
});

test("Registrati asks name, surname and email and shows the generic message", async () => {
  const fetchMock = vi.fn().mockResolvedValue(risposta(true, { message: "Controlla la posta" }));
  vi.stubGlobal("fetch", fetchMock);
  render(<LoginPage title="X" onSubmit={vi.fn()} registrazione recupero />);
  expect(screen.getByRole("button", { name: "Registrati" })).toBeInTheDocument();
  expect(screen.getAllByRole("button", { name: "Password dimenticata?" })).toHaveLength(1);
  await userEvent.click(screen.getByRole("button", { name: "Registrati" }));
  await userEvent.type(screen.getByLabelText("Nome"), "Nina");
  await userEvent.type(screen.getByLabelText("Cognome"), "Verdi");
  await userEvent.type(screen.getByLabelText("Email"), "a@b.it");
  await userEvent.click(screen.getByRole("button", { name: "Invia" }));
  expect(await screen.findByText("Controlla la posta")).toBeInTheDocument();
  expect(fetchMock.mock.calls[0][0]).toBe("/api/auth/registrati");
  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ nome: "Nina", cognome: "Verdi", email: "a@b.it" });
});

test("no Registrati link without the prop", () => {
  render(<LoginPage title="X" onSubmit={vi.fn()} recupero />);
  expect(screen.queryByRole("button", { name: "Registrati" })).toBeNull();
});

const INVITO = { username: "mario", email: "mario@x.it", nome: "Mario", cognome: "Rossi", scade_il: "2026-12-01", invitato_da: "Anna" };

function stubInvito(post) {
  const fetchMock = vi.fn((url) =>
    Promise.resolve(url.startsWith("/api/auth/invito?") ? risposta(true, INVITO) : post(url)),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

test("RegistrazionePage prefills, validates the rules and logs in", async () => {
  const fetchMock = stubInvito(() => risposta(true, { access_token: "t" }));
  const onAccesso = vi.fn();
  render(<RegistrazionePage token="abc" onAccesso={onAccesso} />);
  expect(await screen.findByDisplayValue("mario@x.it")).toHaveAttribute("readonly");
  expect(fetchMock.mock.calls[0][0]).toBe("/api/auth/invito?token=abc");
  expect(screen.getByLabelText("Nome")).toHaveValue("Mario");
  const invia = screen.getByRole("button", { name: "Registrati ed entra" });
  expect(invia).toBeDisabled();
  await userEvent.type(screen.getByLabelText("Password"), "corta");
  await userEvent.type(screen.getByLabelText("Conferma password"), "corta");
  expect(invia).toBeDisabled();
  await userEvent.clear(screen.getByLabelText("Password"));
  await userEvent.clear(screen.getByLabelText("Conferma password"));
  await userEvent.type(screen.getByLabelText("Password"), "lunghissima1");
  await userEvent.type(screen.getByLabelText("Conferma password"), "lunghissima1");
  await userEvent.click(invia);
  await waitFor(() => expect(onAccesso).toHaveBeenCalledWith({ access_token: "t" }));
  const [url, init] = fetchMock.mock.calls[1];
  expect(url).toBe("/api/auth/registrazione");
  expect(JSON.parse(init.body)).toEqual({
    token: "abc", nome: "Mario", cognome: "Rossi", new_password: "lunghissima1", confirm_password: "lunghissima1",
  });
});

test.each([
  ["scaduto", "scaduto"],
  ["sostituito", "scaduto"],
  ["registrato", "registrato"],
])("dead link %s: no page, straight to the login with the email in memory only", async (codice, avviso) => {
  sessionStorage.clear();
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(risposta(false, { detail: { codice, messaggio: "x", email: "mario@x.it" } })));
  const onVaiAlLogin = vi.fn();
  render(<RegistrazionePage token="abc" onAccesso={vi.fn()} onVaiAlLogin={onVaiAlLogin} />);
  await waitFor(() => expect(onVaiAlLogin).toHaveBeenCalledTimes(1));
  expect(JSON.parse(sessionStorage.getItem("vuscomLoginStato"))).toEqual({ email: "mario@x.it", avviso });
  expect(screen.queryByRole("alert")).toBeNull();
  expect(window.location.href).not.toContain("mario");
});

test("an invalid or missing token goes to a plain login", async () => {
  sessionStorage.clear();
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(risposta(false, { detail: { codice: "non_valido", messaggio: "x", email: null } })));
  const onVaiAlLogin = vi.fn();
  render(<RegistrazionePage token="abc" onVaiAlLogin={onVaiAlLogin} />);
  await waitFor(() => expect(onVaiAlLogin).toHaveBeenCalled());
  expect(sessionStorage.getItem("vuscomLoginStato")).toBeNull();
  const senzaToken = vi.fn();
  render(<RegistrazionePage token="" onVaiAlLogin={senzaToken} />);
  await waitFor(() => expect(senzaToken).toHaveBeenCalled());
});

test("without onVaiAlLogin a dead link keeps the old message", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(risposta(false, { detail: { codice: "scaduto", messaggio: "Invito scaduto", email: "m@x.it" } })));
  render(<RegistrazionePage token="abc" />);
  expect(await screen.findByText("Invito scaduto")).toBeInTheDocument();
});

test("login after an expired link: email filled in and the yellow notice open", async () => {
  sessionStorage.setItem("vuscomLoginStato", JSON.stringify({ email: "mario@x.it", avviso: "scaduto" }));
  render(<LoginPage title="X" onSubmit={vi.fn()} registrazione recupero />);
  expect(screen.getByLabelText(/username/i)).toHaveValue("mario@x.it");
  expect(screen.getByText("Non hai ancora completato la registrazione.")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Rimandami l'email di registrazione" })).toBeInTheDocument();
  expect(sessionStorage.getItem("vuscomLoginStato")).toBeNull(); // shown once
});

test("login after a used link: email filled in and the «già completata» line", async () => {
  sessionStorage.setItem("vuscomLoginStato", JSON.stringify({ email: "mario@x.it", avviso: "registrato" }));
  render(<LoginPage title="X" onSubmit={vi.fn()} registrazione recupero />);
  expect(screen.getByLabelText(/username/i)).toHaveValue("mario@x.it");
  expect(screen.getByText("Registrazione già completata: accedi con la tua password.")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Rimandami l'email di registrazione" })).toBeNull();
});

test("an error on submit shows the message", async () => {
  stubInvito(() => risposta(false, { detail: { codice: "scaduto", messaggio: "Invito scaduto il 01/12", invitato_da: "Anna" } }));
  render(<RegistrazionePage token="abc" onAccesso={vi.fn()} />);
  await screen.findByDisplayValue("mario@x.it");
  await userEvent.type(screen.getByLabelText("Password"), "lunghissima1");
  await userEvent.type(screen.getByLabelText("Conferma password"), "lunghissima1");
  await userEvent.click(screen.getByRole("button", { name: "Registrati ed entra" }));
  expect(await screen.findByText("Invito scaduto il 01/12")).toBeInTheDocument();
});
