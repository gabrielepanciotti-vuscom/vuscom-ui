# @vuscom/ui

Componenti UI condivisi tra i frontend VUS COM (Cruscotto, Hub Offerte, ...).

Contiene solo presentazione: nessun dato, nessun endpoint, nessun segreto.
Il repo è pubblico apposta, così le build Docker dei progetti possono
installarlo senza token.

## Uso

```json
"@vuscom/ui": "github:gabrielepanciotti-vuscom/vuscom-ui#v0.1.0"
```

Le versioni si consumano **per tag**, mai da `main`: una modifica al pacchetto
non deve cambiare una build già fatta.

```jsx
import { AppSidebar, normalizeNavTree, collectGroupIds } from "@vuscom/ui";
```

`AppSidebar` non gestisce il tema né conosce le azioni delle pagine: li riceve
come slot (`themeSlot`, `footerSlot`). Non importa React al suo interno come
dipendenza propria — usa quello dell'app che la ospita.

## Sviluppo

```bash
npm install
npm test        # vitest
npm run build   # esbuild -> dist/index.js (gira anche in `prepare`)
```
