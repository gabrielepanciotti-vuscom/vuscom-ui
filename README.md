# @vuscom/ui

Design system condiviso tra i portali VUS COM: Hub Offerte, Cruscotto, Outbound,
Configuratore e Portale Segnalazioni. Tutti hanno lo stesso stile grafico, e tutti
tranne il Portale Segnalazioni anche la stessa struttura (`AppShell`). Anche ogni
portale nuovo nasce così. Lo verifica `vuscom-ui-conformita` (sotto).

Contiene solo presentazione: nessun dato, nessun endpoint, nessun segreto.
Il repo è pubblico apposta, così le build Docker dei progetti possono
installarlo senza token.

## Cosa contiene

Quattro strati, dal più piccolo al più grande:

1. **Tema** — token CSS (`theme.css`), preset Tailwind (`preset`), `useTheme`,
   `ThemeToggle`, `THEME_INIT_SCRIPT` (evita il lampo bianco al primo paint).
2. **Atomi e molecole** — i controlli di base.
3. **Organismi** — blocchi composti (tabelle, finestre, notifiche).
4. **Template** — struttura delle pagine (`AppShell`, `PageHeader`, `Section`, `LoginPage`).

Più `AppSidebar` / `normalizeNavTree` / `collectGroupIds` e gli entry `@vuscom/ui/utenti`
e `@vuscom/ui/segnalazioni` e `@vuscom/ui/grafici`.

Albero di navigazione: una foglia ha `to` (con `badge`/`badgeTone`), un gruppo a fisarmonica
`{ label, icon, children }`, una **sezione** `{ section: "Clienti segnalati", children }`:
titolo fisso maiuscolo, non richiudibile (i badge restano visibili), da compressa un divisore.
`normalizeNavTree` appiattisce i gruppi con un figlio solo, mai le sezioni; toglie entrambi se vuoti.
Tutto in italiano nei testi, `dark:` su ogni componente, niente elementi nativi
(`select`, checkbox, radio): i controlli sono propri.

### Utilità
`cn(...)` (clsx + tailwind-merge) · `formatNumero` e gli altri formattatori di
`lib/format.js` · `useTheme()` → `{ theme, setTheme, toggleTheme }`.
- **Periodi** (dalla 1.12.0, UTC, etichette it-IT): `periodOf(data, "settimana"|"mese")` → `"2026-W42"` / `"2026-10"` ·
  `periodSpan(key)` → `{ start, end }` (`end` escluso) · `periodLabel(key, { breve })` · `periodsBetween(dal, al, gran)` ·
  `isPartial(key, { from, to, now })` (tagliato dal filtro o non ancora chiuso; `now: null` ignora il calendario).
- **CSV** (dalla 1.12.0): `toCsv(rows, columns)` / `esportaCsv(nomeFile, rows, columns)` — BOM, `;`, virgola
  decimale, escape e neutralizzazione delle formule. Le colonne sono quelle di `DataTable`: valore da
  `csv(row)` → `sortAccessor` → `row[key]`, titolo da `csvHeader` → `header` stringa; `csv: false` esclude.
- **Date** `parseDataIt("4/10/2026")` → `"2026-10-04"` (`null` vuoto, `undefined` non valida) · `formatDataIt(iso)`.

### Atomi
| Componente | Props principali |
|---|---|
| `Button` | `variant` (`primary` `secondary` `outline` `ghost` `destructive` `link`), `size` (`sm` `md` `lg`), `loading`, `icon`, `iconRight`, `fullWidth` |
| `IconButton` | `icon`, `label` (obbligatoria, aria), `variant`, `size` |
| `Input` / `Textarea` | `invalid`, `icon` (solo Input), `rows` (solo Textarea) + props native |
| `Badge` | `tone` (`neutral` `primary` `success` `warning` `danger` `info`), `dot` |
| `StatusDot` | `tone`, `label`, `pulse` |
| `Spinner` | `size` (`sm` `md` `lg`), `label` |
| `ProgressBar` | `value`, `max`, `tone`, `label`, `showValue`, `aria-label` (nome accessibile senza etichetta visibile) |
| `Kbd` | `children` |

