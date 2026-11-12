# Arcamis Web

Registro web per la campagna Arcamis: Cloudflare Pages + Pages Functions + D1. La cartella `public/` contiene l'interfaccia; `functions/api/` contiene le API. Gli account non sono auto-registrabili.

## Sicurezza e ruoli

- La prima schermata crea un solo admin usando un segreto impostato fuori dal repository.
- L'admin crea gli account e sceglie tra `Membro` (sola consultazione) e `Amministratore`.
- Le password sono memorizzate con PBKDF2 e salt individuale; la sessione usa un cookie HttpOnly, Secure e SameSite=Strict.
- Gli accessi sono limitati dopo tentativi falliti; le API di scrittura controllano ruolo e origine.
- Archiviare un PG lo nasconde dalle schede attive senza cancellarne le voci XP.
- Il link Google Fogli è modificabile solo dagli admin.

## Preparazione Cloudflare

1. Il codice è già nel repository GitHub indicato. Il repository al momento è pubblico: il codice non include i dati del registro né segreti, ma chiunque può leggerlo. Se vuoi mantenere privato anche il codice, cambia la visibilità del repository dalle impostazioni GitHub. Non inserire mai `arcamis-import.json`, password, token o file con dati reali nel repository.
2. Crea un database D1 chiamato `arcamis-register` e copia il suo ID in `wrangler.jsonc` al posto di `REPLACE_WITH_D1_DATABASE_ID`.
3. Dalla cartella del progetto, applica la migrazione: `npx wrangler d1 migrations apply arcamis-register --remote`.
4. Collega il repository privato a Cloudflare Pages. Imposta la cartella radice `.` e la directory di build `public`; non serve un comando di build.
5. In Cloudflare Pages > Settings > Variables and Secrets, aggiungi il secret `BOOTSTRAP_SECRET`, usando una password casuale lunga e non riutilizzata. In Settings > Bindings collega il database D1 al nome `DB`, poi fai un nuovo deploy.
6. Apri il sito: la prima visita mostrerà la creazione admin; usa il `BOOTSTRAP_SECRET` come codice e scegli username e password admin. La configurazione diventa inattiva appena esiste il primo account.
7. Accedi come admin e importa il file privato `arcamis-import.json` dalla sezione Amministrazione. L'import funziona solo su un database ancora vuoto.
8. Dalla scheda di ogni PG, l'admin può aggiungere il link Google Fogli. Puoi poi creare gli account degli altri utenti dalla sezione Amministrazione.

## Dati

Il file `../arcamis-import.json` contiene l'esportazione dal foglio originale e va trattato come dato privato. Non viene servito dal sito e non va committato. Dal pannello admin si può scaricare un backup JSON.

## Configurazione richiesta prima del deploy

- Sostituire l'ID D1 in `wrangler.jsonc`.
- Collegare il repository GitHub all'account Cloudflare Pages.
- Impostare il secret bootstrap direttamente nel pannello Cloudflare.

Questa prima versione non implementa recupero password via email; un admin può disattivare l'account e ricrearlo con una nuova password.

