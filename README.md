# Registro XP Arcamis

Registro web privato della campagna, pubblicato su Cloudflare Pages e salvato in Cloudflare D1.

**Sito:** https://arcamis-register.pages.dev  
**Progetto Pages:** `arcamis-register`  
**Repository:** `GandoraX-G/registro-xp-arcamis`

## Ruoli

- **Amministratore:** accesso completo; crea account, modifica i ruoli, importa/esporta dati, gestisce collegamenti Google Fogli e ripristina i PG archiviati.
- **Editor:** consulta tutto e può aggiungere o modificare PG, registrare/correggere XP, scrivere il diario delle avventure e archiviare personaggi.
- **Visualizzatore:** consulta tutti i PG, l’intero registro, le schede e i diari senza poter cambiare dati.

La registrazione è disattivata. Solo un amministratore può creare credenziali, disattivarle, riattivarle, reimpostare password o cambiare ruolo. Tutti gli account attivi vedono lo stesso archivio completo.

## Strumenti disponibili

- Panoramica con statistiche, classifica XP, andamento mensile, compleanni vicini e promemoria per traguardi XP.
- Schede PG con classe, stirpe, livello, origine, allineamento, stato, compleanno, immagine, note e dettagli.
- Collegamento Google Fogli modificabile solo da un amministratore.
- Ricerca, filtri e ordinamento di PG e sessioni.
- Pagina di dettaglio per ogni sessione, partecipanti, XP e diario con luogo e riassunto.
- Modifica e rimozione delle singole voci XP con attribuzione nell’audit log.
- Importazione iniziale JSON, aggiunta sessioni da CSV, backup completo JSON ed esportazione CSV leggibile da Excel e Google Fogli.
- Archivio dei PG ritirati: la cronologia rimane conservata e l’amministratore può ripristinarli.
- Interfaccia adattabile a telefono e computer.
- Registrazione di una sessione intera con partecipanti, XP individuali, luogo e riassunto in un solo passaggio.
- Cestino delle voci XP con recupero per editor e amministratore; solo l’amministratore può eliminare definitivamente.
- Ripristino guidato del backup JSON, in modalità unione: aggiorna i record corrispondenti e conserva i dati aggiunti dopo il backup.
- Filtri delle sessioni salvabili nel browser, controlli qualità e ultimo accesso degli account.
- Cambio password personale e promemoria configurabili per soglie XP e compleanni.

## Database e distribuzione

Il branch `main` è collegato a Cloudflare Pages e pubblica automaticamente le modifiche. I dati di campagna e i segreti restano fuori da GitHub.

Le migrazioni `0002_roles_rich_records.sql` e `0003_polish_and_recovery.sql` ampliano i ruoli, i dettagli dei PG, i diari, l’audit e il cestino. Sono state applicate al database D1 online. Su una copia nuova, applicare i file `0001`, `0002` e `0003` nell’ordine indicato.

Il progetto usa il binding D1 `DB` e il secret `BOOTSTRAP_SECRET`. Mantieni i valori dei segreti solo nelle impostazioni Cloudflare, mai nel codice o nel repository.

