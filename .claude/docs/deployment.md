# Rilascio

Non c'è un deploy: il pacchetto si rilascia con un tag.

- Prerequisiti: Node, `npm install`.
- Test: `npm test`. Build: `npm run build` (esbuild → `dist/`, a mano prima del commit di rilascio). Catalogo: `npm run catalogo` (porta 3399).
- Rilascio: bump `version` in `package.json`, commit, tag `vX.Y.Z` su `main`, push di commit e tag.
- Consumo: `npm install "@vuscom/ui@github:gabrielepanciotti-vuscom/vuscom-ui#vX.Y.Z"` (il lockfile tiene il tag vecchio: `npm install` da solo non basta).
- Rollback: i portali tornano al tag precedente; i tag non si spostano né si cancellano.
- Variabili d'ambiente: nessuna richiesta dal pacchetto.
