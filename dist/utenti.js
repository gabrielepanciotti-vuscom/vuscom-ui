// src/utenti/GestioneUtenti.jsx
import { useMemo, useState as useState10 } from "react";
import { AlertCircle as AlertCircle2, Search as Search2, UserPlus, Users } from "lucide-react";

// src/utenti/TabellaUtenti.jsx
import { KeyRound, Pencil, RotateCcw, Trash2, UserMinus, UserX } from "lucide-react";

// src/utenti/ruoli.js
var RUOLI = ["viewer", "manager", "admin", "superadmin"];
var LIVELLO = { viewer: 1, manager: 2, admin: 3, superadmin: 4 };
var ETICHETTE_PORTALE = {
  offerte: "Hub Offerte",
  cruscotto: "Cruscotto",
  outbound: "Outbound"
};
function livello(ruolo) {
  return LIVELLO[ruolo] || 0;
}
function ruoliAssegnabili(ruoloAttore) {
  const lv = livello(ruoloAttore);
  if (lv >= LIVELLO.superadmin) return [...RUOLI];
  const tetto = Math.min(lv, LIVELLO.admin);
  return RUOLI.filter((r) => livello(r) <= tetto);
}
function etichettaPortale(portale) {
  return ETICHETTE_PORTALE[portale] || portale;
}

// src/utenti/BadgePortale.jsx
import { jsx, jsxs } from "react/jsx-runtime";
var RUOLO_COLORE = {
  superadmin: "bg-purple-50 text-purple-700 ring-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:ring-purple-500/30",
  admin: "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/30",
  manager: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30",
  viewer: "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-white/[0.06] dark:text-slate-300 dark:ring-white/10"
};
var pillola = "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset";
function BadgeRuolo({ ruolo }) {
  if (!ruolo) return /* @__PURE__ */ jsx("span", { className: "text-slate-400 dark:text-slate-500", children: "\u2014" });
  return /* @__PURE__ */ jsx("span", { className: `${pillola} capitalize ${RUOLO_COLORE[ruolo] || RUOLO_COLORE.viewer}`, children: ruolo });
}
function BadgePortale({ portale, ruolo }) {
  return /* @__PURE__ */ jsxs("span", { className: `${pillola} ${RUOLO_COLORE[ruolo] || RUOLO_COLORE.viewer}`, children: [
    etichettaPortale(portale),
    ruolo && /* @__PURE__ */ jsxs("span", { className: "opacity-70", children: [
      "\xB7 ",
      ruolo
    ] })
  ] });
}
function ElencoPortali({ portali }) {
  if (!portali?.length) return /* @__PURE__ */ jsx("span", { className: "text-slate-400 dark:text-slate-500", children: "\u2014" });
  return /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: portali.map((p) => /* @__PURE__ */ jsx(BadgePortale, { portale: p.portale, ruolo: p.ruolo }, p.portale)) });
}

// src/utenti/stili.js
var base = "inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
var BOTTONE = {
  primario: `${base} bg-blue-600 text-white shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400`,
  secondario: `${base} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]`,
  pericolo: `${base} bg-red-600 text-white shadow-sm hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400`
};
var ICONA_AZIONE = "inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 dark:text-slate-500 dark:hover:bg-white/[0.06] dark:hover:text-slate-200";
var INPUT = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-800 placeholder:text-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-400";
var ETICHETTA = "mb-1 block text-[12px] font-medium text-slate-600 dark:text-slate-300";

// src/utenti/formato.js
function messaggioErrore(err) {
  const detail = err?.body?.detail;
  if (typeof detail === "string") return detail;
  if (detail && typeof detail.messaggio === "string") return detail.messaggio;
  if (Array.isArray(detail) && detail.length) {
    return detail.map((d) => d?.msg || String(d)).join("; ");
  }
  return err?.message || "Errore imprevisto";
}
function nomeCompleto(utente) {
  const n = [utente?.nome, utente?.cognome].filter(Boolean).join(" ");
  return n || "\u2014";
}
var due = (n) => String(n).padStart(2, "0");
function formattaAccesso(iso) {
  if (!iso) return "mai";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "mai";
  return `${due(d.getDate())}/${due(d.getMonth() + 1)}/${d.getFullYear()} ${due(d.getHours())}:${due(d.getMinutes())}`;
}
function testoONull(valore) {
  const v = (valore || "").trim();
  return v || null;
}

