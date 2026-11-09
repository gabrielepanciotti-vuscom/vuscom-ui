# Rifusione branch — 2026-11-09

## Fusi

- `llm/implementazione-20261027-220511-402f-9` — fuso con merge commit `32d17a8`. Revisione accessibilità di `AppShell` e sidebar mobile: skip link, gestione focus, `aria-expanded`/`aria-controls`, chiusura con Esc e `inert`; test specifici passati 31/31. La deriva automatica nei file `.claude/` è stata mantenuta come in `main`.
- `llm/implementazione-20261027-222939-989b-19` — fuso con merge commit `c113d83`. Test di accessibilità dei campi e adeguamento delle aspettative al contratto `Select`; test specifici passati 58/58. Il test condiviso già più nuovo nel ramo corrente ha prevalso sul duplicato arretrato.

## Da decidere

- `llm/implementazione-20261027-232932-da57-1` — non fuso: branch superato e divergente rispetto al ramo corrente; contiene uno snapshot arretrato che elimina file già presenti e riscrive numerosi componenti oltre al lavoro dichiarato, con rischio di regressioni.

## Verifiche

- Baseline su `origin/main`: `npm test` — 441/449 test passati; 8 errori preesistenti nei tester di conformità (`portale-colore`, `VediCome`, `TopScrollX`) con `SyntaxError: Unexpected end of JSON input`.
- Dopo i merge: `npx vitest run --pool=forks --maxWorkers=2` — 441/449 test passati, stesso identico rosso della baseline.
- Test branch 1: 31/31 passati.
- Test branch 2: 58/58 passati.
- Build: `npm run build` — passato.

Nota: Vitest 5 installato nel checkout non accetta i flag `--poolOptions.forks.*` richiesti dalla procedura; è stato usato l’equivalente supportato `--pool=forks --maxWorkers=2`.
