# Matteo Moscara — Direzione del sito

## La lettura del tuo percorso

Ho letto il CV generale 2026, i tre CV dedicati a comunicazione, informatica e ufficio tecnico, il curriculum testuale e le pagine esistenti. Ho esaminato anche l’archivio dei lavori e delle fotografie.

Il filo che emerge è la capacità di collegare competenze e persone: comunicazione e produzione visiva, sviluppo e debugging, coordinamento e processi. La mia interpretazione è che il sito debba rendere percepibile questa mobilità, senza chiedere al visitatore di ricostruirla da un elenco di incarichi.

## Dove la home precedente ti limitava

- Ripeteva ordine, concretezza e semplicità in sezioni molto simili. La curiosità e il pensiero laterale dei CV restavano sullo sfondo.
- Usava descrizioni generiche di progetti al posto dei lavori grafici presenti nell’archivio.
- Le variazioni di colori, fotografie e testi non seguivano sempre una direzione comune.
- Il pulsante del curriculum arrivava prima che la pagina facesse conoscere la persona.
- Numerose librerie e animazioni si sovrapponevano senza costruire un racconto comune.

## L’idea: «Le idee non stanno ferme.»

La libertà prende forma attraverso composizioni asimmetriche, grandi parole, fotografie inclinate e cambi di ritmo. Fondo carta e nero caldo fanno da base a sei varianti di accento: arancio, blu, viola, rosa, ottanio e oliva. Il tuo pittogramma e il carattere Funnel Display mantengono un legame con il sito precedente.

Il percorso della pagina:

1. **Un invito:** il titolo e la fotografia del salto introducono energia e apertura.
2. **Una persona:** il ritratto e il racconto spiegano cosa tiene insieme ambiti diversi.
3. **Un modo di lavorare:** tre approfondimenti collegano comunicazione, tecnologia e coordinamento.
4. **Cose da guardare:** siti web e fotografie, con una selezione diversa a ogni visita e filtri per esplorare l’intero archivio attuale.
5. **Una piccola esperienza:** «Cambia prospettiva» traduce il pensiero laterale in un’interazione grafica.
6. **Una conversazione:** il contatto via email conclude il percorso.

I testi in prima persona sono una proposta editoriale basata sul materiale fornito. Non sono state aggiunte testimonianze, metriche di successo o attribuzioni a clienti assenti dall’archivio. Nessun collegamento ai CV compare nella nuova home.

## Implementazione

La home usa HTML, CSS e JavaScript senza framework né librerie di animazione. Il font è locale, con la sua licenza. Fotografie e anteprime dei siti sono in WebP; le immagini dei siti sono catture reali, servite dal sito personale senza incorporare pagine di terzi.

### Un sito che cambia a ogni visita

Dieci versioni editoriali percorrono tutta la pagina. Ogni apertura è collegata a una serie coerente di titoli, testi e inviti all'azione: presentazione, racconto personale, quattro tappe del campo, introduzione al portfolio, invito a conoscere altri lavori, esperienza interattiva, contatto e firma finale. Cambiano anche i tre messaggi dell'esperienza delle forme. I dieci fili sono slancio, spazio, altrove, sguardo, insieme, domande, forma, curiosità, dettagli e direzione.

L'obiettivo resta rendere riconoscibile Matteo come persona che collega comunicazione, tecnologia e persone, portare il visitatore a esplorare alcuni lavori e invitarlo a una conversazione. Le frasi sono scelte come una versione completa, insieme al titolo iniziale, per mantenere il filo della lettura. Restano ferme durante la visita e cambiano alla ricarica. Nomi dei progetti, informazioni, fotografie e comandi di navigazione mantengono la loro funzione e i loro riferimenti.

A ogni caricamento varia anche la palette di accento, con tonalità chiare abbinate alle sezioni scure e colori del testo verificati per ciascuno sfondo. Nella stessa scheda la ricarica evita di ripetere immediatamente versione editoriale e palette. La selezione iniziale contiene tre siti e tre fotografie e cambia a ogni visita; «Un altro giro» la rinnova anche senza ricaricare.