### Molecole
| Componente | Props principali |
|---|---|
| `Field` | `label`, `hint`, `error`, `required`, `id` — un solo figlio (Input, Select…) |
| `Select` | `value`, `onChange`, `options` (`{value,label,disabled}`), `placeholder`, `allowClear`, `disabled`, `invalid` — la lista si apre in un portal (`position: fixed`), quindi non viene tagliata da tabelle e finestre. Il pulsante è un `combobox` (la lista è etichettata da lui); da tastiera: frecce, Home/End (prima/ultima opzione abilitata), digitazione di un prefisso (buffer azzerato dopo 500 ms), Invio/Spazio, Esc |
| `Toggle` | `checked`, `onChange`, `label`, `description`, `disabled`, `id` + props extra sul pulsante (cablabile da `Field`) |
| `Checkbox` | `checked`, `indeterminate`, `onChange`, `label`, `disabled`, `id` + props extra sul pulsante (cablabile da `Field`) |
| `Tabs` | `value`, `onChange`, `items` (`{id,label}`), `idPrefix` — con `useTabIds()` gli id sono per istanza (`ids.tab(x)`, `ids.panel(x)`); senza, restano `tab-<id>`/`panel-<id>` |
| `SegmentedControl` | `value`, `onChange`, `options` (`{value,label,icon}`), `size` |
| `Tooltip` | `content`, `side`, `wide` |
| `InfoTip` | `children`, `label`, `side`, `wide` (va a capo; automatico per stringhe lunghe) |
| `CampoData` | `value`/`onChange` in ISO (`"YYYY-MM-DD"`, `null` = vuoto), `min`, `max`, `invalid` — si scrive `gg/mm/aaaa` o si sceglie dal calendario; mai `input type=date`. `aria-describedby`, `aria-invalid` e gli altri attributi vanno all'input; con testo non valido un messaggio sr-only «Data non valida, usa il formato gg/mm/aaaa» si aggiunge a `aria-describedby` |
| `CalendarioMese` | `value`, `onChange`, `min`, `max`, `oggi` — lunedì primo, frecce/PagSu/PagGiù da tastiera |
| `ChipFiltro` | `children`, `onRemove` |
| `PulsanteEsportaCsv` | `nomeFile`, `rows` (array o funzione letta al clic), `columns` (di `DataTable`) |

### Organismi
| Componente | Props principali |
|---|---|
| `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` | `interactive` (Card); `title`, `description`, `actions` (CardHeader) |
| `KpiCard` | `label`, `value` (`null`/`NaN` → «—»), `hint`, `delta` (`{value,label}`), `tone` (anche `info`), `icon`, `loading`, `help`, `segnala` (vedi Segnalazioni) |
| `TopScrollX` | `children`, `className`, `ariaLabel` (predefinito: «Tabella scorrevole») — contenitore a scorrimento orizzontale con una seconda barra in alto, sincronizzata con quella in fondo, visibile solo se il contenuto deborda (dalla 1.18.0). `DataTable` lo usa già; per una tabella scritta a mano avvolgila qui. Senza `ResizeObserver` misura una volta sola |
| `DataOra` | `value`, `soloData` — data e ora su due righe (giorno sopra, hh:mm sotto più chiaro, `tabular-nums`, niente secondi), trattino se vuoto o non valida (dalla 1.18.0) |
| `DataTable` | `columns` (`{key,header,cell,sortable,sortAccessor,align,width}`), `rows`, `rowKey`, `onRowClick`, `loading`, `error`, `onRetry`, `empty`, `initialSort`, `dense`, `caption`, `mobileCards` (predefinito: `false`), `className`, `segnala` (anche per colonna: `colonna.segnala`) — `error` mostra un avviso di errore e `onRetry` aggiunge «Riprova». Con `mobileCards` ogni riga diventa una Card sotto `sm`. `onRowClick` non scatta sui controlli nella cella (link, pulsanti, `[data-no-row-click]`). Colonna con `bar: true` (dalla 1.12.0): barra inline proporzionale al massimo della colonna (valore da `barValue(row)` → `sortAccessor` → `row[key]`). `pageSize` (dalla 1.15.0): paginazione dopo l'ordinamento. Dalla 1.18.0: padding cella `px-3 py-2.5`, barra di scorrimento anche in alto (`TopScrollX`) e `srOnly: true` su una colonna per la sola intestazione per screen reader (colonna azioni) |
| `MatriceCalore` | `righe` (`{id,label,valori:{[periodo]:n}}`), `periodi` (chiavi o `{key,label,parziale}`), `onRigaClick`, `formatValore`, `etichettaRighe`, `totale`, `quota`, `rigaTotali`, `caption` — intensità `sqrt(valore/massimo)` sul token `primary`. Dalla 1.15.0: `scala="riga"` (ogni riga sul proprio massimo), `nd` (testo per i valori mancanti; lo zero vero resta zero), `format` per riga |
| `BarraFiltriPeriodo` | `value`/`onChange` (`{dal,al,granularita}`), `predefinito`, `onReset`, `filtri` (chip extra `{id,label,onRemove}`), `granularita`, `min`, `max`, `children` (slot dei filtri della pagina) |
| `Pagination` | `page`, `pageSize`, `total`, `onPageChange`, `className` |
| `useSort` | `useSort(rows, { initial, accessors })` — numeri e date per valore, stringhe con ordinamento numerico («9» prima di «10»), `null`/`NaN` sempre in fondo |
| `Dialog` | `open`, `onClose`, `title`, `description`, `icon`, `size`, `footer`, `closeOnBackdrop`, `closeDisabled` |
| `ConfirmDialog` | `open`, `onClose`, `onConfirm` (async), `title`, `confirmLabel`, `cancelLabel`, `tone` (`primary`/`danger`), `requireText` |
| `ToastProvider`, `useToast` | `const { toast } = useToast(); toast({ title, description, tone, duration })` — annunciati dagli screen reader (`danger` in una regione `assertive`, gli altri `polite`) |
| `VediCome` (dalla 1.14.0) | `viste` (`{key,label,descrizione}`; vuoto → non si vede), `attiva` (key o `null`), `onSeleziona(key \| null)`, `labelAttiva`, `nota`, `labelRipristino`, `titolo` — selettore «Vedi come» della top bar, da mettere in `topbarRight` di `AppShell`. Solo presentazione: cosa vuol dire cambiare vista lo decide il portale |
| `Alert` | `tone` (`info` `success` `warning` `danger`), `title`, `onClose` |
| `EmptyState` | `icon`, `title`, `description`, `action` |
| `Skeleton`, `SkeletonText`, `SkeletonCard`, `SkeletonTable` | `lines` (SkeletonText) |

