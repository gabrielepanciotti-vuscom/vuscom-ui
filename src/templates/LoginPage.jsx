import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import AccessoMicrosoft from "../accesso/AccessoMicrosoft.jsx";
import AltriPortali from "../accesso/AltriPortali.jsx";
import Alert from "../organisms/Alert.jsx";
import Button from "../atoms/Button.jsx";
import IconButton from "../atoms/IconButton.jsx";
import Input from "../atoms/Input.jsx";
import Field from "../molecules/Field.jsx";
import ThemeToggle from "../theme/ThemeToggle.jsx";
import { LOGHI_VUSCOM, useFaviconVuscom } from "../brand/Brand.jsx";

/**
 * Common VUS COM login screen. `onSubmit(username, password)` must reject on failure.
 * `microsoft` (`{ onAccesso, base? }`) adds "Accedi con Microsoft", shown only
 * where the backend (`vuscom_auth.entra`) says it is available.
 * `altriPortali` (default on) shows «Accedi ad altri portali» with the portals of the
 * last user who logged in from this browser (see accesso/portali.js).
 */
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
}) {
  const passwordId = useId();
  useFaviconVuscom(iconaPortale);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit(username, password);
    } catch (err) {
      setError(err?.message || "Accesso non riuscito");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 px-4 dark:from-slate-900 dark:to-slate-800">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md space-y-8 rounded-xl bg-card p-8 shadow-2xl">
        <div className="text-center">
          <img
            src={logoLight}
            alt="VUS COM"
            className="mx-auto h-20 w-auto object-contain dark:hidden"
          />
          <img
            src={logoDark}
            alt="VUS COM"
            className="mx-auto hidden h-20 w-auto object-contain dark:block"
          />
          <h1 className="mt-6 text-3xl font-bold text-foreground">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        </div>
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
      </div>
    </div>
  );
}
