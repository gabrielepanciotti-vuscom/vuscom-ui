# Rilascio

Non c'è un deploy: il pacchetto si rilascia con un tag.

- Prerequisiti: Node, `npm install`.
- Test: `npm test`. Build: `npm run build` (esbuild → `dist/`, a mano prima del commit di rilascio). Catalogo: `npm run catalogo` (porta 3399).
- Rilascio: bump `version` in `package.json`, commit, tag `vX.Y.Z` su `main`, push di commit e tag,
  poi `npm run notifica -- --prova` e `npm run notifica` (vedi sotto).
- Notifica ai portali: `scripts/rilascia-e-notifica.mjs [vX.Y.Z] [--da vA.B.C] [--solo agente] [--prova]`.
  Dal diff con il tag precedente ricava i moduli cambiati (`dist/index.js` → `index`, `dist/segnalazioni.js`
  → `segnalazioni`, … , `bin/` → `conformita`), sceglie i consumer di `consumatori.json` che li usano e
  apre una conversazione sul bus per ciascuno (`hub_send.py new`, mai una con tutti in copia), seguita da
  `hub_attendi.sh` staccato (log in `/tmp/vuscom-ui-attendi-<id>.log`). Blocca se il tag non è su origin
  o se `src/` cambia senza `dist/` (build dimenticata, successo con v1.11.0).
- Deriva: `scripts/controlla-deriva.mjs` confronta la versione nel `package-lock.json` di ogni consumer
  con l'ultimo tag. Muto se tutti allineati, scrive solo su stdout, esce sempre 0: pensato per un hook
  di SessionStart. I percorsi dei consumer sono relativi a `$VUSCOM_SRV` (default: la cartella che
  contiene il repo).
- Consumo: `npm install "@vuscom/ui@github:gabrielepanciotti-vuscom/vuscom-ui#vX.Y.Z"` (il lockfile tiene il tag vecchio: `npm install` da solo non basta).
- Rollback: i portali tornano al tag precedente; i tag non si spostano né si cancellano.
- Variabili d'ambiente: nessuna richiesta dal pacchetto.