### Template
| Componente | Props principali |
|---|---|
| `AppShell` | `sidebar` (props di `AppSidebar` + `nav`, `adminNav`), `topbarRight`, `azioniSidebar` (nodo, o funzione `({ compressa }) => nodo`: aperta una riga sua nel piè della sidebar sopra «Tema», compressa sopra l'interruttore; per le segnalazioni `azioniSegnalazioni`), `maxWidth`, `compattaAdOgniPagina` (ogni pagina si apre con la sidebar compressa; il pulsante — pieno, nel colore primario — la riapre solo per la pagina corrente; default spento: vale la preferenza salvata); `idContenuto` (id del `<main>`, bersaglio del link «Vai al contenuto» in cima alla pagina; default `contenuto`); il menu mobile ha `aria-expanded`/`aria-controls`, si chiude con Esc (il focus torna al burger) e a ogni cambio di pagina; va dentro un Router |
| `useSidebarCompatta(attiva = true)` | hook per le pagine che vogliono spazio (builder di report, tabelle larghe): finché la pagina è montata la sidebar resta compressa, poi torna alla preferenza dell'utente, che non viene sovrascritta |
| `PageHeader` | `title`, `description`, `icon`, `help`, `helpHref`, `actions`, `tabs`, `className` |
| `Section` | `title`, `description`, `actions`, `className` |
| `LoginPage` | `title`, `subtitle`, `logoLight`, `logoDark`, `onSubmit`, `usernameLabel`, `footer`, `microsoft` (`{ onAccesso, base? }`: aggiunge «Accedi con Microsoft») |

## Installazione in un'app

1. `package.json`:
   ```json
   "@vuscom/ui": "github:gabrielepanciotti-vuscom/vuscom-ui#v1.7.0"
   ```
2. `tailwind.config.js` — preset e `content` (ESM, come nei progetti Vite):
   ```js
   import preset from "@vuscom/ui/preset";

   export default {
     presets: [preset],
     content: [
       "./node_modules/@vuscom/ui/src/**/*.{js,jsx}", // ⚠️ senza questa riga le classi del pacchetto non vengono generate
       "./index.html",
       "./src/**/*.{js,jsx}",
     ],
   };
   ```
   Si scansiona `src/` (pubblicato col pacchetto), non `dist/`: è lì che le
   classi stanno scritte per intero. In CommonJS: `presets: [require("@vuscom/ui/preset")]`.
3. Entry dell'app: `import "@vuscom/ui/theme.css";`
4. `index.html`: nel `<head>`, inline, prima del bundle, il valore di
   `THEME_INIT_SCRIPT`. In un `index.html` statico (Vite) non si può importare:
   si incolla la stringa letterale di `src/theme/initScript.js` così com'è:
   ```html
   <script>try{var t=null;try{t=localStorage.getItem('theme')}catch(e){}var d=t?t==='dark':window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',!!d);}catch(e){}</script>
   ```
   Se il pacchetto cambia lo script (vedi le note di rilascio), va ricopiato.

**⚠️ Hub Offerte e Cruscotto (shadcn):** `theme.css` mette un outline globale su
`*:focus-visible`. I componenti shadcn hanno già il loro `focus:ring`, quindi lì
l'anello può apparire doppio: in migrazione, togliere uno dei due (di solito il
`ring` locale del componente shadcn).

