# API

Il pacchetto non espone nessuna API HTTP: non ha un server. Espone le entry npm elencate in
`architecture.md` (props e uso nel `README.md`). Alcuni moduli però **chiamano** endpoint che il
backend del portale deve fornire; i percorsi sono i default del codice e si possono cambiare per prop.

| Modulo | Chiamate (default) |
|---|---|
| `segnalazioni` (`SegnalazioniProvider`) | `GET /api/segnalazioni/config` (il pulsante compare solo se il portale lo abilita), `POST /api/segnalazioni` (multipart, `credentials: include`) |
| `utenti` (`useUtenti`, `GestioneUtenti`) | `GET /api/utenti?includi_disattivati=<bool>` tramite il `client` passato dal portale |
| `accesso` (`useAccessoMicrosoft`) | `GET /api/auth/microsoft/disponibile`, `POST /api/auth/microsoft/scambia` (`{ biglietto }`), redirect a `/api/auth/microsoft/login` |

Contratto della `POST /api/segnalazioni`, come lo legge `src/segnalazioni/invio.js`:
2xx → `{ ticket_id, url, duplicato }`; 503 con `riprova: false`, 404 e 405 → segnalazioni non
disponibili; 413 troppo grande; 422 con `detail` testuale; 401/403 sessione scaduta; altri 5xx e
rete assente → il widget propone di riprovare. Se il portale autentica con header Bearer, passa
`getToken` al provider.
