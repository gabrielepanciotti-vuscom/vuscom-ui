// Filesystem and git side of the release scripts, kept apart from the pure
// logic in rilascio.mjs.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validaConsumatori } from "./rilascio.mjs";

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
