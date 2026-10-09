import { useEffect } from "react";
// Bundled as data URLs (build.mjs): no asset pipeline in the consuming app, no
// file to copy into public/, nothing a portal can get wrong. Small on purpose:
// the V is ~2 KB, each wordmark ~7 KB.
import vChiaro from "./logo-v-chiaro.png";
import vScuro from "./logo-v-scuro.png";
import marchioChiaro from "./marchio-chiaro.png";
import marchioScuro from "./marchio-scuro.png";

/** The official VUS COM images, named by the theme they are for (not by their colour). */
export const LOGHI_VUSCOM = Object.freeze({
  vChiaro,
  vScuro,
  marchioChiaro,
  marchioScuro,
  favicon: vScuro,
});

/** The V tile, light/dark pair switched by the `dark` class: no JS, no flash. */
export function LogoV({ size = 34, className = "" }) {
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

/**
 * Sets the browser-tab icon to the VUS COM V. AppShell and LoginPage call it,
 * so every portal gets the same icon without shipping its own favicon file.
 */
export function useFaviconVuscom() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    let link = document.querySelector('link[rel~="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.type = "image/png";
    link.href = LOGHI_VUSCOM.favicon;
  }, []);
}