// src/utenti/TabellaUtenti.jsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var COLONNE = ["Nome", "Username", "Email", "Ruolo", "Altri portali", "Ultimo accesso", "Stato", ""];
var CELLA = "px-3 py-2.5 align-middle";
function Azione({ titolo, icona: Icona, onClick, pericolo }) {
  return /* @__PURE__ */ jsx2(
    "button",
    {
      type: "button",
      title: titolo,
      "aria-label": titolo,
      onClick,
      className: `${ICONA_AZIONE} ${pericolo ? "hover:!bg-red-50 hover:!text-red-600 dark:hover:!bg-red-500/10 dark:hover:!text-red-400" : ""}`,
      children: /* @__PURE__ */ jsx2(Icona, { className: "h-4 w-4" })
    }
  );
}
function Stato({ attivo }) {
  return /* @__PURE__ */ jsxs2("span", { className: "inline-flex items-center gap-1.5 text-[12px] text-slate-600 dark:text-slate-300", children: [
    /* @__PURE__ */ jsx2("span", { className: `h-1.5 w-1.5 rounded-full ${attivo ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}` }),
    attivo ? "Attivo" : "Disattivato"
  ] });
}
function RigaScheletro() {
  return /* @__PURE__ */ jsx2("tr", { className: "animate-pulse", children: COLONNE.map((c, i) => /* @__PURE__ */ jsx2("td", { className: CELLA, children: /* @__PURE__ */ jsx2("div", { className: "h-3.5 rounded bg-slate-100 dark:bg-white/[0.06]", style: { width: `${50 + i * 17 % 40}%` } }) }, i)) });
}
function TabellaUtenti({ utenti, caricando, attore, onAzione }) {
  const adminPlus = livello(attore?.ruolo) >= LIVELLO.admin;
  return /* @__PURE__ */ jsx2("div", { className: "overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900", children: /* @__PURE__ */ jsxs2("table", { className: "min-w-full text-left text-[13px]", children: [
    /* @__PURE__ */ jsx2("thead", { className: "border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-slate-400", children: /* @__PURE__ */ jsx2("tr", { children: COLONNE.map((c, i) => /* @__PURE__ */ jsx2("th", { scope: "col", className: `${CELLA} ${i === COLONNE.length - 1 ? "text-right" : ""}`, children: c || /* @__PURE__ */ jsx2("span", { className: "sr-only", children: "Azioni" }) }, i)) }) }),
    /* @__PURE__ */ jsxs2("tbody", { className: "divide-y divide-slate-100 dark:divide-white/[0.06]", children: [
      caricando && utenti.length === 0 && [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsx2(RigaScheletro, {}, i)),
      utenti.map((u) => {
        const io = u.id === attore?.id;
        return /* @__PURE__ */ jsxs2(
          "tr",
          {
            className: `transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.02] ${u.is_active ? "" : "opacity-60"}`,
            children: [
              /* @__PURE__ */ jsxs2("td", { className: `${CELLA} font-medium text-slate-800 dark:text-slate-100`, children: [
                nomeCompleto(u),
                io && /* @__PURE__ */ jsx2("span", { className: "ml-1.5 text-[11px] font-normal text-slate-400", children: "(tu)" })
              ] }),
              /* @__PURE__ */ jsx2("td", { className: `${CELLA} text-slate-600 dark:text-slate-300`, children: u.username }),
              /* @__PURE__ */ jsx2("td", { className: `${CELLA} text-slate-600 dark:text-slate-300`, children: u.email || "\u2014" }),
              /* @__PURE__ */ jsx2("td", { className: CELLA, children: /* @__PURE__ */ jsx2(BadgeRuolo, { ruolo: u.ruolo }) }),
              /* @__PURE__ */ jsx2("td", { className: CELLA, children: /* @__PURE__ */ jsx2(ElencoPortali, { portali: u.altri_portali }) }),
              /* @__PURE__ */ jsx2("td", { className: `${CELLA} whitespace-nowrap text-slate-500 dark:text-slate-400`, children: formattaAccesso(u.last_login) }),
              /* @__PURE__ */ jsx2("td", { className: CELLA, children: /* @__PURE__ */ jsx2(Stato, { attivo: u.is_active }) }),
              /* @__PURE__ */ jsx2("td", { className: `${CELLA} whitespace-nowrap text-right`, children: /* @__PURE__ */ jsxs2("div", { className: "inline-flex gap-0.5", children: [
                /* @__PURE__ */ jsx2(Azione, { titolo: "Modifica", icona: Pencil, onClick: () => onAzione("modifica", u) }),
                /* @__PURE__ */ jsx2(Azione, { titolo: "Password", icona: KeyRound, onClick: () => onAzione("password", u) }),
                !io && /* @__PURE__ */ jsx2(Azione, { titolo: "Togli accesso", icona: UserMinus, onClick: () => onAzione("togli", u) }),
                !io && adminPlus && u.is_active && /* @__PURE__ */ jsx2(Azione, { titolo: "Disattiva", icona: UserX, onClick: () => onAzione("disattiva", u) }),
                !io && adminPlus && !u.is_active && /* @__PURE__ */ jsx2(Azione, { titolo: "Riattiva", icona: RotateCcw, onClick: () => onAzione("riattiva", u) }),
                !io && adminPlus && /* @__PURE__ */ jsx2(Azione, { titolo: "Elimina", icona: Trash2, pericolo: true, onClick: () => onAzione("elimina", u) })
              ] }) })
            ]
          },
          u.id
        );
      })
    ] })
  ] }) });
}

// src/utenti/Interruttore.jsx
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
function Interruttore({ attivo, onCambia, etichetta }) {
  return /* @__PURE__ */ jsxs3(
    "button",
    {
      type: "button",
      role: "switch",
      "aria-checked": attivo,
      onClick: () => onCambia(!attivo),
      className: "group inline-flex items-center gap-2 text-[13px] text-slate-600 focus:outline-none dark:text-slate-300",
      children: [
        /* @__PURE__ */ jsx3(
          "span",
          {
            className: `relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-200 group-focus-visible:ring-2 group-focus-visible:ring-blue-500/60 ${attivo ? "bg-blue-600 dark:bg-blue-500" : "bg-slate-300 dark:bg-white/15"}`,
            children: /* @__PURE__ */ jsx3(
              "span",
              {
                className: `inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${attivo ? "translate-x-[18px]" : "translate-x-0.5"}`
              }
            )
          }
        ),
        etichetta
      ]
    }
  );
}

// src/utenti/FinestraNuovoUtente.jsx
import { useState as useState3 } from "react";
import { UserCheck } from "lucide-react";

