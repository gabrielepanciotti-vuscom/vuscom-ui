import { useEffect } from "react";
// Bundled as data URLs (build.mjs): no asset pipeline in the consuming app, no
// file to copy into public/, nothing a portal can get wrong. Small on purpose:
// the V is ~2 KB, each wordmark ~7 KB.
import vChiaro from "./logo-v-chiaro.png";
import vScuro from "./logo-v-scuro.png";
import marchioChiaro from "./marchio-chiaro.png";
import marchioScuro from "./marchio-scuro.png";
// The original navy tile with only the background recoloured (same V, same
// position): one per internal portal.
import tesseraOfferte from "./tessera-offerte.png";
import tesseraCruscotto from "./tessera-cruscotto.png";
import tesseraOutbound from "./tessera-outbound.png";
import tesseraConfiguratore from "./tessera-configuratore.png";
import tesseraDataapi from "./tessera-dataapi.png";

/** The official VUS COM images, named by the theme they are for (not by their colour). */
export const LOGHI_VUSCOM = Object.freeze({
  vChiaro,
  vScuro,
  marchioChiaro,
  marchioScuro,
  favicon: vScuro,
});

/**
 * One tile colour per internal portal, so their icons (sidebar and browser
 * tab) tell them apart while staying the same V (Gabriele, 09/10/2026). Decided
 * here, not in each portal, so two portals can never pick the same colour. A new
 * portal gets a new entry here first. Portale Segnalazioni is public and keeps
 * the plain logo: it has no entry.
 */
export const TESSERE_PORTALE = Object.freeze({
  offerte: tesseraOfferte,
  cruscotto: tesseraCruscotto,
  outbound: tesseraOutbound,
  configuratore: tesseraConfiguratore,
  dataapi: tesseraDataapi,
});

export const COLORI_PORTALE = Object.freeze({
  offerte: "#1b3a69", // navy, the original tile
  cruscotto: "#0f5c55", // petrol green
  outbound: "#fcc72c", // vuscom.it yellow
  configuratore: "#7f1d1d", // bordeaux
  dataapi: "#4c1d95", // violet (Data API admin, vuscom-db#89)
});


/**
 * The V tile. With `portale` (a key of COLORI_PORTALE) it sits on that portal's
 * colour; without, the light/dark pair switched by the `dark` class.
 */
export function LogoV({ size = 34, className = "", portale }) {
  const tessera = portale && TESSERE_PORTALE[portale];
  if (tessera)
    return (
      <img
        src={tessera}
        alt="VUS COM"
        style={{ width: size, height: size }}
        data-portale={portale}
        className={`block rounded-[9px] object-contain ${className}`}
      />
    );
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
    impostaFavicon((portale && TESSERE_PORTALE[portale]) || LOGHI_VUSCOM.favicon);
  }, [portale]);
}
