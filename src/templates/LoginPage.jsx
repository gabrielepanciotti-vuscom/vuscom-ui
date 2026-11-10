import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import AccessoMicrosoft from "../accesso/AccessoMicrosoft.jsx";
import AltriPortali from "../accesso/AltriPortali.jsx";
import Alert from "../organisms/Alert.jsx";
import Checkbox from "../molecules/Checkbox.jsx";
import LoginCornice from "./LoginCornice.jsx";
import { RichiestaRecupero } from "../accesso/RecuperoPassword.jsx";
import useTemaLogin from "../theme/useTemaLogin.js";
import Button from "../atoms/Button.jsx";
import IconButton from "../atoms/IconButton.jsx";
import Input from "../atoms/Input.jsx";
import Field from "../molecules/Field.jsx";
import { LOGHI_VUSCOM, useFaviconVuscom } from "../brand/Brand.jsx";

/**
 * Common VUS COM login screen. `onSubmit(username, password)` must reject on failure.
 * `microsoft` (`{ onAccesso, base? }`) adds "Accedi con Microsoft", shown only
 * where the backend (`vuscom_auth.entra`) says it is available.
 * `altriPortali` (default on) shows «Accedi ad altri portali» with the portals of the
 * last user who logged in from this browser (see accesso/portali.js).
 * `ricordami` adds the «Ricordami» checkbox (choice kept in localStorage `rememberMe`) and passes it
 * as the third argument of `onSubmit`; `microsoft.onAccesso` is not touched, read it with
 * `localStorage.getItem("rememberMe") === "true"`. `recupero` (`true` or `{ base? }`, default
 * base `/api/auth`) adds «Password dimenticata?» and its screen (`vuscom_auth.recupero`); the
 * emailed link opens `ReimpostaPassword`. The saved/system theme is applied by the page itself.
 */
function leggiRicordami() {
  try {
    return localStorage.getItem("rememberMe") === "true";
  } catch {
    return false;
  }
}

export default function LoginPage({
  title,
  subtitle = "Accedi al tuo account",
  logoLight = LOGHI_VUSCOM.marchioChiaro,
  logoDark = LOGHI_VUSCOM.marchioScuro,
  onSubmit,
  usernameLabel = "Username o email",
  footer = "© VUS COM SRL",
  microsoft,
  iconaPortale,
  altriPortali = true,
  ricordami = false,
  recupero,
}) {
  const passwordId = useId();
  useFaviconVuscom(iconaPortale);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recuperoAperto, setRecuperoAperto] = useState(false);
  const [ricorda, setRicorda] = useState(
    () => typeof window !== "undefined" && leggiRicordami(),
  );
  useTemaLogin();

  function cambiaRicorda(v) {
    setRicorda(v);
    try {
      localStorage.setItem("rememberMe", String(v));
    } catch {
      /* storage blocked: the choice lasts for this page only */
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await (ricordami
        ? onSubmit(username, password, ricorda)
        : onSubmit(username, password));
    } catch (err) {
      setError(err?.message || "Accesso non riuscito");
    } finally {
      setLoading(false);
    }
  }

  if (recupero && recuperoAperto)
    return (
      <RichiestaRecupero
        base={recupero.base}
        title={title}
        logoLight={logoLight}
        logoDark={logoDark}
        onIndietro={() => setRecuperoAperto(false)}
      />
    );

  return (
    <LoginCornice
      title={title}
      subtitle={subtitle}
      logoLight={logoLight}
      logoDark={logoDark}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && <Alert tone="danger">{error}</Alert>}
        <Field label={usernameLabel}>
          <Input
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Field>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={passwordId}
            className="text-sm font-medium text-foreground"
          >
            Password
          </label>
          <div className="relative">
            <Input
              id={passwordId}
              name="password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-11"
              required
            />
            <IconButton
              icon={show ? EyeOff : Eye}
              label={show ? "Nascondi password" : "Mostra password"}
              size="sm"
              className="absolute right-1 top-1"
              onClick={() => setShow((s) => !s)}
            />
          </div>
        </div>
        {(ricordami || recupero) && (
          <div className="flex items-center justify-between gap-3">
            {ricordami ? (
              <Checkbox
                checked={ricorda}
                onChange={cambiaRicorda}
                label="Ricordami"
              />
            ) : (
              <span />
            )}
            {recupero && (
              <Button
                variant="link"
                size="sm"
                onClick={() => setRecuperoAperto(true)}
              >
                Password dimenticata?
              </Button>
            )}
          </div>
        )}
        <Button type="submit" size="lg" fullWidth loading={loading}>
          Accedi
        </Button>
      </form>
      {microsoft && <AccessoMicrosoft {...microsoft} />}
      {altriPortali && <AltriPortali corrente={iconaPortale} />}
      {footer && (
        <div className="text-center text-xs text-muted-foreground">
          {footer}
        </div>
      )}
    </LoginCornice>
  );
}
