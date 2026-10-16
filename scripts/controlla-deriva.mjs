#!/usr/bin/env node
// Which portals are behind the latest @vuscom/ui tag? Reads each consumer's
// package-lock.json (paths from consumatori.json) and compares it with the
// newest local release tag. Built for a SessionStart hook: silent when every
// consumer is aligned, never writes anything but stdout, always exits 0 so a
// broken check can't block a session.
//
// Usage: node scripts/controlla-deriva.mjs
import { caricaConsumatori, git, leggiStato, moduliTraTag, RADICE_REPO, righe, versioneInstallata } from "./lib/io.mjs";
import { pianoAggiornamenti, tagRilascio } from "./lib/rilascio.mjs";

try {
  const tags = righe(git("tag", "--list", "v*"));
  const ultimo = tagRilascio(tags)[0];
  if (ultimo) {
    const consumatori = caricaConsumatori();
    const versioni = Object.fromEntries(consumatori.map((c) => [c.agente, versioneInstallata(c)]));
    // Only portals whose used modules changed count as drift: a tag that touches
    // nothing they import leaves them silently behind, by design.
    const piano = pianoAggiornamenti({
      consumatori, versioni, ultima: ultimo, stato: leggiStato(),
      moduliTra: (base) => moduliTraTag(base, ultimo, tags),
    }).filter((p) => p.esito === "notifica" || p.esito === "attesa");
    if (piano.length) {
      console.log(`@vuscom/ui: ${piano.length} portali da aggiornare a ${ultimo}:`);
      for (const p of piano) {
        const stato = p.esito === "attesa" ? ` (ordine già inviato, prossimo dal ${p.fino.toISOString().slice(0, 10)})` : "";
        console.log(`- ${p.consumatore.nome}: v${p.base}, cambiato ${p.toccati.join(", ")}${stato}`);
      }
      if (piano.some((p) => p.esito === "notifica")) console.log(`  npm run notifica   (in ${RADICE_REPO}; --prova per vedere prima)`);
    }
  }
} catch (e) {
  console.log(`@vuscom/ui: controllo di deriva non riuscito (${e.message.split("\n")[0]})`);
}
