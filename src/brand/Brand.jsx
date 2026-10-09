import { useEffect } from "react";
// Bundled as data URLs (build.mjs): no asset pipeline in the consuming app, no
// file to copy into public/, nothing a portal can get wrong. Small on purpose:
// the V is ~2 KB, each wordmark ~7 KB.
import vChiaro from "./logo-v-chiaro.png";
import vScuro from "./logo-v-scuro.png";
import marchioChiaro from "./marchio-chiaro.png";
import marchioScuro from "./marchio-scuro.png";
import vTrasparente from "./logo-v-trasparente.png";

/** The official VUS COM images, named by the theme they are for (not by their colour). */
export const LOGHI_VUSCOM = Object.freeze({
  vChiaro,
  vScuro,
  marchioChiaro,
  marchioScuro,
  favicon: vScuro,
  vTrasparente,
});

/**
 * One tile colour per internal portal, so their icons (sidebar and browser
 * tab) tell them apart while staying the same V (Gabriele, 09/10/2026). Decided
 * here, not in each portal, so two portals can never pick the same colour. A new
 * portal gets a new entry here first. Portale Segnalazioni is public and keeps
 * the plain logo: it has no entry.
 */
export const COLORI_PORTALE = Object.freeze({
  offerte: "#1b3a69", // navy, the original tile
  cruscotto: "#0f5c55", // petrol green
  outbound: "#fcc72c", // vuscom.it yellow
  configuratore: "#7f1d1d", // bordeaux
});

const coloreDi = (portale) => (portale ? COLORI_PORTALE[portale] : undefined);

/** The V on the portal's own tile colour. */
function TesseraPortale({ colore, size, className }) {
  return (
    <span
      className={`flex items-center justify-center rounded-[9px] ${className}`}
      style={{ width: size, height: size, backgroundColor: colore }}
      data-portale-colore={colore}
    >
      <img src={vTrasparente} alt="VUS COM" style={{ height: Math.round(size * 0.74) }} className="w-auto object-contain" />
    </span>
  );
}

/**
 * The V tile. With `portale` (a key of COLORI_PORTALE) it sits on that portal's
 * colour; without, the light/dark pair switched by the `dark` class.
 */
export function LogoV({ size = 34, className = "", portale }) {
  const colore = coloreDi(portale);
  if (colore) return <TesseraPortale colore={colore} size={size} className={className} />;
  const style = { width: size, height: size };
  return (
    <>
      <img src={vChiaro} alt="VUS COM" style={style} className={`block object-contain dark:hidden ${className}`} />
      <img
        src={vScuro}
        alt="VUS COM"
        style={style}
        className={`hidden rounded-[9px] object-contain dark:block ${className}`}
      />
    </>
  );
}

/** The "VUS COM — energia vicina" wordmark, light/dark pair. */
export function MarchioVuscom({ className = "h-12 w-auto" }) {
  return (
    <>
      <img src={marchioChiaro} alt="VUS COM" className={`${className} dark:hidden`} />
      <img src={marchioScuro} alt="VUS COM" className={`${className} hidden dark:block`} />
    </>
  );
}

/** Draws the portal tile as a PNG data URL for the tab icon; null where there is no canvas. */
function disegnaFavicon(colore) {
  return new Promise((resolve) => {
    // jsdom (the portals' tests) has no canvas and logs an error when asked for one.
    if (typeof navigator !== "undefined" && /jsdom/i.test(navigator.userAgent)) return resolve(null);
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext && canvas.getContext("2d");
      if (!ctx || !ctx.roundRect) return resolve(null);
      canvas.width = canvas.height = 64;
      ctx.fillStyle = colore;
      ctx.beginPath();
      ctx.roundRect(0, 0, 64, 64, 14);
      ctx.fill();
      const img = new Image();
      img.onload = () => {
        const h = 47;
        const w = (img.width / img.height) * h;
        ctx.drawImage(img, (64 - w) / 2, (64 - h) / 2, w, h);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => resolve(null);
      img.src = vTrasparente;
    } catch {
      resolve(null);
    }
  });
}

function impostaFavicon(href) {
  let link = document.querySelector('link[rel~="icon"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.type = "image/png";
  link.href = href;
}

/**
 * Sets the browser-tab icon to the VUS COM V. AppShell and LoginPage call it,
 * so every portal gets the same icon without shipping its own favicon file.
 * With `portale`, the V sits on that portal's colour (same as the sidebar).
 */
export function useFaviconVuscom(portale) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    impostaFavicon(LOGHI_VUSCOM.favicon);
    const colore = coloreDi(portale);
    if (!colore) return;
    let vivo = true;
    disegnaFavicon(colore).then((href) => {
      if (vivo && href) impostaFavicon(href);
    });
    return () => {
      vivo = false;
    };
  }, [portale]);
}
