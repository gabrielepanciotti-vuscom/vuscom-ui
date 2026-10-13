# vuscom-ui — @vuscom/ui

Design system condiviso dei portali VUS COM: tema, componenti, struttura delle pagine, widget
«Segnala un problema», tester di conformità. Libreria npm, nessuna porta, nessun DB.
Le regole globali (stack, git, portali, ruoli) vengono da `~/.claude/CLAUDE.shared.md`.

## Stack
React 18 + Tailwind 3 (preset) · esbuild · vitest + Testing Library · peer: react, react-dom, react-router-dom (opz.), lucide-react.
Repo pubblico, `dist/` versionato, rilascio per tag `vX.Y.Z` (oggi v1.11.0). Path: `$PATH_VUSCOM_UI`.

## Struttura
- `src/{atoms,molecules,organisms,templates,theme,brand,lib,accesso,segnalazioni,utenti}`, `src/AppSidebar.jsx`, `src/navTree.js`
- `bin/conformita.mjs` + `bin/conformita-regole.json` — tester dei portali (regole come dati)
- `catalogo/` — pagina di ogni componente · `test/` — specchio di `src/` · `build.mjs` → `dist/`

## Comandi
```
npm install · npm test · npm run build · npm run catalogo   # catalogo su :3399
npx vuscom-ui-conformita                                    # dentro un portale
```

## Entry
`@vuscom/ui`, `/utenti`, `/segnalazioni`, `/preset`, `/theme.css`. Props e uso: `README.md`.

## Regole del pacchetto
Solo presentazione · nessun controllo nativo · niente esadecimali nei componenti · max 300 righe per file ·
un test per componente · ogni componente nuovo nel catalogo · si consuma per tag, mai da `main`.

## Rilascio
Test verdi → build → bump `package.json` → tag → push → nell'issue l'elenco dei portali e il comando
`npm install "@vuscom/ui@github:gabrielepanciotti-vuscom/vuscom-ui#vX.Y.Z"`. Aggiornare i portali non spetta a chi rilascia.

## Consumatori
Offerte, Cruscotto, Portale_Segnalazioni (widget segnalazioni); anche Outbound, Configuratore, BrainEditor, vuscom-db, call-manager, vicky.

## Agenti di progetto
| Agente | Scope |
|--------|-------|
| @.claude/agents/componenti.md | atomi, molecole, organismi, template, tema, colori |
| @.claude/agents/segnalazioni-utenti.md | entry `segnalazioni` e `utenti` |
| @.claude/agents/rilascio.md | build, tag, tester di conformità |

### Routing
- 1 dominio → subagent singolo · 2+ sequenziali → catena · 2+ indipendenti → worktree paralleli

## Docs
`.claude/docs/`: `project_spec.md`, `architecture.md`, `deployment.md`, `backlog.md` (puntatore agli issue).

## Gotcha
- Il lockfile del consumatore tiene il tag vecchio: serve `npm install "...#vX.Y.Z"`.
- `vuscom-ui-conformita` sul repo stesso segnala avvisi su `src/`: non sono regressioni.
- I portali pubblici restano col navy originale; i colori dei portali sono decisione di Gabriele.
