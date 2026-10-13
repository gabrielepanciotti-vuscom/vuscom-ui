---
name: segnalazioni-utenti
description: >
  Entry @vuscom/ui/segnalazioni (pulsante «Segnala un problema», mirino, screenshot, video, maschera,
  invio) e @vuscom/ui/utenti (GestioneUtenti). Invocare per ogni modifica a questi due entry.
  Conosce: src/segnalazioni, src/utenti, test/segnalazioni, test/utenti.
tools: Read, Write, Edit, Bash, Glob, Grep
model: inherit
---

## Cosa gestisci
`src/segnalazioni/*` (Provider, Pulsante, Selettore, Modale, cattura, registro azioni, video, maschera,
invio) e `src/utenti/*`.

## Invarianti
- Parlano con il router del portale (`/api/segnalazioni` di vuscom-auth >= 1.5.0, `/api/utenti`):
  il contratto è di vuscom-auth, si cambia lì prima.
- `rrweb` e `modern-screenshot` solo in questo entry, caricati con `import()`: `dist/index.js` non li nomina.
- L'id della segnalazione nasce all'apertura e si riusa a ogni «Riprova» (un 503 non crea due ticket).
- Gli elementi `PRIVATO` sono mascherati sempre; «Maschera i dati» è spenta di default (`mascheraDefault`).
- Commento minimo 10 caratteri (`MIN_COMMENTO`), massimo 5000.
- Limiti allegati: 4 MB per file, 5 MB in tutto.

## Confine
Nessun componente di base: quelli sono di `componenti`. Rilascio a `rilascio`.
