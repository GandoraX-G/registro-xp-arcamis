# Registro XP Arcamis

Registro web privato della campagna, pubblicato su Cloudflare Pages e salvato in Cloudflare D1.

**Sito:** https://arcamis-register.pages.dev  
**Progetto Pages:** `arcamis-register`  
**Repository:** `GandoraX-G/registro-xp-arcamis`

## Ruoli

- **Amministratore:** accesso completo; crea account, modifica i ruoli, elimina le credenziali di editor e visualizzatori, importa/esporta dati, gestisce collegamenti Google Fogli, backup e ripristino, ripristina i PG archiviati. L’account `arcamis-admin` è protetto: per eliminarlo, declassarlo o disattivarlo serve il secret `ADMIN_DELETE_SECRET`.
- **Editor:** consulta tutto e può aggiungere o modificare PG, registrare/correggere/togliere XP (anche con voci negative), eliminare sessioni, scrivere il diario, gestire calendario, ispirazioni e oggetti, archiviare personaggi.
- **Visualizzatore:** consulta tutti i PG, il registro, le schede, i diari, il calendario e le presenze senza poter cambiare dati.

La registrazione è disattivata. Solo un amministratore può creare credenziali, disattivarle, riattivarle, reimpostare password o cambiare ruolo. Tutti gli account attivi vedono lo stesso archivio completo.

## Strumenti disponibili

- Panoramica con statistiche, classifica XP, andamento mensile, prossimi appuntamenti, compleanni vicini e promemoria per il livello successivo.
- Schede PG con classe, stirpe, livello calcolato dagli XP sulla scala D&D 5e, XP mancanti al livello successivo, origine, allineamento, stato (Attivo/Inattivo), compleanno, ritratto, note e dettagli.
- Collegamento Google Fogli modificabile solo da un amministratore.
- Ricerca, filtri e ordinamento di PG e sessioni, con filtri salvabili nel browser.
- Calendario delle sessioni programmate con disponibilità dei partecipanti.
- Ispirazione eroica e oggetti ottenuti per ogni PG.
- Livelli automatici: 20 soglie D&D 5e (0 → 355.000 XP), con XP mancanti al livello successivo nella scheda e nel promemoria.
- Pagina di dettaglio per ogni sessione, partecipanti, XP e diario con luogo e riassunto.
- Modifica, rimozione e storno delle singole voci XP, con il vincolo che il totale di un PG non scenda mai sotto 0 XP; eliminazione di un’intera sessione con recupero di voci XP e diario dal cestino; tutto attribuito nell’audit log.
- Importazione iniziale JSON, aggiunta sessioni da CSV, backup completo JSON ed esportazione CSV.
- Archivio dei PG ritirati con ripristino riservato all’amministratore.
- Cestino di voci XP e diari di sessione con recupero per editor e amministratore.
- Ripristino guidato del backup JSON in modalità unione.
- Cambio password personale e promemoria configurabili.
- Interfaccia adattabile a telefono e computer, installabile come PWA.

## Database e distribuzione

Il branch `main` è collegato a Cloudflare Pages e pubblica automaticamente le modifiche. I dati di campagna e i segreti restano fuori da GitHub.

Il progetto usa il binding D1 `DB`. Segreti previsti:

| Nome | Uso |
| --- | --- |
| `BOOTSTRAP_SECRET` | Codice di configurazione iniziale; resta come pepper di riserva per gli hash già esistenti. |
| `PASSWORD_PEPPER` | Pepper dedicato per gli hash delle password. Consigliato: separa il pepper dal codice di setup. Se impostato, gli hash esistenti vengono riscritti automaticamente al primo login riuscito. |
| `ADMIN_DELETE_SECRET` | Password di servizio richiesta per eliminare, declassare o disattivare l’account protetto `arcamis-admin`. Senza questo secret quelle operazioni vengono rifiutate. |

Non ruotare `PASSWORD_PEPPER` senza reimpostare le password: gli hash precedenti non sarebbero più verificabili.

