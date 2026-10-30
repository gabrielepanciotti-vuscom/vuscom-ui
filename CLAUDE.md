# vuscom-ui — @vuscom/ui

Design system condiviso dei portali VUS COM: tema, componenti, struttura delle pagine, widget
«Segnala un problema», tester di conformità. Libreria npm, nessuna porta, nessun DB.
Le regole globali (stack, git, portali, ruoli) vengono da `~/.claude/CLAUDE.shared.md`.

## Stack
React 18 + Tailwind 3 (preset) · esbuild · vitest + Testing Library · peer: react, react-dom, react-router-dom (opz.), lucide-react.
Repo pubblico, `dist/` versionato, rilascio per tag `vX.Y.Z` (oggi v1.20.0). Path: `$PATH_VUSCOM_UI`.

## Struttura
- `src/{atoms,molecules,organisms,templates,theme,brand,lib,accesso,segnalazioni,utenti,grafici}`, `src/AppSidebar.jsx`, `src/navTree.js`
- `bin/conformita.mjs` + `bin/conformita-regole.json` — tester dei portali (regole come dati)
- `consumatori.json` + `scripts/` — portali consumer, notifica di rilascio, controllo di deriva
- `catalogo/` — pagina di ogni componente · `test/` — specchio di `src/` · `build.mjs` → `dist/`

## Comandi
```
npm install · npm test · npm run build · npm run catalogo   # catalogo su :3399
npx vuscom-ui-conformita                                    # dentro un portale
```

## Entry
`@vuscom/ui`, `/utenti`, `/segnalazioni`, `/grafici` (chart.js 4.4.x peer opzionale), `/preset`, `/theme.css`. Props e uso: `README.md`.

## Regole del pacchetto
Solo presentazione · nessun controllo nativo · niente esadecimali nei componenti · max 300 righe per file ·
un test per componente · ogni componente nuovo nel catalogo · si consuma per tag, mai da `main`.

## Rilascio
Test verdi → build → bump `package.json` → tag → push → **`npm run notifica -- --prova`, poi `npm run notifica`**.
Il rilascio finisce lì, non col tag: lo script apre una conversazione sul bus per ogni portale che usa
un modulo cambiato (`consumatori.json`, testo in `scripts/ordine-aggiornamento.md`) e la segue con
`hub_attendi.sh`; si ferma se il tag non è su origin o se `src/` è cambiato senza `dist/`.
Il portale aggiorna, deploya e risponde con lo sha; chi rilascia chiude le conversazioni.
`npm run deriva` elenca i portali indietro rispetto all'ultimo tag (muto se allineati).

## Consumatori
Registrati in `consumatori.json` (ricevono l'ordine di aggiornamento): Offerte, Cruscotto, Portale_Segnalazioni,
Configuratore, OutBound. Usano il pacchetto ma non sono ancora registrati: BrainEditor, vuscom-db, call-manager, vicky.

## Agenti di progetto
| Agente | Scope |
|--------|-------|
| `componenti` | atomi, molecole, organismi, template, tema, colori |
| `segnalazioni-utenti` | entry `segnalazioni` e `utenti` |
| `rilascio` | build, tag, tester di conformità |

### Routing
- 1 dominio → subagent singolo · 2+ sequenziali → catena · 2+ indipendenti → worktree paralleli

## Docs
`.claude/docs/`: `project_spec.md`, `architecture.md`, `deployment.md`, `backlog.md` (puntatore agli issue),
`database.md` (nessun DB), `api.md` (endpoint che i moduli chiamano sul backend del portale).

## Gotcha
- Il lockfile del consumatore tiene il tag vecchio: serve `npm install "...#vX.Y.Z"`.
- `vuscom-ui-conformita` sul repo stesso segnala avvisi su `src/`: non sono regressioni.
- I portali pubblici restano col navy originale; gli altri passano il loro codice e il colore è automatico (`registroColori.js`, dalla 1.20.0).
