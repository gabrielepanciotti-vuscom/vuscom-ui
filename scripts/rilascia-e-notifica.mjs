#!/usr/bin/env node
// Last step of a release: tell the portals that use what changed.
// Diffs the tag against the previous release, maps the changed files to package
// modules, picks the consumers whose `usa` intersects them, and opens ONE bus
// conversation per consumer (never one with everyone in copy) with the standard
// order from ordine-aggiornamento.md. Each conversation is then followed by
// hub_attendi.sh, detached, so the answer comes back without anyone remembering.
//
// Two modes.
//   Automatic (no tag, no --da): for each portal reads the version in its lockfile,
//   diffs THAT version against the newest tag, and orders an update only if a
//   module it uses changed. A portal ordered in the last 7 days is left alone
//   (--forza overrides), and the order always points at the newest tag, so
//   intermediate releases are skipped instead of announced one by one.
//   Manual (vX.Y.Z and/or --da): announce that tag to every portal using what
//   changed since the base, as at release time.
//
// Usage: node scripts/rilascia-e-notifica.mjs [vX.Y.Z] [--da vA.B.C] [--solo agente,...] [--prova] [--forza]
//   vX.Y.Z   tag to announce (default: the newest release tag)
//   --da     base of the diff (default: the release before vX.Y.Z)
//   --solo   only these agents
//   --prova  print what would be opened, send nothing
//   --forza  ignore the weekly pause (automatic mode)
import { execFileSync, spawn } from "node:child_process";
import { openSync, readFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { caricaConsumatori, git, leggiStato, moduliTraTag, RADICE_PROGETTI, RADICE_REPO, registraNotifica, righe, versioneInstallata } from "./lib/io.mjs";
import { buildDimenticata, compila, moduliCambiati, pianoAggiornamenti, selezionaConsumatori, tagPrecedente, tagRilascio } from "./lib/rilascio.mjs";

const SCRIPTS_CLAUDE = join(process.env.CLAUDE_CONFIG_DIR || join(homedir(), ".claude"), "scripts");

function argomenti(argv) {
  const opz = { prova: false, forza: false, da: null, solo: null, tag: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--prova") opz.prova = true;
    else if (a === "--forza") opz.forza = true;
    else if (a === "--da") opz.da = argv[++i];
    else if (a === "--solo") opz.solo = argv[++i]?.split(",").map((s) => s.trim());
    else if (/^v\d+\.\d+\.\d+$/.test(a)) opz.tag = a;
    else throw new Error(`argomento non riconosciuto: ${a}`);
  }
  return opz;
}

function apriConversazione(agente, oggetto, testo) {
  // hub_send.py reads the agent identity from ./.env, so it runs from the repo.
  const out = execFileSync("python3", [join(SCRIPTS_CLAUDE, "hub_send.py"), "new", "--to", agente, "--subject", oggetto, "--body", testo], {
    cwd: RADICE_REPO,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });
  const id = JSON.parse(out)?.id;
  if (!Number.isInteger(id)) throw new Error(`risposta del bus senza id per ${agente}`);
  return id;
}

function seguiConversazione(id) {
  // Detached: between checks only bash+sleep are alive, and it must outlive this script.
  const log = join(tmpdir(), `vuscom-ui-attendi-${id}.log`);
  const fd = openSync(log, "a");
  spawn(join(SCRIPTS_CLAUDE, "hub_attendi.sh"), [String(id), "5", "24"], {
    cwd: RADICE_REPO,
    detached: true,
    stdio: ["ignore", fd, fd],
  }).unref();
  return log;
}

function main() {
  const opz = argomenti(process.argv.slice(2));
  if (!opz.tag && !opz.da) return automatica(opz);
  const tags = righe(git("tag", "--list", "v*"));
  const tag = opz.tag ?? tagRilascio(tags)[0];
  if (!tag || !tags.includes(tag)) throw new Error(`tag ${tag ?? "(nessuno)"} non trovato`);
  const base = opz.da ?? tagPrecedente(tags, tag);
  if (!base) throw new Error(`nessun rilascio prima di ${tag}: indica la base con --da`);

  // Portals install from GitHub: announcing a tag that isn't pushed sends them to a 404.
  if (!opz.prova && !git("ls-remote", "--tags", "origin", `refs/tags/${tag}`)) {
    throw new Error(`il tag ${tag} non è su origin: git push origin ${tag}, poi rilancia`);
  }

  const cambiati = righe(git("diff", "--name-only", `${base}..${tag}`));
  if (buildDimenticata(cambiati)) {
    throw new Error(`${base}..${tag} cambia src/ ma non dist/: il tag è stato fatto senza npm run build`);
  }
  const moduli = moduliCambiati(cambiati);
  const commit = righe(git("log", "--format=- %s", `${base}..${tag}`)).join("\n") || "- (nessun commit)";
  let consumatori = selezionaConsumatori(caricaConsumatori(), moduli);
  if (opz.solo) consumatori = consumatori.filter((c) => opz.solo.includes(c.agente));

  console.log(`${base} → ${tag}: moduli cambiati ${moduli.join(", ") || "nessuno"}`);
  if (!consumatori.length) {
    console.log("Nessun portale usa i moduli cambiati: nessuna conversazione da aprire.");
    return;
  }

  emetti(consumatori.map((c) => ({ c, base, toccati: c.toccati })), tag, commit, opz);
}

function emetti(voci, tag, commit, opz) {
  const template = readFileSync(resolve(RADICE_REPO, "scripts/ordine-aggiornamento.md"), "utf8");
  for (const { c, base, toccati } of voci) {
    const oggetto = `Aggiorna @vuscom/ui a ${tag} (${c.nome})`;
    const testo = compila(template, {
      versione: tag,
      precedente: base,
      nome: c.nome,
      frontend: join(RADICE_PROGETTI, c.frontend),
      toccati: toccati.join(", "),
      commit,
    }).trim();
    if (opz.prova) {
      console.log(`\n=== ${c.agente} — ${oggetto}\n${testo}`);
      continue;
    }
    const id = apriConversazione(c.agente, oggetto, testo);
    registraNotifica(c.agente, tag, id);
    const log = seguiConversazione(id);
    console.log(`- ${c.nome}: conversazione #${id} con ${c.agente} (attesa in background, log ${log})`);
  }
  if (opz.prova) console.log(`\n--prova: ${voci.length} conversazioni NON aperte.`);
}

function automatica(opz) {
  const tags = righe(git("tag", "--list", "v*"));
  const ultima = tagRilascio(tags)[0];
  if (!ultima) throw new Error("nessun tag di rilascio");
  if (!opz.prova && !git("ls-remote", "--tags", "origin", `refs/tags/${ultima}`)) {
    throw new Error(`il tag ${ultima} non è su origin: git push origin ${ultima}, poi rilancia`);
  }
  let consumatori = caricaConsumatori();
  if (opz.solo) consumatori = consumatori.filter((c) => opz.solo.includes(c.agente));
  const piano = pianoAggiornamenti({
    consumatori,
    versioni: Object.fromEntries(consumatori.map((c) => [c.agente, versioneInstallata(c)])),
    ultima,
    moduliTra: (b) => moduliTraTag(b, ultima, tags),
    stato: opz.forza ? {} : leggiStato(),
  });
  for (const p of piano) {
    if (p.esito === "allineato") console.log(`= ${p.consumatore.nome}: già a ${ultima}`);
    if (p.esito === "nessuna-novita") console.log(`= ${p.consumatore.nome}: v${p.base}, nulla di ciò che usa è cambiato`);
    if (p.esito === "attesa") console.log(`= ${p.consumatore.nome}: ordine già inviato, prossimo dal ${p.fino.toISOString().slice(0, 10)} (--forza per anticipare)`);
  }
  const voci = piano.filter((p) => p.esito === "notifica").map((p) => ({ c: p.consumatore, base: `v${p.base}`, toccati: p.toccati, ultima }));
  if (!voci.length) return console.log("Nessun ordine da inviare.");
  for (const v of voci) {
    const commit = righe(git("log", "--format=- %s", `${v.base}..${ultima}`)).join("\n") || "- (nessun commit)";
    emetti([v], ultima, commit, opz);
  }
}

try {
  main();
} catch (e) {
  console.error(`rilascia-e-notifica: ${e.message}`);
  process.exit(1);
}
