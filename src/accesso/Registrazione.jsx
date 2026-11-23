import { useEffect, useState } from "react";
import { Check, Circle } from "lucide-react";
import Alert from "../organisms/Alert.jsx";
import Button from "../atoms/Button.jsx";
import Input from "../atoms/Input.jsx";
import Field from "../molecules/Field.jsx";
import LoginCornice from "../templates/LoginCornice.jsx";
import useTemaLogin from "../theme/useTemaLogin.js";
import { useFaviconVuscom } from "../brand/Brand.jsx";
import { BASE_RECUPERO, postJson } from "./RecuperoPassword.jsx";

const MINIMO = 8;
const SENZA_RETE = "Errore di connessione al server.";

/** Message of a FastAPI error body: `detail` is a string or `{ messaggio }`. */
function messaggio(data, predefinito) {
  const d = data?.detail;
  if (typeof d === "string") return d;
  return d?.messaggio || predefinito;
}

/** «Rimandami l'email di registrazione»: shown inside the yellow «non_registrato» alert. */
export function RimandaInvito({ base = BASE_RECUPERO, login }) {
  const [loading, setLoading] = useState(false);
  const [esito, setEsito] = useState("");

  async function rimanda() {
    setLoading(true);
    try {
      const { data } = await postJson(`${base}/invito/rimanda`, { login });
      setEsito(data.message || messaggio(data, "Se l'account esiste, riceverai una nuova email."));
    } catch {
      setEsito(SENZA_RETE);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-3 space-y-2">
      {esito && <p>{esito}</p>}
      <Button size="sm" variant="secondary" loading={loading} disabled={Boolean(esito)} onClick={rimanda}>
        Rimandami l'email di registrazione
      </Button>
    </div>
  );
}

/** «Registrati» from the login: asks only the email; the answer is always the same sentence. */
export function RichiestaRegistrazione({ base = BASE_RECUPERO, onIndietro, ...cornice }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function invia(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await postJson(`${base}/registrati`, { email });
      setMessage(data.message || "Se l'indirizzo è abilitato, riceverai un'email per registrarti.");
    } catch {
      setError(SENZA_RETE);
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoginCornice {...cornice} subtitle="Registrati">
      <form className="space-y-5" onSubmit={invia}>
        {error && <Alert tone="danger">{error}</Alert>}
        {message ? (
          <Alert tone="success">{message}</Alert>
        ) : (
          <>
            <Field label="Email" hint="Ti invieremo un link per completare la registrazione.">
              <Input type="email" name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Field>
            <Button type="submit" size="lg" fullWidth loading={loading}>
              Invia
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

function Regola({ ok, children }) {
  const Icona = ok ? Check : Circle;
  return (
    <li className={`flex items-center gap-2 ${ok ? "text-success" : "text-muted-foreground"}`}>
      <Icona className="h-3.5 w-3.5" aria-hidden="true" />
      {children}
    </li>
  );
}

/**
 * Registration screen the invitation link opens (`/registrazione?token=…`).
 * `token` defaults to `?token=`; `onAccesso(rispostaDiLogin)` is the portal's login-success
 * callback; `onVaiAlLogin()` is the way back to the login (router-agnostic).
 */
export default function RegistrazionePage({
  base = BASE_RECUPERO,
  token = typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("token") || "",
  onAccesso,
  onVaiAlLogin,
  iconaPortale,
  ...cornice
}) {
  useTemaLogin();
  useFaviconVuscom(iconaPortale);
  const [invito, setInvito] = useState(null);
  const [errore, setErrore] = useState(token ? "" : "Link non valido: token mancante.");
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [password, setPassword] = useState("");
  const [conferma, setConferma] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    let vivo = true;
    fetch(`${base}/invito?token=${encodeURIComponent(token)}`, { headers: { Accept: "application/json" } })
      .then(async (r) => ({ ok: r.ok, data: await r.json().catch(() => ({})) }))
      .then(({ ok, data }) => {
        if (!vivo) return;
        if (!ok) return setErrore(messaggio(data, "Invito non valido."));
        setInvito(data);
        setNome(data.nome || "");
        setCognome(data.cognome || "");
      })
      .catch(() => vivo && setErrore(SENZA_RETE));
    return () => {
      vivo = false;
    };
  }, [base, token]);

  const lungaAbbastanza = password.length >= MINIMO;
  const uguali = password !== "" && password === conferma;
  const pronto = lungaAbbastanza && uguali && nome.trim() && cognome.trim();

  async function invia(e) {
    e.preventDefault();
    setErrore("");
    setLoading(true);
    try {
      const { ok, data } = await postJson(`${base}/registrazione`, {
        token,
        nome: nome.trim(),
        cognome: cognome.trim(),
        new_password: password,
        confirm_password: conferma,
      });
      if (!ok) return setErrore(messaggio(data, "Registrazione non riuscita."));
      await onAccesso?.(data);
    } catch {
      setErrore(SENZA_RETE);
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoginCornice {...cornice} subtitle="Completa la registrazione">
      {!invito ? (
        <div className="space-y-5">
          {errore ? <Alert tone="danger">{errore}</Alert> : <p className="text-center text-sm text-muted-foreground">Verifica dell'invito in corso…</p>}
          {errore && (
            <div className="text-center">
              <Button variant="link" onClick={onVaiAlLogin}>
                Vai al login
              </Button>
            </div>
          )}
        </div>
      ) : (
        <form className="space-y-5" onSubmit={invia}>
          {errore && <Alert tone="danger">{errore}</Alert>}
          <Field label="Email">
            <Input type="email" value={invito.email || ""} readOnly />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nome">
              <Input value={nome} onChange={(e) => setNome(e.target.value)} required />
            </Field>
            <Field label="Cognome">
              <Input value={cognome} onChange={(e) => setCognome(e.target.value)} required />
            </Field>
          </div>
          <Field label="Password">
            <Input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Field>
          <Field label="Conferma password">
            <Input type="password" autoComplete="new-password" value={conferma} onChange={(e) => setConferma(e.target.value)} required />
          </Field>
          <ul className="space-y-1 text-xs" aria-label="Regole della password">
            <Regola ok={lungaAbbastanza}>Almeno {MINIMO} caratteri</Regola>
            <Regola ok={uguali}>Le due password coincidono</Regola>
          </ul>
          <Button type="submit" size="lg" fullWidth loading={loading} disabled={!pronto}>
            Registrati ed entra
          </Button>
        </form>
      )}
    </LoginCornice>
  );
}
