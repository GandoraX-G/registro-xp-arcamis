let plans=[],playerRewards={inspirations:[],items:[]},calDate=new Date();
const homeReminderObserver=new MutationObserver(()=>{if(page!=='home'||!plans.length||document.querySelector('#upcomingReminder'))return;const main=document.querySelector('.main');if(!main)return;const upcoming=plans.filter(p=>p.status==='planned'&&p.date>=todayISO()).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,4);main.insertAdjacentHTML('beforeend','<section class="panel" id="upcomingReminder"><div class="panelhead"><h2>Prossimi appuntamenti</h2><button class="link" data-page="calendar">Apri calendario →</button>'+(canEdit()?'<button class="quiet" id="newplan">＋ Programma sessione</button>':'')+'</div>'+(upcoming.map(p=>'<button class="upcoming-row" data-plan="'+p.id+'"><b>'+itdate(p.date)+' '+esc(p.start_time||'')+'</b><span>'+esc(p.title)+'</span><small>'+p.participants.filter(x=>x.availability==='available').length+' disponibili · '+p.participants.filter(x=>x.availability==='pending').length+' da confermare</small></button>').join('')||'<p class="sub">Nessuna sessione futura programmata.</p>')+'</section>');document.querySelectorAll('#upcomingReminder [data-plan]').forEach(b=>b.onclick=()=>planDetails(b.dataset.plan));document.querySelector('#upcomingReminder #newplan')?.addEventListener('click',newPlan);document.querySelector('#upcomingReminder [data-page]')?.addEventListener('click',()=>{setPage('calendar')})});
homeReminderObserver.observe(document.querySelector('#app'),{childList:true,subtree:true});
const itdate=s=>s?new Date(s+'T12:00:00').toLocaleDateString('it-IT'):'—';
async function load(){try{[players,entries,adventures,prefs,plans]=await Promise.all([api('players'),api('entries'),api('adventures'),api('settings'),api('session-plans')]);pendingReports=await api('pending-reports');notesError='';notes=await api('player-notes').catch(e=>{notesError=e.message;return []});if(canEdit()){trashError='';[trash,trashAdventures]=await Promise.all([api('trash').catch(e=>{trashError=trashError||e.message;return[]}),api('adventure-trash').catch(e=>{trashError=trashError||e.message;return[]})])}else{trash=[];trashAdventures=[];trashError=''}if(isAdmin())[users,archivedPlayers,auditLog,quality,schemaStatus]=await Promise.all([api('users'),api('archived-players'),api('audit'),api('quality'),api('schema-status').catch(()=>null)]);clearLoadError();render()}catch(e){if(e.status===401)return login(e.message);showLoadError(e.message)}}
function nav(){const items=[['home',"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" aria-hidden=\"true\"><path d=\"M4 10.6 12 4l8 6.6V20a1 1 0 0 1-1 1h-4.2v-6H9.2v6H5a1 1 0 0 1-1-1z\"/></svg>",'Home'],['players',"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"8\" r=\"3.3\"/><path d=\"M5.5 20.5c0-3.7 2.9-6.2 6.5-6.2s6.5 2.5 6.5 6.2\"/></svg>",'PG'],['sessions',"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" aria-hidden=\"true\"><rect x=\"4.5\" y=\"3.5\" width=\"15\" height=\"17\" rx=\"2\"/><path d=\"M8.5 8.5h7M8.5 12.5h7M8.5 16.5h4\"/></svg>",'Registro'],['calendar',"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" aria-hidden=\"true\"><rect x=\"4\" y=\"5\" width=\"16\" height=\"15\" rx=\"2\"/><path d=\"M4 9.7h16M8.2 3.5v3M15.8 3.5v3\"/></svg>",'Calendario'],['notes',"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" aria-hidden=\"true\"><path d=\"M4 20l4.2-1 9.9-9.9a2.1 2.1 0 0 0-3-3L5.2 16z\"/><path d=\"M14.2 6.1l3 3\"/></svg>",'Note PG'],['docs',"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" aria-hidden=\"true\"><path d=\"M12 6.6C10.2 5.2 8 4.5 5.5 4.5v12.2c2.5 0 4.7.7 6.5 2.1 1.8-1.4 4-2.1 6.5-2.1V4.5c-2.5 0-4.7.7-6.5 2.1z\"/><path d=\"M12 6.6v12.2\"/></svg>",'Documentazione'],['pending',"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" aria-hidden=\"true\"><path d=\"M7 3.5h10M7 20.5h10M8.2 3.5v2.6c0 2 3.8 3.4 3.8 5.9s-3.8 3.9-3.8 5.9v2.6M15.8 3.5v2.6c0 2-3.8 3.4-3.8 5.9s3.8 3.9 3.8 5.9v2.6\"/></svg>",'Sospesi']];if(isAdmin())items.push(['admin',"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" aria-hidden=\"true\"><path d=\"M4 7h5M13 7h7M4 12h9M17 12h3M4 17h3M11 17h9\"/><circle cx=\"11\" cy=\"7\" r=\"2\"/><circle cx=\"15\" cy=\"12\" r=\"2\"/><circle cx=\"9\" cy=\"17\" r=\"2\"/></svg>",'Admin']);const active=k=>k===page||(k==='players'&&page.startsWith('detail-'))||(k==='sessions'&&page==='adventure');return '<aside class="side">'+brand()+'<nav class="nav" aria-label="Navigazione principale">'+items.map(([k,icon,label])=>'<button class="navtab'+(active(k)?' active':'')+'" data-page="'+k+'" aria-label="'+label+'" title="'+label+'"'+(active(k)?' aria-current="page"':'')+'><span class="navicon" aria-hidden="true">'+icon+'</span><span class="navlabel">'+label+'</span></button>').join('')+'</nav><div class="sidefoot">✧ '+(roleNames[me?.role]||'Account')+' · Tutti gli annali</div></aside>'}
let ultimaPagina='';
function docsPage(){
  const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const tabella=(intestazioni,righe)=>'<div class="scroll docscroll"><table><thead><tr>'+intestazioni.map(h=>'<th>'+h+'</th>').join('')+'</tr></thead><tbody>'+righe.map(r=>'<tr>'+r.map(c=>'<td>'+c+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
  const rarita=[
    ['Comune','7','5','Diari, storie locali, guide geografiche di base, racconti popolari'],
    ['Raro','14','10','Tomi storici dimenticati, manuali tecnici, bestiari regionali, saggi scientifici'],
    ['Molto raro','21','15','Grimori arcani, testi profetici, segreti di antiche gilde, genealogie nobiliari'],
    ['Leggendario','25 o più','20','Libri dei Piani, manoscritti originali di divinità, artefatti senzienti']
  ];
  const condizioni=[
    ['Perfetto','Il volume è leggibile e completo. Si applicano i DT base.'],
    ['Danneggiato o usurato','Il costo aumenta di 2 DT, per esempio a causa di pagine macchiate o strappate.'],
    ['Codificato o criptato','Prima di studiarlo, il PG deve superare una prova di Intelligenza (Investigazione) per decifrarlo. Il DM stabilisce la CD.'],
    ['Frammentario','Il tempo richiesto raddoppia per ricostruire i passaggi mancanti.']
  ];
  const modalita=[
    ['Ricerca rapida','1 ora','Cercare un nome o un altro dettaglio specifico.'],
    ['Studio','4 ore','Comprendere i concetti di base del tomo.'],
    ['Studio approfondito','8 ore','Comprendere concetti complessi. Se il libro è cifrato o codificato, il PG ottiene +2 alla prova di Intelligenza per decifrarlo.'],
    ['Ricerca complessa','A discrezione del DM','Per argomenti vasti, il DM può richiedere 3 prove di Intelligenza riuscite prima di fornire le informazioni complete.']
  ];
  const ranghi=[
    ['Ferro','100–200','100','120','140','160','180','200','20','50–200'],
    ['Bronzo','450–650','450','490','530','570','610','650','40','150–300'],
    ['Argento','900–1500','900','1020','1140','1260','1380','1500','120','250–400'],
    ['Oro','1400–2000','1400','1520','1640','1760','1880','2000','120','350–500'],
    ['Platino','1600–2200','1600','1720','1840','1960','2080','2200','120','450–600'],
    ['Smeraldo','1800–2400','1800','1920','2040','2160','2280','2400','120','550–700'],
    ['Diamante','2000–2600','2000','2120','2240','2360','2480','2600','120','650–800'],
    ['Grandmaster','2200–2800','2200','2320','2440','2560','2680','2800','120','750–900'],
    ['Challenger','3000','','','','','','','','850–1000']
  ];
  const quota=[
    ['Individuale','5 MO','14 MO','24 MO'],
    ['Doppia · a persona','4 MO','11 MO','20 MO'],
    ['Doppia · totale per due','8 MO','22 MO','40 MO']
  ];
  const cronache=[
    {c:'I',d:'03/02/2026',t:'Benvenuti ad Arcamis',s:'Una festa cittadina riporta un po’ di gioia ad Arcamis dopo le recenti tragedie: piazza, taverna, arena e mercato animano la giornata fino a notte.'},
    {c:'I',d:'12/02/2026',t:'La protezione del carico di Edward',s:'La scorta al carico del mercante Edward finisce in uno scontro con vecchi nemici: alcuni aggressori muoiono, altri vengono catturati, uno riesce a fuggire.'},
    {c:'I',d:'18/02/2026',t:'La miniera di Thorin Bruciascoria',s:'Nella miniera i gildani liberano un umano dai goblin e riparano gli argani, poi stringono un patto con un ragno gigante: cibo in cambio di non aggressione.'},
    {c:'I',d:'20/02/2026',t:'Le strane creature del bosco',s:'Il ranger Kylir guida il gruppo in una tana di ratti giganti, dove compare un ratto dall’aspetto umanoide. I corpi finiscono in caserma per l’esame.'},
    {c:'I',d:'21/02/2026',t:'I furti al porto e l’accordo nelle fogne',s:'Nei condotti fognari il gruppo trova i responsabili dei furti e sceglie la trattativa: la merce torna al porto e i ladri ottengono un impiego, in cambio di contatti e informazioni.'},
    {c:'I',d:'27/02/2026',t:'Il traffico di pozioni contraffatte',s:'L’indagine sulle pozioni false porta dal bazaar al porto. Xitralk sfugge a un bandito e il gruppo cattura vivo Lilzirar con altri tre complici.'},
    {c:'I',d:'28/02/2026',t:'La spedizione nelle rovine di Shurima',s:'L’esploratore Zack manda il gruppo nelle rovine di Shurima a recuperare un disco di Az’Zirash. Lo scontro con i discepoli dell’armadillo lascia morti e prigionieri risparmiati.'},
    {c:'II',d:'03/03/2026',t:'La morte di Xiltralk',s:'Una creatura con le sembianze di Kai’Reth fa emergere qualcosa dal corpo di Xiltralk e A’valon lo uccide per risparmiargli l’orrore. Entrambi finiscono arrestati per omicidio.'},
    {c:'II',d:'03/03/2026',t:'Le ombre di Noxus',s:'L’operazione congiunta contro i nobili noxiani si complica: una ragazza di quattordici anni con il tatuaggio della rosa tenta il suicidio e viene fermata. Gli interrogatori danno poche risposte.'},
    {c:'II',d:'06/03/2026',t:'Gli omicidi in Caserma',s:'Liana e Alaric trovano quattro prigionieri morti nelle celle, senza segni di strangolamento e con una rosa nera sottopelle: qualcosa li ha privati dell’aria.'},
    {c:'II',d:'05/03/2026',t:'Il segreto del maniero',s:'Sulle tracce dei dispersi il gruppo scopre che Luke, raffinato intellettuale, tortura e uccide civili nella propria dimora. Lo uccidono.'},
    {c:'II',d:'06/03/2026',t:'Gli strani fenomeni della cantina',s:'Gli oggetti che si spostano da soli sono mimic: tre creature eliminate e ricompensa dalla caserma per aver messo in sicurezza la cantina.'},
    {c:'II',d:'07/03/2026',t:'Il mulino di Rivorosso',s:'Maeve trascina il gruppo al vecchio mulino, dove quattro cultisti compiono un rituale. Sconfitti, i giovani scomparsi vengono salvati.'},
    {c:'II',d:'07/03/2026',t:'Il ritorno nella caverna',s:'La spedizione rimasta incompleta viene ripetuta: bestia distorcente, tre gnoll e il ragno gigante con la prole vengono eliminati. Un ruggito lontano resta senza risposta.'},
    {c:'II',d:'10/03/2026',t:'La prova di Theren Meliamne',s:'Theren Meliamne mette alla prova i nuovi arrivati su un varano magico gigante e alla fine rivela la propria identità: è il Duca di Virturia.'},
    {c:'II',d:'10/03/2026',t:'Il canto nelle profondità',s:'Gli squali che sorvegliano un’insenatura portano a Sylvie, una sirena ferita. Il gruppo la cura e la accompagna in ospedale, capendo che il raduno di pesci era un richiamo d’aiuto.'},
    {c:'II',d:'13/03/2026',t:'Il formaggio del contadino',s:'La consegna del formaggio si trasforma in uno scontro con una banda. Maeve e Yuri guidano la difesa, due banditi sopravvivono e finiscono alle guardie.'},
    {c:'II',d:'13/03/2026',t:'L’imboscata dell’Intelligence',s:'La pista che porta all’Intelligence è una trappola. Il gruppo si barrica, cattura una figura misteriosa e fugge attraverso i cunicoli sotto Arcamis.'},
    {c:'II',d:'16/03/2026',t:'Il patto con il lupo invernale',s:'Kylir media una tregua con il lupo invernale invece di abbatterlo: i territori di caccia vengono divisi tra lupi e cacciatori.'},
    {c:'II',d:'18/03/2026',t:'Il laboratorio del Passo di Nyssus',s:'Il piano per avvelenare le acque porta al laboratorio segreto: la struttura viene distrutta e il responsabile catturato, ma fugge davanti alle mura. I documenti collegano tutto alla Rosa Nera e al Dottor Ziegler.'},
    {c:'II',d:'20/03/2026',t:'Il drago nella cantina',s:'Il drago è un drake blu dipinto di rosso. Il compromesso su grotta e cibo fallisce e il gruppo finisce per affrontarlo.'},
    {c:'II',d:'24/03/2026',t:'L’arrivo del Comandante Liana Derinas',s:'Duecento soldati del Regno entrano ad Arcamis guidati dalla comandante Liana Derinas: la Corona ha risposto alle lettere su Rose Nere, Shimmer e complotto.'},
    {c:'II',d:'24/03/2026',t:'Missione a Piltover',s:'Caitlyn e Vi chiedono aiuto per le rapine di componenti per automi. Il gruppo parte per Piltover e resta in città, con la durata della permanenza ancora da stabilire.'},
    {c:'II',d:'25/03/2026',t:'Il tentato furto alla gioielleria Draxx',s:'Il furto alla gioielleria viene sventato, ma due ladri muoiono. Tatuaggi con spada e serpente e arnesi da scasso indicano un quinto complice fuggito verso il porto.'},
    {c:'II',d:'28/03/2026',t:'La Congiura contro Mira',s:'Kai’Reth porta Mira in caserma con un pretesto per un’ispezione. Smascherata, la donna si toglie la vita davanti a tutti pur di non rivelare i propri segreti.'},
    {c:'II',d:'29/03/2026',t:'Sulle tracce del Dottor Ziegler',s:'Il laboratorio costiero rivela fascicoli su tutti i gildani ed esperimenti Chemtech e Shimmer. Un terremoto blocca il rientro, ma l’interrogatorio dà le coordinate del rifugio di Ziegler a Noxus.'},
    {c:'II',d:'01/04/2026',t:'Il bizzarro regno dei clown',s:'In un semipiano governato dai clown le armi diventano caramelle e la prova finale è una papera gigante da far ridere. Al risveglio, monete d’oro in tasca.'},
    {c:'II',d:'02/04/2026',t:'Il Festival dell’Agrume',s:'Durante il festival il gruppo nota il tatuaggio del pugnale e del serpente. Una rissa permette di catturare il sospetto, ma un complice riesce a fuggire.'},
    {c:'II',d:'04/03/2026',t:'Il gioco della fata',s:'La ladra di piante è una fata che le ha riportate in vita. Tra nascondino e una melanzana animata, il gruppo chiude l’indagine e torna da Emilio.'},
    {c:'II',d:'05/04/2026',t:'La penitenza di Nerivelle e il viaggio a Bilgewater',s:'La penitenza di Nerivelle passa da Bilgewater e dall’Isola dei Buhru. La ciurma accoglie la sua confessione e il gruppo ottiene risposte sul proprio futuro.'},
    {c:'III',d:'08/04/2026',t:'Il Festival della Caccia di Uwendale',s:'Al festival di caccia il gruppo affronta le creature più pericolose delle giungle conosciute e viene premiato da Poppy in persona.'},
    {c:'III',d:'08/04/2026',t:'La carovana per il nuovo tribunale',s:'La scorta al materiale per il nuovo tribunale respinge un assalto di gnoll e completa la consegna senza altri incidenti.'},
    {c:'III',d:'09/04/2026',t:'Il labirinto vivente',s:'Il labirinto che cambia forma ogni notte è mosso da un sistema di ingranaggi. Disattivato, la tenuta torna tranquilla.'},
    {c:'III',d:'10/04/2026',t:'L’incubo di Tibbers',s:'Più gruppi affrontano l’orso di pezza animato e i cinque ingranaggi. Tibbers si autodistrugge e l’incubo finisce; chi rifiuta il sacrificio ricorda solo frammenti.'},
    {c:'III',d:'14/04/2026',t:'Il ritorno di Mei',s:'Il ritorno a casa di Mei viene disturbato da piccoli costrutti a forma di ragno, eliminati senza ferite.'},
    {c:'III',d:'14/04/2026',t:'Il Festival dei Solari',s:'Al Festival dei Solari Valerius viene consacrato paladino da Aurelion Kael. La caccia a creature sacre ai Lunari si ferma con l’intervento di Aphelios.'},
    {c:'III',d:'17/04/2026',t:'Il sangue di Rivorosso',s:'A Rivorosso i cultisti di Nymerion evocano un Bulezau. Nerivelle muore e il demone la riporta in vita per usarla contro i compagni: il gruppo lo ricaccia indietro e la salva.'}
  ];
  const capitoli=[
    {r:'I',t:'Capitolo I: L’inizio'},
    {r:'II',t:'Capitolo II: Le Rose Nere'},
    {r:'III',t:'Capitolo III: La Calma prima della Tempesta'}
  ];
  const blocchi=capitoli.map((c,i)=>{
    const voci=cronache.filter(v=>v.c===c.r);
    return '<details class="capitolo"'+(i===0?' open':'')+'><summary><span>'+esc(c.t)+'</span><span class="conteggio">'+voci.length+' sessioni</span></summary><ol class="cronache">'
      +voci.map(v=>{
        const iso=v.d.split('/').reverse().join('-');
        return '<li data-iso="'+iso+'" data-cerca="'+esc((v.t+' '+v.s).toLowerCase())+'"><div class="crono-data">'+v.d+'</div><div><b>'+esc(v.t)+'</b><p>'+esc(v.s)+'</p></div></li>';
      }).join('')
      +'</ol></details>';
  }).join('');

  return '<nav class="docs-toc" aria-label="Indice della documentazione">'
    +'<button class="chip" data-doc="lore">1 · Lore</button>'
    +'<button class="chip" data-doc="cronache">2 · Cronache</button>'
    +'<button class="chip" data-doc="libri">3 · Libri</button>'
    +'<button class="chip" data-doc="xp">4 · XP</button>'
    +'<button class="chip" data-doc="gilda">5 · Quota di gilda</button>'
    +'</nav>'

    +'<section class="panel doc" id="docs-lore">'
    +'<div class="eyebrow">01 · Ambientazione</div>'
    +'<h2>Lore del mondo e degli dei</h2>'
    +'<p class="sub">Materiale di riferimento su Arcamis e sul pantheon. Entrambi i documenti sono in lavorazione.</p>'
    +'<div class="doclinks">'
    +'<a class="doclink" href="https://docs.google.com/document/d/1gEcmKmRgoaFpvfYbOXGujXCZk-Ktrbu4OcJ6ZU44joQ/edit?usp=sharing" target="_blank" rel="noopener"><span><b>Lore del Mondo</b><small>Cronache e avvenimenti di Arcamis, capitolo per capitolo.</small></span><span class="badge wip">WIP</span></a>'
    +'<a class="doclink" href="https://docs.google.com/document/d/151BnjDRjwBFjc30vrlCeDKpthF2fN5tyBFWU2ofSm8E/edit?usp=sharing" target="_blank" rel="noopener"><span><b>Lore sugli Dei</b><small>Schede dei tredici eroi e delle loro classi.</small></span><span class="badge wip">WIP</span></a>'
    +'<a class="doclink" href="https://pin.it/3kkGx2e42" target="_blank" rel="noopener"><span><b>Immagini dei 13 eroi</b><small>Raccolta visiva su Pinterest.</small></span><span class="badge">Immagini</span></a>'
    +'<a class="doclink" href="https://pin.it/XV8nhYFan" target="_blank" rel="noopener"><span><b>Immagini dei 13 dei</b><small>Raccolta visiva su Pinterest.</small></span><span class="badge">Immagini</span></a>'
    +'</div>'
    +'<div class="callout"><p>I due documenti sono ancora incompleti: il contenuto di questa pagina non li sostituisce, serve come punto di partenza per chi prepara una sessione.</p></div>'
    +'</section>'

    +'<section class="panel doc" id="docs-cronache">'
    +'<div class="eyebrow">02 · Cronache</div>'
    +'<h2>La storia di Arcamis in breve</h2>'
    +'<p class="sub">Trentasette sessioni divise per capitolo, con data, titolo e due righe che dicono com’è finita. Il testo completo resta nel documento Lore del Mondo.</p>'
    +'<div class="cron-filtri">'
    +'<label>Dall’<input type="date" id="cronDa" aria-label="Data iniziale"></label>'
    +'<label>Al<input type="date" id="cronA" aria-label="Data finale"></label>'
    +'<label class="cerca">Cerca<input type="search" id="cronCerca" placeholder="Titolo o riassunto" aria-label="Cerca nelle cronache"></label>'
    +'<button class="quiet" id="cronAzzera">Azzera</button>'
    +'</div>'
    +'<p class="sub" id="cronEsito" aria-live="polite"></p>'
    +blocchi
    +'<p class="sub" id="cronVuoto" hidden>Nessuna sessione con questi filtri.</p>'
    +'<p class="sub">Capitoli ancora vuoti nel documento originale: Capitolo IV: Ionia, Capitolo V: Infrastrutture, Eradicazione Corrotti e Mezzi di trasporto.</p>'
    +'</section>'

    +'<section class="panel doc" id="docs-libri">'
    +'<div class="eyebrow">03 · Ricerca e studio</div>'
    +'<h2>Libri: rarità, condizioni e consultazione</h2>'
    +'<p class="sub">La rarità del volume stabilisce i DT base per completare la ricerca o lo studio e la CD di riferimento. Il DM sceglie l’abilità pertinente in base all’argomento.</p>'
    +'<h3>Rarità e difficoltà</h3>'
    +tabella(['Rarità','DT base','CD','Esempi'],rarita)
    +'<h3>Condizioni del volume</h3>'
    +tabella(['Condizione','Effetto'],condizioni)
    +'<h3>Modalità di consultazione</h3>'
    +tabella(['Modalità','Durata','Risultato'],modalita)
    +'<div class="callout"><h3>Al tavolo</h3><p>Il DM può chiedere una prova di Arcano, Storia, Natura o Religione in base alla materia. Studiare in una biblioteca attrezzata dà vantaggio alle prove. Chi consulta un libro o un documento che riguarda il Void deve superare un tiro salvezza di Saggezza con CD 12.</p></div>'
    +'<h3>Punti ancora aperti</h3>'
    +'<div class="proposte">'
    +'<div class="proposta"><div class="eyebrow">Aperto 01</div><h4>Ore e DT</h4><p class="domanda">Le ore delle singole consultazioni come si sommano ai DT complessivi?</p><p><b>Proposta:</b> un DT equivale a 4 ore di studio, quindi un tomo comune da 7 DT richiede 28 ore. Le consultazioni si sommano e il conteggio riparte all’inizio di ogni sessione.</p><span class="badge wip">Da approvare</span></div>'
    +'<div class="proposta"><div class="eyebrow">Aperto 02</div><h4>Condizioni multiple</h4><p class="domanda">Cosa succede se un volume è insieme danneggiato, cifrato e frammentario?</p><p><b>Proposta:</b> i modificatori si sommano con un tetto di +6 DT. La decifratura si affronta prima di iniziare lo studio, così il +2 dello studio approfondito si applica alla prova.</p><span class="badge wip">Da approvare</span></div>'
    +'<div class="proposta"><div class="eyebrow">Aperto 03</div><h4>Fallire il tiro sul Void</h4><p class="domanda">Cosa accade a chi non supera il tiro salvezza di Saggezza con CD 12?</p><p><b>Proposta:</b> il PG è spaventato fino alla fine della sessione e non può consultare altri testi sul Void per 24 ore. Il DM può alzare la CD per lo stesso documento.</p><span class="badge wip">Da approvare</span></div>'
    +'</div>'
    +'</section>'

    +'<section class="panel doc" id="docs-xp">'
    +'<div class="eyebrow">04 · Ricompense</div>'
    +'<h2>Assegnazione degli XP da parte dei DM</h2>'
    +'<p class="sub">Il sistema in prova prevede sei fasce di ricompensa per ogni rango: la scala di difficoltà va da 1 a 6, come nel foglio di prova. Il DM valuta la difficoltà della sessione e usa l’intervallo della fascia corrispondente. Una sessione semplice e senza rischio concreto di morte ricade verso le fasce basse, una sessione mortale verso quelle alte. Il valore preciso dentro l’intervallo lo sceglie il DM.</p>'
    +'<h3>Tabella del foglio di prova</h3>'
    +tabella(['Rango','XP','1','2','3','4','5','6','Distacco','Bonus'],ranghi)
    +'<p class="sub">La stessa fascia rappresenta lo stesso grado di ricompensa rispetto al rango: una fascia alta per Ferro, Bronzo o Argento occupa la stessa posizione nelle rispettive tabelle, con quantità di XP scalate per rango.</p>'
    +'<p class="sub">Le colonne da 1 a 6 sono le fasce di difficoltà: la 1 è la sessione più semplice, la 6 la più letale.</p>'
    +'<p class="sub">L’obiettivo è dare ai DM un criterio comune per motivare le differenze di XP tra sessioni e ridurre i dubbi sui favoritismi, mantenendo un margine di scelta nella ricompensa finale. I valori effettivi restano quelli del <a class="link" href="https://docs.google.com/spreadsheets/d/1apE9ZoOkVRsTAUb1CQVeqC5rYY0xdAy5gPtc_n3iLPs/edit?usp=drivesdk" target="_blank" rel="noopener">foglio XP di prova</a>.</p>'
    +'</section>'

    +'<section class="panel doc" id="docs-gilda">'
    +'<div class="eyebrow">05 · Cittadinanza</div>'
    +'<h2>Quota della Gilda e cittadinanza gildana</h2>'
    +'<p class="sub">La quota mensile dà al personaggio lo status di cittadino gildano di Arcamis, riconosciuto dal regno di Arcadia.</p>'
    +'<h3>Diritti e servizi</h3>'
    +'<ul class="doclist">'
    +'<li><b>Posto letto e pasti.</b> Può alloggiare negli spazi riservati ai membri e usufruire dei pasti in locanda. Il servizio funziona come la mensa e gli alloggi di una caserma: il membro sceglie quanto usufruirne e la quota mensile resta fissa.</li>'
    +'<li><b>Missioni e incarichi.</b> Può accedere alle missioni e agli incarichi della Gilda.</li>'
    +'<li><b>Cure ospedaliere.</b> Può accedere alle cure in ospedale senza pagare di tasca propria. Chi è esterno alla Gilda paga per intero le eventuali terapie previste dal sistema delle malattie.</li>'
    +'<li><b>Protezione legale.</b> Gode della protezione riconosciuta ai cittadini gildani di Arcamis sotto il regno di Arcadia.</li>'
    +'<li><b>Apertura di attività.</b> Può presentare domanda per aprire un’attività. Agli esterni alla Gilda è preclusa la presentazione della domanda.</li>'
    +'</ul>'
    +'<h3>Costi</h3>'
    +tabella(['Sistemazione','1 mese','3 mesi · −10%','6 mesi · −20%'],quota)
    +'<p class="sub">Lo sconto è del 10% per 3 mesi e del 20% per 6 mesi. Si arrotonda per difetto alla MO intera, quindi il costo finale si arrotonda per eccesso. Per la stanza doppia il calcolo è fatto sulla quota di ciascun occupante.</p>'
    +'<div class="callout"><h3>Esempio</h3><p>Tre mesi in stanza individuale partono da 15 MO. Lo sconto del 10% è 1,5 MO, arrotondato per difetto a 1 MO. Il costo finale è 14 MO.</p></div>'
    +'</section>';
}
function filtraCronache(){
  const da=document.getElementById('cronDa')?.value||'';
  const a=document.getElementById('cronA')?.value||'';
  const q=(document.getElementById('cronCerca')?.value||'').toLowerCase().trim();
  const attivo=!!(da||a||q);
  let tot=0;
  document.querySelectorAll('#docs-cronache .capitolo').forEach(cap=>{
    let vis=0;
    cap.querySelectorAll('.cronache li').forEach(li=>{
      const iso=li.dataset.iso||'';
      const ok=(!da||iso>=da)&&(!a||iso<=a)&&(!q||(li.dataset.cerca||'').includes(q));
      li.hidden=!ok;
      if(ok)vis++;
    });
    const c=cap.querySelector('.conteggio');
    if(c)c.textContent=vis+(vis===1?' sessione':' sessioni');
    cap.hidden=vis===0;
    if(attivo&&vis>0)cap.open=true;
    tot+=vis;
  });
  const esito=document.getElementById('cronEsito');
  if(esito)esito.textContent=attivo?(tot===1?'1 sessione trovata':tot+' sessioni trovate'):'';
  const vuoto=document.getElementById('cronVuoto');
  if(vuoto)vuoto.hidden=tot!==0;
}
function render(){const nuova=page!==ultimaPagina;ultimaPagina=page;const title={home:'Panoramica',players:'Avventurieri',sessions:'Registro XP',notes:'Note sui PG',docs:'Documentazione',pending:'Resoconti sospesi',calendar:'Calendario sessioni',admin:'Amministrazione',adventure:selectedAdventure?.title||'Sessione'};if(page.startsWith('detail-'))title[page]='Scheda PG';document.body.classList.toggle('compact-session',page==='sessions');app.innerHTML='<div class="layout">'+nav()+'<main class="main'+(nuova?' pagina-nuova':'')+'" id="contenuto"><header class="top"><div><div class="eyebrow">Benvenuto, '+esc(me.username)+' · '+esc(roleNames[me.role]||'')+'</div><h1>'+esc(title[page]||'Scheda PG')+'</h1><p class="sub">'+(page==='docs'?'Documenti e materiale di riferimento della campagna.':'Esperienza, sessioni e cronache della compagnia.')+'</p></div><div class="top-actions"><button class="quiet" id="gsearch">⌕ Cerca <kbd>Ctrl K</kbd></button>'+(canEdit()?'<button class="action" id="newSession">＋ Nuova sessione</button><button class="quiet" id="addEntry">Singolo XP</button>':'')+'<button class="quiet" id="changePassword">Cambia password</button><button class="quiet" id="logout">Esci</button></div></header>'+(page==='calendar'?calendar():page==='home'?home():page==='players'?playerPage():page==='notes'?notesPage():page==='pending'?pendingPage():page==='docs'?docsPage():page==='sessions'?sessionPage():page==='adventure'?adventurePage():page==='admin'&&isAdmin()?adminPage():page.startsWith('detail-')?detail():home())+(page==='admin'&&isAdmin()?'<div id="adminExtras">'+adminExtrasHTML()+'</div>':'')+'</main></div><div class="modal" id="modal"></div>';document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>setPage(b.dataset.page));$('#logout').onclick=async()=>{await post('logout',{});me=null;page='home';history.replaceState(null,'','#');login()};$('#addEntry')?.addEventListener('click',()=>entryForm());$('#newSession')?.addEventListener('click',sessionForm);$('#openTrash')?.addEventListener('click',openTrash);$('#changePassword')?.addEventListener('click',changePasswordForm);bindPage();if(page==='docs'){['cronDa','cronA','cronCerca'].forEach(id=>{const el=document.getElementById(id);if(el)el.addEventListener('input',filtraCronache)});document.getElementById('cronAzzera')?.addEventListener('click',()=>{['cronDa','cronA','cronCerca'].forEach(id=>{const el=document.getElementById(id);if(el)el.value=''});document.querySelectorAll('#docs-cronache .capitolo').forEach((c,i)=>c.open=i===0);filtraCronache()})}
document.querySelectorAll('[data-doc]').forEach(b=>b.onclick=()=>{const t=document.getElementById('docs-'+b.dataset.doc);if(t)t.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})});document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openPlayer(b.dataset.open));$('#calprev')?.addEventListener('click',()=>{calDate.setMonth(calDate.getMonth()-1);render()});$('#calnext')?.addEventListener('click',()=>{calDate.setMonth(calDate.getMonth()+1);render()});$('#newplan')?.addEventListener('click',newPlan);document.querySelectorAll('[data-plan]').forEach(b=>b.onclick=()=>planDetails(b.dataset.plan));$('#gsearch')?.addEventListener('click',searchModal);if(page.startsWith('detail-'))rewardHandlers();if(page==='admin'&&isAdmin())bindAdminExtras();stampaEtichette();applyDynamicStyles()}
function calendar(){let y=calDate.getFullYear(),m=calDate.getMonth(),start=(new Date(y,m,1).getDay()+6)%7,n=new Date(y,m+1,0).getDate(),days='';for(let i=0;i<start;i++)days+='<div class="cal-cell blank"></div>';for(let d=1;d<=n;d++){let k=y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');days+='<div class="cal-cell"><b>'+d+'</b>'+plans.filter(p=>p.date===k&&p.status!=='cancelled').map(p=>'<button class="cal-event" data-plan="'+p.id+'">'+esc(p.start_time||'')+' '+esc(p.title)+'</button>').join('')+'</div>'}return '<section class="panel"><div class="panelhead"><button id="calprev" class="quiet">←</button><h2>'+calDate.toLocaleDateString('it-IT',{month:'long',year:'numeric'})+'</h2><button id="calnext" class="quiet">→</button>'+(canEdit()?'<button id="newplan" class="action">＋ Programma</button>':'')+'</div><div class="calendar-grid">'+['Lun','Mar','Mer','Gio','Ven','Sab','Dom'].map(x=>'<b class="cal-weekday">'+x+'</b>').join('')+days+'</div></section>'}
function newPlan(){let people=players.map(p=>'<label>'+esc(p.name)+' <select name="a_'+p.id+'"><option value="pending">Da confermare</option><option value="available">Disponibile</option><option value="maybe">Forse</option><option value="unavailable">Assente</option></select></label>').join('');openModal('Programma sessione','<div class="formgrid"><label class="wide">Titolo<input name="title" required></label><label>Data<input name="date" type="date" min="'+todayISO()+'" value="'+todayISO()+'" required></label><label>Ora<input name="start_time" type="time"></label><label>Tipo<select name="type">'+typesSelect('Principale')+'</select></label><label>Luogo<input name="location"></label><label class="wide">Note<textarea name="notes"></textarea></label></div><h3>Disponibilità avventurieri</h3><div class="availability-list">'+people+'</div>',async f=>{let d=Object.fromEntries(f);d.participants=players.map(p=>({player_id:p.id,availability:d['a_'+p.id]}));await post('session-plans',d);await load()})}
function planDetails(id){let p=plans.find(x=>x.id===id);if(p)openModal(esc(p.title),'<p>'+itdate(p.date)+' · '+esc(p.start_time||'')+' · '+esc(p.location||'')+'</p><p>'+esc(p.notes||'')+'</p><div class="scroll"><table><tbody>'+p.participants.map(x=>'<tr><td>'+esc(x.name)+'</td><td>'+esc(x.availability)+'</td></tr>').join('')+'</tbody></table></div>'+(canEdit()?'<button id="editPlan" class="action">Modifica / segna presenze</button>':'')+(canEdit()&&p.status==='planned'?'<button id="completePlan" class="quiet">Segna sessione completata</button><button id="cancelPlan" class="quiet danger">Annulla</button>':''),null);$('#editPlan')?.addEventListener('click',()=>editPlan(p));$('#completePlan')?.addEventListener('click',()=>editPlan(p,true));$('#cancelPlan')?.addEventListener('click',async()=>{await api('session-plans/'+id,{method:'DELETE'});await load()})}
function editPlan(p,completed=false){let roster=p.participants.map(x=>'<label>'+esc(x.name)+' <select name="a_'+x.player_id+'"><option value="pending">Da confermare</option><option value="available" '+(x.availability==='available'?'selected':'')+'>Disponibile</option><option value="maybe" '+(x.availability==='maybe'?'selected':'')+'>Forse</option><option value="unavailable" '+(x.availability==='unavailable'?'selected':'')+'>Non disponibile</option></select></label>').join('');openModal('Disponibilità dei partecipanti','<div class="formgrid"><label>Titolo<input name="title" value="'+esc(p.title)+'"></label><label>Data<input name="date" type="date" value="'+p.date+'"></label><label>Ora<input name="start_time" type="time" value="'+esc(p.start_time||'')+'"></label><label>Luogo<input name="location" value="'+esc(p.location||'')+'"></label><label class="wide">Note<textarea name="notes">'+esc(p.notes||'')+'</textarea></label><label>Stato<select name="status"><option value="planned">In programma</option><option value="completed" '+(completed||p.status==='completed'?'selected':'')+'>Completata</option><option value="cancelled">Annullata</option></select></label></div><div class="availability-list">'+roster+'</div>',async f=>{let d=Object.fromEntries(f);d.participants=p.participants.map(x=>({player_id:x.player_id,availability:d['a_'+x.player_id]}));await put('session-plans/'+p.id,d);await load()})}
function searchModal(){openModal('Ricerca globale','<input id="searchall" type="search" placeholder="PG, sessioni, XP…" aria-label="Cerca in tutto l’archivio"><div id="searchres"></div>',async()=>{});$('#searchall').oninput=()=>{const q=$('#searchall').value.toLowerCase(),box=$('#searchres');if(q.length<2){box.innerHTML='';return}const out=[];players.filter(p=>[p.name,p.class,p.race,p.background].some(v=>String(v||'').toLowerCase().includes(q))).slice(0,6).forEach(p=>out.push('<button type="button" class="search-result" data-open="'+esc(p.id)+'">PG · '+esc(p.name)+'</button>'));plans.filter(p=>(p.title+' '+p.location+' '+p.notes).toLowerCase().includes(q)).slice(0,6).forEach(p=>out.push('<button type="button" class="search-result" data-open-plan="'+esc(p.id)+'">Sessione · '+esc(p.title)+' · '+itdate(p.date)+'</button>'));groups().filter(g=>(g.title+' '+g.rows.map(x=>x.player_name).join(' ')).toLowerCase().includes(q)).slice(0,6).forEach(g=>out.push('<button type="button" class="search-result" data-group="'+encodeURIComponent(g.key)+'">Sessione · '+esc(g.title)+' · '+itdate(g.date)+'</button>'));entries.filter(e=>(e.title+' '+e.player_name+' '+e.notes).toLowerCase().includes(q)).slice(0,8).forEach(e=>{const label='XP · '+esc(e.player_name)+' · '+esc(e.title)+' · '+fmt(e.xp);out.push(e.player_id?'<button type="button" class="search-result" data-open="'+esc(e.player_id)+'">'+label+'</button>':'<div class="search-result">'+label+'</div>')});box.innerHTML=out.length?out.join(''):'<p class="sub">Nessun risultato.</p>';box.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openPlayer(b.dataset.open));box.querySelectorAll('[data-open-plan]').forEach(b=>b.onclick=()=>planDetails(b.dataset.openPlan));box.querySelectorAll('[data-group]').forEach(b=>b.onclick=()=>showGroup(decodeURIComponent(b.dataset.group)))};$('#searchall').focus()}
async function openPlayer(id){try{playerRewards=await api('players/'+id+'/rewards')}catch{playerRewards={inspirations:[],items:[]}}setPage('detail-'+id)}
function detail(){let p=players.find(x=>x.id===page.slice(7));if(!p)return playerPage();let r=playerRewards||{inspirations:[],items:[]},active=r.inspirations.find(x=>!x.used_on),xp=totals().get(p.id)||0,lvl=levelInfo(xp);return '<button class="link" data-page="players">← Avventurieri</button><section class="panel"><div class="person-heading">'+(p.portrait_url?'<img class="portrait" src="'+esc(p.portrait_url)+'" alt="">':'')+'<div class="person-heading-main"><div class="eyebrow">Scheda avventuriero · '+esc(p.status||'Attivo')+'</div><h2>'+esc(p.name)+'</h2><p class="sub">'+esc(p.class||'Classe non indicata')+' · '+esc(p.race||'Stirpe non indicata')+'</p><p><span class="tag">Livello '+lvl.level+'</span> '+(p.alignment?'<span class="tag">'+esc(p.alignment)+'</span>':'')+'</p></div>'+(p.google_sheet_url?'<a class="action" href="'+esc(p.google_sheet_url)+'" target="_blank" rel="noopener">Apri Google Fogli ↗</a>':'')+'</div><section class="cards mini-cards"><div class="card"><label>XP totali</label><div class="metric">'+fmt(xp)+'</div></div><div class="card"><label>Sessioni frequentate</label><div class="metric">'+entries.filter(x=>x.player_id===p.id).length+'</div></div><div class="card"><label>Prossimo livello</label><div class="metric small-metric">'+(lvl.maxed?'Massimo':fmt(lvl.remaining)+' XP')+'</div></div><div class="card"><label>Origine</label><div class="metric small-metric">'+esc(p.background||'—')+'</div></div><div class="card"><label>Compleanno</label><div class="metric small-metric">'+dateBirthday(p.birthday)+'</div></div></section>'+(p.details?'<h3 class="section-title">Altri dettagli</h3><div class="detailtext">'+esc(p.details)+'</div>':'')+(p.notes?'<h3 class="section-title">Note</h3><div class="detailtext">'+esc(p.notes)+'</div>':'')+(canEdit()?'<button class="quiet section-title" data-edit="'+p.id+'">Modifica scheda</button>':'')+(canEdit()&&p.google_sheet_url?'<button class="quiet section-title" data-sheet="'+p.id+'">Aggiorna dalla scheda</button>':'')+'<section class="panel reward-panel"><h3>Ispirazione eroica</h3>'+(active?'<p>✦ Attiva dal '+itdate(active.granted_on)+(canEdit()?' <button type="button" data-usei="'+active.id+'">Segna usata</button>':'')+'</p>':'<p class="sub">Nessuna ispirazione attiva.</p>')+(canEdit()&&!active?'<button type="button" id="granti">＋ Assegna</button>':'')+'<h3>Oggetti ottenuti</h3>'+(canEdit()?'<button type="button" id="additem">＋ Registra oggetto</button>':'')+r.items.map(x=>'<article class="item-card"><div><b>'+esc(x.name)+' ×'+x.quantity+'</b><p>'+esc(x.description||'')+'</p><small>'+esc(x.session_title||'')+' · '+itdate(x.session_date)+'</small></div>'+(canEdit()?'<button type="button" data-deli="'+x.id+'">Rimuovi</button>':'')+'</article>').join('')+'</section><h3 class="section-title">Sessioni e XP</h3>'+entryTable(entries.filter(x=>x.player_id===p.id).sort((a,b)=>b.date.localeCompare(a.date)))+'</section>'}
function rewardHandlers(){let pid=page.slice(7);$('#granti')?.addEventListener('click',()=>openModal('Assegna ispirazione','<label>Data<input name="granted_on" type="date" value="'+todayISO()+'"></label><label>Nota<input name="notes"></label>',async f=>{await post('players/'+pid+'/inspirations',Object.fromEntries(f));await openPlayer(pid)}));$('#additem')?.addEventListener('click',()=>openModal('Aggiungi oggetto','<label>Nome<input name="name" required></label><label>Quantità<input name="quantity" type="number" value="1"></label><label>Data<input name="session_date" type="date"></label><label>Sessione<input name="session_title"></label><label>Dettagli<textarea name="description"></textarea></label>',async f=>{await post('players/'+pid+'/items',Object.fromEntries(f));await openPlayer(pid)}));document.querySelectorAll('[data-usei]').forEach(b=>b.onclick=async()=>{await post('inspirations/'+b.dataset.usei+'/use',{used_on:todayISO()});await openPlayer(pid)});document.querySelectorAll('[data-deli]').forEach(b=>b.onclick=async()=>{if(confirm('Rimuovere oggetto?')){await api('items/'+b.dataset.deli,{method:'DELETE'});await openPlayer(pid)}})}
function playerPage(){let statuses=[...new Set(['Attivo','Inattivo',...players.map(p=>p.status||'Attivo')])].sort((a,b)=>a.localeCompare(b));return '<section class="player-intro"><div><div class="eyebrow">Archivio della compagnia</div><h2>Le schede degli avventurieri</h2><p class="sub">Cerca e confronta i progressi e la partecipazione di ogni personaggio.</p></div>'+(canEdit()?'<button class="action" id="newPlayer">＋ Aggiungi avventuriero</button>':'')+'</section><div class="player-toolbar"><label class="player-search"><span>⌕</span><input id="pSearch" placeholder="Cerca nome, classe, stirpe o origine…" autocomplete="off"></label><select id="pStatus"><option value="">Tutti gli stati</option>'+statuses.map(x=>'<option>'+esc(x)+'</option>').join('')+'</select><select id="pSort" aria-label="Ordina avventurieri"><option value="name">Ordina per nome</option><option value="xp">Più XP</option><option value="played">Più sessioni giocate</option><option value="playedLeast">Meno sessioni giocate</option><option value="recent">Ha giocato più recentemente</option><option value="oldest">Ha giocato più tempo fa</option></select><span class="player-count" id="playerCount">'+players.length+' PG</span></div><div id="pcards" class="gridcards">'+playerCards(players)+'</div>'}
function filterPlayers(){let q=$('#pSearch')?.value.toLocaleLowerCase('it')||'',status=$('#pStatus')?.value||'',sort=$('#pSort')?.value||'name',xp=totals(),list=players.filter(p=>(!status||(p.status||'Attivo')===status)&&[p.name,p.class,p.race,p.background,p.alignment,p.status].join(' ').toLocaleLowerCase('it').includes(q)),count=p=>entries.filter(e=>e.player_id===p.id).length,last=p=>entries.filter(e=>e.player_id===p.id).map(e=>e.date).filter(Boolean).sort().slice(-1)[0]||'';list.sort((a,b)=>{let av,bv;if(sort==='xp'){av=xp.get(a.id)||0;bv=xp.get(b.id)||0;return bv-av||a.name.localeCompare(b.name,'it')}if(sort==='played'||sort==='playedLeast'){av=count(a);bv=count(b);return (sort==='played'?bv-av:av-bv)||a.name.localeCompare(b.name,'it')}if(sort==='recent'||sort==='oldest'){av=last(a);bv=last(b);if(!av&&!bv)return a.name.localeCompare(b.name,'it');if(!av)return 1;if(!bv)return -1;return (sort==='recent'?bv.localeCompare(av):av.localeCompare(bv))||a.name.localeCompare(b.name,'it')}return a.name.localeCompare(b.name,'it')});if($('#pcards'))$('#pcards').innerHTML=playerCards(list);if($('#playerCount'))$('#playerCount').textContent=list.length+' PG';applyDynamicStyles()}
const cardsSortObserver=new MutationObserver(records=>{if(!document.querySelector('#pcards'))return;for(const m of records)if(m.target.id==='pcards'||m.target.closest?.('#pcards')){document.querySelectorAll('#pcards [data-open]').forEach(b=>b.onclick=()=>openPlayer(b.dataset.open));document.querySelectorAll('#pcards [data-edit]').forEach(b=>b.onclick=()=>playerForm(players.find(p=>p.id===b.dataset.edit)));document.querySelectorAll('#pcards [data-archive]').forEach(b=>b.onclick=async()=>{if(confirm('Archiviare questo PG? La cronologia XP resterà negli annali.')){try{await api('players/'+b.dataset.archive,{method:'DELETE'});await load()}catch(e){alert(e.message)}}});break}});
cardsSortObserver.observe(document.querySelector('#app'),{childList:true,subtree:true});

function stampaEtichette(){
  document.querySelectorAll('table').forEach(t=>{
    const h=[...t.querySelectorAll('thead th')].map(x=>x.textContent.trim());
    if(!h.length)return;
    t.querySelectorAll('tbody tr').forEach(r=>[...r.cells].forEach((c,i)=>{if(!c.dataset.label&&h[i])c.dataset.label=h[i]}))
  })
}
