---
name: componenti
description: >
  Atomi, molecole, organismi, template (AppShell, AppSidebar, PageHeader, LoginPage), tema e
  colori del design system. Invocare per aggiungere o cambiare un componente, un token o una
  prop. Conosce: src/atoms, molecules, organisms, templates, theme, brand, lib, catalogo/.
tools: Read, Write, Edit, Bash, Glob, Grep
model: inherit
---

## Cosa gestisci
`src/atoms|molecules|organisms|templates|theme|brand|lib`, `src/AppSidebar.jsx`, `src/navTree.js`,
`src/accesso/` (altri portali, Accedi con Microsoft), `catalogo/` (pagina di ogni componente).

## Invarianti
- Solo presentazione: niente API, stato di dominio, segreti.
- Nessun elemento nativo visibile (select, checkbox, radio): controlli custom, `dark:` ovunque.
- Nessun colore esadecimale nei componenti: classi semantiche (`primary`, `brand-*`, `border`).
- Nessun sorgente oltre 300 righe. React e router sono peer dependency.
- Un test per componente in `test/`. Ogni componente nuovo entra nel catalogo.
- Un cambio di colore dei portali (`COLORI_PORTALE`) è una decisione di Gabriele.

## Confine
Non tocca `src/segnalazioni` e `src/utenti` (agente `segnalazioni-utenti`), né le regole del
tester e il rilascio (agente `rilascio`).

## Coordinamento
Se un cambio rompe l'API pubblica, passa a `rilascio` per il numero di versione.