// src/utenti/Finestra.jsx
import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var FOCUSABILI = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
function Finestra({ titolo, onChiudi, children, piede, larghezza = "max-w-lg" }) {
  const pannello = useRef(null);
  const idTitolo = useId();
  const chiudiRef = useRef(onChiudi);
  chiudiRef.current = onChiudi;
  useEffect(() => {
    const prima = document.activeElement;
    const nodo = pannello.current;
    const iniziale = nodo?.querySelector("[autofocus]") || nodo?.querySelector(FOCUSABILI);
    (iniziale || nodo)?.focus();
    return () => prima?.focus?.();
  }, []);
  function tasto(e) {
    if (e.key === "Escape") {
      e.stopPropagation();
      chiudiRef.current?.();
      return;
    }
    if (e.key !== "Tab") return;
    const elementi = Array.from(pannello.current?.querySelectorAll(FOCUSABILI) || []);
    if (!elementi.length) return;
    const primo = elementi[0];
    const ultimo = elementi[elementi.length - 1];
    if (e.shiftKey && document.activeElement === primo) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primo.focus();
    }
  }
  return /* @__PURE__ */ jsxs4(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      onKeyDown: tasto,
      children: [
        /* @__PURE__ */ jsx4(
          "div",
          {
            className: "absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] dark:bg-black/60",
            onMouseDown: () => chiudiRef.current?.(),
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxs4(
          "div",
          {
            ref: pannello,
            role: "dialog",
            "aria-modal": "true",
            "aria-labelledby": idTitolo,
            tabIndex: -1,
            className: `relative flex max-h-[90vh] w-full ${larghezza} flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl focus:outline-none dark:border-white/10 dark:bg-slate-900`,
            children: [
              /* @__PURE__ */ jsxs4("div", { className: "flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-white/[0.06]", children: [
                /* @__PURE__ */ jsx4("h2", { id: idTitolo, className: "text-[15px] font-semibold text-slate-800 dark:text-slate-100", children: titolo }),
                /* @__PURE__ */ jsx4(
                  "button",
                  {
                    type: "button",
                    onClick: () => chiudiRef.current?.(),
                    "aria-label": "Chiudi finestra",
                    className: "rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/[0.06] dark:hover:text-slate-200",
                    children: /* @__PURE__ */ jsx4(X, { className: "h-4 w-4" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsx4("div", { className: "flex-1 space-y-4 overflow-y-auto px-5 py-4", children }),
              piede && /* @__PURE__ */ jsx4("div", { className: "flex justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3 dark:border-white/[0.06] dark:bg-white/[0.02]", children: piede })
            ]
          }
        )
      ]
    }
  );
}

// src/utenti/SelettoreRuolo.jsx
import { useRef as useRef2 } from "react";
import { jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
function SelettoreRuolo({ ruoli, valore, onCambia, etichetta = "Ruolo" }) {
  const gruppo = useRef2(null);
  function tasto(e, indice) {
    const passo = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!passo) return;
    e.preventDefault();
    const prossimo = (indice + passo + ruoli.length) % ruoli.length;
    onCambia(ruoli[prossimo]);
    gruppo.current?.querySelectorAll('[role="radio"]')[prossimo]?.focus();
  }
  return /* @__PURE__ */ jsxs5("div", { children: [
    /* @__PURE__ */ jsx5("span", { className: "mb-1 block text-[12px] font-medium text-slate-600 dark:text-slate-300", children: etichetta }),
    /* @__PURE__ */ jsx5(
      "div",
      {
        ref: gruppo,
        role: "radiogroup",
        "aria-label": etichetta,
        className: "inline-flex flex-wrap gap-0.5 rounded-lg bg-slate-100 p-0.5 dark:bg-white/[0.06]",
        children: ruoli.map((r, i) => {
          const scelto = r === valore;
          return /* @__PURE__ */ jsx5(
            "button",
            {
              type: "button",
              role: "radio",
              "aria-checked": scelto,
              tabIndex: scelto || !valore && i === 0 ? 0 : -1,
              onClick: () => onCambia(r),
              onKeyDown: (e) => tasto(e, i),
              className: `rounded-md px-3 py-1.5 text-[12.5px] font-medium capitalize transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 ${scelto ? "bg-white text-blue-700 shadow-sm dark:bg-slate-800 dark:text-blue-300" : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"}`,
              children: r
            },
            r
          );
        })
      }
    )
  ] });
}

// src/utenti/PasswordMostrata.jsx
import { useState } from "react";
import { Check, Copy, KeyRound as KeyRound2 } from "lucide-react";
import { jsx as jsx6, jsxs as jsxs6 } from "react/jsx-runtime";
function PasswordMostrata({ password }) {
  const [copiata, setCopiata] = useState(false);
  async function copia() {
    try {
      await navigator.clipboard.writeText(password);
      setCopiata(true);
      setTimeout(() => setCopiata(false), 2e3);
    } catch {
      setCopiata(false);
    }
  }
  return /* @__PURE__ */ jsxs6("div", { className: "space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-500/30 dark:bg-amber-500/10", children: [
    /* @__PURE__ */ jsxs6("p", { className: "flex items-center gap-1.5 text-[12.5px] font-medium text-amber-800 dark:text-amber-300", children: [
      /* @__PURE__ */ jsx6(KeyRound2, { className: "h-4 w-4" }),
      "Password generata: viene mostrata una sola volta, consegnala tu alla persona."
    ] }),
    /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx6("code", { className: "flex-1 select-all rounded-md bg-white px-3 py-2 font-mono text-[13px] text-slate-800 ring-1 ring-amber-200 dark:bg-slate-900 dark:text-slate-100 dark:ring-amber-500/30", children: password }),
      /* @__PURE__ */ jsxs6("button", { type: "button", onClick: copia, className: BOTTONE.secondario, children: [
        copiata ? /* @__PURE__ */ jsx6(Check, { className: "h-4 w-4 text-emerald-600" }) : /* @__PURE__ */ jsx6(Copy, { className: "h-4 w-4" }),
        copiata ? "Copiata" : "Copia"
      ] })
    ] })
  ] });
}

// src/utenti/Campo.jsx
import { useId as useId2 } from "react";
import { AlertCircle, Info } from "lucide-react";
import { jsx as jsx7, jsxs as jsxs7 } from "react/jsx-runtime";
function Campo({ etichetta, valore, onCambia, tipo = "text", nota, autoFocus, ...resto }) {
  const id = useId2();
  return /* @__PURE__ */ jsxs7("div", { children: [
    /* @__PURE__ */ jsx7("label", { htmlFor: id, className: ETICHETTA, children: etichetta }),
    /* @__PURE__ */ jsx7(
      "input",
      {
        id,
        type: tipo,
        value: valore,
        onChange: (e) => onCambia(e.target.value),
        autoFocus,
        className: INPUT,
        ...resto
      }
    ),
    nota && /* @__PURE__ */ jsx7("p", { className: "mt-1 text-[11px] text-slate-500 dark:text-slate-400", children: nota })
  ] });
}
function MessaggioErrore({ children }) {
  if (!children) return null;
  return /* @__PURE__ */ jsxs7(
    "div",
    {
      role: "alert",
      className: "flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12.5px] text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300",
      children: [
        /* @__PURE__ */ jsx7(AlertCircle, { className: "mt-0.5 h-4 w-4 flex-shrink-0" }),
        /* @__PURE__ */ jsx7("span", { children })
      ]
    }
  );
}
function Nota({ children }) {
  return /* @__PURE__ */ jsxs7("div", { className: "flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-[12px] text-slate-600 dark:bg-white/[0.04] dark:text-slate-400", children: [
    /* @__PURE__ */ jsx7(Info, { className: "mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-400 dark:text-slate-500" }),
    /* @__PURE__ */ jsx7("span", { children })
  ] });
}

// src/utenti/useAzione.js
import { useCallback, useEffect as useEffect2, useRef as useRef3, useState as useState2 } from "react";
function useAzione() {
  const [inCorso, setInCorso] = useState2(false);
  const [errore, setErrore] = useState2(null);
  const montato = useRef3(true);
  useEffect2(() => {
    montato.current = true;
    return () => {
      montato.current = false;
    };
  }, []);
  const esegui = useCallback(async (fn, gestisci) => {
    setInCorso(true);
    setErrore(null);
    try {
      return { ok: true, valore: await fn() };
    } catch (err) {
      if (montato.current && !gestisci?.(err)) setErrore(messaggioErrore(err));
      return { ok: false, err };
    } finally {
      if (montato.current) setInCorso(false);
    }
  }, []);
  return { inCorso, errore, setErrore, esegui };
}

// src/utenti/FinestraNuovoUtente.jsx
import { Fragment, jsx as jsx8, jsxs as jsxs8 } from "react/jsx-runtime";
var NOTA_SESSIONI = "Dare l'accesso chiude le sessioni della persona su tutti i portali: dovr\xE0 rifare il login.";
function PersonaEsistente({ utente, nomePortale, onDaiAccesso, inCorso, selettore }) {
  let stato = null;
  if (utente.ruolo) stato = "Ha gi\xE0 accesso a questo portale.";
  else if (!utente.is_active) stato = "L'account \xE8 disattivato: riattivalo prima di dargli accesso.";
  return /* @__PURE__ */ jsxs8("div", { className: "space-y-3 rounded-lg border border-blue-200 bg-blue-50/60 p-4 dark:border-blue-500/30 dark:bg-blue-500/10", children: [
    /* @__PURE__ */ jsxs8("p", { className: "flex items-center gap-2 text-[14px] font-semibold text-slate-800 dark:text-slate-100", children: [
      /* @__PURE__ */ jsx8(UserCheck, { className: "h-4 w-4 text-blue-600 dark:text-blue-400" }),
      `${nomeCompleto(utente) === "\u2014" ? utente.username : nomeCompleto(utente)} esiste gi\xE0`
    ] }),
    /* @__PURE__ */ jsx8(ElencoPortali, { portali: utente.altri_portali }),
    stato ? /* @__PURE__ */ jsx8("p", { className: "text-[13px] text-slate-600 dark:text-slate-300", children: stato }) : /* @__PURE__ */ jsxs8(Fragment, { children: [
      selettore,
      /* @__PURE__ */ jsx8(Nota, { children: NOTA_SESSIONI }),
      /* @__PURE__ */ jsx8("button", { type: "button", onClick: onDaiAccesso, disabled: inCorso, className: BOTTONE.primario, children: `Dai accesso a ${nomePortale}` })
    ] })
  ] });
}
function FinestraNuovoUtente({ client, basePath, nomePortale, attore, onChiudi, onFatto }) {
  const ruoli = ruoliAssegnabili(attore?.ruolo);
  const [campi, setCampi] = useState3({ username: "", email: "", nome: "", cognome: "", password: "" });
  const [ruolo, setRuolo] = useState3("viewer");
  const [esistente, setEsistente] = useState3(null);
  const [esito, setEsito] = useState3(null);
  const { inCorso, errore, esegui } = useAzione();
  const imposta = (k) => (v) => setCampi((c) => ({ ...c, [k]: v }));
  async function crea(e) {
    e.preventDefault();
    const corpo = {
      username: campi.username.trim(),
      email: testoONull(campi.email),
      nome: testoONull(campi.nome),
      cognome: testoONull(campi.cognome),
      ruolo,
      password: campi.password ? campi.password : null
    };
    const r = await esegui(
      () => client.post(basePath, corpo),
      (err) => {
        const d = err?.body?.detail;
        if (err?.status === 409 && d?.codice === "esiste" && d.utente) {
          setEsistente(d.utente);
          return true;
        }
        return false;
      }
    );
    if (!r.ok) return;
    onFatto?.();
    setEsito({ password_generata: r.valore?.password_generata, email_inviata: r.valore?.email_inviata });
  }
  async function daiAccesso() {
    const r = await esegui(() => client.post(`${basePath}/${esistente.id}/accesso`, { ruolo }));
    if (!r.ok) return;
    onFatto?.();
    setEsito({ accesso: true });
  }
  const chiudi = /* @__PURE__ */ jsx8("button", { type: "button", onClick: onChiudi, className: BOTTONE.secondario, children: "Chiudi" });
  if (esito) {
    return /* @__PURE__ */ jsxs8(Finestra, { titolo: "Nuovo utente", onChiudi, piede: chiudi, children: [
      esito.accesso && /* @__PURE__ */ jsx8("p", { className: "text-[13px] text-slate-700 dark:text-slate-300", children: `Accesso a ${nomePortale} concesso.` }),
      !esito.accesso && /* @__PURE__ */ jsx8("p", { className: "text-[13px] text-slate-700 dark:text-slate-300", children: "Utente creato." }),
      esito.password_generata && /* @__PURE__ */ jsx8(PasswordMostrata, { password: esito.password_generata }),
      !esito.password_generata && esito.email_inviata && /* @__PURE__ */ jsx8("p", { className: "text-[13px] text-slate-600 dark:text-slate-400", children: "Le credenziali sono state inviate per email." })
    ] });
  }
  if (esistente) {
    return /* @__PURE__ */ jsxs8(Finestra, { titolo: "Nuovo utente", onChiudi, piede: chiudi, children: [
      /* @__PURE__ */ jsx8(
        PersonaEsistente,
        {
          utente: esistente,
          nomePortale,
          onDaiAccesso: daiAccesso,
          inCorso,
          selettore: /* @__PURE__ */ jsx8(SelettoreRuolo, { ruoli, valore: ruolo, onCambia: setRuolo })
        }
      ),
      /* @__PURE__ */ jsx8(MessaggioErrore, { children: errore })
    ] });
  }
  return /* @__PURE__ */ jsx8(
    Finestra,
    {
      titolo: "Nuovo utente",
      onChiudi,
      piede: /* @__PURE__ */ jsxs8(Fragment, { children: [
        /* @__PURE__ */ jsx8("button", { type: "button", onClick: onChiudi, className: BOTTONE.secondario, children: "Annulla" }),
        /* @__PURE__ */ jsx8("button", { type: "submit", form: "vuscom-nuovo-utente", disabled: inCorso || campi.username.trim().length < 3, className: BOTTONE.primario, children: "Crea utente" })
      ] }),
      children: /* @__PURE__ */ jsxs8("form", { id: "vuscom-nuovo-utente", onSubmit: crea, className: "space-y-3", children: [
        /* @__PURE__ */ jsx8(Campo, { etichetta: "Username", valore: campi.username, onCambia: imposta("username"), autoFocus: true, autoComplete: "off" }),
        /* @__PURE__ */ jsx8(Campo, { etichetta: "Email", tipo: "email", valore: campi.email, onCambia: imposta("email"), autoComplete: "off" }),
        /* @__PURE__ */ jsxs8("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsx8(Campo, { etichetta: "Nome", valore: campi.nome, onCambia: imposta("nome") }),
          /* @__PURE__ */ jsx8(Campo, { etichetta: "Cognome", valore: campi.cognome, onCambia: imposta("cognome") })
        ] }),
        /* @__PURE__ */ jsx8(SelettoreRuolo, { ruoli, valore: ruolo, onCambia: setRuolo }),
        /* @__PURE__ */ jsx8(
          Campo,
          {
            etichetta: "Password (facoltativa)",
            tipo: "password",
            valore: campi.password,
            onCambia: imposta("password"),
            autoComplete: "new-password",
            nota: "Se vuota viene generata e inviata per email. Almeno 8 caratteri."
          }
        ),
        /* @__PURE__ */ jsx8(MessaggioErrore, { children: errore })
      ] })
    }
  );
}

// src/utenti/FinestraAggiungiEsistente.jsx
import { useState as useState5 } from "react";
import { Check as Check2, Loader2, Search } from "lucide-react";

// src/utenti/useRicerca.js
import { useEffect as useEffect3, useState as useState4 } from "react";
var RITARDO_RICERCA_MS = 300;
var MINIMO_CARATTERI = 2;
function useRicerca({ client, basePath, testo }) {
  const [risultati, setRisultati] = useState4(null);
  const [cercando, setCercando] = useState4(false);
  const [errore, setErrore] = useState4(null);
  useEffect3(() => {
    const q = testo.trim();
    if (q.length < MINIMO_CARATTERI) {
      setRisultati(null);
      setCercando(false);
      setErrore(null);
      return void 0;
    }
    let annullata = false;
    setCercando(true);
    const timer = setTimeout(async () => {
      try {
        const dati = await client.get(`${basePath}/cerca?q=${encodeURIComponent(q)}`);
        if (annullata) return;
        setRisultati(Array.isArray(dati) ? dati : []);
        setErrore(null);
      } catch (err) {
        if (!annullata) setErrore(messaggioErrore(err));
      } finally {
        if (!annullata) setCercando(false);
      }
    }, RITARDO_RICERCA_MS);
    return () => {
      annullata = true;
      clearTimeout(timer);
    };
  }, [client, basePath, testo]);
  return { risultati, cercando, errore };
}

// src/utenti/FinestraAggiungiEsistente.jsx
import { Fragment as Fragment2, jsx as jsx9, jsxs as jsxs9 } from "react/jsx-runtime";
function Risultato({ utente, scelto, onScegli }) {
  return /* @__PURE__ */ jsx9("li", { children: /* @__PURE__ */ jsxs9(
    "button",
    {
      type: "button",
      "aria-pressed": scelto,
      onClick: onScegli,
      className: `flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 ${scelto ? "border-blue-400 bg-blue-50 dark:border-blue-400/60 dark:bg-blue-500/10" : "border-slate-200 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/[0.04]"}`,
      children: [
        /* @__PURE__ */ jsxs9("span", { className: "min-w-0 flex-1 space-y-1", children: [
          /* @__PURE__ */ jsx9("span", { className: "block text-[13px] font-medium text-slate-800 dark:text-slate-100", children: nomeCompleto(utente) }),
          /* @__PURE__ */ jsxs9("span", { className: "block truncate text-[12px] text-slate-500 dark:text-slate-400", children: [
            utente.username,
            utente.email ? ` \xB7 ${utente.email}` : ""
          ] }),
          /* @__PURE__ */ jsx9(ElencoPortali, { portali: utente.altri_portali })
        ] }),
        scelto && /* @__PURE__ */ jsx9(Check2, { className: "mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" })
      ]
    }
  ) });
}
function FinestraAggiungiEsistente({ client, basePath, nomePortale, attore, onChiudi, onFatto }) {
  const ruoli = ruoliAssegnabili(attore?.ruolo);
  const [testo, setTesto] = useState5("");
  const [scelto, setScelto] = useState5(null);
  const [ruolo, setRuolo] = useState5("viewer");
  const ricerca = useRicerca({ client, basePath, testo });
  const { inCorso, errore, esegui } = useAzione();
  async function conferma() {
    const r = await esegui(() => client.post(`${basePath}/${scelto.id}/accesso`, { ruolo }));
    if (!r.ok) return;
    onFatto?.();
    onChiudi();
  }
  return /* @__PURE__ */ jsxs9(
    Finestra,
    {
      titolo: `Aggiungi utente esistente a ${nomePortale}`,
      onChiudi,
      piede: /* @__PURE__ */ jsxs9(Fragment2, { children: [
        /* @__PURE__ */ jsx9("button", { type: "button", onClick: onChiudi, className: BOTTONE.secondario, children: "Annulla" }),
        /* @__PURE__ */ jsx9("button", { type: "button", onClick: conferma, disabled: !scelto || inCorso, className: BOTTONE.primario, children: "Dai accesso" })
      ] }),
      children: [
        /* @__PURE__ */ jsx9(
          Campo,
          {
            etichetta: "Cerca persona",
            valore: testo,
            onCambia: setTesto,
            placeholder: "Nome, cognome, username o email",
            autoFocus: true,
            autoComplete: "off",
            nota: testo.trim().length < MINIMO_CARATTERI ? `Almeno ${MINIMO_CARATTERI} caratteri.` : void 0
          }
        ),
        ricerca.cercando && /* @__PURE__ */ jsxs9("p", { className: "flex items-center gap-2 text-[12.5px] text-slate-500 dark:text-slate-400", children: [
          /* @__PURE__ */ jsx9(Loader2, { className: "h-3.5 w-3.5 animate-spin" }),
          " Ricerca in corso\u2026"
        ] }),
        /* @__PURE__ */ jsx9(MessaggioErrore, { children: ricerca.errore }),
        !ricerca.cercando && ricerca.risultati?.length === 0 && /* @__PURE__ */ jsxs9("p", { className: "flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400", children: [
          /* @__PURE__ */ jsx9(Search, { className: "h-4 w-4" }),
          " Nessun risultato"
        ] }),
        ricerca.risultati?.length > 0 && /* @__PURE__ */ jsx9("ul", { className: "max-h-64 space-y-1.5 overflow-y-auto pr-1", children: ricerca.risultati.map((u) => /* @__PURE__ */ jsx9(Risultato, { utente: u, scelto: scelto?.id === u.id, onScegli: () => setScelto(u) }, u.id)) }),
        scelto && /* @__PURE__ */ jsxs9(Fragment2, { children: [
          /* @__PURE__ */ jsx9(SelettoreRuolo, { ruoli, valore: ruolo, onCambia: setRuolo, etichetta: `Ruolo su ${nomePortale}` }),
          /* @__PURE__ */ jsx9(Nota, { children: "Dare l'accesso chiude le sessioni della persona su tutti i portali: dovr\xE0 rifare il login." })
        ] }),
        /* @__PURE__ */ jsx9(MessaggioErrore, { children: errore })
      ]
    }
  );
}

// src/utenti/FinestraModifica.jsx
import { useState as useState6 } from "react";
import { Fragment as Fragment3, jsx as jsx10, jsxs as jsxs10 } from "react/jsx-runtime";
var ANAGRAFICA = ["nome", "cognome", "email"];
function campiCambiati(utente, bozza) {
  const cambiati = {};
  for (const k of ANAGRAFICA) {
    if ((bozza[k] || "").trim() !== (utente[k] || "")) cambiati[k] = bozza[k].trim();
  }
  if (bozza.ruolo !== utente.ruolo) cambiati.ruolo = bozza.ruolo;
  return cambiati;
}
function FinestraModifica({ client, basePath, attore, utente, SezioneExtra, onChiudi, onFatto }) {
  const [bozza, setBozza] = useState6({
    nome: utente.nome || "",
    cognome: utente.cognome || "",
    email: utente.email || "",
    ruolo: utente.ruolo
  });
  const { inCorso, errore, esegui } = useAzione();
  const imposta = (k) => (v) => setBozza((b) => ({ ...b, [k]: v }));
  const assegnabili = ruoliAssegnabili(attore?.ruolo);
  const ruoli = RUOLI.filter((r) => assegnabili.includes(r) || r === utente.ruolo);
  const cambiati = campiCambiati(utente, bozza);
  const nessunCambio = Object.keys(cambiati).length === 0;
  async function salva(e) {
    e.preventDefault();
    if (nessunCambio) return;
    const r = await esegui(() => client.put(`${basePath}/${utente.id}`, cambiati));
    if (!r.ok) return;
    onFatto?.();
    onChiudi();
  }
  return /* @__PURE__ */ jsxs10(
    Finestra,
    {
      titolo: `Modifica ${utente.username}`,
      onChiudi,
      piede: /* @__PURE__ */ jsxs10(Fragment3, { children: [
        /* @__PURE__ */ jsx10("button", { type: "button", onClick: onChiudi, className: BOTTONE.secondario, children: "Annulla" }),
        /* @__PURE__ */ jsx10("button", { type: "submit", form: "vuscom-modifica-utente", disabled: inCorso || nessunCambio, className: BOTTONE.primario, children: "Salva" })
      ] }),
      children: [
        /* @__PURE__ */ jsxs10("form", { id: "vuscom-modifica-utente", onSubmit: salva, className: "space-y-3", children: [
          /* @__PURE__ */ jsxs10("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsx10(Campo, { etichetta: "Nome", valore: bozza.nome, onCambia: imposta("nome"), autoFocus: true }),
            /* @__PURE__ */ jsx10(Campo, { etichetta: "Cognome", valore: bozza.cognome, onCambia: imposta("cognome") })
          ] }),
          /* @__PURE__ */ jsx10(Campo, { etichetta: "Email", tipo: "email", valore: bozza.email, onCambia: imposta("email") }),
          bozza.ruolo && /* @__PURE__ */ jsx10(SelettoreRuolo, { ruoli, valore: bozza.ruolo, onCambia: imposta("ruolo") }),
          /* @__PURE__ */ jsx10(Nota, { children: "Cambiare il ruolo chiude le sessioni della persona su tutti i portali." }),
          /* @__PURE__ */ jsxs10("div", { children: [
            /* @__PURE__ */ jsx10("span", { className: ETICHETTA, children: "Altri portali (sola lettura)" }),
            /* @__PURE__ */ jsx10(ElencoPortali, { portali: utente.altri_portali })
          ] }),
          /* @__PURE__ */ jsx10(MessaggioErrore, { children: errore })
        ] }),
        SezioneExtra && /* @__PURE__ */ jsx10("div", { className: "border-t border-slate-100 pt-4 dark:border-white/[0.06]", children: /* @__PURE__ */ jsx10(SezioneExtra, { utente }) })
      ]
    }
  );
}

