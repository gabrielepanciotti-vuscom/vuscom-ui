#!/usr/bin/env node
// Conformity tester for VUS COM portals: is this frontend using @vuscom/ui the
// way every other portal does? Run it from the portal's frontend folder:
//
//   npx vuscom-ui-conformita            # table, exit 1 only on a blocking rule
//   npx vuscom-ui-conformita --json     # the shared tester contract
//
// The rules live in conformita-regole.json next to this file: changing what
// "standard" means is editing data, not this script. Each portal runs it in
// its own test suite, so a divergence is caught by the portal's owner, not by
// someone looking at screenshots.
//
// A portal with its own page structure (Portale Segnalazioni) declares it in
// package.json: "vuscomUi": { "struttura": "propria" }. Style rules still apply.

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const QUI = dirname(fileURLToPath(import.meta.url));
const REGOLE = JSON.parse(readFileSync(join(QUI, "conformita-regole.json"), "utf8"));
const PACCHETTO = JSON.parse(readFileSync(join(QUI, "..", "package.json"), "utf8"));
const RADICE = process.cwd();
const JSON_OUT = process.argv.includes("--json");
const OFFLINE = process.argv.includes("--offline");

// --- helpers -----------------------------------------------------------------

function leggi(p) {
  try {
    return readFileSync(p, "utf8");
  } catch {
    return null;
  }
}

function fileSorgente(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const nome of readdirSync(dir)) {
    if (nome === "node_modules" || nome.startsWith(".")) continue;
    const p = join(dir, nome);
    if (statSync(p).isDirectory()) {
      // Tests may legitimately mock or assert on anything.
      if (nome === "__tests__" || nome === "test" || nome === "tests") continue;
      fileSorgente(p, out);
    } else if (/\.(jsx?|tsx?|css)$/.test(nome) && !/\.test\.|\.spec\./.test(nome)) {
      out.push(p);
    }
  }
  return out;
}

function confronta(a, b) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
  return 0;
}

function ultimaVersione() {
  try {
    const out = execFileSync("git", ["ls-remote", "--tags", REGOLE.repo], {
      encoding: "utf8",
      timeout: 10000,
      stdio: ["ignore", "pipe", "ignore"],
    });
    const tag = [...out.matchAll(/refs\/tags\/v(\d+\.\d+\.\d+)$/gm)].map((m) => m[1]);
    return tag.sort(confronta).at(-1) || null;
  } catch {
    return null;
  }
}

// --- the checks ------------------------------------------------------------

const pkg = JSON.parse(leggi(join(RADICE, "package.json")) || "{}");
const struttura = pkg.vuscomUi?.struttura === "propria" ? "propria" : "appshell";
const sorgenti = fileSorgente(join(RADICE, "src")).map((p) => ({ p, testo: leggi(p) || "" }));
const tutto = (re) => sorgenti.filter(({ testo }) => re.test(testo));
const rel = (p) => relative(RADICE, p);

const trovati = []; // { codice, messaggio, evidenza?, esito? }
const fonti = [];
const segnala = (codice, messaggio, evidenza, esito = "difforme") =>
  trovati.push({ codice, messaggio, evidenza, esito });

// versione
const dichiarata = (pkg.dependencies?.["@vuscom/ui"] || "").match(/v?(\d+\.\d+\.\d+)/)?.[1];
if (!dichiarata) {
  segnala("versione-minima", "@vuscom/ui non è fra le dipendenze del progetto", "package.json");
} else {
  if (confronta(dichiarata, REGOLE.versione_minima) < 0)
    segnala(
      "versione-minima",
      `@vuscom/ui ${dichiarata}: serve almeno ${REGOLE.versione_minima} (colori, guida e icona del portale)`,
      "package.json",
    );
  const ultima = OFFLINE ? null : ultimaVersione();
  if (!ultima) fonti.push("tag di vuscom-ui (rete)");
  else if (confronta(dichiarata, ultima) < 0)
    segnala("versione-ultima", `@vuscom/ui ${dichiarata}, l'ultima è ${ultima}`, "package.json");
}

// preset + tema
const tailwind = ["tailwind.config.js", "tailwind.config.cjs", "tailwind.config.mjs", "tailwind.config.ts"]
  .map((f) => ({ f, testo: leggi(join(RADICE, f)) }))
  .find((x) => x.testo);
if (!tailwind || !tailwind.testo.includes("@vuscom/ui/preset"))
  segnala("preset", "Tailwind non usa il preset @vuscom/ui/preset", tailwind?.f || "tailwind.config.*");
if (!tutto(/@vuscom\/ui\/theme\.css/).length)
  segnala("tema-css", "nessun file importa @vuscom/ui/theme.css", "src/");

// colori
const token = new RegExp(`^\\s*--(${REGOLE.token_tema.join("|")})\\s*:`, "m");
for (const { p, testo } of sorgenti.filter(({ p }) => p.endsWith(".css")))
  if (token.test(testo)) segnala("token-ridefiniti", "il CSS del portale ridefinisce i token del tema VUS COM", rel(p));