**⚠️ Il passo 2 va in testa, non è opzionale.** Le versioni si consumano **per
tag**, mai da `main`: una modifica al pacchetto non deve cambiare una build già fatta.

```jsx
import { AppShell, PageHeader, Button, DataTable } from "@vuscom/ui";
```

## Colori e marchio VUS COM (dalla 1.5.0)

Decisi da Gabriele il 09/10/2026, dopo una 1.4.0 col magenta ovunque («sembra il sito di
un'estetista»):
- **`primary` e la scala `brand-50…950` sono il blu dei portali**, la stessa tinta del blu di
  prima. `brand-*` sostituisce `blue-*`/`indigo-*` nel codice dei portali, così il colore si
  cambia da qui e non file per file.
- **`accento` è il giallo di vuscom.it** (`#fcc72c`, il giallo «luce» del sito), con
  `accento-foreground` navy. Si usa **solo per i dettagli**, mai per sfondi, pulsanti o bordi
  di selezione (un bordo giallo sulla voce attiva della sidebar è stato provato e bocciato).
- **`bg-brand-gradient`** è la sfumatura del logo (viola → magenta → corallo): resta per il
  marchio e basta.
- `success`/`warning`/`info`/`destructive` restano semantici.

Il marchio sta nel pacchetto, quindi il portale non ha file di logo propri:
- la **sidebar** mostra la «V» VUS COM chiaro/scuro se non riceve `appIcon`, e il portale
  non deve passarlo;
- **`LoginPage`** usa il marchio «VUS COM energia vicina» se non riceve `logoLight`/`logoDark`;
- **`AppShell`** e **`LoginPage`** impostano l'icona della scheda (`useFaviconVuscom`), quindi
  `index.html` non dichiara nessuna favicon;
- per usi propri ci sono `LogoV`, `MarchioVuscom` e `LOGHI_VUSCOM`. Le immagini sono data URL
  dentro il bundle: nessun asset da copiare e nessun `.png` da risolvere nei test.

## Icona di ogni portale (dalla 1.7.0)

Il riquadro è quello originale, con la stessa V nella stessa posizione: cambia **solo il colore
dello sfondo**, uno per ogni portale interno. Vale sia nella sidebar sia nell'icona della
scheda, così i portali si distinguono a colpo d'occhio (`TESSERE_PORTALE`, immagini già pronte):

| Portale | `iconaPortale` | Sfondo |
|---|---|---|
| Hub Offerte | `offerte` | blu `#2563eb` (il blu dei pulsanti) |
| Cruscotto | `cruscotto` | verde petrolio `#0f5c55` |
| Outbound | `outbound` | bordeaux `#7f1d1d` |
| Configuratore | `configuratore` | navy `#1b3a69`, il riquadro originale |
| Admin Data API | `dataapi` | viola `#4c1d95` |
| Brain Editor | `braineditor` | ambra `#b45309` |

- Il portale passa `iconaPortale` nelle props della sidebar di `AppShell`. `LoginPage` accetta
  la stessa prop, per l'icona della scheda.
- **Aggiungere un portale non richiede una release (dalla 1.10.0).** `iconaPortale` accetta,
  oltre alle chiavi sopra, un colore esadecimale: `iconaPortale: "#0e7490"` oppure
  `iconaPortale: { colore: "#0e7490" }`. Vale ovunque: sidebar, `LogoV portale="#0e7490"`,
  scheda del browser (`useFaviconVuscom`, `LoginPage`). La tessera si genera a runtime
  dal riquadro navy originale (stessa V, stessa posizione, solo lo sfondo cambia; mappa per
  canale, quindi i bordi sfumati restano puliti) e si ricorda per colore. Senza canvas
  (test jsdom, SSR) o con un esadecimale malformato mostra la V neutra, senza errori.
- Il tester `vuscom-ui-conformita` accetta un `#rrggbb` valido, **blocca** uno malformato
  (`icona-portale`) e **avvisa** (`icona-portale-vicina`) se è troppo vicino a un portale
  esistente o al navy pubblico (distanza RGB sotto 60, soglia in `conformita-regole.json`):
  scegliere un colore ben distinto dagli altri. Le chiavi note (`COLORI_PORTALE`) restano
  valide e invariate; ai portali già in tabella non cambia niente.
- **I portali pubblici restano sempre col navy originale** (Gabriele, 09/10): il Portale
  Segnalazioni senza voce, il Configuratore, che serve anche i clienti, col navy.

## Altri portali (dalla 1.8.0)

Un solo elenco dei portali interni (`PORTALI_INTERNI` in `src/accesso/portali.js`: nome,
indirizzo interno `*.vuscom.dev`, pubblico `*.vuscom.it` dove esiste). Nessun portale scrive
più la sua lista a mano.

- **Sotto il login** `LoginPage` mostra da sola «Accedi ad altri portali» (prop
  `altriPortali`, attiva di default): i portali dell'ultimo utente che si è collegato da quel
  browser; se non c'è nessuno da ricordare, tutti sui domini interni `*.vuscom.dev` e nessuno sui
  domini pubblici `*.vuscom.it`, dove può esserci un agente esterno o un cliente.
- **Nella sidebar** `AppShell` mostra le tessere degli altri portali a cui l'utente è
  abilitato. Il portale passa `portali` nelle props della sidebar: i codici di
  `user_progetto_ruolo` restituiti dal suo `/me`. Gli stessi codici vengono ricordati per la
  pagina di login.
- **Passaggio da un portale all'altro**: il link porta a `https://<portale>/?accedi=microsoft`.
  Lì «Accedi con Microsoft» parte da solo e, con una sessione Microsoft già aperta, si entra
  senza digitare nulla. L'identità la gestisce Entra ID, i ruoli restano in `user_progetto_ruolo`.
  Senza Microsoft (fuori rete, o finché non è attivo) la pagina di arrivo chiede il login.
- Un link resta nella zona in cui si è: da `*.vuscom.it` non si propone un portale solo interno.
- Il tester avvisa con `portali-sidebar` (sidebar senza `portali`) e `portali-a-mano` (lista
  «Accedi ad altri portali» scritta nel portale).

## Guide (dalla 1.6.0)

Ogni portale ha due livelli di guida, nello stesso posto in tutti i portali:
- **la guida generale**: un pulsante nella sidebar, accanto a «comprimi». Il portale passa
  `guida` nelle props della sidebar di `AppShell`: un path (`"/guida"`), un URL (si apre in
  una nuova scheda) o `{ href, label }`. È obbligatoria: il tester la blocca se manca;
- **la guida della pagina**: dove serve, il link «Guida» di `PageHeader` (`helpHref`), che
  porta alla sezione giusta della guida generale.

## Vedi come (dalla 1.14.0)

Il cambio vista della top bar è uno solo per tutti i portali: `VediCome` in `topbarRight` di
`AppShell`. Il componente non sa niente di ruoli e permessi: riceve le viste che l'utente può
usare (chi non può riceve `[]` e non vede niente) e chiama `onSeleziona` con la chiave scelta,
o `null` per tornare alla vista reale. Offerte ci mette il travestimento lato client del ruolo,
il Portale Segnalazioni l'ingresso nell'account demo. Il tester blocca con `vedi-come` un
selettore scritto nel portale.

```jsx
<VediCome
  viste={puoCambiare ? [{ key: "viewer", label: "Viewer", descrizione: "Sola lettura" }] : []}
  attiva={vista}
  onSeleziona={(k) => { setVista(k); location.reload(); }}
  nota="Cambia solo ciò che vedi. I permessi reali restano i tuoi."
/>
```

## Conformità: `vuscom-ui-conformita`

Un portale si allinea **da solo**, rilanciando il tester finché non dà `ok`:

```bash
cd frontend && npx vuscom-ui-conformita          # tabella; esce 1 solo se c'è un bloccante
npx vuscom-ui-conformita --json                   # contratto comune dei tester (ok | avvisi | bloccante)
```

Le regole sono dati, in `bin/conformita-regole.json`.
- **Bloccanti:** versione minima, preset, `theme.css`, token del tema ridefiniti, pagine fuori
  da `AppShell`, selettore «Vedi come» scritto nel portale (`vedi-come`).
- **Avvisi:** versione non all'ultima, palette di colori propria, colori in `tailwind.config`,
  `blue`/`indigo`/`violet`/`sky` cablati, logo, favicon o loghi di login propri.

Il traguardo è **`ok`, cioè zero avvisi**. Ogni portale lo mette nei propri test
(`"conformita": "vuscom-ui-conformita"` negli script).

Una struttura di pagina diversa si dichiara, non si deduce: in `package.json` del portale
`"vuscomUi": { "struttura": "propria" }`. Oggi vale solo per il Portale Segnalazioni, e
salta la sola regola `app-shell`: lo stile resta lo stesso.

## Regole del pacchetto

- Solo presentazione: niente chiamate API, niente stato di dominio, niente segreti.
  Eccezioni dichiarate: `@vuscom/ui/utenti` (tramite il `client` dell'app) e
  `@vuscom/ui/segnalazioni` (parla col router `/api/segnalazioni` del portale).
- Un test per componente (`test/`, vitest + Testing Library).
- Nessun elemento nativo visibile (`select`, checkbox, radio): controlli custom.
- Nessun colore esadecimale nei componenti: classi semantiche (`bg-primary`, `border-border`…).
- Nessun sorgente oltre 300 righe.
- Nessun React proprio: `react`, `react-dom`, `react-router-dom`, `lucide-react` sono peer dependency.
- La 1.0.0 è additiva: `AppSidebar`, `normalizeNavTree`, `collectGroupIds` e `@vuscom/ui/utenti` non cambiano API.

## Catalogo

```bash
npm run catalogo   # vite su catalogo/ → http://localhost:3399
```

Una pagina con ogni componente, tutte le varianti e gli stati, con interruttore
chiaro/scuro. È il posto dove guardare prima di scrivere un componente nuovo.

## `AppSidebar`

`AppSidebar` non gestisce il tema né conosce le azioni delle pagine: li riceve
come slot (`themeSlot`, `footerSlot`). Normalmente la si usa tramite `AppShell`,
che le passa lo stato (collasso, gruppi aperti, menu mobile). Non importa React
come dipendenza propria — usa quello dell'app che la ospita.

Da chiuso il pannello mobile (l'`<aside>` dell'overlay) è `inert` e `aria-hidden`,
così i suoi link non entrano nel Tab né nei lettori di schermo; da aperto non ha
nessuno dei due. La prop facoltativa `idPannelloMobile` dà un `id` a quell'`<aside>`,
per l'`aria-controls` del pulsante che lo apre (`AppShell` la compila da solo). Su
desktop non cambia nulla.

## Gestione utenti (`@vuscom/ui/utenti`, dalla 0.2.0)

Pagina Utenti condivisa dai tre portali, che parla col router `/api/utenti` di
`vuscom-auth` (>= 1.1.0) montato da ogni backend. Entry separato apposta: non
importa `react-router-dom`, solo `react` e `lucide-react`, così la pagina si
può montare anche fuori da un Router.

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

## Segnalazioni (`@vuscom/ui/segnalazioni`, dalla 1.1.0)

Il pulsante «Segnala un problema»: l'utente indica l'elemento che non va,
scrive cosa non torna, e la segnalazione arriva come ticket con screenshot,
ultime azioni e video delle ultime azioni. Parla col router di `vuscom-auth`
(>= 1.5.0, `crea_router_segnalazioni`) montato dal backend del portale su
`/api/segnalazioni`. Entry separato: `rrweb` (2.1.7) e `modern-screenshot`
sono dipendenze di questo entry soltanto, caricate con `import()` solo se il
portale ha le segnalazioni accese — `dist/index.js` non le nomina.

```jsx
import { AppShell } from "@vuscom/ui";
import { SegnalazioniProvider, PulsanteSegnala, segnalaAttr } from "@vuscom/ui/segnalazioni";

<SegnalazioniProvider
  endpoint="/api/segnalazioni"               // default
  configEndpoint="/api/segnalazioni/config"  // default
  durataVideoSec={30}                        // default; vince quello del config
  mascheraDefault={false}                    // default; true = «Maschera i dati» parte accesa
>
  <AppShell sidebar={…} azioniSidebar={azioniSegnalazioni}>
    <KpiCard label="Clienti attivi" value={n}
      segnala={{ tipo: "kpi", id: "kpi_clienti_attivi", nome: "Clienti attivi",
                 contesto: { periodo: "2026-09" } }} />
    <div {...segnalaAttr({ tipo: "grafico", id: "trend", nome: "Trend mensile" })}>…</div>
  </AppShell>
</SegnalazioniProvider>
```

| Pezzo | Cosa fa |
|---|---|
| `SegnalazioniProvider` | Chiede `GET {configEndpoint}` (con i cookie). Se `abilitato` è `false` o la chiamata fallisce non monta nulla e non registra nulla. Altrimenti tiene il registro delle ultime **200** azioni (cambi pagina, click, richieste `fetch`/XHR con metodo, percorso senza query, stato e durata — **mai i corpi** —, `console.error`, eccezioni) e la registrazione rrweb degli ultimi `durata_video_sec` secondi, solo in memoria. **`getToken`** (`() => string | null`): per i portali che autenticano con l'header `Authorization` (Cruscotto, Hub Offerte) — ogni chiamata del widget porta `Bearer <token>`. Senza, `/config` risponde 401, il pulsante resta nascosto e in console compare un avviso. Props extra: `fetchImpl` (solo per i test). |
| `PulsanteSegnala` | `compatto` (solo icona). Non rende nulla se il provider è spento o assente. |
| `useSegnalazioni()` | `{ abilitato, apri(), stato }` — `stato`: `inattivo` · `mirino` · `cattura` · `modale`. |
| `segnalaAttr({tipo, id, nome, contesto})` | Le props `data-segnala` (JSON) da spargere su un elemento. Nessuno scrive il JSON a mano. `tipo` è un vocabolario aperto (`kpi`, `grafico`, `tabella`, `colonna`, `campo`, `parametro`, `export`…) con cui TicketManager sceglie la categoria. |
| `mascheraEventi`, `mascheraDom`, `mascheraAzioni`, `PRIVATO` | Le funzioni pure di maschera, esportate per i test dei portali. |

Il flusso: pulsante → **mirino** (l'elemento sotto il puntatore si evidenzia,
click = sceglie, `Esc` = annulla, «Segnala senza elemento» per i problemi
generali; si risale al primo antenato con `data-segnala`, altrimenti si
salvano testo ≤ 200 caratteri, percorso CSS breve e rettangolo) → screenshot →
**finestra** con commento obbligatorio (1–5000), «Allega il video delle ultime
azioni» (attivo di default) e «Maschera i dati» (spenta di default, `mascheraDefault`
la riaccende), anteprima dello
screenshot. L'id della segnalazione nasce all'apertura e si riusa a ogni
«Riprova»: un 503 seguito da un nuovo invio non crea due ticket.

**Privacy.** «Maschera i dati» parte **spenta** (dalla 1.8.2; un portale che tratta
dati sensibili passa `mascheraDefault` al provider e parte accesa). Si applica all'invio a screenshot, video e
testo dei click: restano struttura, colori e posizioni. Gli elementi `PRIVATO`
(`[data-segnala-privato]`, `input[type="password"]`) sono mascherati **sempre**,
anche con la maschera spenta. Pulsante e mirino portano `data-segnala-ignora`:
fuori da video, screenshot e registro; la finestra si apre dopo che screenshot,
video e registro sono già stati congelati. Con la maschera
accesa anche `page_url` perde la query string.

**Errori.** `503 {riprova: true}` o rete giù → «Non sono riuscito a inviarla.
Riprova.» con la bozza intatta. `503 {riprova: false}` → «Segnalazione non
disponibile al momento», bozza intatta, nessun «Riprova». `413`/`422` → il
messaggio nella finestra. Successo → notifica «Segnalazione #N inviata» con il
link al ticket. Il video si tronca (dall'inizio, a checkpoint interi) per
restare nei 4 MB per allegato e 5 MB in tutto.

## Grafici (`@vuscom/ui/grafici`, dalla 1.12.0)

```bash
npm install chart.js@4.4.1   # peer opzionale: serve solo a chi importa questo entry
```

```jsx
import { GraficoBarre } from "@vuscom/ui/grafici";

<GraficoBarre
  periodi={[{ key: "2026-09" }, { key: "2026-10", parziale: true }]}
  serie={[{ id: "ok", label: "Accettate", valori: { "2026-09": 10, "2026-10": 4 } }]}
  titolo="Esiti per mese"          // nome accessibile; i numeri vanno anche in una tabella sr-only
  onPeriodoClick={(key) => {}}
/>
```

Barre impilate (`impilate={false}` affiancate), legenda cliccabile, tooltip con titolo del periodo e totale
delle serie visibili, asterisco sui periodi parziali. I colori vengono dai token `--chart-1…8` (una serie può
fissarne uno con `tono: 1…8`) e seguono il tema chiaro/scuro dal vivo. `configGraficoBarre` è la
configurazione Chart.js pura, `coloriTema()` legge i token.

### `PaginaReportCampagna` (dalla 1.15.0)

La pagina Report delle campagne, identica su ogni portale (modello: il report Euris). Non fa fetch:
riceve le foto già lette dal portale.

```jsx
import { PaginaReportCampagna } from "@vuscom/ui/grafici";

<PaginaReportCampagna
  campagne={[{ id: "bonus_50", label: "Bonus 50" }, { id: "segnalatori", label: "Segnalatori" }]}
  campagna={scelta}                  // opzionale: controllata, con onCampagnaChange il portale ricarica
  onCampagnaChange={setScelta}
  righe={snapshot}                   // [{ data_riferimento, mensile, forniture_attive, storni, maturati,
                                     //    costo, margine, guadagno_netto, indicatori, dettaglio, campagna? }]
  caricando={caricando}
  errore={errore}
  azioni={<PulsanteGuida … />}       // slot a destra del titolo
/>
```

- **Intestazione**: tab «Campagna», nome della campagna come titolo, «Situazione al gg/mm/aaaa».
- **Tessere**: metriche e indicatori nella stessa griglia (`TesseraKpi`, stessa altezza), delta rispetto
  all'ultima foto mensile e `Sparkline` sulle foto di fine mese. `null` → «n.d.», mai zero.
- **Filtri** (`FiltriReport`): dal/al e settimana/mese in una riga, valgono per andamento, storico e matrice.
- **Andamento**: barre impilate (forniture attive, storni, maturati) = stato all'ultima foto del periodo.
  Con meno di 2 periodi niente grafico: «Storico in costruzione, prima foto mensile il 1/11».
- **Storico**: `DataTable` ordinabile, barre inline, 10 righe per pagina, «Solo foto mensili», Esporta CSV.
- **Variazioni per periodo**: matrice di calore periodo × indicatore delle differenze fra foto consecutive,
  scala per riga, totale = variazione netta; compare da 3 periodi.

Righe con il campo `campagna` vengono filtrate su quella scelta; senza, sono tutte della campagna scelta.
`etichetteIndicatori` (`{chiave: "Etichetta"}`) e `formatiIndicatori` (`{chiave: "euro"|"numero"}`)
correggono le etichette e l'unità degli indicatori (di default `bonus_*`, `costo*`, `margine*` sono euro).

## Sviluppo e versionamento

```bash
npm install
npm test           # vitest
npm run build      # esbuild -> dist/ (a mano, prima del commit di rilascio)
npm run catalogo   # catalogo visivo
```

`dist/` è versionato: chi installa da GitHub lo riceve già costruito. Per
questo non c'è uno script `prepare`: con `prepare`, ogni installazione da git
scaricherebbe tutte le devDependencies (in ogni build Docker dei consumatori).
`sideEffects: ["*.css"]` lascia al bundler il tree-shaking di tutto il resto. Si rilascia
con un tag `vMAJOR.MINOR.PATCH` su `main`; i progetti si aggiornano cambiando il tag.

## Accedi con Microsoft

`AccessoMicrosoft` (e la prop `microsoft` di `LoginPage`) è il lato frontend di
`vuscom_auth.entra` (vuscom-auth ≥ 1.8.0, router montato su `/api/auth/microsoft`).

```jsx
<AccessoMicrosoft onAccesso={(risposta) => salvaSessione(risposta)} />
// oppure
<LoginPage title="Cruscotto" onSubmit={login} microsoft={{ onAccesso: salvaSessione }} />
```

- Chiede `GET /disponibile`: fuori dalla rete VUS COM (o backend senza config) **non rende
  niente**. Nessuna risposta = nessun pulsante.
- Il pulsante porta a `GET /login`; al ritorno legge `#microsoft=<biglietto>` dal frammento, lo
  **toglie subito dall'URL** e chiama `POST /scambia`.
- `onAccesso(risposta)` riceve **la stessa risposta del login con password** del portale: la
  salva come già fa (token, utente, `must_change_password`…) e naviga.
- `#microsoft_errore=<codice>` → messaggio in italiano (`MESSAGGI_ERRORE_MICROSOFT`), mostrato
  anche fuori rete.
- `useAccessoMicrosoft({ base, onAccesso })` → `{ disponibile, inCorso, errore, accedi }` per chi
  vuole un aspetto diverso.
