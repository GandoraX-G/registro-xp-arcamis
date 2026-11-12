# Arcamis Web

**Sito online:** https://arcamis-register.pages.dev  
**Cloudflare Pages project:** `arcamis-register`  
**Database:** Cloudflare D1, regione UE

## Distribuzione attiva

Il progetto è collegato al branch `main` del repository `GandoraX-G/registro-xp-arcamis`. I nuovi commit avviano automaticamente un deploy. Le anteprime per branch sono disattivate e la produzione usa la directory `public/`.

La tabella D1 è stata inizializzata; il binding `DB` e il secret cifrato `BOOTSTRAP_SECRET` sono configurati su Cloudflare. Non aggiungere segreti o dati del registro a GitHub.

## Primo accesso

1. Apri il sito online. La prima schermata richiede il codice monouso fornito separatamente al proprietario.
2. Scegli username e password dell’amministratore sul sito. Non comunicarli in chat e non salvarli nel repository.
3. Accedi come admin e importa `arcamis-import.json`, fornito separatamente e non incluso in questo repository.
4. Dall’area Amministrazione crea le credenziali degli altri membri. Non esiste registrazione pubblica.
5. Aggiungi il link Google Fogli alla scheda del rispettivo PG: il campo è modificabile solo dall’admin.

Conserva `arcamis-import.json` e il codice monouso fuori da GitHub. Il primo file contiene il registro della campagna; il secondo permette di inizializzare l’admin finché il database non ha utenti.

## Ruoli e dati

- **Admin:** gestisce account, avventurieri, link ai fogli e voci XP; può importare ed esportare backup JSON.
- **Membro:** consulta avventurieri, sessioni e schede.
- Archiviare un PG lo nasconde dall’elenco attivo ma conserva la cronologia XP.
- Le password sono memorizzate con PBKDF2 e salt individuale; la sessione usa cookie HttpOnly, Secure e SameSite=Strict.

## Struttura

- `public/`: interfaccia web e intestazioni di sicurezza.
- `functions/api/`: API di autenticazione e gestione dati.
- `migrations/`: schema Cloudflare D1.
- `wrangler.jsonc`: configurazione Pages e binding D1.

Il repository GitHub è pubblico: contiene il codice dell’app, non i dati della campagna né il codice monouso admin.