// src/utenti/FinestraPassword.jsx
import { useState as useState7 } from "react";
import { MailCheck } from "lucide-react";
import { Fragment as Fragment4, jsx as jsx11, jsxs as jsxs11 } from "react/jsx-runtime";
function FinestraPassword({ client, basePath, utente, onChiudi, onFatto }) {
  const [password, setPassword] = useState7("");
  const [esito, setEsito] = useState7(null);
  const { inCorso, errore, esegui } = useAzione();
  async function conferma(e) {
    e.preventDefault();
    const r = await esegui(() => client.put(`${basePath}/${utente.id}/password`, { password: password || null }));
    if (!r.ok) return;
    onFatto?.();
    setEsito(r.valore || {});
  }
  if (esito) {
    return /* @__PURE__ */ jsx11(
      Finestra,
      {
        titolo: `Password di ${utente.username}`,
        onChiudi,
        piede: /* @__PURE__ */ jsx11("button", { type: "button", onClick: onChiudi, className: BOTTONE.secondario, children: "Chiudi" }),
        children: esito.password_generata ? /* @__PURE__ */ jsx11(PasswordMostrata, { password: esito.password_generata }) : /* @__PURE__ */ jsxs11("p", { className: "flex items-center gap-2 text-[13px] text-slate-700 dark:text-slate-300", children: [
          /* @__PURE__ */ jsx11(MailCheck, { className: "h-4 w-4 text-emerald-600 dark:text-emerald-400" }),
          esito.email_inviata ? "Email inviata" : "Password aggiornata"
        ] })
      }
    );
  }
  return /* @__PURE__ */ jsx11(
    Finestra,
    {
      titolo: `Reimposta password di ${utente.username}`,
      onChiudi,
      piede: /* @__PURE__ */ jsxs11(Fragment4, { children: [
        /* @__PURE__ */ jsx11("button", { type: "button", onClick: onChiudi, className: BOTTONE.secondario, children: "Annulla" }),
        /* @__PURE__ */ jsx11("button", { type: "submit", form: "vuscom-password-utente", disabled: inCorso, className: BOTTONE.primario, children: "Reimposta" })
      ] }),
      children: /* @__PURE__ */ jsxs11("form", { id: "vuscom-password-utente", onSubmit: conferma, className: "space-y-3", children: [
        /* @__PURE__ */ jsx11(
          Campo,
          {
            etichetta: "Nuova password (facoltativa)",
            tipo: "password",
            valore: password,
            onCambia: setPassword,
            autoFocus: true,
            autoComplete: "new-password",
            nota: "Se vuota viene generata e inviata per email. Almeno 8 caratteri."
          }
        ),
        /* @__PURE__ */ jsx11(Nota, { children: "Vale per l'account su tutti i portali: le sessioni aperte vengono chiuse e al prossimo accesso la persona dovr\xE0 cambiarla." }),
        /* @__PURE__ */ jsx11(MessaggioErrore, { children: errore })
      ] })
    }
  );
}

