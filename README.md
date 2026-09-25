# @vuscom/ui

Componenti UI condivisi tra i frontend VUS COM (Cruscotto, Hub Offerte, Outbound).

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

## Gestione utenti (`@vuscom/ui/utenti`, dalla 0.2.0)

Pagina Utenti condivisa dai tre portali, che parla col router `/api/utenti` di
`vuscom-auth` (>= 1.1.0) montato da ogni backend. Entry separato apposta: non
importa `react-router-dom` (Outbound non ce l'ha), solo `react` e `lucide-react`.

```jsx
import { GestioneUtenti } from "@vuscom/ui/utenti";

<GestioneUtenti
  portale="cruscotto"              // "offerte" | "cruscotto" | "outbound"
  nomePortale="Cruscotto"
  client={client}                  // { get(path), post(path, body), put(path, body), del(path) }
  attore={{ id: 21, ruolo: "admin" }}
  basePath="/api/utenti"           // default
  SezioneExtra={({ utente }) => …} // facoltativa, in fondo alla finestra Modifica
/>
```

Il `client` è dell'app (porta con sé cookie/token): restituisce il JSON (o `null`
su 204) e, su errore HTTP, **lancia** un `Error` con `.status` (numero) e `.body`
(JSON già letto, o `null`). La pagina mostra `body.detail` dentro la finestra
che ha fallito, e riconosce il 409 `{detail: {codice: "esiste", utente}}` per
proporre «Dai accesso a …» invece di un errore.

Le regole di permesso le applica il backend; la pagina nasconde solo ciò che
l'attore non potrebbe mai fare (Disattiva/Riattiva/Elimina sotto admin, le
azioni distruttive sulla propria riga). Niente `<select>`, checkbox o radio
nativi: ruolo e interruttori sono componenti propri, con varianti `dark:`.

⚠️ Come per la sidebar, il `content` di `tailwind.config.js` dell'app deve
includere `node_modules/@vuscom/ui/dist/**/*.js`, altrimenti le classi non
vengono generate.

## Sviluppo

```bash
npm install
npm test        # vitest
npm run build   # esbuild -> dist/index.js + dist/utenti.js (gira anche in `prepare`)
```