I filtri rendono disponibili i quattro siti e le dodici fotografie caricati per questa selezione. I siti attuali sono MeTe Regione Abruzzo, PISSTA, Carico Srl e LILT Pescara. La grafica è esclusa dalla selezione finché non sarà aggiornata. In ogni versione il portfolio si presenta come un primo sguardo sul percorso, con un invito a scrivere per conoscere altri progetti e il modo di lavorare.

MeTe comprende l’indicazione delle app iOS e Android e i collegamenti agli store forniti dall’utente. Nell’ambiente di verifica questi indirizzi hanno restituito 404; sono stati mantenuti su esplicita indicazione dell’utente.

### Fotografie, dentro il sito

Le dodici fotografie hanno titoli editoriali e nuovi nomi descrittivi, come `il-mondo-si-riflette.webp` e `geometrie-pazienti.webp`. Ciascuna ha un’anteprima leggera e una versione a risoluzione maggiore. Gli originali dell’archivio sono conservati, senza collegamenti dalla nuova home.

Le foto si aprono in una modal che occupa l’intero schermo, con titolo, contatore, frecce, tasti direzionali, Home/End e navigazione al tocco. Escape e il pulsante di chiusura riportano alla fotografia da cui si era partiti. Nessun comando della galleria porta al file immagine.

### Scorrere per trasformare

Tra il racconto personale e il portfolio, un piccolo campo da calcio ruota e si espande fino a riempire lo schermo. Continuando a scorrere verso il basso, l’inquadratura attraversa quattro tappe dello stesso campo. Per esempio, nella versione «slancio»:

1. Zoom al centro: «Cambio prospettiva. Metto a fuoco».
2. Avvicinamento in basso a destra: «Far arrivare le idee».
3. Spostamento verso destra: «Dare vita alle intuizioni».
4. Proseguimento verso destra: «Far muovere le cose».

Campo e testi condividono le coordinate della scena. I capitoli restano ancorati ai loro punti durante lo spostamento dell’inquadratura; la dimensione del testo si mantiene leggibile mentre lo sfondo si avvicina. Alcuni tratti del percorso lasciano ferma l’inquadratura per leggere. I comandi in basso permettono anche di raggiungere direttamente una tappa. La foto iniziale e la tipografia mantengono il leggero movimento a velocità diverse.

Lo scorrimento resta nativo. Un solo gestore passivo e un aggiornamento per fotogramma alimentano la trasformazione; non vengono catturati rotella o gesti per imporre un percorso.

Menu, galleria e comandi funzionano da tastiera. La preferenza di sistema per il movimento ridotto presenta i quattro capitoli in sequenza e disattiva le animazioni, anche se cambia a pagina già aperta. Senza JavaScript restano disponibili contenuti, navigazione, siti e fotografie statiche.

### Dettagli che rispondono

Il mouse ha un cursore disegnato con una piccola rosa dei venti: diventa una freccia sui collegamenti e un segno da testo sulle parole. Il clic produce un cerchio che si apre e un leggero movimento del testo vicino, che torna subito al suo posto. Il movimento si somma alle trasformazioni esistenti, senza sostituire la camera del campo o le animazioni di ingresso. La selezione tramite trascinamento e i comandi da tastiera non attivano questi effetti.

Sul telefono, un piccolo alone animato segue il punto di contatto anche durante lo scorrimento nativo. Scompare quando il dito si stacca; con più dita si nasconde per lasciare spazio al gesto di zoom. L'effetto non blocca i gesti, non cattura il puntatore e non muove i testi al tocco. Il tipo di interazione segue l'input effettivo, anche quando si passa dal mouse al touch sullo stesso dispositivo.

