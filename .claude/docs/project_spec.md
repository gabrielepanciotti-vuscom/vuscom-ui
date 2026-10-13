# Project Spec: @vuscom/ui

## Product Requirements
- **Vision**: un solo stile grafico e una sola struttura di pagina per tutti i portali VUS COM; un portale nuovo nasce già a norma.
- **Utenti**: gli sviluppatori dei portali (Offerte, Cruscotto, Outbound, Configuratore, Portale Segnalazioni, DB VUS COM, ...); gli utenti finali ne vedono il risultato.
- **Funzionalità**: tema chiaro/scuro e colori VUS COM, atomi/molecole/organismi, template (`AppShell`, `LoginPage`), icona e colore per portale, elenco unico dei portali, accesso Microsoft, gestione utenti, pulsante «Segnala un problema», tester di conformità.
- **Non funzionali**: accessibile (aria, screen reader), `dark:` ovunque, testi in italiano, nessun controllo nativo.

## Engineering Requirements
- React 18 + Tailwind 3 (preset), esbuild, vitest + Testing Library. Peer: react, react-dom, react-router-dom (opzionale), lucide-react.
- Repo pubblico (le build Docker lo installano senza token), `dist/` versionato, rilascio per tag.
- Solo presentazione: nessun dato, endpoint o segreto. Eccezioni dichiarate: entry `utenti` e `segnalazioni`.
- Milestone: nessuna data fissa, si rilascia a richiesta dei portali.
