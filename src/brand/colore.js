// Runtime portal tile: the original navy tile with only the background
// recoloured, generated from a hex colour so a new portal needs no new image
// and no release.
//
// Technique: the V is NOT separable by a flat mask (its edges are anti-aliased
// and it carries coloured accents), so each pixel is remapped per channel with
// the linear map that sends the navy background to the new colour and keeps
// white fixed. For a pixel that is a blend of background and white this is
// exact, and accents shift proportionally instead of being cut out.
import vScuro from "./logo-v-scuro.png";

/** The navy of the original tile (also the public-portal colour). */
export const NAVY_ORIGINALE = Object.freeze([27, 58, 105]);

const HEX = /^#[0-9a-f]{6}$/i;

/** True for a well-formed `#rrggbb` string. */
export function isEsadecimale(valore) {
  return typeof valore === "string" && HEX.test(valore);
}

/** `#rrggbb` -> [r, g, b]. */
export function rgb(hex) {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

/**
 * Normalises what a portal may pass (`"offerte"`, `"#0e7490"`, `{ colore }`)
 * into `{ chiave }`, `{ colore }` (lower-case hex) or `null` (public/navy).
 * A malformed value never throws: it degrades to the neutral V.
 */
export function leggiPortale(spec) {
  if (!spec) return null;
  if (typeof spec === "object") return isEsadecimale(spec.colore) ? { colore: spec.colore.toLowerCase() } : null;
  if (typeof spec !== "string") return null;
  if (spec.startsWith("#")) return isEsadecimale(spec) ? { colore: spec.toLowerCase() } : null;
  return { chiave: spec };
}

/** Remaps RGBA pixels (in place) from the navy background to `nuovo` ([r,g,b]). */
export function ricolora(dati, nuovo, base = NAVY_ORIGINALE) {
  for (let i = 0; i < dati.length; i += 4)
    for (let c = 0; c < 3; c++) {
      const v = nuovo[c] + ((dati[i + c] - base[c]) * (255 - nuovo[c])) / (255 - base[c]);
      dati[i + c] = Math.max(0, Math.min(255, Math.round(v)));
    }
  return dati;
}

const cache = new Map(); // hex -> Promise<string|null>

/**
 * Data URL of the tile on `hex`, or `null` when there is no canvas/Image
 * (jsdom, SSR) or decoding fails: callers fall back to the neutral V. Cached
 * per colour, so it is computed once however many components ask.
 */
export function tesseraDaColore(hex) {
  const chiave = hex.toLowerCase();
  if (!cache.has(chiave)) cache.set(chiave, genera(chiave));
  return cache.get(chiave);
}

/** Test hook: forget generated tiles. */
export function svuotaCache() {
  cache.clear();
}

async function genera(hex) {
  try {
    if (typeof document === "undefined" || typeof Image === "undefined") return null;
    // jsdom has a canvas stub that logs "not implemented": treat it as no canvas.
    if (typeof navigator !== "undefined" && /jsdom/i.test(navigator.userAgent)) return null;
    const canvas = document.createElement("canvas");
    const ctx = typeof canvas.getContext === "function" ? canvas.getContext("2d") : null;
    if (!ctx) return null;
    const img = new Image();
    await new Promise((ok, ko) => {
      img.onload = ok;
      img.onerror = ko;
      img.src = vScuro;
    });
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    const immagine = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ricolora(immagine.data, rgb(hex));
    ctx.putImageData(immagine, 0, 0);
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}
