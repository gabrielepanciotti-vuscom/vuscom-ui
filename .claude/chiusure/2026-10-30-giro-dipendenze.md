# Giro dipendenze dei portali VUS COM e colore portale automatico — 30/10/2026

Resoconto completo, repo per repo: `~/work/RESOCONTO-deps-2026-10-30.md`.

## Cosa è stato fatto
- **@vuscom/ui**:
  - **v1.19.0** (`9e1d30e`): toolchain di sviluppo all'ultima major (vite 8, vitest 5, jsdom 30, esbuild 0.28), rrweb 2.2.0. `npm audit` da 2 critical + 1 high a 0.
  - **v1.20.0** (`c1ac1f8`): il colore del portale è automatico.
- **12 portali @vuscom/ui e 22 repo VUS COM non-portale**:
  - Node 26 nei Dockerfile e Python 3.13.
  - Dipendenze all'ultima versione; `npm audit` e `pip-audit` a zero high/critical.
  - Test uguali o migliori rispetto a prima.
  - Tutto pushato.
- **Deploy verificati**:
  - Su integra: Configuratore, BrainEditor, PortaleDistributori, Vicky, Simulatore, GestioneSharepoint, vuscom-auth, vuscom-db, Offerte, Cruscotto.
  - Su Vus-SRVSEG: Portale_Segnalazioni, VetrinaOffertePubbliche e il Caddyfile unito (`9059464`).
  - Già in prod da altre sessioni: OutBound, TicketManager, EmailManager.

## Come funziona
- **Colore automatico**: `src/brand/registroColori.js` è un modulo puro, condiviso fra il runtime e il tester di conformità. Un codice di portale registrato in `COLORI_PORTALE` tiene il suo colore. Ogni altro codice riceve un colore deterministico:
  - la tinta parte dall'hash FNV-1a del codice e avanza per angolo aureo;
  - la saturazione e la luminosità sono fisse, perché la V bianca resti leggibile;
  - il colore scelto dista sempre almeno 60 RGB dai registrati e dal navy pubblico.

  `leggiPortale` lo usa per generare la tessera a runtime. Il tester accetta qualunque codice in minuscolo.
- **Criterio di deploy** (deciso da Gabriele: si deploya solo quando si è sicuri che funziona):
  - build dell'immagine di prod e smoke test del container;
  - test con un Postgres usa e getta, prima e dopo il giro, contando solo le regressioni;
  - deploy uno alla volta, con l'immagine precedente taggata `:rollback-deps-20261030`, health, log e frontend verificati dal vivo.

## Struttura
- vuscom-ui:
  - nuovi `src/brand/registroColori.js` e `test/registroColori.test.js`;
  - modificati `src/brand/colore.js`, `src/brand/Brand.jsx`, `src/index.js`, `src/AppSidebar.jsx`, `bin/conformita.mjs`, `bin/conformita-regole.json`, `README.md`, `CLAUDE.md`, `package.json`, `dist/`.
- Portali: `package.json`/lockfile, Dockerfile, requirements e piccole correzioni di breaking change:
  - `Select` con ruolo combobox nei test;
  - `app.openapi()` al posto di `app.routes`;
  - CSS vite 8, tsconfig TypeScript 7, zod 4 in ConcorsoPremi, selectolax Lexbor in Scraper.

## Come si prova
- `npm test` in vuscom-ui: 417/417.
- `node -e 'import("./src/brand/registroColori.js").then(m=>console.log(m.coloreAutomatico("vicky")))'` stampa `#1f842a`.
- `npx vuscom-ui-conformita` in PortaleDistributori e in Vicky dà `OK`.
- In produzione: `curl https://<portale>.vuscom.dev/api/health`; su integra, `docker ps` mostra i container healthy.

## Decisioni
- **Tailwind 4, tailwind-merge 3 e React 19 non adottati**: il preset è Tailwind 3 e i portali sono su React 18 (vuscom-ui#12).
- **pandas resta alla 2.3** in Cruscotto, Report_Agenzie ed ETL_V2: la 3 rompe test o non è verificabile senza dati (Cruscotto#182, Report_Agenzie#18, ETL_V2#179).
- **ProjectManager e Scheduler non vanno su integra**: sono nodi unici per tutte le istanze, quindi restano su dev-linux e sul minipc; su integra solo gli standby di Life#153.
- **`npm run notifica` non lanciato**: avrebbe mandato ordini di deploy ai portali.
- **Non deployati**:
  - CallRecorder: solo Windows, cattura WASAPI.
  - ConcorsoPremi: Firebase, concorso chiuso dal 06/04.
- **Template di conform**: la correzione (Node 26, git, ordine pip) è affidata alla sessione `work-life-conform-node26` (bus #5272), seguita da Gabriele.
