#!/usr/bin/env node
// Which portals are behind the latest @vuscom/ui tag? Reads each consumer's
// package-lock.json (paths from consumatori.json) and compares it with the
// newest local release tag. Built for a SessionStart hook: silent when every
// consumer is aligned, never writes anything but stdout, always exits 0 so a
// broken check can't block a session.
//
// Usage: node scripts/controlla-deriva.mjs
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { caricaConsumatori, git, RADICE_PROGETTI, RADICE_REPO, righe } from "./lib/io.mjs";
import { consumatoriIndietro, tagRilascio, versioneNelLock } from "./lib/rilascio.mjs";

function leggiVersione(consumatore) {
  try {
    const lock = JSON.parse(readFileSync(resolve(RADICE_PROGETTI, consumatore.frontend, "package-lock.json"), "utf8"));
    return versioneNelLock(lock);
  } catch {
    return null; // portal not checked out on this device: not drift, nothing to say
  }
}

try {
  const ultimo = tagRilascio(righe(git("tag", "--list", "v*")))[0];
  if (ultimo) {
    const installate = caricaConsumatori().map((c) => ({ ...c, versione: leggiVersione(c) }));
    const indietro = consumatoriIndietro(installate, ultimo);
    if (indietro.length) {
      console.log(`@vuscom/ui: ${indietro.length} portali indietro rispetto a ${ultimo}:`);
      for (const c of indietro) {
        console.log(`- ${c.nome}: v${c.versione} (agente ${c.agente})`);
        console.log(`  node ${RADICE_REPO}/scripts/rilascia-e-notifica.mjs ${ultimo} --da v${c.versione} --solo ${c.agente} --prova`);
      }
    }
  }
} catch (e) {
  console.log(`@vuscom/ui: controllo di deriva non riuscito (${e.message.split("\n")[0]})`);
}