// src/utenti/FinestraElimina.jsx
import { useEffect as useEffect4, useState as useState8 } from "react";
import { Loader2 as Loader22 } from "lucide-react";
import { Fragment as Fragment5, jsx as jsx12, jsxs as jsxs12 } from "react/jsx-runtime";
function descriviRiferimenti(riferimenti) {
  return Object.entries(riferimenti || {}).map(([chiave, n]) => `${chiave.split(".")[0]}: ${n}`).join(", ");
}
function Anteprima({ anteprima }) {
  if (anteprima.esito === "eliminato") {
    return /* @__PURE__ */ jsx12("p", { className: "text-[13px] text-slate-700 dark:text-slate-300", children: "L'account non \xE8 mai stato usato: verr\xE0 cancellato definitivamente." });
  }
  return /* @__PURE__ */ jsx12("p", { className: "text-[13px] leading-relaxed text-slate-700 dark:text-slate-300", children: `L'account ha dati collegati (${descriviRiferimenti(anteprima.riferimenti)}): i dati personali verranno cancellati e l'account disattivato. I dati collegati restano.` });
}
function FinestraElimina({ client, basePath, utente, onChiudi, onFatto }) {
  const [anteprima, setAnteprima] = useState8(null);
  const [erroreAnteprima, setErroreAnteprima] = useState8(null);
  const [digitato, setDigitato] = useState8("");
  const { inCorso, errore, esegui } = useAzione();
  useEffect4(() => {
    let annullata = false;
    client.get(`${basePath}/${utente.id}/eliminazione`).then((d) => !annullata && setAnteprima(d)).catch((err) => !annullata && setErroreAnteprima(messaggioErrore(err)));
    return () => {
      annullata = true;
    };
  }, [client, basePath, utente.id]);
  async function elimina() {
    const r = await esegui(() => client.del(`${basePath}/${utente.id}`));
    if (!r.ok) return;
    onFatto?.();
    onChiudi();
  }
  const pronto = anteprima && digitato === utente.username;
  return /* @__PURE__ */ jsxs12(
    Finestra,
    {
      titolo: `Elimina ${utente.username}`,
      onChiudi,
      piede: /* @__PURE__ */ jsxs12(Fragment5, { children: [
        /* @__PURE__ */ jsx12("button", { type: "button", onClick: onChiudi, className: BOTTONE.secondario, children: "Annulla" }),
        /* @__PURE__ */ jsx12("button", { type: "button", onClick: elimina, disabled: !pronto || inCorso, className: BOTTONE.pericolo, children: "Elimina account" })
      ] }),
      children: [
        /* @__PURE__ */ jsx12("p", { className: "text-[12.5px] text-slate-500 dark:text-slate-400", children: "Vale per l'account su tutti i portali." }),
        !anteprima && !erroreAnteprima && /* @__PURE__ */ jsxs12("p", { className: "flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400", children: [
          /* @__PURE__ */ jsx12(Loader22, { className: "h-4 w-4 animate-spin" }),
          " Verifica dei dati collegati\u2026"
        ] }),
        /* @__PURE__ */ jsx12(MessaggioErrore, { children: erroreAnteprima }),
        anteprima && /* @__PURE__ */ jsx12(Anteprima, { anteprima }),
        anteprima && /* @__PURE__ */ jsx12(
          Campo,
          {
            etichetta: `Digita lo username (${utente.username}) per confermare`,
            valore: digitato,
            onCambia: setDigitato,
            autoComplete: "off"
          }
        ),
        /* @__PURE__ */ jsx12(MessaggioErrore, { children: errore })
      ]
    }
  );
}

