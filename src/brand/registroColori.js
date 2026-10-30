// Portal colours: the registered ones, and the automatic one for every other
// portal code. Pure module (no React, no images), so the conformity tester in
// bin/ can import it under plain Node and agree with the runtime on the colour.
//
// Gabriele, 30/10/2026: a portal never picks its colour by hand. It passes its
// code (`iconaPortale: "vicky"`) and gets a colour derived from the code, far
// enough from every registered portal and from the public navy that two
// portals can never look the same.

/**
 * Registered portals (Gabriele, 09/10/2026). A new portal does NOT need an entry
 * here: its colour comes from `coloreAutomatico`. Public portals keep the
 * original navy tile (Configuratore, which serves clients too, uses navy).
 */
export const COLORI_PORTALE = Object.freeze({
  offerte: "#2563eb", // portal blue, lighter than the public navy
  cruscotto: "#0f5c55", // petrol green
  outbound: "#7f1d1d", // bordeaux
  configuratore: "#1b3a69", // navy: it has public pages, and public is always the original navy
  dataapi: "#4c1d95", // violet (Data API admin, vuscom-db#89)
  braineditor: "#b45309", // amber (Brain Editor, BrainEditor#1)
});

/** Navy of the public portals: no portal colour may come close to it. */
export const NAVY_PUBBLICO = "#1b3a69";

/** Minimum RGB distance between two portal colours (same value as the tester). */
export const DISTANZA_MINIMA_COLORI = 60;

const CODICE = /^[a-z][a-z0-9_-]*$/;

/** True for a portal code usable as `iconaPortale` (lower-case slug). */
export function isCodicePortale(valore) {
  return typeof valore === "string" && CODICE.test(valore);
}

function rgbDa(hex) {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

/** Euclidean RGB distance between two `#rrggbb` colours. */
export function distanzaRgb(a, b) {
  const [x, y] = [rgbDa(a), rgbDa(b)];
  return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);
}

function hslHex(h, s, l) {
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return `#${[f(0), f(8), f(4)].map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("")}`;
}

// FNV-1a: stable across runtimes, so a code always gets the same colour.
function hash(testo) {
  let h = 0x811c9dc5;
  for (const c of testo) {
    h ^= c.codePointAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

// Fixed saturation/lightness: dark enough for the white V to stay readable.
const TONI = [
  [0.62, 0.32],
  [0.55, 0.26],
  [0.7, 0.38],
];

/**
 * The colour of a portal code: the registered one if there is one, otherwise a
 * deterministic colour (hue from the code's hash, walked by the golden angle)
 * at least DISTANZA_MINIMA_COLORI from every registered colour and the navy.
 * `null` for something that is not a portal code.
 */
export function coloreAutomatico(codice) {
  if (!isCodicePortale(codice)) return null;
  if (COLORI_PORTALE[codice]) return COLORI_PORTALE[codice];
  const occupati = [...Object.values(COLORI_PORTALE), NAVY_PUBBLICO];
  const partenza = hash(codice) % 360;
  for (const [s, l] of TONI)
    for (let i = 0; i < 360; i++) {
      const colore = hslHex((partenza + i * 137.508) % 360, s, l);
      if (occupati.every((o) => distanzaRgb(colore, o) >= DISTANZA_MINIMA_COLORI)) return colore;
    }
  return null; // unreachable with today's registry; the neutral V is the safe fallback
}
