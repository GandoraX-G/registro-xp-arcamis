-- GP, oggetti e note fama del canale #log-sessione, riportati nei diari delle sessioni.
-- Le sessioni esistono già (elenco da xp_entries): qui si compila il solo diario,
-- con la stessa chiave (data, tipo, titolo) usata dall'app. Nessun XP viene toccato.
-- Su una riga già presente aggiorna i tre campi solo se sono tutti ancora vuoti,
-- così una seconda esecuzione non sovrascrive nulla di scritto a mano.

INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-02-12','Principale','Protezione Mercante','','','15 mo a testa','','[Arcamis] Catturati alcuni membri della malavita; uno è riuscito a fuggire.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-02-18','Principale','Primo Dungeon','','','10 mo a testa','','[Arcamis] +0: nessun materiale prezioso rubato nella miniera e degna sepoltura dell''umano in fiamme; nota negativa, pericoli ancora presenti nella caverna.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-02-20','Principale','Topi nella Foresta','','','10 mo a testa','','[Arcamis] Liberata la zona dai ratti giganti prima che diventassero troppi, Kylir aiutato; nota negativa: fuoco sui cadaveri e tana lasciata aperta.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-02-21','Principale','Ammanchi al Porto','','','10 mo a testa','Un favore da chiedere alla Gilda dei Ladri (due per Alphard)','[Arcamis] Merce recuperata e restituita, accordo trovato con i ladri; nota negativa: alcuni non sono ben visti dalla Gilda e dovranno spiegarsi con Gilda e Caserma.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-02-27','Principale','Pozioni Contraffatte','','','20 mo a testa','','[Arcamis] Sarkhan +3 per aver risparmiato parte dei banditi; gli altri +0.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-02-28','Principale','Labirinto dell''Armadillo','','','15 mo a testa','Disco di Az''Zirash recuperato per Zack','[Ricercatori di Piltover] +5; [Discepoli dell''Armadillo] -10 a Issahnya, +10 a Daphne e 43.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-03-03','Principale','Le Ombre','','','15 mo a testa','','[Arcamis] Catturate le due spie e protetti i civili; nota negativa: tre Noxiani persi e possibili informazioni con loro.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-03-04','Principale','Fata dispersa','','','10 mo a testa','','Nessuna variazione.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-03-05','Principale','Il Critico d''Arte','','','20 mo a testa','Zoe ha un libro sulla vecchia civiltà di Arcamis','[Arcamis] +5','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-03-06','Principale','Cantina e Mimic!','','','15 gp a testa; Thalir 10 gp','Dente di mimic (Thalir, valore 5 gp)','[Arcamis] +5 per aver aiutato i due anziani della trattoria.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-03-07','Principale','Visita a Rivorosso','','','15 gp a testa','','Rapporto tra Arcamis e Rivorosso rafforzato.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-03-07','Secondaria','Dungeon Ragni','','','20 mo a testa (subquest al 75%: 15 mo)','','Nessuna.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-03-10','Principale','Il richiamo della Sirena','','','10 monete d''oro a testa','','[Arcamis] Sirena curata e portata in ospedale.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-03-13','Principale','Formaggio!','','','15 monete d''oro a testa','','[Arcamis] +3; i prigionieri possono essere interrogati per una secondaria sui banditi.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-03-13','Secondaria','Indagini Fogne ed Ombre','','','10 monete d''oro a testa','','Nessuna ufficiale: catturato uno dei due, ma le Ombre ora li conoscono.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-03-16','Principale','Lupi parlanti','','','12 monete d''oro a testa','','[Arcamis] +1 per aver aiutato Kylir.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-03-18','Principale','Emergenza Arcamis','','','20 monete d''oro a testa','Documenti sul progetto virale recuperati da Zoe','Positivo: fermata una catastrofe; negativo: il prigioniero è fuggito e solo Kisen ha fatto rapporto.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-03-20','Principale','Cantina e Draghi','','','15 mo a testa','','Nessuna.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-03-24','Principale','Rapina a Piltover','','','20 mo a testa','','[Guardiani di Piltover] +5','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-03-25','Principale','Furto in Gioielleria','','','15 monete d''oro a testa','','Positivo: furto sventato; negativo: un ladro fuggito e alcuni uccisi.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-03-30','Secondaria','Andiamo a riprendere il Dottore!','','','14 monete d''oro a testa','Fascicoli sui Gildani e documenti Chemtech/Shimmer','Positivo: fermata una catastrofe, recuperato il Dottor Kerslen e tutte le informazioni disponibili.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-04-01','Principale','Pagliacci d''Aprile','','','10 monete d''oro a testa','','Nessuna: nessuna entità di un luogo conosciuto.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-04-02','Principale','Festival dell''Arancia','','','10 monete d''oro a testa','','Positivo: catturato un membro dei Pugnali Seghettati; negativo: un civile bilgewateriano è morto.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-04-05','Secondaria','Esequie a Bilgewater','','','10 mo a testa','Informazioni sui tatuaggi dei Pugnali Seghettati (Aris)','Rispetto e cordoglio alle persone del malcapitato, legami stretti a Bilgewater.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-04-08','Principale','Festival Uwendale','','','10 mo a testa','Pergamena di Scudo scritta in yordle','Nessuna.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-04-08','Secondaria','Fumofosco e Gnoll','','','10 mo a testa','','Nessuna.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-04-09','Principale','Il Labirinto','','','15 mo a testa','','Nessuna.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-04-14','Principale','Festival Targon','','','30 monete d''oro a testa','','[Solari] Valerius +2, battezzato neo Paladino Solari.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-04-14','Secondaria','Secondaria Yabu','','','10 mo a testa','','Nessuna.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-04-17','Secondaria','Cultisti a Rivorosso','','','20 mo a testa','','[Rivorosso] Villaggio protetto; aiuti monetari di Valerius molto apprezzati.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-04-20','Principale','Infezione Misteriosa','','','18 monete d''oro a testa','','[Arcamis] +1 a tutti.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-04-22','Principale','LUNA','','','15 mo a testa','','Nessuna.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-04-22','Principale','Panico a Fumofosco','','','20 monete d''oro a testa','Squame, denti e pezzi dei mostri','Nessuna.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-04-23','Secondaria','Caos a Galeton','','','10 gp a testa (nessun loot per Yabu)','Un favore dai Mercanti di pergamene di Galeton','[Galeton] +2 a tutti tranne Yabu.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-04-24','Principale','Cinghiali Aggressivi','','','23 monete d''oro a testa','','Nessuna.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-04-24','Principale','Cinghiali Difesa','','','23 monete d''oro a testa','','Nessuna; l''incendio domato da Yukio avrà conseguenze.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-04-25','Principale','Pecore Targon','','','15 mo a testa','','Nessuna fama del Targon: non ricorderanno Orpheus.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
INSERT INTO adventure_details (date,type,title,summary,location,gp,items,fame,updated_by,updated_at) VALUES ('2026-04-26','Principale','è ora di andare LIVE!','','','15 mo a testa','','[Arcamis] +2 a Nagiyori, Valerius, Sok''haanji, Leena Hayi, Zeraphiel, A''melie, A''valon e Lilith.','import-log',datetime('now'))
  ON CONFLICT(date,type,title) DO UPDATE SET gp=excluded.gp, items=excluded.items, fame=excluded.fame
  WHERE adventure_details.gp='' AND adventure_details.items='' AND adventure_details.fame='';