// src/utenti/FinestraConferma.jsx
import { Fragment as Fragment6, jsx as jsx13, jsxs as jsxs13 } from "react/jsx-runtime";
function FinestraConferma({
  titolo,
  messaggio,
  nota,
  etichettaConferma,
  pericolo = false,
  azione,
  onChiudi,
  onFatto
}) {
  const { inCorso, errore, esegui } = useAzione();
  async function conferma() {
    const esito = await esegui(azione);
    if (esito.ok) {
      onFatto?.();
      onChiudi();
    }
  }
  return /* @__PURE__ */ jsxs13(
    Finestra,
    {
      titolo,
      onChiudi,
      piede: /* @__PURE__ */ jsxs13(Fragment6, { children: [
        /* @__PURE__ */ jsx13("button", { type: "button", onClick: onChiudi, className: BOTTONE.secondario, children: "Annulla" }),
        /* @__PURE__ */ jsx13(
          "button",
          {
            type: "button",
            onClick: conferma,
            disabled: inCorso,
            className: pericolo ? BOTTONE.pericolo : BOTTONE.primario,
            children: etichettaConferma
          }
        )
      ] }),
      children: [
        /* @__PURE__ */ jsx13("p", { className: "text-[13px] leading-relaxed text-slate-700 dark:text-slate-300", children: messaggio }),
        nota && /* @__PURE__ */ jsx13(Nota, { children: nota }),
        /* @__PURE__ */ jsx13(MessaggioErrore, { children: errore })
      ]
    }
  );
}

