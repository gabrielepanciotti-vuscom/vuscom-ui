// Filesystem and git side of the release scripts, kept apart from the pure
// logic in rilascio.mjs.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { MODULI, moduliCambiati, validaConsumatori, versioneNelLock } from "./rilascio.mjs";

export const RADICE_REPO = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

// Consumer paths are relative to $VUSCOM_SRV; without it, the folder holding
// this repo — which is $VUSCOM_SRV on every device, since repos sit side by side.
export const RADICE_PROGETTI = process.env.VUSCOM_SRV || resolve(RADICE_REPO, "..");

export function caricaConsumatori(file = resolve(RADICE_REPO, "consumatori.json")) {
  const dati = JSON.parse(readFileSync(file, "utf8"));
  const errori = validaConsumatori(dati);
  if (errori.length) throw new Error(`consumatori.json non valido:\n- ${errori.join("\n- ")}`);
  return dati.consumatori;
}

export function git(...args) {
  return execFileSync("git", args, { cwd: RADICE_REPO, encoding: "utf8" }).trim();
}

export function righe(testo) {
  return testo.split("\n").map((r) => r.trim()).filter(Boolean);
}

// Per-device record of the last order sent to each portal (gitignored): it is
// what lets "one order a week, straight to the newest tag" hold across runs.
const FILE_STATO = resolve(RADICE_REPO, ".notifiche.json");

export function leggiStato() {
  return existsSync(FILE_STATO) ? JSON.parse(readFileSync(FILE_STATO, "utf8")) : {};
}

export function registraNotifica(agente, tag, conversazione) {
  const stato = leggiStato();
  stato[agente] = { tag, conversazione, quando: new Date().toISOString() };
  writeFileSync(FILE_STATO, JSON.stringify(stato, null, 2) + "\n");
}

/** Installed @vuscom/ui version of a consumer, from its package-lock.json; null when not checked out on this device. */
export function versioneInstallata(consumatore) {
  try {
    const lock = JSON.parse(readFileSync(resolve(RADICE_PROGETTI, consumatore.frontend, "package-lock.json"), "utf8"));
    return versioneNelLock(lock);
  } catch {
    return null;
  }
}

/** Modules changed between an installed version and `ultima`; a version with no local tag counts as "everything changed". */
export function moduliTraTag(base, ultima, tagsEsistenti) {
  const tag = `v${String(base).replace(/^v/, "")}`;
  if (!tagsEsistenti.includes(tag)) return MODULI;
  return moduliCambiati(righe(git("diff", "--name-only", `${tag}..${ultima}`)));
}
