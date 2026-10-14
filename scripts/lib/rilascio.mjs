// Pure logic behind the release notification and the drift check: no git, no
// network, no filesystem, so every step can be tested with fake consumers.

// A consumer depends on what it imports, and each public entry is one built
// file in dist/ (bundled, so a change in an atom shows up in every entry that
// uses it). Diffing dist/ between two tags is therefore the exact answer to
// "which entries changed", with no import graph to maintain by hand.
const FILE_MODULO = {
  "dist/index.js": "index",
  "dist/utenti.js": "utenti",
  "dist/segnalazioni.js": "segnalazioni",
  "dist/grafici.js": "grafici",
  "dist/preset.cjs": "preset",
  "dist/theme.css": "theme",
};

export const MODULI = [...Object.values(FILE_MODULO), "conformita"];

/** Map the paths changed between two tags to the package modules they belong to. */
export function moduliCambiati(fileCambiati) {
  const moduli = new Set();
  for (const file of fileCambiati) {
    if (FILE_MODULO[file]) moduli.add(FILE_MODULO[file]);
    // The conformity tester runs inside every portal's test suite: a new rule
    // can turn a portal red, so it counts as a change like any component.
    else if (file.startsWith("bin/")) moduli.add("conformita");
  }
  return MODULI.filter((m) => moduli.has(m));
}

/**
 * True when sources changed but no built file did: the release was tagged
 * without `npm run build`, so portals installing it would get the old code
 * (it happened with v1.11.0, whose dist/ never received the change).
 */
export function buildDimenticata(fileCambiati) {
  const sorgenti = fileCambiati.some((f) => f.startsWith("src/"));
  const costruiti = fileCambiati.some((f) => f.startsWith("dist/"));
  return sorgenti && !costruiti;
}

/** Consumers whose `usa` intersects the changed modules, each with the modules that touch it. */
export function selezionaConsumatori(consumatori, moduli) {
  const cambiati = new Set(moduli);
  return consumatori
    .map((c) => ({ ...c, toccati: c.usa.filter((m) => cambiati.has(m)) }))
    .filter((c) => c.toccati.length > 0);
}

/** Fail loudly on a consumers file that would silently select nobody. */
export function validaConsumatori(dati) {
  const errori = [];
  const lista = dati?.consumatori;
  if (!Array.isArray(lista)) return ["manca l'elenco 'consumatori'"];
  const agenti = new Set();
  for (const [i, c] of lista.entries()) {
    const chi = c?.nome || `#${i}`;
    for (const campo of ["nome", "agente", "repo", "frontend"]) {
      if (typeof c?.[campo] !== "string" || !c[campo]) errori.push(`${chi}: manca '${campo}'`);
    }
    if (!Array.isArray(c?.usa) || c.usa.length === 0) errori.push(`${chi}: 'usa' vuoto`);
    else for (const m of c.usa) if (!MODULI.includes(m)) errori.push(`${chi}: modulo sconosciuto '${m}'`);
    if (c?.agente && agenti.has(c.agente)) errori.push(`${chi}: agente '${c.agente}' ripetuto`);
    agenti.add(c?.agente);
  }
  return errori;
}

/** Fill {{chiave}} placeholders; an unknown key is an error, not an empty string. */
export function compila(template, valori) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, chiave) => {
    if (!(chiave in valori)) throw new Error(`segnaposto senza valore: {{${chiave}}}`);
    return String(valori[chiave]);
  });
}

function parti(versione) {
  return String(versione).replace(/^v/, "").split(".").map(Number);
}

/** Semver compare on X.Y.Z (with or without the leading v). */
export function confrontaVersioni(a, b) {
  const [pa, pb] = [parti(a), parti(b)];
  for (let i = 0; i < 3; i++) if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
  return 0;
}

/** Release tags (vX.Y.Z only), newest first. */
export function tagRilascio(tags) {
  return tags.filter((t) => /^v\d+\.\d+\.\d+$/.test(t)).sort((a, b) => confrontaVersioni(b, a));
}

/** The release tag right before `tag`, or null for the first release. */
export function tagPrecedente(tags, tag) {
  return tagRilascio(tags).find((t) => confrontaVersioni(t, tag) < 0) ?? null;
}

/** Version of @vuscom/ui recorded in a package-lock.json (v2/v3 or v1 layout). */
export function versioneNelLock(lock) {
  return (
    lock?.packages?.["node_modules/@vuscom/ui"]?.version ??
    lock?.dependencies?.["@vuscom/ui"]?.version ??
    null
  );
}

/** Consumers whose installed version is behind `ultima`; unreadable ones are skipped by the caller. */
export function consumatoriIndietro(installate, ultima) {
  return installate.filter((c) => c.versione && confrontaVersioni(c.versione, ultima) < 0);
}