### Migrazioni

Applicare i file in ordine su un database nuovo:

```bash
npx wrangler d1 migrations apply arcamis-register --local   # ambiente locale
npx wrangler d1 migrations apply arcamis-register --remote  # database online
```

- `0001_initial.sql`: schema iniziale.
- `0002_roles_rich_records.sql`: ruoli admin/editor/viewer, campi PG, diario, audit.
- `0003_polish_and_recovery.sql`: ultimo accesso e cestino XP.
- `0004_calendar_attendance_rewards.sql`: sessioni programmate, presenze, ispirazioni, oggetti.
- `0005_performance_indexes.sql`: indici per pulizia sessioni, rate limit e audit.
- `0006_diary_trash_and_drop_attendance.sql`: cestino dei diari di sessione e rimozione della marcatura presenze (le disponibilità del calendario restano).

### Hash delle password

Formato versionato `pbkdf2_sha512$100000$<hash>` con salt casuale per utente e HMAC con pepper. Cloudflare Workers rifiuta PBKDF2 oltre 100.000 iterazioni (`NotSupportedError`), quindi 100.000 con SHA-512 è il massimo utilizzabile sulla piattaforma. Gli hash del vecchio formato (10.000 iterazioni SHA-256, senza prefisso) restano validi e vengono aggiornati al primo login.

## Sicurezza

- Cookie di sessione `__Host-arcamis_session`: `HttpOnly`, `Secure`, `SameSite=Strict`, `Path=/`.
- Sessioni salvate come hash del token, con scadenza a 7 giorni e pulizia delle sessioni scadute al login.
- Rate limit per IP e per nome utente, con registrazione dei tentativi falliti nell’audit log.
- Header `Strict-Transport-Security`, `X-Robots-Tag: noindex` e CSP con `img-src 'self' data: https:` per i ritratti esterni.
- Il cambio password invalida le altre sessioni dell’account.

Il passaggio al cookie `__Host-` invalida le sessioni esistenti: al primo deploy dopo questo aggiornamento tutti gli utenti devono accedere di nuovo.

## Sviluppo locale

```bash
npm install
npx wrangler d1 migrations apply arcamis-register --local
npm run dev
```

Per il setup locale servono i segreti in `.dev.vars` (già escluso da Git):

```
BOOTSTRAP_SECRET=valore-di-test
PASSWORD_PEPPER=valore-di-test-separato
```

## Verifiche

```bash
npm run check   # controllo sintattico di JS, functions e script
```

Test API end-to-end: avvia `npm run dev` con i segreti di test su una porta nota e lancia `npm test` con `BASE_URL`. Il test copre setup, login, cookie, ruoli, creazione PG, registrazione XP, backup e cambio password. `scripts/legacy-check.mjs` verifica la migrazione di un hash nel vecchio formato. La pipeline in `.github/workflows/verify.yml` esegue tutto su push e pull request.

## Rilascio

A ogni modifica di CSS o JS:

1. Aggiorna `VERSION` in `public/sw.js`.
2. Aggiorna i parametri `?v=` in `public/index.html` con lo stesso valore.
3. Le cache precedenti vengono eliminate all’attivazione del nuovo service worker; agli utenti viene mostrato un avviso “Nuova versione disponibile” invece di un aggiornamento silenzioso.

## Backup

Il backup completo JSON è disponibile dall’area amministrazione e registra `last_backup_at`. Cloudflare Pages non supporta Cron Trigger: per un backup automatico serve un Worker separato con binding D1 e bucket R2, da distribuire a parte. Finché non è attivo, scaricare il backup con regolarità.

## Lavoro residuo noto

- Suddivisione di `app.js`/`enhanced.js` in moduli ES (oggi sono stati rimossi i duplicati morti, ma i file restano monolitici).
- Tabella `sessions` con id stabile al posto della chiave `(date, type, title)` del diario.
- Paginazione e aggregati SQL per archivi molto grandi.
- Passkey/MFA per gli account amministratore.
