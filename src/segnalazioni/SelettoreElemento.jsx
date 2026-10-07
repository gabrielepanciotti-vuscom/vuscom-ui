import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Crosshair } from "lucide-react";
import Button from "../atoms/Button.jsx";
import Kbd from "../atoms/Kbd.jsx";
import { IGNORA } from "./maschera.js";
import { leggiSegnala } from "./segnalaAttr.js";

const MAX_TESTO = 200;
const MAX_LIVELLI = 8;
const CLASSE_SEMPLICE = /^[a-zA-Z][\w-]*$/;

const breve = (testo) => {
  const una = String(testo ?? "")
    .replace(/\s+/g, " ")
    .trim();
  return una.length <= MAX_TESTO ? una : `${una.slice(0, MAX_TESTO - 1)}…`;
};

// One step of the path: tag, at most one readable class, nth-of-type when needed.
function passo(el) {
  const tag = el.tagName.toLowerCase();
  const classe = Array.from(el.classList).find((c) => CLASSE_SEMPLICE.test(c));
  let s = classe ? `${tag}.${classe}` : tag;
  const fratelli = el.parentElement
    ? Array.from(el.parentElement.children).filter(
        (f) => f.tagName === el.tagName,
      )
    : [];
  if (fratelli.length > 1) s += `:nth-of-type(${fratelli.indexOf(el) + 1})`;
  return s;
}

/** Shortest CSS path (up to 8 levels) that selects `el` and nothing else. */
export function selettoreBreve(el) {
  const doc = el.ownerDocument;
  const parti = [];
  let corrente = el;
  while (corrente && corrente.nodeType === 1 && parti.length < MAX_LIVELLI) {
    if (corrente.id && CLASSE_SEMPLICE.test(corrente.id)) {
      parti.unshift(`#${corrente.id}`);
    } else {
      parti.unshift(passo(corrente));
    }
    const s = parti.join(" > ");
    try {
      const trovati = doc.querySelectorAll(s);
      if (trovati.length === 1 && trovati[0] === el) return s;
    } catch {
      /* not a valid selector: keep climbing */
    }
    if (corrente.tagName === "BODY") break;
    corrente = corrente.parentElement;
  }
  return parti.join(" > ");
}

/**
 * What the report says about the picked element: the nearest `data-segnala`
 * ancestor's descriptor, or — when the page did not declare one — its text
 * (≤ 200 chars), a short CSS path and its rectangle.
 */
export function descriviElemento(el) {
  const area = el.closest?.("[data-segnala]");
  const letto = area ? leggiSegnala(area.getAttribute("data-segnala")) : null;
  if (letto) return { ...letto };
  const r = el.getBoundingClientRect();
  return {
    testo: breve(el.innerText || el.textContent),
    selettore: selettoreBreve(el),
    rect: {
      x: Math.round(r.x),
      y: Math.round(r.y),
      width: Math.round(r.width),
      height: Math.round(r.height),
    },
  };
}

// What the crosshair highlights: the element that the report would describe.
const bersaglioDi = (el) => el.closest("[data-segnala]") || el;

const elementoDi = (nodo) =>
  nodo?.nodeType === 1 ? nodo : (nodo?.parentElement ?? null);

/**
 * Crosshair mode: the element under the pointer is highlighted, a click picks
 * it, Esc cancels. Clicks never reach the page meanwhile. The bar offers
 * «Segnala senza elemento» for problems that are not about one element.
 */
export default function SelettoreElemento({ onScegli, onAnnulla }) {
  const [riquadro, setRiquadro] = useState(null);

  useEffect(() => {
    const radice = document.documentElement;
    const cursore = radice.style.cursor;
    radice.style.cursor = "crosshair";

    const nostro = (el) => !el || Boolean(el.closest(IGNORA));
    const muovi = (e) => {
      const el = elementoDi(e.target);
      if (nostro(el)) {
        setRiquadro(null);
        return;
      }
      const r = bersaglioDi(el).getBoundingClientRect();
      setRiquadro({
        top: r.top,
        left: r.left,
        width: r.width,
        height: r.height,
      });
    };
    // Window capture runs before anything the page listens to: the page
    // (and the action log) never see the picking click.
    const blocca = (e) => {
      if (nostro(elementoDi(e.target))) return;
      e.preventDefault();
      e.stopPropagation();
    };
    const clicca = (e) => {
      const el = elementoDi(e.target);
      if (nostro(el)) return;
      e.preventDefault();
      e.stopPropagation();
      onScegli(descriviElemento(el));
    };
    const tasto = (e) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopPropagation();
      onAnnulla();
    };
    const ascoltatori = [
      ["mousemove", muovi],
      ["pointerdown", blocca],
      ["mousedown", blocca],
      ["pointerup", blocca],
      ["mouseup", blocca],
      ["click", clicca],
      ["keydown", tasto],
    ];
    ascoltatori.forEach(([ev, fn]) => window.addEventListener(ev, fn, true));
    return () => {
      ascoltatori.forEach(([ev, fn]) =>
        window.removeEventListener(ev, fn, true),
      );
      radice.style.cursor = cursore;
    };
  }, [onScegli, onAnnulla]);

  return createPortal(
    <div data-segnala-ignora>
      {riquadro && (
        <div
          aria-hidden
          className="pointer-events-none fixed z-[70] rounded-md bg-primary/10 ring-2 ring-primary transition-all duration-75"
          style={{
            top: riquadro.top - 2,
            left: riquadro.left - 2,
            width: riquadro.width + 4,
            height: riquadro.height + 4,
          }}
        />
      )}
      <div
        role="toolbar"
        aria-label="Scegli l'elemento da segnalare"
        className="fixed bottom-6 left-1/2 z-[71] flex max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-wrap items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-card-foreground shadow-2xl ring-1 ring-black/5 animate-fade-in dark:ring-white/10"
      >
        <span className="flex items-center gap-2 font-medium">
          <Crosshair className="h-4 w-4 text-primary" aria-hidden />
          Clicca l'elemento che non va
        </span>
        <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
          <Kbd>Esc</Kbd> per annullare
        </span>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => onScegli(null)}>
            Segnala senza elemento
          </Button>
          <Button variant="ghost" size="sm" onClick={onAnnulla}>
            Annulla
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