for (const { p, testo } of sorgenti.filter(({ p }) => p.endsWith(".css"))) {
  // Only variables holding a colour: layout variables (widths, z-index) are fine.
  const colore = /^\s*(#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%)/i;
  const privati = [
    ...new Set(
      [...testo.matchAll(/^\s*--([a-z][\w-]*)\s*:([^;]*);/gm)].filter((m) => colore.test(m[2])).map((m) => m[1]),
    ),
  ].filter((n) => !REGOLE.token_tema.some((t) => new RegExp(`^(?:${t})$`).test(n)));
  if (privati.length)
    segnala(
      "palette-privata",
      `variabili di colore proprie (${privati.slice(0, 5).join(", ")}${privati.length > 5 ? "…" : ""}): usare primary/brand/success/warning/info del tema`,
      rel(p),
    );
}
if (tailwind && /\bcolors\s*:/.test(tailwind.testo))
  segnala("colori-tailwind", "tailwind.config definisce colori propri accanto al preset", tailwind.f);
const blu = tutto(new RegExp(`\\b(?:bg|text|border|ring|from|to|via|fill|stroke)-(?:${REGOLE.colori_vietati.join("|")})-\\d{2,3}\\b`));
if (blu.length)
  segnala(
    "colori-cablati",
    `${blu.length} file usano ${REGOLE.colori_vietati.join("/")} cablati al posto di primary/brand`,
    blu.slice(0, 5).map(({ p }) => rel(p)).join(", "),
  );

// struttura e marchio
if (struttura === "appshell" && !tutto(/\bAppShell\b[\s\S]*@vuscom\/ui|@vuscom\/ui[\s\S]*\bAppShell\b/).length)
  segnala("app-shell", "la pagina non è montata in AppShell di @vuscom/ui (sidebar comune)", "src/");
if (struttura === "appshell" && !tutto(/\bguida\s*:/).length)
  segnala("guida-generale", "la sidebar non ha la guida generale: passare `guida` (es. \"/guida\") nelle props della sidebar di AppShell", "src/");
if (struttura === "appshell") {
  const chiavi = [...new Set(sorgenti.flatMap(({ testo }) => [...testo.matchAll(/\biconaPortale\s*:\s*["'`](\w+)["'`]/g)].map((m) => m[1])))];
  if (!chiavi.length)
    segnala("icona-portale", `la sidebar non dice di che portale è: passare iconaPortale (${REGOLE.portali_interni.join(", ")}), che dà alla V il colore del portale`, "src/");
  for (const k of chiavi.filter((k) => !REGOLE.portali_interni.includes(k)))
    segnala("icona-portale", `iconaPortale "${k}" non è un portale noto: aggiungerlo prima a COLORI_PORTALE in @vuscom/ui (${REGOLE.portali_interni.join(", ")})`, "src/");
}
const icona = tutto(/\bappIcon\s*[:=]/);
if (icona.length)
  segnala("logo-proprio", "la sidebar riceve un appIcon proprio: il logo VUS COM lo mette AppShell", icona.map(({ p }) => rel(p)).join(", "));
const html = leggi(join(RADICE, "index.html")) || "";
if (/<link[^>]+rel=["'][^"']*icon/i.test(html))
  segnala("favicon-propria", "index.html dichiara una favicon propria: quella VUS COM la imposta AppShell/LoginPage", "index.html");
const loghiLogin = tutto(/<LoginPage[\s\S]*?logo(?:Light|Dark)=/);
if (loghiLogin.length)
  segnala("logo-login", "LoginPage riceve loghi propri: il marchio VUS COM è già il default", loghiLogin.map(({ p }) => rel(p)).join(", "));

// --- the contract ----------------------------------------------------------

const perCodice = Object.fromEntries(REGOLE.regole.map((r) => [r.codice, r]));
const difformita = trovati.map((t) => {
  const r = perCodice[t.codice];
  return {
    codice: t.codice,
    esito: t.esito,
    gravita: r.gravita,
    messaggio: t.messaggio,
    evidenza: t.evidenza,
    fonte: "standard portali VUS COM (@vuscom/ui)",
    intervento: "vuscom",
    da_validare: false,
  };
});
const bloccanti = difformita.filter((d) => d.gravita === "blocca");
const avvisi = difformita.filter((d) => d.gravita === "avvisa");
const esito = bloccanti.length ? "bloccante" : avvisi.length ? "avvisi" : "ok";
const risposta = {
  servizio: `vuscom-ui.conformita${pkg.name ? `.${pkg.name}` : ""}`,
  esito,
  collaudato: true,
  salto: null,
  struttura,
  regole: { versione: REGOLE.versione, totale: REGOLE.regole.length, da_validare: 0 },
  bloccanti,
  avvisi,
  fonti_non_disponibili: fonti,
  generato_il: new Date().toISOString(),
};

if (JSON_OUT) {
  console.log(JSON.stringify(risposta, null, 2));
} else {
  const segno = { ok: "OK", avvisi: "AVVISI", bloccante: "BLOCCANTE" }[esito];
  console.log(`Conformità @vuscom/ui (${PACCHETTO.version}) — ${segno}`);
  for (const d of [...bloccanti, ...avvisi])
    console.log(`  [${d.gravita === "blocca" ? "BLOCCA" : "avvisa"}] ${d.codice}: ${d.messaggio}${d.evidenza ? `  (${d.evidenza})` : ""}`);
  if (fonti.length) console.log(`  non verificato: ${fonti.join(", ")}`);
}
process.exit(bloccanti.length ? 1 : 0);
