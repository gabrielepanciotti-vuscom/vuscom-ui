import Input from "../atoms/Input.jsx";
import Field from "../molecules/Field.jsx";

export const EMAIL_VALIDA = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Who writes, for the anonymous report of the login page; plus the honeypot. */
export default function CampiAnonimi({
  email,
  onEmail,
  emailOk,
  nome,
  onNome,
  website,
  onWebsite,
}) {
  return (
    <>
      <Field
        label="La tua email"
        required
        hint="ti rispondiamo qui"
        error={
          email && !emailOk ? "Inserisci un indirizzo email valido" : undefined
        }
      >
        <Input
          data-autofocus
          type="email"
          autoComplete="email"
          maxLength={254}
          value={email}
          onChange={(e) => onEmail(e.target.value)}
          placeholder="nome@azienda.it"
        />
      </Field>
      <Field label="Il tuo nome" hint="facoltativo">
        <Input
          autoComplete="name"
          maxLength={120}
          value={nome}
          onChange={(e) => onNome(e.target.value)}
        />
      </Field>
      {/* Honeypot: invisible to people, bots fill it in. */}
      <div
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label>
          Sito web
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => onWebsite(e.target.value)}
          />
        </label>
      </div>
    </>
  );
}
