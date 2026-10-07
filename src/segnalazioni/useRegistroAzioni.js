import { useEffect, useRef } from "react";
import { IGNORA, MASCHERA, PRIVATO } from "./maschera.js";
import { leggiSegnala } from "./segnalaAttr.js";

const MAX_AZIONI = 200;
const MAX_MESSAGGIO = 500;
const MAX_ETICHETTA = 80;

const CONTROLLI =
  'button, a, input, textarea, select, label, [role="button"], [role="tab"], [role="menuitem"], [role="checkbox"], [role="switch"], [role="option"], [role="link"]';

const breve = (testo, max) => {
  const una = String(testo ?? "")
    .replace(/\s+/g, " ")
    .trim();
  return una.length <= max ? una : `${una.slice(0, max - 1)}…`;
};

/**
 * The URL as logged: path only, never the query string or the fragment (they
 * carry tokens, ids and search terms). Other origins keep their host.
 */
export function urlPulito(url, base) {
  try {
    const u = new URL(String(url), base);
    const stessa = base && u.origin === new URL(base).origin;
    return stessa ? u.pathname : `${u.origin}${u.pathname}`;
  } catch {
    return String(url).split(/[?#]/)[0];
  }
}

function testoMessaggio(argomenti) {
  return breve(
    argomenti
      .map((a) => {
        if (a instanceof Error) return a.message;
        if (typeof a === "string") return a;
        try {
          return JSON.stringify(a);
        } catch {
          return String(a);
        }
      })
      .join(" "),
    MAX_MESSAGGIO,
  );
}

function descriviClick(bersaglio) {
  const controllo = bersaglio.closest(CONTROLLI);
  const area = bersaglio.closest("[data-segnala]");
  const segnala = area ? leggiSegnala(area.getAttribute("data-segnala")) : null;
  const nomeArea = segnala ? segnala.nome || segnala.id : undefined;
  if (!controllo && nomeArea)
    return { elemento: nomeArea, fonte: "data-segnala" };
  const el = controllo || bersaglio;
  const tag = el.tagName.toLowerCase();
  // Never the value of a field: its label, name or placeholder instead.
  const etichetta =
    el.getAttribute("aria-label") ||
    (tag === "input" || tag === "textarea" || tag === "select"
      ? el.getAttribute("name") || el.getAttribute("placeholder") || tag
      : el.textContent) ||
    el.getAttribute("title") ||
    tag;
  // Private areas are masked always, even when the user later turns the mask off.
  const azione = {
    elemento: el.closest(PRIVATO) ? MASCHERA : breve(etichetta, MAX_ETICHETTA),
    fonte: "testo",
  };
  if (nomeArea) azione.area = nomeArea;
  return azione;
}

/**
 * Circular log of the last `max` user actions on `win`: page changes, clicks,
 * fetch/XHR requests (method, path, status, duration — never a body), console
 * errors and unhandled exceptions. Patches the globals until `stop()`.
 */
export function creaRegistroAzioni(
  win,
  { max = MAX_AZIONI, ignoraUrl = [] } = {},
) {
  const buffer = [];
  const base = win.location?.href;
  const ripristini = [];

  const aggiungi = (azione) => {
    buffer.push({ ts: new Date().toISOString(), ...azione });
    if (buffer.length > max) buffer.splice(0, buffer.length - max);
  };
  const ignorata = (url) => ignoraUrl.some((p) => p && url.startsWith(p));
  const durata = (inizio) => Math.round(performance.now() - inizio);

  // Replace obj[nome] and remember how to undo it, unless someone wrapped it after us.
  const sostituisci = (obj, nome, crea) => {
    const originale = obj?.[nome];
    if (typeof originale !== "function") return;
    const nuovo = crea(originale);
    obj[nome] = nuovo;
    ripristini.push(() => {
      if (obj[nome] === nuovo) obj[nome] = originale;
    });
  };
  const ascolta = (bersaglio, evento, fn, cattura = false) => {
    bersaglio?.addEventListener?.(evento, fn, cattura);
    ripristini.push(() =>
      bersaglio?.removeEventListener?.(evento, fn, cattura),
    );
  };

  const naviga = () =>
    aggiungi({ tipo: "navigazione", url: win.location?.pathname ?? "" });
  naviga();
  sostituisci(
    win.history,
    "pushState",
    (orig) =>
      function pushState(...args) {
        const esito = orig.apply(this, args);
        naviga();
        return esito;
      },
  );
  sostituisci(
    win.history,
    "replaceState",
    (orig) =>
      function replaceState(...args) {
        const esito = orig.apply(this, args);
        naviga();
        return esito;
      },
  );
  ascolta(win, "popstate", naviga);

  ascolta(
    win.document,
    "click",
    (e) => {
      const bersaglio =
        e.target?.nodeType === 1 ? e.target : e.target?.parentElement;
      if (!bersaglio || bersaglio.closest(IGNORA)) return;
      aggiungi({ tipo: "click", ...descriviClick(bersaglio) });
    },
    true,
  );

  sostituisci(
    win,
    "fetch",
    (orig) =>
      function fetch(input, init) {
        const grezzo =
          typeof input === "string" ? input : (input?.url ?? String(input));
        const url = urlPulito(grezzo, base);
        if (ignorata(url)) return orig.call(win, input, init);
        const metodo = String(
          init?.method || input?.method || "GET",
        ).toUpperCase();
        const inizio = performance.now();
        // Called synchronously, as the page expects; a sync throw becomes a rejection.
        return new Promise((risolvi) =>
          risolvi(orig.call(win, input, init)),
        ).then(
          (risposta) => {
            aggiungi({
              tipo: "richiesta",
              metodo,
              url,
              stato: risposta?.status ?? null,
              durata_ms: durata(inizio),
            });
            return risposta;
          },
          (errore) => {
            aggiungi({
              tipo: "richiesta",
              metodo,
              url,
              stato: null,
              durata_ms: durata(inizio),
              errore: errore?.name === "AbortError" ? "annullata" : "rete",
            });
            throw errore;
          },
        );
      },
  );

  const xhr = win.XMLHttpRequest?.prototype;
  const richiesteXhr = new WeakMap();
  sostituisci(
    xhr,
    "open",
    (orig) =>
      function open(metodo, url, ...resto) {
        richiesteXhr.set(this, {
          metodo: String(metodo || "GET").toUpperCase(),
          url: urlPulito(url, base),
        });
        return orig.call(this, metodo, url, ...resto);
      },
  );
  sostituisci(
    xhr,
    "send",
    (orig) =>
      function send(corpo) {
        const info = richiesteXhr.get(this);
        if (info && !ignorata(info.url)) {
          const inizio = performance.now();
          this.addEventListener("loadend", () =>
            aggiungi({
              tipo: "richiesta",
              ...info,
              stato: this.status || null,
              durata_ms: durata(inizio),
              ...(this.status ? {} : { errore: "rete" }),
            }),
          );
        }
        return orig.call(this, corpo);
      },
  );

  sostituisci(
    win.console,
    "error",
    (orig) =>
      function error(...args) {
        aggiungi({
          tipo: "errore",
          origine: "console",
          messaggio: testoMessaggio(args),
        });
        return orig.apply(this, args);
      },
  );
  ascolta(win, "error", (e) => {
    // Resource load errors (img, script) reach window in capture only: skip them.
    if (!e.message && !e.error) return;
    aggiungi({
      tipo: "errore",
      origine: "eccezione",
      messaggio: breve(e.message || e.error?.message, MAX_MESSAGGIO),
      sorgente: e.filename
        ? `${urlPulito(e.filename, base)}:${e.lineno ?? 0}`
        : undefined,
    });
  });
  ascolta(win, "unhandledrejection", (e) => {
    const motivo = e.reason;
    aggiungi({
      tipo: "errore",
      origine: "promessa",
      messaggio: breve(motivo?.message ?? String(motivo), MAX_MESSAGGIO),
    });
  });

  return {
    aggiungi,
    azioni: () => buffer.map((a) => ({ ...a })),
    stop: () => {
      while (ripristini.length) ripristini.pop()();
    },
  };
}

/** Starts the action log while `attivo`; returns a stable getter of the actions. */
export function useRegistroAzioni(attivo, { ignoraUrl = [] } = {}) {
  const registro = useRef(null);
  const chiaveIgnora = ignoraUrl.join("|");
  useEffect(() => {
    if (!attivo || typeof window === "undefined") return undefined;
    const r = creaRegistroAzioni(window, {
      ignoraUrl: chiaveIgnora.split("|"),
    });
    registro.current = r;
    return () => {
      r.stop();
      registro.current = null;
    };
  }, [attivo, chiaveIgnora]);
  const api = useRef({ azioni: () => registro.current?.azioni() ?? [] });
  return api.current;
}