// src/utenti/useUtenti.js
import { useCallback as useCallback2, useEffect as useEffect5, useRef as useRef4, useState as useState9 } from "react";
function useUtenti({ client, basePath = "/api/utenti", includiDisattivati = false }) {
  const [utenti, setUtenti] = useState9([]);
  const [caricando, setCaricando] = useState9(true);
  const [errore, setErrore] = useState9(null);
  const ultima = useRef4(0);
  const ricarica = useCallback2(async () => {
    const numero = ++ultima.current;
    setCaricando(true);
    try {
      const dati = await client.get(`${basePath}?includi_disattivati=${includiDisattivati}`);
      if (numero !== ultima.current) return;
      setUtenti(Array.isArray(dati) ? dati : []);
      setErrore(null);
    } catch (err) {
      if (numero !== ultima.current) return;
      setErrore(messaggioErrore(err));
    } finally {
      if (numero === ultima.current) setCaricando(false);
    }
  }, [client, basePath, includiDisattivati]);
  useEffect5(() => {
    ricarica();
  }, [ricarica]);
  return { utenti, caricando, errore, ricarica };
}

// src/utenti/GestioneUtenti.jsx
import { jsx as jsx14, jsxs as jsxs14 } from "react/jsx-runtime";
var NOTA_SESSIONI2 = "La persona verr\xE0 disconnessa da tutti i portali e dovr\xE0 rifare il login.";
function corrisponde(u, filtro) {
  if (!filtro) return true;
  const testo = [u.nome, u.cognome, u.username, u.email].filter(Boolean).join(" ").toLowerCase();
  return testo.includes(filtro);
}
function conferme({ client, basePath, nomePortale }) {
  return {
    togli: (u) => ({
      titolo: "Togli accesso",
      messaggio: `${nomeCompleto(u)} (${u.username}) non potr\xE0 pi\xF9 entrare in ${nomePortale}. L'account resta attivo sugli altri portali.`,
      nota: NOTA_SESSIONI2,
      etichettaConferma: "Togli accesso",
      pericolo: true,
      azione: () => client.del(`${basePath}/${u.id}/accesso`)
    }),
    disattiva: (u) => ({
      titolo: "Disattiva account",
      messaggio: `L'account di ${nomeCompleto(u)} (${u.username}) verr\xE0 disattivato: vale per tutti i portali. Gli accessi restano com'erano e tornano validi se lo riattivi.`,
      nota: NOTA_SESSIONI2,
      etichettaConferma: "Disattiva",
      pericolo: true,
      azione: () => client.post(`${basePath}/${u.id}/disattiva`, {})
    }),
    riattiva: (u) => ({
      titolo: "Riattiva account",
      messaggio: `L'account di ${nomeCompleto(u)} (${u.username}) torner\xE0 attivo su tutti i portali a cui ha accesso.`,
      etichettaConferma: "Riattiva",
      azione: () => client.post(`${basePath}/${u.id}/riattiva`, {})
    })
  };
}
function GestioneUtenti({
  portale,
  nomePortale,
  client,
  attore,
  basePath = "/api/utenti",
  SezioneExtra
}) {
  const [mostraDisattivati, setMostraDisattivati] = useState10(false);
  const [filtro, setFiltro] = useState10("");
  const [finestra, setFinestra] = useState10(null);
  const { utenti, caricando, errore, ricarica } = useUtenti({ client, basePath, includiDisattivati: mostraDisattivati });
  const visibili = useMemo(() => {
    const f = filtro.trim().toLowerCase();
    return utenti.filter((u) => corrisponde(u, f));
  }, [utenti, filtro]);
  const nome = nomePortale || portale;
  const chiudi = () => setFinestra(null);
  const comuni = { client, basePath, attore, nomePortale: nome, onChiudi: chiudi, onFatto: ricarica };
  const conferma = finestra && conferme({ client, basePath, nomePortale: nome })[finestra.tipo];
  return /* @__PURE__ */ jsxs14("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs14("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs14("h1", { className: "flex items-center gap-2 text-[18px] font-semibold text-slate-800 dark:text-slate-100", children: [
        /* @__PURE__ */ jsx14(Users, { className: "h-5 w-5 text-blue-600 dark:text-blue-400" }),
        `Utenti \u2014 ${nome}`
      ] }),
      /* @__PURE__ */ jsxs14("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxs14("button", { type: "button", onClick: () => setFinestra({ tipo: "aggiungi" }), className: BOTTONE.secondario, children: [
          /* @__PURE__ */ jsx14(Search2, { className: "h-4 w-4" }),
          "Aggiungi utente esistente"
        ] }),
        /* @__PURE__ */ jsxs14("button", { type: "button", onClick: () => setFinestra({ tipo: "nuovo" }), className: BOTTONE.primario, children: [
          /* @__PURE__ */ jsx14(UserPlus, { className: "h-4 w-4" }),
          "Nuovo utente"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs14("div", { className: "flex flex-wrap items-center gap-4", children: [
      /* @__PURE__ */ jsxs14("div", { className: "relative w-full max-w-xs", children: [
        /* @__PURE__ */ jsx14(Search2, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" }),
        /* @__PURE__ */ jsx14(
          "input",
          {
            type: "search",
            "aria-label": "Filtra utenti",
            placeholder: "Filtra per nome, username, email",
            value: filtro,
            onChange: (e) => setFiltro(e.target.value),
            className: `${INPUT} pl-9`
          }
        )
      ] }),
      /* @__PURE__ */ jsx14(Interruttore, { attivo: mostraDisattivati, onCambia: setMostraDisattivati, etichetta: "Mostra disattivati" })
    ] }),
    errore && /* @__PURE__ */ jsxs14("div", { role: "alert", className: "flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300", children: [
      /* @__PURE__ */ jsxs14("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx14(AlertCircle2, { className: "h-4 w-4" }),
        errore
      ] }),
      /* @__PURE__ */ jsx14("button", { type: "button", onClick: ricarica, className: BOTTONE.secondario, children: "Riprova" })
    ] }),
    !errore && /* @__PURE__ */ jsx14(TabellaUtenti, { utenti: visibili, caricando, attore, onAzione: (tipo, utente) => setFinestra({ tipo, utente }) }),
    !errore && !caricando && visibili.length === 0 && /* @__PURE__ */ jsx14("p", { className: "py-8 text-center text-[13px] text-slate-500 dark:text-slate-400", children: filtro.trim() ? "Nessun utente corrisponde al filtro." : `Nessun utente ha accesso a ${nome}.` }),
    finestra?.tipo === "nuovo" && /* @__PURE__ */ jsx14(FinestraNuovoUtente, { ...comuni }),
    finestra?.tipo === "aggiungi" && /* @__PURE__ */ jsx14(FinestraAggiungiEsistente, { ...comuni }),
    finestra?.tipo === "modifica" && /* @__PURE__ */ jsx14(FinestraModifica, { ...comuni, utente: finestra.utente, SezioneExtra }),
    finestra?.tipo === "password" && /* @__PURE__ */ jsx14(FinestraPassword, { ...comuni, utente: finestra.utente }),
    finestra?.tipo === "elimina" && /* @__PURE__ */ jsx14(FinestraElimina, { ...comuni, utente: finestra.utente }),
    conferma && /* @__PURE__ */ jsx14(FinestraConferma, { ...conferma(finestra.utente), onChiudi: chiudi, onFatto: ricarica })
  ] });
}
export {
  ETICHETTE_PORTALE,
  GestioneUtenti,
  LIVELLO,
  RUOLI,
  livello,
  ruoliAssegnabili,
  useUtenti
};
