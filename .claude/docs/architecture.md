# Architettura

Pacchetto npm (`@vuscom/ui`) con quattro strati: tema → atomi/molecole → organismi → template.
Il README del repo è il riferimento delle props; qui stanno struttura e decisioni.

## Entry
| Entry | Contenuto |
|---|---|
| `@vuscom/ui` | tema, atomi, molecole, organismi, template, brand, accesso |
| `@vuscom/ui/utenti` | `GestioneUtenti` (non importa react-router) |
| `@vuscom/ui/segnalazioni` | pulsante «Segnala un problema» (rrweb e modern-screenshot caricati con `import()`) |
| `@vuscom/ui/grafici` | `GraficoBarre` su Chart.js 4.4.x (peer opzionale, esterno: `dist/index.js` non lo nomina) |
| `@vuscom/ui/preset` | preset Tailwind (CJS) |
| `@vuscom/ui/theme.css` | token CSS |
| bin `vuscom-ui-conformita` | tester dei portali, regole in `bin/conformita-regole.json` |

## Struttura
`src/{atoms,molecules,organisms,templates,theme,brand,lib,accesso,segnalazioni,utenti,grafici}`, `catalogo/` (vite, porta 3399), `test/` (specchio di `src/`), `build.mjs` → `dist/`.

## Decisioni
- **2026-10-09 colori**: blu `primary`/`brand-*`, giallo `accento` solo per i dettagli; il magenta come colore principale è stato bocciato.
- **2026-10-09 tessera per portale**: ogni portale interno ha il colore dietro la V; dalla 1.10.0 anche un esadecimale a runtime senza nuova release. I portali pubblici restano navy.
- **Consumo per tag**: una modifica al pacchetto non deve cambiare una build già fatta.
- **`dist/` versionato, nessun `prepare`**: evita di scaricare le devDependencies a ogni build Docker dei consumatori.
- **2026-10-14 componenti per i report** (GestoreCampagne#11): `GraficoBarre`, `MatriceCalore`, `BarraFiltriPeriodo`, `lib/periodi`, `lib/esportaCsv`, barra inline in `DataTable`.
- **2026-10-13 commento minimo 10 caratteri** nel widget segnalazioni (ticket #59 con il solo «.»).
- **Regole del tester come dati**: si cambia la regola, non il codice.