Dopo un secondo di selezione stabile e a dito o mouse rilasciato, compare una delle dieci battute, iniziando da «Dai non selezionarmi». Il messaggio si posiziona vicino al testo entro i bordi dello schermo e scompare da solo, scorrendo o premendo Escape. La selezione resta disponibile per copiare il testo. Il titolo iniziale è selezionabile come il resto della pagina.

Cursore e messaggi funzionano anche nella galleria a tutto schermo. Con movimento ridotto restano gli indicatori statici e il messaggio, senza cerchi animati o spostamenti dei testi; con colori forzati il mouse usa il cursore nativo. Non sono state aggiunte librerie.

I lavori, le aperture e le sei palette sono in `js/portfolio-content.js`; i testi delle dieci versioni sono in `js/portfolio-copy.js`, collegati all'apertura tramite un identificatore. Gli attributi `data-copy` dell'HTML indicano quali testi sostituire; l'HTML resta una versione completa quando JavaScript è disattivato. Il comportamento è in `js/portfolio.js`. Gli stili sono in `css/portfolio.css` e `css/experience.css`; `css/field-story.css` gestisce la scena del campo e le varianti di colore. `js/micro-interactions.js` e `css/micro-interactions.css` gestiscono cursori, clic e battute sulla selezione. Gli stili precedenti restano separati perché sono usati anche dalle altre pagine. I PDF non sono stati modificati da questo intervento.

## Verifiche eseguite

Controllo nel browser Chrome a nove larghezze, da 320 a 1920 px, senza sforamenti orizzontali. Tutte e dieci le aperture sono verificate singolarmente a 320, 390, 768 e 1440 px. Controllate le ricariche successive, la variazione dei lavori, i filtri, la galleria a tutto schermo, i comandi da tastiera, il ritorno del focus e le fasi dell’espansione del campo. Verificati anche movimento ridotto e navigazione senza JavaScript.

Tutte e dieci le versioni dell'intera pagina sono verificate a 320, 390, 768 e 1440 px: corrispondenza con l'apertura, copertura dei testi, titoli differenti, assenza di tagli e sforamenti, conservazione delle frecce dei comandi e ciclo dei tre messaggi interattivi. Per ogni versione sono controllate anche le quattro tappe del campo a 320 × 568, 390 × 844, 844 × 390 e 1440 × 1000, con i testi entro l'inquadratura e distanti dai comandi. Verificate visivamente presentazione, invito del portfolio e contatto; la versione controllata con axe a 390 e 1440 px non segnala violazioni WCAG A/AA.

Il percorso del campo è verificato a 1440 × 1000, 390 × 844, 320 × 568 e 844 × 390: centratura dei capitoli, posizione dell’inquadratura, continuità dello spostamento verso destra e salto tra le tappe. Tutte e sei le palette passano il controllo automatico axe per WCAG A/AA nelle viste desktop, mobile e nello stato di passaggio sul pulsante interattivo.

Il controllo automatico axe per WCAG A/AA non segnala violazioni nelle viste desktop e mobile della selezione mista, dei filtri, della galleria a tutto schermo e del menu aperto. Questo controllo automatico non sostituisce una valutazione completa con tecnologie assistive.

Le microinterazioni sono verificate in Chrome con mouse e touch emulato a 320 e 390 px: indicatore durante lo scroll nativo, rilascio e multitouch, passaggio tra mouse e dito, swipe nella galleria, menu e messaggi entro i bordi dello schermo. Controllati il trascinamento reale per selezionare, il ritardo di un secondo, l'alternanza delle battute, la conservazione della selezione e il ritorno dei testi alla posizione iniziale. Verificate anche le preferenze per movimento ridotto e colori forzati. Il messaggio visibile passa il controllo automatico axe. Non è stata effettuata una prova su dispositivi iOS o Android fisici.

## Anteprima locale

Dalla cartella del sito:

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Apri `http://127.0.0.1:8765/`. Non occorre installare dipendenze o eseguire una compilazione.

Le modifiche sono nel repository locale. Non è stata avviata una pubblicazione sul dominio esistente.
