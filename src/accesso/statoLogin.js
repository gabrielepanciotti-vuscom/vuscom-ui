// Hand-off from the registration page to the login page when an invitation link no longer works.
// sessionStorage, not a URL: the email must never appear in an address, a log or a history entry,
// and the two pages need no shared router (see Registrazione.jsx, LoginPage.jsx).
const CHIAVE = "vuscomLoginStato";

/** `{ email?, avviso: "scaduto" | "registrato" }` for the next login page that opens. */
export function salvaStatoLogin(stato) {
  try {
    sessionStorage.setItem(CHIAVE, JSON.stringify(stato));
  } catch {
    /* storage blocked: the person lands on a plain login */
  }
}

/** Reads and clears the hand-off (one login page shows it, once). */
export function leggiStatoLogin() {
  try {
    const grezzo = sessionStorage.getItem(CHIAVE);
    sessionStorage.removeItem(CHIAVE);
    return grezzo ? JSON.parse(grezzo) : null;
  } catch {
    return null;
  }
}
