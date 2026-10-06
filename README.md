# @vuscom/ui

Design system condiviso tra i frontend VUS COM (Cruscotto, Hub Offerte, Outbound).

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

Più `AppSidebar` / `normalizeNavTree` / `collectGroupIds` e l'entry `@vuscom/ui/utenti`.
Tutto in italiano nei testi, `dark:` su ogni componente, niente elementi nativi
(`select`, checkbox, radio): i controlli sono propri.

### Utilità
`cn(...)` (clsx + tailwind-merge) · `formatNumero` e gli altri formattatori di
`lib/format.js` · `useTheme()` → `{ theme, setTheme, toggleTheme }`.

### Atomi
| Componente | Props principali |
|---|---|
| `Button` | `variant` (`primary` `secondary` `outline` `ghost` `destructive` `link`), `size` (`sm` `md` `lg`), `loading`, `icon`, `iconRight`, `fullWidth` |
| `IconButton` | `icon`, `label` (obbligatoria, aria), `variant`, `size` |
| `Input` / `Textarea` | `invalid`, `icon` (solo Input), `rows` (solo Textarea) + props native |
| `Badge` | `tone` (`neutral` `primary` `success` `warning` `danger` `info`), `dot` |
| `StatusDot` | `tone`, `label`, `pulse` |
| `Spinner` | `size` (`sm` `md` `lg`), `label` |
| `ProgressBar` | `value`, `max`, `tone`, `label`, `showValue` |
| `Kbd` | `children` |

### Molecole
| Componente | Props principali |
|---|---|
| `Field` | `label`, `hint`, `error`, `required`, `id` — un solo figlio (Input, Select…) |
| `Select` | `value`, `onChange`, `options` (`{value,label,disabled}`), `placeholder`, `allowClear`, `disabled`, `invalid` |
| `Toggle` | `checked`, `onChange`, `label`, `description`, `disabled` |
| `Checkbox` | `checked`, `indeterminate`, `onChange`, `label`, `disabled` |
| `Tabs` | `value`, `onChange`, `items` (`{id,label}`) |
| `SegmentedControl` | `value`, `onChange`, `options` (`{value,label,icon}`), `size` |
| `Tooltip` | `content`, `side`, `wide` |
| `InfoTip` | `children`, `label`, `side` |

### Organismi
| Componente | Props principali |
|---|---|
| `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` | `interactive` (Card); `title`, `description`, `actions` (CardHeader) |
| `KpiCard` | `label`, `value`, `hint`, `delta` (`{value,label}`), `tone`, `icon`, `loading`, `help` |
| `DataTable` | `columns` (`{key,header,cell,sortable,sortAccessor,align,width}`), `rows`, `rowKey`, `onRowClick`, `loading`, `empty`, `initialSort`, `dense`, `caption` |
| `Pagination` | `page`, `pageSize`, `total`, `onPageChange` |
| `useSort` | `useSort(rows, { initial, accessors })` |
| `Dialog` | `open`, `onClose`, `title`, `description`, `icon`, `size`, `footer`, `closeOnBackdrop` |
| `ConfirmDialog` | `open`, `onClose`, `onConfirm` (async), `title`, `confirmLabel`, `cancelLabel`, `tone` (`primary`/`danger`), `requireText` |
| `ToastProvider`, `useToast` | `const { toast } = useToast(); toast({ title, description, tone, duration })` |
| `Alert` | `tone` (`info` `success` `warning` `danger`), `title`, `onClose` |
| `EmptyState` | `icon`, `title`, `description`, `action` |
| `Skeleton`, `SkeletonText`, `SkeletonCard`, `SkeletonTable` | `lines` (SkeletonText) |

### Template
| Componente | Props principali |
|---|---|
| `AppShell` | `sidebar` (props di `AppSidebar` + `nav`, `adminNav`), `topbarRight`, `maxWidth`; va dentro un Router |
| `PageHeader` | `title`, `description`, `icon`, `help`, `helpHref`, `actions`, `tabs` |
| `Section` | `title`, `description`, `actions` |
| `LoginPage` | `title`, `subtitle`, `logoLight`, `logoDark`, `onSubmit`, `usernameLabel`, `footer` |

## Installazione in un'app

1. `package.json`:
   ```json
   "@vuscom/ui": "github:gabrielepanciotti-vuscom/vuscom-ui#v1.0.0"
   ```
2. `tailwind.config.js` — preset e `content`:
   ```js
   module.exports = {
     presets: [require("@vuscom/ui/preset")], // ESM: import preset from "@vuscom/ui/preset"
     content: [
       "./node_modules/@vuscom/ui/dist/**/*.js", // ⚠️ senza questa riga le classi del pacchetto non vengono generate
       "./index.html",
       "./src/**/*.{js,jsx}",
     ],
   };
   ```
3. Entry dell'app: `import "@vuscom/ui/theme.css";`
4. `index.html`: nel `<head>`, inline, lo script `THEME_INIT_SCRIPT`
   (`import { THEME_INIT_SCRIPT } from "@vuscom/ui"`; il valore è una stringa JS da incollare in un `<script>`).

**⚠️ Il passo 2 va in testa, non è opzionale.** Le versioni si consumano **per
tag**, mai da `main`: una modifica al pacchetto non deve cambiare una build già fatta.

```jsx
import { AppShell, PageHeader, Button, DataTable } from "@vuscom/ui";
```

## Regole del pacchetto

- Solo presentazione: niente chiamate API, niente stato di dominio, niente segreti.
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

## Sviluppo e versionamento

```bash
npm install
npm test           # vitest
npm run build      # esbuild -> dist/ (gira anche in `prepare`)
npm run catalogo   # catalogo visivo
```

`dist/` è versionato: chi installa da GitHub lo riceve già costruito. Si rilascia
con un tag `vMAJOR.MINOR.PATCH` su `main`; i progetti si aggiornano cambiando il tag.
