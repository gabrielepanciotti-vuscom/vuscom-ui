import { useState } from "react";
import Alert from "../organisms/Alert.jsx";
import Button from "../atoms/Button.jsx";
import Input from "../atoms/Input.jsx";
import Field from "../molecules/Field.jsx";
import LoginCornice from "../templates/LoginCornice.jsx";
import useTemaLogin from "../theme/useTemaLogin.js";
import { useFaviconVuscom } from "../brand/Brand.jsx";

export const BASE_RECUPERO = "/api/auth";
const MINIMO = 8;
const GENERICO =
  "Se l'account esiste, riceverà un'email con le istruzioni per reimpostare la password.";

async function postJson(url, body) {
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  return { ok: r.ok, data: await r.json().catch(() => ({})) };
}

/** «Password dimenticata?»: `vuscom_auth.recupero` always answers 200 with a generic message. */
export function RichiestaRecupero({
  base = BASE_RECUPERO,
  onIndietro,
  ...cornice
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function invia(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await postJson(`${base}/forgot-password`, { email });
      setMessage(data.message || GENERICO);
    } catch {
      setError("Errore di connessione al server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoginCornice {...cornice} subtitle="Recupera la tua password">
      <form className="space-y-5" onSubmit={invia}>
        {error && <Alert tone="danger">{error}</Alert>}
        {message ? (
          <Alert tone="success">{message}</Alert>
        ) : (
          <>
            <Field
              label="Email o username"
              hint="Ti invieremo un link, valido 60 minuti, per reimpostare la password."
            >
              <Input
                name="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
            <Button type="submit" size="lg" fullWidth loading={loading}>
              Invia link di reset
            </Button>
          </>
        )}
        <div className="text-center">
          <Button variant="link" onClick={onIndietro}>
            Torna al login
          </Button>
        </div>
      </form>
    </LoginCornice>
  );
}

/**
 * New-password screen the emailed link opens. `token` defaults to `?token=` of the current URL;
 * `onFatto()` is the portal's way back to the login (router-agnostic).
 */
export default function ReimpostaPassword({
  base = BASE_RECUPERO,
  token = typeof window === "undefined"
    ? ""
    : new URLSearchParams(window.location.search).get("token") || "",
  onFatto,
  iconaPortale,
  ...cornice
}) {
  useTemaLogin();
  useFaviconVuscom(iconaPortale);
  const [password, setPassword] = useState("");
  const [conferma, setConferma] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fatto, setFatto] = useState(false);

  async function invia(e) {
    e.preventDefault();
    setError("");
    if (!token) return setError("Link non valido: token mancante.");
    if (password !== conferma)
      return setError("Le password non corrispondono.");
    if (password.length < MINIMO)
      return setError(`La password deve essere di almeno ${MINIMO} caratteri.`);
    setLoading(true);
    try {
      const { ok, data } = await postJson(`${base}/reset-password`, {
        token,
        new_password: password,
        confirm_password: conferma,
      });
      if (!ok)
        return setError(data.detail || "Impossibile reimpostare la password.");
      setFatto(true);
    } catch {
      setError("Errore di connessione al server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoginCornice {...cornice} subtitle="Reimposta la tua password">
      {fatto ? (
        <div className="space-y-5">
          <Alert tone="success">
            Password reimpostata. Per sicurezza le sessioni aperte su tutti i
            portali sono state chiuse.
          </Alert>
          <Button size="lg" fullWidth onClick={onFatto}>
            Vai al login
          </Button>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={invia}>
          {error && <Alert tone="danger">{error}</Alert>}
          <Field label="Nuova password">
            <Input
              type="password"
              autoComplete="new-password"
              minLength={MINIMO}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>
          <Field label="Conferma nuova password">
            <Input
              type="password"
              autoComplete="new-password"
              minLength={MINIMO}
              value={conferma}
              onChange={(e) => setConferma(e.target.value)}
              required
            />
          </Field>
          <Button type="submit" size="lg" fullWidth loading={loading}>
            Reimposta password
          </Button>
          <div className="text-center">
            <Button variant="link" onClick={onFatto}>
              Torna al login
            </Button>
          </div>
        </form>
      )}
    </LoginCornice>
  );
}
