import { IGNORA, mascheraDom } from "./maschera.js";

// Under the portal's 4 MB per attachment, with room for the multipart envelope.
const MAX_BYTE = 3.5 * 1024 * 1024;
const SCROLL = "data-segnala-scroll";

const escluso = (nodo) =>
  !(
    nodo.nodeType === 1 &&
    typeof nodo.matches === "function" &&
    nodo.matches(IGNORA)
  );

/**
 * The clone the library renders keeps no scroll position, so a scrolled
 * panel (AppShell's <main>) would show its top instead of what the user
 * sees. Scrolled elements are tagged on the live page for the duration of the
 * capture; returns the undo.
 */
function marcaScroll(radice) {
  const marcati = [];
  const marca = (el, x, y) => {
    el.setAttribute(SCROLL, `${x},${y}`);
    marcati.push(el);
  };
  for (const el of [radice, ...radice.querySelectorAll("*")]) {
    if (el.scrollTop || el.scrollLeft) marca(el, el.scrollLeft, el.scrollTop);
  }
  // The window's own scroll lives on <html>, outside the captured <body>.
  if (radice === document.body && (window.scrollX || window.scrollY))
    marca(radice, window.scrollX, window.scrollY);
  return () => marcati.forEach((el) => el.removeAttribute(SCROLL));
}

// On the clone: shift the content of every tagged element by its scroll.
function applicaScroll(clone) {
  const sel = `[${SCROLL}]`;
  const nodi = [
    ...(clone.matches?.(sel) ? [clone] : []),
    ...(clone.querySelectorAll?.(sel) ?? []),
  ];
  for (const nodo of nodi) {
    const [x, y] = nodo.getAttribute(SCROLL).split(",").map(Number);
    nodo.removeAttribute(SCROLL);
    nodo.style.overflow = "hidden";
    for (const figlio of Array.from(nodo.children))
      figlio.style.translate = `${-x}px ${-y}px`;
  }
}

/**
 * Two PNG screenshots of the viewport as it is now: one with every text
 * masked, one with only the private elements masked. Both are taken up front
 * because the user picks «Maschera i dati» after the page is already covered
 * by the modal. Masking runs on the library's DOM clone, never on the live
 * page. modern-screenshot is loaded on demand, only when a report starts.
 */
export async function catturaSchermata(nodo = document.body) {
  const { domToBlob } = await import("modern-screenshot");
  const vista =
    nodo === document.body
      ? { width: window.innerWidth, height: window.innerHeight }
      : {};
  const scatta = async (tutto) => {
    const opzioni = (scale) => ({
      ...vista,
      type: "image/png",
      scale,
      filter: escluso,
      onCloneNode: (clone) => {
        applicaScroll(clone);
        mascheraDom(clone, { tutto });
      },
    });
    const blob = await domToBlob(nodo, opzioni(1));
    return blob.size <= MAX_BYTE ? blob : domToBlob(nodo, opzioni(0.5));
  };
  const smarca = marcaScroll(nodo);
  try {
    // One after the other: two full renders at once double the memory peak.
    const mascherato = await scatta(true);
    const privato = await scatta(false);
    return { mascherato, privato };
  } finally {
    smarca();
  }
}
