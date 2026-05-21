import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { supabase } from "./supabase.js";

function formatDuration(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

// ─── DEFAULT DATA ──────────────────────────────────────────────────────────────
const DEFAULT_CHECKLIST = [{ phase: "FASE 0 — Pianificazione", tasks: [{ title: "0.1 — Definire l'architettura del sito", description: `Hai già concordato 3 keyword principali durante la vendita.\nLa struttura del sito sarà:\n/ → Home ottimizzata per la keyword principale più importante\n/servizi/ → Pagina servizi\n/keyword-2/ → Pagina SEO dedicata al secondo servizio\n/keyword-3/ → Pagina SEO dedicata al terzo servizio\n/chi-siamo/ → Chi siamo\n/contatti/ → Contatti\nLa Home sarà la pagina SEO principale del sito e sarà ottimizzata per il servizio/keyword più importante.\nLe altre 2 keyword avranno invece pagine SEO dedicate separate.\nOgni pagina SEO deve essere costruita per posizionarsi su una keyword specifica già concordata col cliente.\nGli URL vanno decisi subito prima della costruzione del sito. Non modificarli dopo l'indicizzazione.`, practicalGuide: `PASSO PASSO PRATICO:\n1. Apri Notion oppure crea un foglio Google Docs dedicato al progetto.\n2. Scrivi il nome del cliente e sotto crea la struttura delle pagine:\n• Home\n• Servizi\n• Pagina SEO keyword 2\n• Pagina SEO keyword 3\n• Chi siamo\n• Contatti\n3. Decidi subito gli URL finali.\nEsempio:\n/servizi/\n/videoispezioni-milano/\n/spurghi-milano/\n4. Associa ad ogni pagina:\n• keyword principale\n• CTA\n• obiettivo pagina\n5. NON iniziare Elementor o WordPress finché la struttura non è chiara.\n6. Controlla che:\n• gli URL siano corti\n• leggibili\n• senza caratteri strani\n• coerenti col servizio.` }, { title: "0.2 — Organizzare le keyword già concordate", description: `Le 3 keyword principali sono già state concordate durante la vendita.\nAdesso devi solo organizzare:\n• keyword principale della Home\n• keyword della seconda pagina SEO\n• keyword della terza pagina SEO\nPer ogni pagina annota:\n• keyword principale\n• keyword secondarie correlate\n• intento di ricerca\n• CTA principale\nL'obiettivo è costruire ogni pagina per un servizio specifico già venduto al cliente.`, practicalGuide: `💡 UTILITÀ: Senza una mappa chiara delle keyword ogni pagina rischia di ottimizzarsi per le stesse parole, cannibalizzando il posizionamento invece di coprire più ricerche.\n\nPASSO PASSO PRATICO:\n1. Apri il documento di progetto creato nel task 0.1.\n2. Crea una tabella con 3 colonne: Pagina | Keyword principale | Keyword secondarie.\n3. Inserisci le 3 keyword già concordate col cliente, una per riga.\n4. Per ciascuna annota l'intento di ricerca: informazionale, commerciale o transazionale.\n5. Aggiungi la CTA principale di ogni pagina (es. "Chiama ora", "Richiedi preventivo").\n6. Verifica che nessuna keyword compaia come principale su due pagine diverse.\n7. Salva il documento — lo userai come riferimento fisso durante tutta la Fase 4 e 5.` }, { title: "0.3 — Raccogliere tutti i materiali", description: `Prima di costruire:\n• testi definitivi (o bozze avanzate)\n• loghi in formato SVG o PNG trasparente\n• immagini già compresse e rinominate con keyword\n• numero di telefono\n• indirizzo\n• P.IVA\n• email professionale`, practicalGuide: `💡 UTILITÀ: Iniziare Elementor senza avere testi e immagini pronti significa riempire il sito di placeholder che poi si dimenticano, rallentare il lavoro e rischiare di pubblicare contenuti incompleti.\n\nPASSO PASSO PRATICO:\n1. Crea una cartella sul PC nominata con il dominio del cliente (es. "rossiidraulica-it").\n2. Al suo interno crea sottocartelle: /loghi /immagini /testi /dati-aziendali.\n3. Chiedi al cliente via email o WhatsApp:\n   • logo in SVG o PNG trasparente (almeno 500px)\n   • 5-10 foto dell'attività (no stock)\n   • testi delle pagine o punti chiave del servizio\n   • numero di telefono, indirizzo, P.IVA, email\n4. Comprimi e rinomina le immagini con la keyword prima di salvarle (es. "idraulico-milano-pronto-intervento.jpg").\n5. Se i testi non sono pronti, scrivi almeno una bozza per H1, descrizione servizio e CTA di ogni pagina.\n6. Non aprire WordPress finché non hai almeno l'80% dei materiali.` }] }, { phase: "FASE 1 — Acquisto e configurazione iniziale", tasks: [{ title: "1.1 — Acquistare il dominio su Hostinger", description: `Registra il dominio direttamente su Hostinger così gestisci tutto da un pannello solo.\nScegli:\n• .it per business locale italiano\n• .com per brand più internazionale\nEvita:\n• domini troppo lunghi\n• trattini\n• numeri inutili\nSalva tutte le credenziali nel password manager.`, practicalGuide: `💡 UTILITÀ: Avere dominio e hosting sullo stesso pannello elimina la configurazione DNS manuale e riduce i tempi di propagazione da ore a minuti.\n\nPASSO PASSO PRATICO:\n1. Vai su hostinger.it e accedi al tuo account.\n2. Clicca su \"Domini\" nel menu principale → \"Cerca dominio\".\n3. Digita il nome desiderato e scegli l'estensione (.it per business locale).\n4. Verifica che non ci siano trattini o numeri nel nome.\n5. Aggiungi al carrello e completa l'acquisto (NON attivare addon inutili come \"protezione privacy\" a pagamento — Hostinger lo include già).\n6. Salva subito credenziali nel password manager con etichetta \"Hostinger – [nomecliente]\".\n7. Controlla la email di conferma registrazione.` }, { title: "1.2 — Acquistare il piano hosting", description: `Su Hostinger scegli almeno il piano Business (include LiteSpeed con cache object, CDN gratuita, backup giornalieri automatici e possibilità di creare il sito staging). Il piano Premium è sufficiente solo per siti piccoli senza staging.`, practicalGuide: `💡 UTILITÀ: Il piano Business è il minimo per avere staging integrato — senza staging non puoi testare aggiornamenti in sicurezza prima di applicarli al sito live.\n\nPASSO PASSO PRATICO:\n1. Vai su hostinger.it → \"Hosting\" → \"Hosting condiviso\".\n2. Seleziona il piano Business (o superiore). NON scegliere Premium se il cliente vuole lo staging.\n3. Scegli durata minima 12 mesi per avere prezzo conveniente.\n4. Nella pagina checkout associa il dominio già acquistato a questo piano.\n5. Completa l'acquisto.\n6. Verifica dall'hPanel che il piano sia attivo e che il dominio risulti associato.` }, { title: "1.3 — Attivare il dominio sul piano hosting", description: `Dall'hPanel di Hostinger, vai in Hosting → Gestisci → Domains e collega il dominio acquistato. Se dominio e hosting sono entrambi su Hostinger, i DNS si configurano automaticamente in pochi minuti.`, practicalGuide: `💡 UTILITÀ: Senza collegare il dominio al piano, il sito non sarà raggiungibile dall'esterno. Farlo subito evita ritardi nella propagazione DNS.\n\nPASSO PASSO PRATICO:\n1. Accedi all'hPanel di Hostinger.\n2. Vai su \"Hosting\" → clicca \"Gestisci\" sul piano acquistato.\n3. Nel menu laterale clicca \"Domini\".\n4. Clicca \"Aggiungi dominio\" e seleziona il dominio già acquistato su Hostinger.\n5. Se dominio e hosting sono sullo stesso account i DNS si configurano in automatico.\n6. Attendi 5-15 minuti e verifica che il dominio punti all'hosting aprendo una finestra in incognito.` }, { title: "1.4 — Attivare SSL", description: `Dall'hPanel vai in SSL → Gestisci e attiva il certificato SSL gratuito (Let's Encrypt) sul dominio. Attendere che lo stato diventi "Attivo" prima di installare WordPress.`, practicalGuide: `💡 UTILITÀ: Senza SSL il browser mostra \"Non sicuro\" accanto al dominio, i visitatori scappano e Google penalizza il posizionamento. Va attivato prima di installare WordPress.\n\nPASSO PASSO PRATICO:\n1. Dall'hPanel vai su \"SSL\" nel menu laterale.\n2. Clicca \"Gestisci\" accanto al dominio.\n3. Clicca \"Installa\" sul certificato gratuito Let's Encrypt.\n4. Attendi che lo stato diventi \"Attivo\" (di solito 1-5 minuti).\n5. Se dopo 10 minuti non è attivo, prova a forzare il rinnovo con \"Reinstalla\".\n6. Verifica aprendo https://tuodominio.it — il lucchetto deve essere presente.\n7. Solo ora procedi con l'installazione di WordPress.` }, { title: "1.5 — Installare WordPress", description: `Dall'hPanel vai in Siti Web → Aggiungi sito web e scegli WordPress.\nInserisci:\nNome sito\nEmail admin\nUsername admin (NON usare "admin" — scegli qualcosa di non ovvio)\nPassword forte (almeno 20 caratteri, generata da password manager)\nSalva username e password nel password manager.`, practicalGuide: `💡 UTILITÀ: Un'installazione WordPress con credenziali deboli o username \"admin\" è la causa numero uno di siti bucati. Farlo bene adesso evita problemi futuri.\n\nPASSO PASSO PRATICO:\n1. Dall'hPanel vai su \"Siti Web\" → \"Aggiungi sito web\".\n2. Seleziona WordPress come CMS.\n3. Nel campo \"Nome sito\" inserisci il nome del business del cliente.\n4. Email admin: usa la tua email professionale (non quella del cliente per ora).\n5. Username: NON scrivere \"admin\". Usa qualcosa come \"gestorenome\" o una stringa casuale.\n6. Password: genera una password da almeno 20 caratteri con il password manager.\n7. Salva tutto nel password manager sotto la voce del cliente.\n8. Clicca \"Installa\" e attendi il completamento.\n9. Verifica accedendo a https://tuodominio.it/wp-admin.` }, { title: "1.6 — Forzare HTTPS da WordPress", description: `Vai su WordPress → Impostazioni → Generali e assicurati che entrambi gli indirizzi inizino con https://. Se non è già così, modificali e salva. Poi installa il plugin Really Simple SSL per gestire i redirect automatici da HTTP a HTTPS.`, practicalGuide: `💡 UTILITÀ: Senza forzare HTTPS anche le pagine interne possono essere servite in HTTP, creando contenuto misto che invalida il certificato SSL e genera warning nel browser.\n\nPASSO PASSO PRATICO:\n1. Accedi a wp-admin → \"Impostazioni\" → \"Generali\".\n2. Controlla che \"Indirizzo WordPress\" e \"Indirizzo sito\" inizino entrambi con https://.\n3. Se iniziano con http://, cambia manualmente in https:// e salva.\n4. Vai su \"Plugin\" → \"Aggiungi nuovo\" → cerca \"Really Simple SSL\".\n5. Installalo e attivalo.\n6. Clicca \"Vai su HTTPS\" quando appare il banner.\n7. Verifica che visitando http://tuodominio.it venga reindirizzato automaticamente su https://.` }, { title: "1.7 — Creare l'email professionale", description: `Dall'hPanel vai in Email → Gestisci e crea l'indirizzo (es. info@nomesito.it). Hostinger usa Titan Email: puoi accedere da webmail o configurare l'inoltro/accesso su Gmail. Crea almeno: info@, eventualmente noreply@ per i form.`, practicalGuide: `💡 UTILITÀ: Usare info@nomesito.it nei form di contatto invece di un Gmail generico aumenta la credibilità del brand e migliora la deliverability delle email.\n\nPASSO PASSO PRATICO:\n1. Dall'hPanel vai su \"Email\" → \"Gestisci\" → \"Crea account email\".\n2. Crea almeno info@nomesito.it.\n3. Scegli una password forte e salvala nel password manager.\n4. Per leggere le email: usa la webmail Hostinger oppure configura l'inoltro su Gmail.\n5. Per configurare su Gmail: vai su Impostazioni Gmail → Account → \"Aggiungi un account email\" e inserisci i dati IMAP/SMTP che trovi nell'hPanel.\n6. Testa inviando una email di prova da un account esterno e verificando che arrivi.` }] }, { phase: "FASE 2 — Configurazione WordPress", tasks: [{ title: "2.1 — Accedere alla dashboard", description: `Vai su tuodominio.it/wp-admin e accedi. Prima cosa: controlla che la barra superiore mostri che sei su HTTPS.`, practicalGuide: `💡 UTILITÀ: Verificare subito HTTPS e rimuovere la toolbar pubblica evita di esporre informazioni sulla versione WordPress ai visitatori.\n\nPASSO PASSO PRATICO:\n1. Vai su https://tuodominio.it/wp-admin.\n2. Accedi con le credenziali salvate nel password manager.\n3. Controlla che la barra degli indirizzi mostri il lucchetto HTTPS.\n4. Vai su \"Utenti\" → \"Il tuo profilo\" → scorri fino a \"Barra degli strumenti\" e disattiva \"Mostra la barra degli strumenti quando visito il sito\".\n5. Salva il profilo.\n6. Familiarizza con il menu laterale — lo userai molto nelle prossime fasi.` }, { title: "2.2 — Pulizia iniziale", description: `Post → Elimina "Hello World"\nPagine → Elimina "Sample Page" e "Privacy Policy" di default (ne creerai una via Complianz)\nPlugin → Disattiva ed elimina tutto il preinstallato (Akismet, Hello Dolly, ecc.)\nAspetto → Temi → Elimina tutti i temi preinstallati. Ne installerai uno solo`, practicalGuide: `💡 UTILITÀ: WordPress installa contenuti e plugin di esempio che appesantiscono il database e possono creare conflitti. Pulire subito significa partire da una base neutra.\n\nPASSO PASSO PRATICO:\n1. \"Post\" → seleziona \"Hello World\" → Azioni in blocco → Elimina → Svuota cestino.\n2. \"Pagine\" → elimina \"Sample Page\" e \"Privacy Policy\" predefinita.\n3. \"Plugin\" → disattiva Akismet, Hello Dolly e qualsiasi altro plugin preinstallato → poi eliminali.\n4. \"Aspetto\" → \"Temi\" → attiva Twenty Twenty-Three temporaneamente → poi elimina tutti gli altri temi tranne quello che stai per installare.\n5. \"Commenti\" → se presenti, elimina tutti i commenti di esempio.\n6. Verifica che il database sia pulito: la scheda \"Post\" e \"Pagine\" devono essere vuote.` }, { title: "2.3 — Impostare permalink", description: `Impostazioni → Permalink → seleziona "Nome articolo" → Salva. Fallo subito, prima di creare qualsiasi pagina.`, practicalGuide: `💡 UTILITÀ: Se imposti i permalink dopo aver già creato pagine, tutti gli URL cambiano e i link interni si rompono. Farlo subito è irreversibile nel senso positivo.\n\nPASSO PASSO PRATICO:\n1. Vai su \"Impostazioni\" → \"Permalink\".\n2. Seleziona \"Nome articolo\" (la struttura /%postname%/).\n3. Clicca \"Salva modifiche\".\n4. Verifica che la struttura sia salvata correttamente tornando sulla stessa pagina.\n5. Non toccare più questa impostazione dopo aver pubblicato le prime pagine indicizzate.` }, { title: "2.4 — Impostare lingua, fuso orario e data", description: `Impostazioni → Generali:\nLingua: Italiano\nFuso orario: Europe/Rome\nFormato data: gg/mm/aaaa\nFormato ora: H:i`, practicalGuide: `💡 UTILITÀ: Fuso orario e lingua errati causano email con timestamp sbagliati, backup schedulati a orari strani e interfaccia in inglese per il cliente.\n\nPASSO PASSO PRATICO:\n1. Vai su \"Impostazioni\" → \"Generali\".\n2. \"Lingua sito\": seleziona Italiano.\n3. \"Fuso orario\": seleziona Europe/Rome.\n4. \"Formato data\": inserisci d/m/Y (es. 21/05/2026).\n5. \"Formato ora\": inserisci H:i (es. 14:30).\n6. \"Il primo giorno della settimana\": seleziona Lunedì.\n7. Clicca \"Salva modifiche\".` }, { title: "2.5 — Bloccare l'indicizzazione durante i lavori", description: `Impostazioni → Lettura → spunta "Scoraggia i motori di ricerca" → Salva. Da rimuovere solo al momento della pubblicazione.`, practicalGuide: `💡 UTILITÀ: Se Google indicizza il sito a metà costruzione, indicizza pagine incomplete, testi placeholder e strutture provvisorie che poi sono difficili da rimuovere dall'indice.\n\nPASSO PASSO PRATICO:\n1. Vai su \"Impostazioni\" → \"Lettura\".\n2. In fondo alla pagina spunta \"Scoraggia i motori di ricerca dall'indicizzare questo sito\".\n3. Salva le modifiche.\n4. Segnati un promemoria di rimuovere questa spunta prima della pubblicazione (task 6.6).\n5. Verifica visitando https://tuodominio.it/robots.txt — deve contenere \"Disallow: /\".` }, { title: "2.6 — Hardening sicurezza base", description: `Vai in Utenti → Il tuo profilo e verifica che la email admin sia corretta\nVai in Impostazioni → Scrittura: rimuovi servizi di aggiornamento ping non necessari\nInstalla Limit Login Attempts Reloaded (gratuito): blocca i tentativi di brute force sul login\nOpzionale ma consigliato: installa WPS Hide Login per cambiare l'URL di accesso da /wp-admin a qualcosa di personalizzato (es. /accedi-admin)`, practicalGuide: `💡 UTILITÀ: L'URL /wp-admin standard è attaccato da bot automatici ogni giorno. Cambiarlo e limitare i tentativi di login blocca il 95% degli attacchi brute force senza sforzo.\n\nPASSO PASSO PRATICO:\n1. Vai su \"Utenti\" → \"Il tuo profilo\" → verifica che l'email admin sia corretta e funzionante.\n2. Installa \"Limit Login Attempts Reloaded\" → attivalo → lascia le impostazioni di default.\n3. Installa \"WPS Hide Login\" → attivalo.\n4. Nelle impostazioni di WPS Hide Login, imposta un URL personalizzato (es. /accesso-staff o simile) e salvalo nel password manager.\n5. Esci e verifica che /wp-admin mostri un 404 e che il tuo URL personalizzato funzioni.\n6. Comunica il nuovo URL di accesso solo al cliente se necessario.` }, { title: "2.7 — Disabilitare XML-RPC", description: `Installa il plugin "Disable XML-RPC".\nXML-RPC è un vettore di attacco comune e non serve per siti standard costruiti con Elementor Pro.`, practicalGuide: `💡 UTILITÀ: XML-RPC è un protocollo legacy che permette l'accesso remoto a WordPress. Non serve per siti Elementor e viene usato attivamente per attacchi DDoS amplificati.\n\nPASSO PASSO PRATICO:\n1. Vai su \"Plugin\" → \"Aggiungi nuovo\".\n2. Cerca \"Disable XML-RPC\".\n3. Installalo e attivalo (non richiede configurazione).\n4. Verifica visitando https://tuodominio.it/xmlrpc.php — deve restituire un errore 403 o 404, non la pagina XML-RPC standard.` }] }, { phase: "FASE 3 — Tema e Plugin", tasks: [{ title: "3.1 — Installare Hello Elementor + template Envato Elements", description: `Aspetto → Temi → Aggiungi nuovo → cerca "Hello Elementor" → Installa e attiva.\nÈ il tema ufficiale Elementor: leggerissimo, zero stili propri, nessun conflitto.\nTu costruirai il sito usando Elementor Pro e importerai i kit/template grafici da Envato Elements.\nInstalla quindi anche il plugin Envato Elements:\nPlugin → Aggiungi nuovo → cerca "Envato Elements" → Installa → Attiva.\nCollega il tuo account Envato e importa i template/kits direttamente dentro Elementor.`, practicalGuide: `💡 UTILITÀ: Hello Elementor è il tema più leggero per Elementor — zero stili aggiuntivi significa nessun conflitto CSS e massima libertà creativa con Elementor Pro.\n\nPASSO PASSO PRATICO:\n1. \"Aspetto\" → \"Temi\" → \"Aggiungi nuovo\" → cerca \"Hello Elementor\" → Installa → Attiva.\n2. \"Plugin\" → \"Aggiungi nuovo\" → cerca \"Envato Elements\" → Installa → Attiva.\n3. Vai su \"Envato Elements\" nel menu laterale.\n4. Clicca \"Collega account Envato\" e accedi con le tue credenziali Envato.\n5. Autorizza l'accesso.\n6. Verifica che il plugin mostri i template disponibili nel browser interno.` }, { title: "3.2 — Importare template e kit da Envato Elements dentro Elementor", description: `Dopo aver installato il plugin Envato Elements:\nVai in Envato Elements → Kits Template\nCollega il tuo account Envato\nScegli un kit/template compatibile con Elementor\nClicca "Installa Kit"\nImporta:\n• Header\n• Footer\n• Homepage\n• Pagine interne\n• Popup (se presenti)\n⚠️ IMPORTANTISSIMO:\nQuando importi un kit da Envato NON lasciare il sito identico al template originale.\nDevi sempre:\n• cambiare colori con quelli del brand cliente\n• cambiare font\n• sostituire tutte le immagini stock\n• eliminare sezioni inutili\n• ottimizzare testi e struttura SEO\n• sistemare responsive mobile\nIl template serve SOLO come base grafica per velocizzare il lavoro.`, practicalGuide: `💡 UTILITÀ: Importare un kit professionale riduce il tempo di costruzione da giorni a ore. L'importante è non consegnare mai un sito che assomiglia al template originale.\n\nPASSO PASSO PRATICO:\n1. Vai su \"Envato Elements\" → \"Kits Template\".\n2. Filtra per \"Elementor\" e scegli un kit coerente con il settore del cliente.\n3. Clicca \"Installa Kit\" e scegli quali sezioni importare (almeno: Header, Footer, Home, pagine interne).\n4. Dopo l'importazione apri ogni pagina con Elementor e sostituisci:\n   • Colori con quelli del brand (usa Global Colors)\n   • Font con quelli scelti (usa Global Fonts)\n   • Tutte le immagini stock con quelle del cliente\n   • Tutti i testi placeholder con i testi reali\n5. Elimina le sezioni del template che non servono.\n6. Controlla il responsive mobile di ogni sezione modificata.` }, { title: "3.3 — Installare Elementor Free", description: `Plugin → Aggiungi nuovo → cerca "Elementor" → Installa e attiva.\nElementor Free serve come base per Elementor Pro.`, practicalGuide: `💡 UTILITÀ: Elementor Pro richiede la versione Free come base. Vanno installati nell'ordine corretto altrimenti l'attivazione della licenza Pro fallisce.\n\nPASSO PASSO PRATICO:\n1. Vai su \"Plugin\" → \"Aggiungi nuovo\".\n2. Cerca \"Elementor Website Builder\".\n3. Clicca \"Installa ora\" sul plugin ufficiale (autore: Elementor.com).\n4. Dopo l'installazione clicca \"Attiva\".\n5. Salta la procedura guidata di onboarding di Elementor Free.\n6. Verifica che \"Elementor\" compaia nel menu laterale di WordPress.` }, { title: "3.4 — Attivare Elementor Pro", description: `Plugin → Aggiungi nuovo → Carica plugin → carica il file ZIP di Elementor Pro → Attiva.\nVai poi in Elementor → Licenza e collega la licenza Elementor Pro.`, practicalGuide: `💡 UTILITÀ: Elementor Pro sblocca Theme Builder (header/footer globali), widget Form, Popup Builder e i template avanzati — tutti elementi necessari per un sito professionale.\n\nPASSO PASSO PRATICO:\n1. Scarica il file ZIP di Elementor Pro dal tuo account su elementor.com.\n2. Vai su \"Plugin\" → \"Aggiungi nuovo\" → \"Carica plugin\".\n3. Seleziona il file ZIP scaricato e clicca \"Installa ora\".\n4. Dopo l'installazione clicca \"Attiva plugin\".\n5. Vai su \"Elementor\" → \"Licenza\".\n6. Inserisci la chiave di licenza del tuo account Elementor e clicca \"Attiva licenza\".\n7. Verifica che nella dashboard Elementor compaia \"Licenza attiva\".` }, { title: "3.5 — Configurare le impostazioni globali di Elementor", description: `Prima di costruire qualsiasi pagina, vai in Elementor → Impostazioni sito:\nGlobal Colors: imposta la palette colori del brand\nGlobal Fonts: imposta i font per titoli e corpo testo\nLayout: imposta la larghezza del contenuto (tipicamente 1140px o 1200px)`, practicalGuide: `💡 UTILITÀ: Impostare colori e font globali prima di costruire qualsiasi pagina permette di cambiare l'intero design del sito modificando un solo valore, invece di aggiornare ogni widget manualmente.\n\nPASSO PASSO PRATICO:\n1. Apri qualsiasi pagina con Elementor → clicca il menu hamburger in alto a sinistra.\n2. Vai su \"Impostazioni sito\".\n3. \"Global Colors\": inserisci colore primario, secondario, testo, sfondo del brand.\n4. \"Global Fonts\": imposta font per titoli (H1-H4) e font per testo corpo.\n5. \"Layout\": imposta larghezza contenuto a 1140px o 1200px.\n6. Salva le impostazioni.\n7. D'ora in poi usa SEMPRE i Global Colors e Global Fonts nei widget — mai valori hardcoded.` }, { title: "3.6 — Installare Rank Math SEO", description: `Plugin → Aggiungi nuovo → cerca "Rank Math SEO" → Installa e attiva.\nNelle impostazioni attiva:\nSchema markup (JSON-LD)\nBreadcrumbs\nSitemap XML\nAnalisi contenuto`, practicalGuide: `💡 UTILITÀ: Rank Math gestisce title, meta description, schema markup e sitemap da un unico pannello. Senza di esso il sito è invisibile a Google nella sua versione ottimizzata.\n\nPASSO PASSO PRATICO:\n1. \"Plugin\" → \"Aggiungi nuovo\" → cerca \"Rank Math SEO\" → Installa → Attiva.\n2. Segui la procedura guidata di setup:\n   • Connetti account Rank Math (gratuito)\n   • Tipo sito: scegli \"Business locale\"\n   • Inserisci nome azienda, logo\n3. Nella schermata \"Funzionalità\" attiva: Schema, Breadcrumbs, Sitemap, Analisi contenuto.\n4. Nella schermata \"Sitemap\" verifica che tutte le pagine siano incluse.\n5. Completa il wizard e vai su \"Rank Math\" → \"Impostazioni generali\" per verificare la configurazione.` }, { title: "3.7 — Installare LiteSpeed Cache", description: `Plugin → Aggiungi nuovo → cerca "LiteSpeed Cache" → Installa e attiva.\nConfigurazione consigliata:\nCache: attiva "Abilita Cache"\nCDN: attiva la CDN di Hostinger\nOttimizzazione pagina: attiva compressione CSS, JS, HTML\nMedia: attiva lazy load immagini, converti in WebP`, practicalGuide: `💡 UTILITÀ: LiteSpeed Cache integrato con l'hosting Hostinger attiva la cache server-side (non solo browser) riducendo il tempo di caricamento fino al 70% senza toccare il codice.\n\nPASSO PASSO PRATICO:\n1. \"Plugin\" → \"Aggiungi nuovo\" → cerca \"LiteSpeed Cache\" → Installa → Attiva.\n2. Vai su \"LiteSpeed Cache\" → \"Cache\" → attiva \"Abilita Cache\".\n3. Vai su \"LiteSpeed Cache\" → \"CDN\" → attiva la CDN di Hostinger inserendo il dominio.\n4. Vai su \"Ottimizzazione pagina\":\n   • Spunta: Minifica CSS, Minifica JS, Combina CSS, Combina JS\n   • Spunta: Compressione HTML\n5. Vai su \"Media\":\n   • Attiva Lazy Load immagini\n   • Attiva conversione WebP\n6. Svuota la cache dopo ogni modifica importante al sito.` }, { title: "3.8 — Installare Complianz GDPR", description: `Plugin → Aggiungi nuovo → cerca "Complianz GDPR" → Installa e attiva.\nSegui la configurazione guidata:\nInserisci dati aziendali\nDichiara i servizi che usi\nGenera Privacy Policy e Cookie Policy\nConfigura banner cookie secondo Garante italiano`, practicalGuide: `💡 UTILITÀ: Senza un banner cookie conforme al Garante italiano il sito viola la normativa GDPR e rischia sanzioni. Complianz genera anche Privacy Policy e Cookie Policy legalmente valide.\n\nPASSO PASSO PRATICO:\n1. \"Plugin\" → \"Aggiungi nuovo\" → cerca \"Complianz GDPR\" → Installa → Attiva.\n2. Avvia la procedura guidata di setup.\n3. Inserisci: nome azienda, P.IVA, indirizzo, email DPO o titolare.\n4. Dichiara tutti i servizi che usi: Google Analytics, Google Maps, form di contatto, ecc.\n5. Segui i passaggi per generare Privacy Policy e Cookie Policy.\n6. Configura il banner cookie: scegli stile \"Wall\" o \"Bar\" e verifica che il blocco sia attivo prima del consenso.\n7. Nella schermata finale pubblica le pagine generate.` }, { title: "3.9 — Configurare le pagine legali nel menu e footer", description: `Le pagine Privacy Policy e Cookie Policy generate da Complianz devono essere linkate nel footer.`, practicalGuide: `💡 UTILITÀ: Privacy Policy e Cookie Policy devono essere raggiungibili da ogni pagina del sito — è un requisito legale del GDPR. Il footer è il posto standard dove i visitatori le cercano.\n\nPASSO PASSO PRATICO:\n1. Vai su \"Pagine\" e verifica che Privacy Policy e Cookie Policy generate da Complianz siano pubblicate.\n2. Apri il footer in Elementor → Theme Builder → Footer.\n3. Individua la sezione link del footer.\n4. Aggiungi due voci: \"Privacy Policy\" e \"Cookie Policy\" puntando alle rispettive pagine.\n5. Salva e aggiorna il footer.\n6. Verifica che i link siano visibili aprendo il sito in incognito e scorrendolo fino in fondo.` }] }, { phase: "FASE 4 — Costruzione con Elementor Pro", tasks: [{ title: "4.1 — Creare header globale con Theme Builder", description: `Con Elementor Pro usi il Theme Builder per header, footer e template globali.\nVai in Elementor → Theme Builder → Aggiungi nuovo → Header.\nCostruisci con: logo, menu di navigazione, CTA.\nNella sezione "Condizioni di visualizzazione" seleziona "Intero sito". Pubblica.`, practicalGuide: `💡 UTILITÀ: Un header costruito con Theme Builder viene aggiornato in un solo posto e si propaga su tutto il sito automaticamente — zero lavoro di manutenzione.\n\nPASSO PASSO PRATICO:\n1. Vai su \"Elementor\" → \"Theme Builder\" → \"Aggiungi nuovo\" → seleziona \"Header\".\n2. Scegli un template esistente o inizia da zero.\n3. Inserisci: logo (widget Immagine o Sito Logo), menu (widget Menu di navigazione), CTA (widget Bottone con numero di telefono o \"Contattaci\").\n4. Imposta lo sfondo header e verifica che sia responsive su mobile (hamburger menu).\n5. Clicca \"Pubblica\" → \"Aggiungi condizione\" → seleziona \"Intero sito\".\n6. Salva e verifica aprendo qualsiasi pagina del sito.` }, { title: "4.2 — Creare footer globale con Theme Builder", description: `Vai in Elementor → Theme Builder → Aggiungi nuovo → Footer.\nIncludi: logo, link rapidi, contatti, Privacy Policy, Cookie Policy, P.IVA, copyright.\nAssegna a "Intero sito". Pubblica.`, practicalGuide: `💡 UTILITÀ: Il footer è il secondo posto dove i visitatori cercano informazioni di contatto e link legali. Un footer curato aumenta la fiducia e riduce i tassi di abbandono.\n\nPASSO PASSO PRATICO:\n1. Vai su \"Elementor\" → \"Theme Builder\" → \"Aggiungi nuovo\" → seleziona \"Footer\".\n2. Struttura consigliata a 3 colonne:\n   • Colonna 1: logo + breve descrizione\n   • Colonna 2: link rapidi alle pagine principali\n   • Colonna 3: indirizzo, telefono, email\n3. Riga inferiore: Copyright © [anno], P.IVA, link Privacy Policy e Cookie Policy.\n4. Per l'anno dinamico usa il widget Testo con shortcode o il Dynamic Tag \"Data corrente\".\n5. Pubblica → Aggiungi condizione → \"Intero sito\".\n6. Verifica su mobile che le colonne si impilino correttamente.` }, { title: "4.3 — Creare pagina 404 personalizzata", description: `Vai in Elementor → Theme Builder → Aggiungi nuovo → Pagina 404.\nUna 404 ben fatta ha: messaggio chiaro, barra di ricerca, link alle pagine principali.`, practicalGuide: `💡 UTILITÀ: Una pagina 404 di default WordPress fa scappare i visitatori. Una 404 ben fatta li trattiene e li reindirizza verso contenuti utili, salvando la conversione.\n\nPASSO PASSO PRATICO:\n1. Vai su \"Elementor\" → \"Theme Builder\" → \"Aggiungi nuovo\" → seleziona \"Pagina 404\".\n2. Inserisci:\n   • Titolo: \"Ops! Pagina non trovata\"\n   • Breve testo esplicativo\n   • Barra di ricerca (widget Cerca)\n   • Bottone \"Torna alla Home\"\n   • Link alle 2-3 pagine principali\n3. Mantieni il design coerente con il resto del sito.\n4. Pubblica senza condizioni aggiuntive (Elementor la imposta automaticamente come 404).\n5. Testa digitando un URL inesistente, es. tuodominio.it/paginainesistente.` }, { title: "4.4 — Creare le pagine principali", description: `Pagine → Aggiungi nuova per ogni pagina pianificata nella Fase 0.\nImposta subito lo slug URL definitivo.\nStruttura:\nHome, Pagina Servizi, Pagina SEO keyword 2, Pagina SEO keyword 3, Chi siamo, Contatti`, practicalGuide: `💡 UTILITÀ: Creare tutte le pagine subito con i loro slug definitivi evita di dover aggiornare i link interni in seguito e garantisce che gli URL siano corretti prima dell'indicizzazione.\n\nPASSO PASSO PRATICO:\n1. Vai su \"Pagine\" → \"Aggiungi nuova\" per ogni pagina pianificata nel task 0.1.\n2. Per ogni pagina: inserisci il titolo e subito imposta lo slug nell'URL (blocco laterale → Permalink).\n3. Imposta il template pagina su \"Elementor Canvas\" o \"Elementor Full Width\" per eliminare le aree tema.\n4. Salva come bozza — non pubblicare ancora.\n5. Crea in questo ordine: Home, Servizi, Pagina SEO keyword 2, Pagina SEO keyword 3, Chi siamo, Contatti.\n6. Verifica che tutti gli slug siano corti, in minuscolo e senza caratteri speciali.` }, { title: "4.5 — Costruire le pagine con Elementor Pro + Envato Elements", description: `Apri ogni pagina → "Modifica con Elementor".\nWorkflow:\n• Importa kit/template da Envato Elements\n• Personalizza colori e font con Global Styles\n• Adatta testi, immagini e sezioni al cliente\n• Ottimizza struttura SEO\n⚠️ Non lasciare mai testi placeholder o immagini stock.`, practicalGuide: `💡 UTILITÀ: Costruire le pagine con un workflow strutturato evita di tornare indietro a rifare sezioni dimenticate e garantisce coerenza visiva su tutto il sito.\n\nPASSO PASSO PRATICO:\n1. Apri la prima pagina → \"Modifica con Elementor\".\n2. Se hai importato un kit Envato, adatta la struttura esistente; altrimenti costruisci da zero.\n3. Workflow per ogni pagina:\n   a. Hero section con H1 + keyword principale + CTA principale\n   b. Sezione servizi/vantaggi con keyword secondarie negli H2\n   c. Sezione prova sociale (recensioni, loghi clienti)\n   d. CTA finale (form o numero di telefono)\n4. Controlla che ogni widget Titolo abbia il \"Tag HTML\" corretto (H1, H2, H3).\n5. Verifica che non ci siano testi placeholder o immagini stock.\n6. Testa il responsive mobile prima di passare alla pagina successiva.` }, { title: "4.6 — Usare il widget Form di Elementor Pro", description: `Non installare Contact Form 7. Elementor Pro include un widget Form nativo.\nConfigura:\nCampi: Nome, Email, Telefono, Messaggio\nAction dopo invio: email a info@\nIntegrazione Complianz: checkbox consenso privacy`, practicalGuide: `💡 UTILITÀ: Il form è il punto di conversione principale del sito. Un form mal configurato significa lead persi e violazioni GDPR.\n\nPASSO PASSO PRATICO:\n1. Apri la pagina Contatti (o la sezione con il form) in Elementor.\n2. Trascina il widget \"Form\" (disponibile solo con Elementor Pro).\n3. Aggiungi i campi: Nome (testo), Email (email), Telefono (tel), Messaggio (textarea).\n4. Imposta tutti i campi come obbligatori tranne Messaggio.\n5. Vai su \"Azioni dopo invio\" → aggiungi \"Email\" → inserisci info@nomesito.it come destinatario.\n6. Aggiungi un campo Accettazione con testo \"Accetto la Privacy Policy\" e link alla pagina Privacy Policy (requisito GDPR).\n7. Configura la pagina di ringraziamento o un messaggio di successo.\n8. Testa il form inviando un messaggio e verificando che arrivi all'email configurata.` }, { title: "4.7 — Impostare la homepage statica", description: `Impostazioni → Lettura → seleziona "Una pagina statica" → scegli la pagina Home. Salva.`, practicalGuide: `💡 UTILITÀ: WordPress di default mostra gli ultimi post come homepage. Se non imposti la pagina statica, la Home che hai costruito con Elementor non sarà quella mostrata ai visitatori.\n\nPASSO PASSO PRATICO:\n1. Vai su \"Impostazioni\" → \"Lettura\".\n2. In \"La tua homepage visualizza\" seleziona \"Una pagina statica\".\n3. Nel menu \"Pagina iniziale\" seleziona la pagina \"Home\" che hai creato.\n4. Nel menu \"Pagina dei post\" lascia vuoto (a meno che il sito non abbia un blog).\n5. Salva le modifiche.\n6. Verifica aprendo https://tuodominio.it in incognito — deve mostrare la tua pagina Home Elementor.` }, { title: "4.8 — Impostare il menu di navigazione", description: `Aspetto → Menu → crea il menu principale con tutte le pagine nell'ordine corretto → assegna alla posizione "Menu principale".`, practicalGuide: `💡 UTILITÀ: Il menu deve rispecchiare esattamente la struttura pianificata nella Fase 0 — ordine sbagliato o voci mancanti confondono i visitatori e penalizzano l'UX.\n\nPASSO PASSO PRATICO:\n1. Vai su \"Aspetto\" → \"Menu\" → \"Crea un nuovo menu\".\n2. Chiamalo \"Menu principale\".\n3. Aggiungi le pagine nell'ordine: Home, Servizi, [Keyword 2], [Keyword 3], Chi siamo, Contatti.\n4. Sposta le voci trascinandole per cambiare l'ordine.\n5. In \"Impostazioni menu\" spunta \"Menu principale\" (o la posizione del tema).\n6. Clicca \"Salva menu\".\n7. Torna all'header in Elementor Theme Builder e verifica che il widget Menu mostri il menu corretto.` }] }, { phase: "FASE 5 — Ottimizzazione SEO On-Page", tasks: [{ title: "5.1 — URL ottimizzati per ogni pagina", description: `Lo slug deve:\nContenere la keyword principale\nEssere breve (3-5 parole)\nUsare solo lettere minuscole e trattini\nEsempi: /posizionamento-google-milano/, /servizi-seo/, /chi-siamo/`, practicalGuide: `💡 UTILITÀ: Google legge lo slug dell'URL come segnale di pertinenza per la keyword. Uno slug generico come /pagina-2/ non contribuisce al posizionamento.\n\nPASSO PASSO PRATICO:\n1. Apri ogni pagina in WordPress (editor blocchi o Elementor).\n2. Nel pannello laterale clicca su \"Permalink\".\n3. Verifica che lo slug contenga la keyword principale della pagina.\n4. Formato corretto: solo lettere minuscole, parole separate da trattini, max 3-5 parole.\n5. Esempi corretti: /idraulico-milano/, /spurghi-fognature-milano/, /chi-siamo/.\n6. Se devi modificare uno slug già pubblicato, aggiungi un redirect 301 dal vecchio al nuovo URL tramite Rank Math o un plugin redirect.\n7. Salva e verifica l'URL finale nel browser.` }, { title: "5.2 — Struttura heading su ogni pagina", description: `H1: uno solo per pagina, contiene la keyword principale\nH2: sottosezioni (keyword secondarie)\nH3: sotto-punti degli H2\nIn Elementor controlla il "Tag HTML" del widget Titolo.`, practicalGuide: `💡 UTILITÀ: Google usa la gerarchia H1-H2-H3 per capire la struttura del contenuto. Un H1 sbagliato o mancante è uno degli errori SEO più comuni e più facili da correggere.\n\nPASSO PASSO PRATICO:\n1. Apri ogni pagina in Elementor.\n2. Clicca sul titolo principale della pagina → pannello laterale → \"Tag HTML\" → imposta H1.\n3. Verifica che ci sia UN SOLO H1 per pagina.\n4. Imposta tutti i titoli di sezione come H2 (keyword secondarie).\n5. Imposta i sotto-punti come H3.\n6. Per verificare rapidamente: installa l'estensione browser \"Headings Map\" (Chrome) e analizza la struttura di ogni pagina.\n7. Correggi qualsiasi H1 doppio o H2 usato come H1.` }, { title: "5.3 — Title SEO per ogni pagina (Rank Math)", description: `Formato: Keyword Principale | Nome Brand\nMassimo 60 caratteri\nUsa variabili: %title% | %sitename%`, practicalGuide: `💡 UTILITÀ: Il Title SEO è il testo blu cliccabile su Google. È il fattore on-page più influente sul CTR e sul posizionamento — non può essere lasciato al default.\n\nPASSO PASSO PRATICO:\n1. Apri ogni pagina in WordPress.\n2. Scorri fino al box Rank Math in fondo all'editor.\n3. Clicca sulla tab \"Generali\".\n4. Nel campo \"Titolo SEO\" scrivi: Keyword Principale | Nome Brand.\n5. Verifica che il contatore non superi i 60 caratteri (barra verde).\n6. Usa le variabili dinamiche di Rank Math se necessario: %title%, %sitename%.\n7. Esempi corretti:\n   • \"Idraulico Milano 24h | Rossi Impianti\"\n   • \"Spurghi Fognature Milano | Rossi Impianti\"\n8. Ripeti per tutte le pagine del sito.` }, { title: "5.4 — Meta Description per ogni pagina", description: `Descrive cosa trova l'utente\nContiene la keyword principale\nInvito all'azione ("Scopri", "Contattaci")\nMassimo 155 caratteri`, practicalGuide: `💡 UTILITÀ: La meta description non influenza direttamente il ranking ma determina il CTR — una descrizione persuasiva porta più clic anche da posizioni basse.\n\nPASSO PASSO PRATICO:\n1. Apri ogni pagina → box Rank Math → tab \"Generali\".\n2. Nel campo \"Meta Description\" scrivi una frase di 130-155 caratteri.\n3. Struttura consigliata: [cosa fai] + [dove] + [vantaggio] + [CTA].\n4. Esempio: \"Idraulico a Milano disponibile 24 ore su 24. Intervento rapido per guasti, perdite e emergenze. Chiama ora per un preventivo gratuito.\"\n5. Verifica che contenga la keyword principale della pagina.\n6. Verifica che il contatore non superi 155 caratteri.\n7. Non duplicare la stessa meta description su più pagine.` }, { title: "5.5 — Schema markup", description: `Home: schema Organization\nPagine servizio: schema Service\nPagina Contatti: schema LocalBusiness\nArticoli blog: schema Article`, practicalGuide: `💡 UTILITÀ: Lo schema markup aiuta Google a capire di cosa tratta la pagina e può generare rich snippet nei risultati di ricerca (stelle, indirizzo, orari), aumentando la visibilità.\n\nPASSO PASSO PRATICO:\n1. Apri ogni pagina → box Rank Math → tab \"Schema\".\n2. Assegna lo schema corretto:\n   • Home → \"Organization\" o \"LocalBusiness\"\n   • Pagine servizio → \"Service\"\n   • Pagina contatti → \"LocalBusiness\"\n   • Articoli blog → \"Article\"\n3. Per LocalBusiness: compila nome, indirizzo, telefono, orari di apertura, URL.\n4. Per Organization: compila nome, logo, URL, social profiles.\n5. Salva e verifica su Google Rich Results Test (search.google.com/test/rich-results).` }, { title: "5.6 — Ottimizzazione immagini", description: `Rinomina il file con keyword prima di caricarlo\nComprimi su squoosh.app e converti in WebP\nCompila il campo alt text con descrizione keyword-rich`, practicalGuide: `💡 UTILITÀ: Le immagini non ottimizzate sono la causa principale di siti lenti. Un'immagine da 3MB può diventare 80KB in WebP senza perdita di qualità visibile.\n\nPASSO PASSO PRATICO:\n1. Prima di caricare su WordPress: rinomina ogni file con la keyword (es. \"idraulico-pronto-intervento-milano.jpg\").\n2. Vai su squoosh.app e comprimi ogni immagine:\n   • Formato: WebP\n   • Qualità: 75-80%\n   • Obiettivo: sotto i 150KB per immagini di contenuto, sotto i 300KB per hero\n3. Carica l'immagine compressa su WordPress → Libreria Media.\n4. Compila sempre il campo \"Testo alternativo\" con una descrizione keyword-rich.\n5. Nelle impostazioni Elementor del widget immagine verifica che le dimensioni siano corrette.\n6. Verifica le immagini già caricate: vai su Libreria Media e controlla che nessuna superi 500KB.` }, { title: "5.7 — Link interni", description: `Ogni pagina deve linkare almeno 2-3 altre pagine rilevanti.\nHome → Hub Servizi, Chi siamo, Contatti\nHub Servizi → ogni pagina servizio\nPagine servizio → linkano tra loro`, practicalGuide: `💡 UTILITÀ: I link interni distribuiscono il \"peso SEO\" tra le pagine e aiutano Google a capire quali pagine sono più importanti. Senza link interni alcune pagine rimangono isolate nell'indice.\n\nPASSO PASSO PRATICO:\n1. Apri la pagina Home in Elementor.\n2. Identifica 2-3 punti nel testo dove ha senso linkare: Servizi, Chi siamo, la pagina SEO principale.\n3. Seleziona la parola o frase → widget Testo → aggiungi hyperlink alla pagina target.\n4. Ripeti per tutte le pagine: ogni pagina deve avere almeno 2 link ad altre pagine del sito.\n5. Segui questo schema:\n   • Home → Servizi, Chi siamo, Contatti\n   • Servizi → pagine SEO keyword 2 e 3\n   • Keyword 2 e 3 → si linkano a vicenda e a Contatti\n6. Usa testo anchor descrittivo (es. \"servizi di spurgo\" non \"clicca qui\").` }, { title: "5.8 — Breadcrumbs", description: `Rank Math genera il codice breadcrumbs.\nAggiungilo tramite widget Shortcode nelle pagine interne (non sulla Home).`, practicalGuide: `💡 UTILITÀ: Le breadcrumb aiutano Google a capire la struttura del sito e possono apparire nei risultati di ricerca, aumentando il CTR e migliorando l'UX su pagine interne.\n\nPASSO PASSO PRATICO:\n1. Verifica che Rank Math abbia le breadcrumb attive: \"Rank Math\" → \"Impostazioni generali\" → \"Breadcrumbs\" → attiva.\n2. Copia lo shortcode breadcrumb di Rank Math: [rank_math_breadcrumb].\n3. Apri ogni pagina interna (non la Home) in Elementor.\n4. Aggiungi un widget \"Shortcode\" nella parte superiore della pagina, sopra l'H1.\n5. Incolla lo shortcode.\n6. Salva e verifica che le breadcrumb appaiano correttamente (es. Home › Servizi › Spurghi Milano).\n7. Non aggiungere breadcrumb sulla Homepage.` }, { title: "5.9 — Verificare robots.txt", description: `Visita tuodominio.it/robots.txt\nIn Rank Math → Impostazioni Generali → Edit robots.txt\nAggiungi: Sitemap: https://tuodominio.it/sitemap_index.xml`, practicalGuide: `💡 UTILITÀ: Il robots.txt dice a Google cosa può e non può indicizzare. Un errore qui può bloccare l'indicizzazione dell'intero sito senza che tu te ne accorga subito.\n\nPASSO PASSO PRATICO:\n1. Vai su \"Rank Math\" → \"Impostazioni generali\" → \"Edit robots.txt\".\n2. Verifica che ci siano queste righe:\n   User-agent: *\n   Disallow:\n   Sitemap: https://tuodominio.it/sitemap_index.xml\n3. Aggiungi manualmente la riga Sitemap se mancante.\n4. Salva.\n5. Visita https://tuodominio.it/robots.txt nel browser e verifica che il file sia leggibile e corretto.\n6. Assicurati che NON ci sia \"Disallow: /\" (che bloccherebbe tutto il sito) una volta rimosso il blocco indicizzazione del task 2.5.` }] }, { phase: "FASE 6 — Prima di Pubblicare", tasks: [{ title: "6.1 — Creare staging", description: `Prima di pubblicare fai sempre una copia staging.\nHostinger Business permette staging integrato.`, practicalGuide: `💡 UTILITÀ: Lo staging è una copia del sito live dove testare aggiornamenti e modifiche senza rischio. Senza staging un aggiornamento plugin sbagliato può rompere il sito in produzione.\n\nPASSO PASSO PRATICO:\n1. Accedi all'hPanel di Hostinger.\n2. Vai su \"Hosting\" → \"Gestisci\" → \"Staging\".\n3. Clicca \"Crea staging\" e attendi la copia (3-10 minuti).\n4. Prendi nota dell'URL staging generato da Hostinger.\n5. Accedi allo staging e verifica che il sito sia identico al live.\n6. Da questo momento: testa prima nello staging, poi applica al live solo se tutto funziona.\n7. Ripeti prima di ogni aggiornamento massiccio di plugin o WordPress core.` }, { title: "6.2 — Test mobile completo", description: `Controlla da smartphone reale:\n• menu\n• CTA\n• form\n• spaziature\n• velocità\n• leggibilità\n⚠️ Non fidarti solo della preview Elementor.`, practicalGuide: `💡 UTILITÀ: Oltre il 60% del traffico arriva da mobile. Un sito non responsive perde conversioni e viene penalizzato da Google nel mobile-first indexing.\n\nPASSO PASSO PRATICO:\n1. Prendi in mano uno smartphone reale (non la preview Elementor).\n2. Visita ogni pagina del sito e controlla:\n   • Menu hamburger funziona e si chiude al tap\n   • Le CTA (bottoni telefono) sono facilmente cliccabili col pollice\n   • I form sono compilabili senza zoom\n   • Le immagini non escono dai margini\n   • I font sono leggibili senza zoom\n   • Le spaziature non sono eccessive o troppo strette\n3. Apri anche Chrome DevTools da desktop (F12 → icona mobile) per verificare breakpoint intermedi (tablet).\n4. Correggi ogni problema in Elementor usando i controlli responsive (icone desktop/tablet/mobile).` }, { title: "6.3 — Test velocità PageSpeed", description: `Usa Google PageSpeed Insights.\nControlla LCP, CLS, INP.\nSe lento: comprimi immagini, riduci animazioni, ottimizza CSS/JS`, practicalGuide: `💡 UTILITÀ: Google usa i Core Web Vitals come fattore di ranking. Un sito lento perde posizioni indipendentemente dalla qualità del contenuto SEO.\n\nPASSO PASSO PRATICO:\n1. Vai su pagespeed.web.dev.\n2. Inserisci l'URL della Homepage e analizza sia mobile che desktop.\n3. Punta a un punteggio mobile ≥ 70, desktop ≥ 85.\n4. Se il punteggio è basso, controlla i suggerimenti:\n   • LCP alto → comprimi le immagini hero, usa lazy load\n   • CLS alto → imposta dimensioni esplicite su immagini e iframe\n   • INP alto → riduci JavaScript inutile\n5. Svuota la cache LiteSpeed dopo ogni modifica e ritesta.\n6. Testa anche le pagine interne principali, non solo la Home.` }, { title: "6.4 — Controllo finale", description: `Verifica:\n• tutti i link\n• tutte le immagini\n• tutti i form\n• SEO base\n• responsive\n• privacy policy\n• cookie banner`, practicalGuide: `💡 UTILITÀ: Il controllo finale è l'ultima rete di sicurezza prima della pubblicazione. Un link rotto o un form non funzionante trovato dopo il go-live imbarazza davanti al cliente.\n\nPASSO PASSO PRATICO:\n1. Usa il plugin \"Broken Link Checker\" per trovare link rotti — eliminalo dopo l'uso.\n2. Clicca manualmente ogni voce del menu e verifica che porti alla pagina corretta.\n3. Compila e invia ogni form del sito — verifica che l'email di notifica arrivi.\n4. Controlla su ogni pagina: title SEO, meta description, H1 presente e corretto.\n5. Verifica che il cookie banner appaia correttamente aprendo il sito in incognito.\n6. Verifica che Privacy Policy e Cookie Policy siano accessibili dal footer.\n7. Controlla che non ci siano pagine in stato \"Bozza\" che dovrebbero essere pubblicate.` }, { title: "6.5 — Configurare backup", description: `Assicurati che backup automatici siano attivi.\nFai anche un backup manuale completo.`, practicalGuide: `💡 UTILITÀ: I backup automatici di Hostinger proteggono da errori umani, plugin corrotti e attacchi. Senza backup verificati non c'è rete di salvataggio.\n\nPASSO PASSO PRATICO:\n1. Accedi all'hPanel → \"Backup\".\n2. Verifica che i backup automatici giornalieri siano attivi (inclusi nel piano Business).\n3. Fai un backup manuale completo cliccando \"Crea backup\" prima del go-live.\n4. Scarica una copia del backup sul tuo PC o su Google Drive come backup off-site.\n5. Testa il ripristino: fallo almeno una volta sullo staging per verificare che il processo funzioni.\n6. Configura anche UpdraftPlus come backup secondario su Google Drive per sicurezza doppia.` }, { title: "6.6 — Rimuovere blocco indicizzazione", description: `Impostazioni → Lettura → togli "Scoraggia i motori di ricerca".`, practicalGuide: `💡 UTILITÀ: Se dimentichi di rimuovere il blocco indicizzazione il sito rimane invisibile a Google per settimane — è uno degli errori più comuni nel lancio di un sito.\n\nPASSO PASSO PRATICO:\n1. Vai su \"Impostazioni\" → \"Lettura\".\n2. Togli la spunta da \"Scoraggia i motori di ricerca dall'indicizzare questo sito\".\n3. Salva le modifiche.\n4. Verifica visitando https://tuodominio.it/robots.txt — NON deve contenere \"Disallow: /\".\n5. In Rank Math → verifica che la sitemap sia accessibile su tuodominio.it/sitemap_index.xml.\n6. Fai uno screenshot della pagina Lettura con la spunta rimossa — documentazione per il cliente.` }, { title: "6.7 — Pubblicare sito", description: `Pubblica il sito solo quando tutto è realmente pronto.\nMai pubblicare "poi sistemiamo dopo".`, practicalGuide: `💡 UTILITÀ: La pubblicazione è un momento critico. Un workflow preciso evita dimenticanze dell'ultimo secondo e garantisce che il sito sia davvero pronto.\n\nPASSO PASSO PRATICO:\n1. Verifica che tutti i task dalla 6.1 alla 6.6 siano completati.\n2. Pubblica tutte le pagine ancora in stato bozza.\n3. Svuota la cache LiteSpeed completamente.\n4. Apri il sito in una finestra in incognito e naviga tutte le pagine una per una.\n5. Testa il sito da smartphone reale un'ultima volta.\n6. Invia una email al cliente con:\n   • URL del sito\n   • Credenziali di accesso wp-admin (se il cliente le gestisce)\n   • Breve guida su come aggiornare contenuti base\n7. Fai uno screenshot della homepage per i tuoi archivi portfolio.` }] }, { phase: "FASE 7 — Dopo la Pubblicazione", tasks: [{ title: "7.1 — Collegare Google Search Console", description: `Aggiungi il sito su Google Search Console e verifica proprietà tramite DNS o HTML tag.`, practicalGuide: `💡 UTILITÀ: Search Console è il pannello di controllo SEO gratuito di Google. Senza di esso non puoi sapere quante pagine sono indicizzate, se ci sono errori e per quali keyword appare il sito.\n\nPASSO PASSO PRATICO:\n1. Vai su search.google.com/search-console e accedi con un account Google del cliente (o crea uno dedicato).\n2. Clicca \"Aggiungi proprietà\" → scegli \"Dominio\" (copertura completa HTTP/HTTPS).\n3. Copia il record TXT fornito da Google.\n4. Vai su hPanel di Hostinger → \"DNS\" → \"Gestisci record DNS\".\n5. Aggiungi un record TXT con il valore copiato.\n6. Torna su Search Console e clicca \"Verifica\".\n7. Attendi 24-48h per la verifica completa — di solito avviene in pochi minuti.` }, { title: "7.2 — Inviare sitemap XML", description: `Invia la sitemap XML generata da Rank Math dentro Search Console.`, practicalGuide: `💡 UTILITÀ: La sitemap dice a Google quali pagine esistono e quando sono state aggiornate. Inviandola manualmente acceleri l'indicizzazione delle nuove pagine.\n\nPASSO PASSO PRATICO:\n1. Verifica che la sitemap esista: visita tuodominio.it/sitemap_index.xml nel browser.\n2. Deve mostrare un file XML con i link alle sitemap delle pagine, post, ecc.\n3. Vai su Google Search Console → \"Sitemap\" nel menu laterale.\n4. Nel campo \"Aggiungi una nuova sitemap\" inserisci: sitemap_index.xml\n5. Clicca \"Invia\".\n6. Verifica che lo stato diventi \"Successo\" (può richiedere qualche minuto).\n7. Controlla il numero di URL inviati vs URL indicizzati nei giorni successivi.` }, { title: "7.3 — Configurare Google Analytics", description: `Installa GA4 rispettando GDPR tramite Complianz.`, practicalGuide: `💡 UTILITÀ: Analytics traccia il comportamento reale degli utenti sul sito. Senza dati non puoi ottimizzare nulla — non sai da dove arrivano i visitatori né cosa fanno.\n\nPASSO PASSO PRATICO:\n1. Vai su analytics.google.com e crea una nuova proprietà GA4 per il dominio del cliente.\n2. Copia l'ID misurazione (formato G-XXXXXXXXXX).\n3. In WordPress vai su Complianz → \"Integrazioni\" e aggiungi GA4 come servizio dichiarato.\n4. Installa il plugin \"Site Kit by Google\" oppure inserisci il tag GA4 manualmente tramite Rank Math → \"Impostazioni generali\" → \"Codici analitici\".\n5. Verifica che il consenso GDPR blocchi Analytics prima del consenso cookie.\n6. Testa aprendo il sito in una scheda normale (non incognito) e controllando i \"Report in tempo reale\" di Analytics.` }, { title: "7.4 — Verificare tracciamenti", description: `Controlla che Analytics riceva dati reali.\nVerifica: visualizzazioni, eventi, conversioni`, practicalGuide: `💡 UTILITÀ: Un tag Analytics installato ma non funzionante raccoglie zero dati per settimane prima che te ne accorga. Verificare subito salva mesi di dati persi.\n\nPASSO PASSO PRATICO:\n1. Installa l'estensione Google Tag Assistant (Chrome) e aprila sul sito.\n2. Verifica che il tag GA4 sia presente e senza errori.\n3. Vai su Google Analytics → \"Report in tempo reale\".\n4. Apri il sito in un'altra scheda e naviga alcune pagine.\n5. Verifica che le visualizzazioni appaiano nel report in tempo reale.\n6. Controlla che vengano tracciati: visualizzazioni di pagina, sessioni, click sui bottoni CTA.\n7. Se non arrivano dati: verifica che il consenso cookie sia stato dato e che il plugin non blocchi Analytics.` }, { title: "7.5 — Configurare Google Business Profile", description: `Ottimizza la scheda:\n• categoria corretta\n• descrizione\n• immagini\n• servizi\n• recensioni`, practicalGuide: `💡 UTILITÀ: Google Business Profile è spesso il primo risultato che vedono gli utenti per ricerche locali. Una scheda ottimizzata può generare più contatti del sito stesso.\n\nPASSO PASSO PRATICO:\n1. Vai su business.google.com e rivendica o crea la scheda del cliente.\n2. Verifica la proprietà tramite cartolina postale, telefono o video (dipende dalle opzioni disponibili).\n3. Compila al 100%: nome, categoria principale, indirizzo, numero di telefono, URL sito, orari.\n4. Aggiungi almeno 10 foto: esterno, interno, logo, team, servizi.\n5. Scrivi una descrizione di 750 caratteri con le keyword principali.\n6. Aggiungi i servizi offerti con descrizione e prezzo (se applicabile).\n7. Imposta le domande e risposte con le FAQ più comuni del settore.` }, { title: "7.6 — Richiedere recensioni", description: `Invia il link recensione ai clienti appena possibile.\nLe recensioni influenzano fortemente la Local SEO.`, practicalGuide: `💡 UTILITÀ: Le recensioni Google influenzano direttamente il ranking locale e la fiducia dei nuovi clienti. I primi 5 clienti soddisfatti valgono più di mesi di ottimizzazione SEO.\n\nPASSO PASSO PRATICO:\n1. Vai su Google Business Profile → \"Chiedi recensioni\" e copia il link diretto alla pagina recensioni.\n2. Crea un messaggio WhatsApp/email semplice: \"Ciao [nome], grazie per aver scelto [azienda]! Se sei soddisfatto ci aiuterebbe molto lasciare una recensione su Google: [link]\"\n3. Invia subito al cliente il link nei suoi canali (può mandarli ai suoi clienti).\n4. Aggiungi il link recensione anche nella firma email del cliente.\n5. Non offrire incentivi per le recensioni — viola le policy Google.\n6. Rispondi a ogni recensione entro 48 ore, positive e negative.` }, { title: "7.7 — Inserimento directory locali", description: `Inserisci azienda nelle directory locali con dati coerenti:\n• nome\n• indirizzo\n• telefono`, practicalGuide: `💡 UTILITÀ: Le citazioni NAP (Nome, Indirizzo, Telefono) coerenti in più directory aumentano l'autorità locale del dominio e migliorano il ranking su Google Maps.\n\nPASSO PASSO PRATICO:\n1. Prepara una scheda con i dati NAP definitivi: nome esatto azienda, indirizzo completo, telefono, URL sito.\n2. Inserisci il business nelle principali directory italiane:\n   • Pagine Gialle (paginegialle.it)\n   • Yelp Italia (yelp.it)\n   • Hotfrog (hotfrog.it)\n   • Kompass (kompass.com)\n   • Cylex (cylex.it)\n3. Usa SEMPRE gli stessi dati NAP identici — anche una piccola variazione (Via vs V.) indebolisce il segnale.\n4. Salva le credenziali di ogni directory nel password manager.\n5. Ripeti con directory di settore specifiche se esistono (es. Habitissimo per artigiani).` }, { title: "7.8 — Monitor uptime", description: `Configura monitor uptime per notifiche se il sito va offline.`, practicalGuide: `💡 UTILITÀ: Un sito offline per ore senza che nessuno se ne accorga significa lead persi e un impatto negativo sulla reputazione. Il monitor uptime ti avvisa in 1 minuto.\n\nPASSO PASSO PRATICO:\n1. Vai su uptimerobot.com e crea un account gratuito.\n2. Clicca \"Add New Monitor\" → tipo \"HTTP(s)\".\n3. Inserisci l'URL del sito e imposta il check ogni 5 minuti.\n4. Aggiungi la tua email (e quella del cliente se vuole) come contatto di notifica.\n5. Salva il monitor.\n6. Verifica che arrivi una email di \"Il monitor è attivo\".\n7. In alternativa usa il monitor uptime integrato se disponibile nel tuo piano Hostinger.` }, { title: "7.9 — Pianificazione contenuti blog", description: `Prepara un piano editoriale iniziale per aumentare traffico organico.`, practicalGuide: `💡 UTILITÀ: Il blog è il motore del traffico organico a lungo termine. Senza un piano editoriale si pubblica in modo casuale e si perdono opportunità di posizionamento.\n\nPASSO PASSO PRATICO:\n1. Apri un foglio Google e crea una tabella: Titolo articolo | Keyword target | Intento | Data pubblicazione | Stato.\n2. Identifica 10 domande che i clienti del tuo cliente si fanno (es. \"quanto costa uno spurgo?\", \"come capire se ho un tubo rotto?\").\n3. Trasformale in titoli articolo ottimizzati.\n4. Pianifica almeno 2 articoli al mese per i primi 3 mesi.\n5. Priorità: articoli informativi con keyword a bassa concorrenza per i primi risultati rapidi.\n6. Condividi il piano col cliente per raccogliere feedback sui temi.\n7. Imposta promemoria mensili per la pubblicazione.` }] }, { phase: "MANUTENZIONE MENSILE", tasks: [{ title: "M.1 — Aggiornare WordPress", description: `Aggiorna:\n• core WordPress\n• plugin\n• tema\n⚠️ Prima fai backup.`, practicalGuide: `💡 UTILITÀ: Plugin non aggiornati sono la principale porta di accesso degli hacker. Gli aggiornamenti regolari correggono vulnerabilità di sicurezza prima che vengano sfruttate.\n\nPASSO PASSO PRATICO:\n1. Prima di ogni aggiornamento: fai un backup manuale dall'hPanel.\n2. Vai sullo staging → aggiorna prima lì tutti i plugin e il core WordPress.\n3. Testa il sito staging: naviga tutte le pagine principali, testa i form.\n4. Se tutto funziona: vai sul sito live → \"Dashboard\" → \"Aggiornamenti\".\n5. Aggiorna prima i plugin uno alla volta (non tutti insieme), verificando il sito dopo ogni aggiornamento.\n6. Infine aggiorna il core WordPress.\n7. Svuota la cache LiteSpeed dopo gli aggiornamenti.` }, { title: "M.2 — Controllare Search Console", description: `Verifica:\n• errori indicizzazione\n• pagine escluse\n• cali traffico\n• problemi mobile`, practicalGuide: `💡 UTILITÀ: Search Console è il termometro della salute SEO del sito. Un'ispezione mensile permette di intercettare problemi di indicizzazione prima che danneggino il traffico.\n\nPASSO PASSO PRATICO:\n1. Vai su search.google.com/search-console.\n2. Controlla la sezione \"Copertura\": verifica che le pagine principali siano in stato \"Valide\".\n3. Controlla \"Errori\": se ci sono pagine escluse o con errori, aprile e verifica il motivo.\n4. Controlla \"Prestazioni\": confronta clic e impressioni col mese precedente.\n5. Se c'è un calo di traffico, identifica quali keyword o pagine hanno perso posizioni.\n6. Controlla \"Esperienza pagina\" → verifica Core Web Vitals.\n7. Se hai pubblicato nuove pagine, invia un URL di ispezione per richiedere l'indicizzazione.` }, { title: "M.3 — Analizzare Analytics", description: `Controlla andamento traffico e conversioni.`, practicalGuide: `💡 UTILITÀ: I dati Analytics mostrano cosa funziona e cosa non funziona. Senza analisi mensile il sito stagna — con l'analisi puoi ottimizzare ciò che converte di più.\n\nPASSO PASSO PRATICO:\n1. Vai su analytics.google.com → seleziona la proprietà del cliente.\n2. Controlla il report \"Acquisizione\": da dove arrivano i visitatori (organico, diretto, referral).\n3. Controlla \"Pagine e schermate\": quali pagine hanno più traffico e più uscite.\n4. Controlla il tasso di conversione dei form (se hai configurato gli eventi).\n5. Confronta i dati col mese precedente e con lo stesso periodo dell'anno scorso.\n6. Prepara un breve report mensile per il cliente: 3-5 dati chiave + 1-2 azioni concrete.` }, { title: "M.4 — Backup completi", description: `Verifica che i backup siano funzionanti.`, practicalGuide: `💡 UTILITÀ: I backup automatici possono silenziosamente smettere di funzionare. Verificare manualmente ogni mese che i backup esistano e siano ripristinabili è l'unico modo per essere sicuri.\n\nPASSO PASSO PRATICO:\n1. Accedi all'hPanel → \"Backup\".\n2. Verifica che l'ultimo backup automatico sia recente (non più di 24-48h fa).\n3. Fai un backup manuale mensile e scaricalo sul PC o Google Drive.\n4. Ogni trimestre: testa il ripristino sullo staging per verificare che il backup sia effettivamente funzionante.\n5. Se il backup automatico non è recente, contatta Hostinger o forza manualmente.` }, { title: "M.5 — Verificare SSL", description: `Controlla che HTTPS sia valido e senza warning.`, practicalGuide: `💡 UTILITÀ: I certificati SSL Let's Encrypt scadono ogni 90 giorni. Se il rinnovo automatico fallisce il sito mostra un warning di sicurezza a tutti i visitatori.\n\nPASSO PASSO PRATICO:\n1. Vai su hPanel → \"SSL\" → \"Gestisci\".\n2. Controlla la data di scadenza del certificato.\n3. Verifica che il rinnovo automatico sia attivo.\n4. Testa aprendo https://tuodominio.it e controllando il lucchetto nel browser.\n5. Per un controllo approfondito: usa ssllabs.com/ssltest e inserisci il dominio.\n6. Se il certificato è scaduto o in scadenza imminente: vai su hPanel e clicca \"Rinnova\" o \"Reinstalla\".` }, { title: "M.6 — Monitorare Core Web Vitals", description: `Controlla regolarmente performance e velocità del sito.`, practicalGuide: `💡 UTILITÀ: Le performance del sito peggiorano nel tempo con l'aggiunta di plugin, immagini e contenuti. Un controllo mensile permette di intervenire prima che il ranking ne risenta.\n\nPASSO PASSO PRATICO:\n1. Vai su pagespeed.web.dev e testa Homepage + 1-2 pagine interne.\n2. Controlla i tre Core Web Vitals:\n   • LCP (Largest Contentful Paint): obiettivo < 2.5s\n   • CLS (Cumulative Layout Shift): obiettivo < 0.1\n   • INP (Interaction to Next Paint): obiettivo < 200ms\n3. Se i punteggi sono peggiorati rispetto al mese scorso: identifica la causa (nuove immagini pesanti, nuovi plugin, animazioni aggiunte).\n4. Controlla anche Search Console → \"Esperienza pagina\" per i dati reali degli utenti.\n5. Svuota la cache LiteSpeed e ritesta dopo ogni ottimizzazione.` }] }];

const PHASE_COLORS = [
  { accent: "#a78bfa", badge: "rgba(167,139,250,0.15)", badgeText: "#c4b5fd" },
  { accent: "#60a5fa", badge: "rgba(96,165,250,0.15)", badgeText: "#93c5fd" },
  { accent: "#22d3ee", badge: "rgba(34,211,238,0.15)", badgeText: "#67e8f9" },
  { accent: "#2dd4bf", badge: "rgba(45,212,191,0.15)", badgeText: "#5eead4" },
  { accent: "#34d399", badge: "rgba(52,211,153,0.15)", badgeText: "#6ee7b7" },
  { accent: "#fbbf24", badge: "rgba(251,191,36,0.15)", badgeText: "#fcd34d" },
  { accent: "#fb923c", badge: "rgba(251,146,60,0.15)", badgeText: "#fdba74" },
  { accent: "#fb7185", badge: "rgba(251,113,133,0.15)", badgeText: "#fda4af" },
  { accent: "#f472b6", badge: "rgba(244,114,182,0.15)", badgeText: "#f9a8d4" },
];

// ─── STRUCTURE HELPERS ─────────────────────────────────────────────────────────
function buildTasksFromStructure(structure) {
  return structure.flatMap((section, si) =>
    section.tasks.map((task, ti) => ({
      id: task.id || `${si}-${ti}`,
      phase: section.phase,
      title: task.title,
      description: task.description,
      practicalGuide: task.practicalGuide || null,
      completed: false,
      status: "Da fare",
      timerRunning: false,
      sessionSeconds: 0,
      totalSeconds: 0,
      notes: "",
      suspended: false,
    }))
  );
}

function buildStructureFromTasks(tasks, phases) {
  return phases.map((phase) => ({
    phase,
    tasks: tasks
      .filter((t) => t.phase === phase)
      .map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        practicalGuide: t.practicalGuide || "",
      })),
  }));
}

// ─── AUTO-BACKUP ───────────────────────────────────────────────────────────────
function triggerBackupDownload(tasks, structure) {
  const backup = {
    version: 2,
    exportedAt: new Date().toISOString(),
    structure: structure,
    taskState: tasks.map((t) => ({
      id: t.id,
      completed: t.completed,
      status: t.status,
      totalSeconds: t.totalSeconds,
      notes: t.notes,
      suspended: t.suspended,
    })),
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `seo-checklist-backup-${new Date().toISOString().slice(0, 16).replace("T", "_")}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  // Structure = ordered phases + task definitions (title/desc/guide/id)
  const [structure, setStructure] = useState(DEFAULT_CHECKLIST);
  // Tasks = runtime state (completed, timer, notes, etc.)
  const [tasks, setTasks] = useState(() => buildTasksFromStructure(DEFAULT_CHECKLIST));

  const [search, setSearch] = useState("");
  const [searchResultIndex, setSearchResultIndex] = useState(0);
  const [deadline, setDeadline] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [expandedTasks, setExpandedTasks] = useState({});
  const [expandedGuides, setExpandedGuides] = useState({});
  const [syncStatus, setSyncStatus] = useState("idle");
  const [loaded, setLoaded] = useState(false);

  // ── EDIT MODE ──
  const [editMode, setEditMode] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // { id, title, description, practicalGuide }
  const [editingPhase, setEditingPhase] = useState(null); // index being renamed
  // Drag state uses refs (no re-render) + a single visual indicator state
  const dragRef = useRef(null); // { taskId, phaseIdx }
  const [dragOverId, setDragOverId] = useState(null); // just for visual highlight
  const [backupCount, setBackupCount] = useState(0);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");

  // ─── LOAD ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      setSyncStatus("syncing");

      // 1. Try Supabase for structure
      const { data: structData } = await supabase
        .from("checklist_structure")
        .select("*")
        .order("phase_index")
        .order("task_index");

      // 2. Try Supabase for task state
      const { data: stateData, error: stateError } = await supabase
        .from("checklist_tasks")
        .select("*");

      let resolvedStructure = DEFAULT_CHECKLIST;
      let resolvedState = [];

      if (structData && structData.length > 0) {
        // Rebuild structure from DB rows
        const phases = [...new Set(structData.map((r) => r.phase))].sort(
          (a, b) =>
            structData.find((r) => r.phase === a).phase_index -
            structData.find((r) => r.phase === b).phase_index
        );
        resolvedStructure = phases.map((phase) => ({
          phase,
          tasks: structData
            .filter((r) => r.phase === phase)
            .sort((a, b) => a.task_index - b.task_index)
            .map((r) => ({
              id: r.id,
              title: r.title,
              description: r.description,
              practicalGuide: r.practical_guide || "",
            })),
        }));
      } else {
        // Fallback: localStorage structure
        const localStruct = localStorage.getItem("seo-checklist-structure");
        if (localStruct) {
          try { resolvedStructure = JSON.parse(localStruct); } catch {}
        }
      }

      if (stateData && stateData.length > 0) {
        resolvedState = stateData;
      } else if (stateError) {
        // Fallback: localStorage state
        const local = localStorage.getItem("seo-checklist-local");
        if (local) {
          try { resolvedState = JSON.parse(local); } catch {}
        }
      }

      setStructure(resolvedStructure);
      const fresh = buildTasksFromStructure(resolvedStructure);
      setTasks(fresh.map((f) => {
        const s = resolvedState.find((r) => r.id === f.id);
        if (!s) return f;
        return {
          ...f,
          completed: s.completed ?? false,
          status: s.status ?? "Da fare",
          totalSeconds: s.total_seconds ?? s.totalSeconds ?? 0,
          notes: s.notes ?? "",
          suspended: s.suspended ?? false,
        };
      }));

      setExpandedTasks((prev) => {
        const map = {};
        fresh.forEach((t) => { map[t.id] = prev[t.id] !== undefined ? prev[t.id] : true; });
        return map;
      });

      const dl = localStorage.getItem("seo-deadline-local");
      if (dl) setDeadline(dl);
      setSyncStatus(stateError ? "error" : "ok");
      setLoaded(true);
    }
    load();
  }, []);

  // ─── TIMER ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const iv = setInterval(() => {
      setTasks((p) => p.map((t) => t.timerRunning ? { ...t, sessionSeconds: t.sessionSeconds + 1 } : t));
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  // ─── DEADLINE ────────────────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem("seo-deadline-local", deadline);
  }, [deadline]);

  // ─── SAVE STATE ──────────────────────────────────────────────────────────────
  const saveTaskState = useCallback(async (taskId, updates, allTasks) => {
    const task = (allTasks || tasks).find((t) => t.id === taskId);
    if (!task) return;
    const merged = { ...task, ...updates };
    const row = {
      id: merged.id,
      completed: merged.completed,
      status: merged.status,
      total_seconds: merged.totalSeconds + merged.sessionSeconds,
      notes: merged.notes,
      suspended: merged.suspended,
    };
    setSyncStatus("syncing");
    const { error } = await supabase.from("checklist_tasks").upsert(row);
    setSyncStatus(error ? "error" : "ok");
    // always backup locally
    const next = (allTasks || tasks).map((t) => t.id === taskId ? { ...t, ...updates } : t);
    localStorage.setItem("seo-checklist-local", JSON.stringify(
      next.map((t) => ({ id: t.id, completed: t.completed, status: t.status, totalSeconds: t.totalSeconds + t.sessionSeconds, notes: t.notes, suspended: t.suspended }))
    ));
  }, [tasks]);

  const updateAndSave = (id, updates) => {
    setTasks((prev) => {
      const next = prev.map((t) => t.id === id ? { ...t, ...updates } : t);
      saveTaskState(id, updates, next);
      return next;
    });
  };

  const toggleDone = (id) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === id);
      const newCompleted = !task.completed;
      const updates = { completed: newCompleted, status: newCompleted ? "Completato" : "Da fare" };
      const next = prev.map((t) => t.id === id ? { ...t, ...updates } : t);
      saveTaskState(id, updates, next);
      return next;
    });
  };

  const startTimer = (id) => updateAndSave(id, { timerRunning: true, status: "In corso" });
  const pauseTimer = (id) => {
    setTasks((prev) => {
      const t = prev.find((x) => x.id === id);
      const newTotal = t.totalSeconds + t.sessionSeconds;
      const next = prev.map((x) => x.id === id ? { ...x, timerRunning: false, totalSeconds: newTotal, sessionSeconds: 0 } : x);
      saveTaskState(id, { timerRunning: false, totalSeconds: newTotal, sessionSeconds: 0 }, next);
      return next;
    });
  };
  const stopTimer = pauseTimer;
  const resetTimer = (id) => {
    setTasks((prev) => {
      const next = prev.map((x) => x.id === id ? { ...x, timerRunning: false, totalSeconds: 0, sessionSeconds: 0 } : x);
      saveTaskState(id, { timerRunning: false, totalSeconds: 0, sessionSeconds: 0 }, next);
      return next;
    });
  };

  // ─── SAVE STRUCTURE ───────────────────────────────────────────────────────────
  const saveStructureToSupabase = async (newStructure) => {
    setSyncStatus("syncing");
    // Delete all existing structure rows
    await supabase.from("checklist_structure").delete().neq("id", "___never___");
    // Insert new rows
    const rows = [];
    newStructure.forEach((section, si) => {
      section.tasks.forEach((task, ti) => {
        rows.push({
          id: task.id,
          phase: section.phase,
          phase_index: si,
          task_index: ti,
          title: task.title,
          description: task.description,
          practical_guide: task.practicalGuide || "",
        });
      });
    });
    if (rows.length > 0) {
      const { error } = await supabase.from("checklist_structure").insert(rows);
      setSyncStatus(error ? "error" : "ok");
      if (error) console.error("Structure save error:", error);
    } else {
      setSyncStatus("ok");
    }
    // Always save locally too
    localStorage.setItem("seo-checklist-structure", JSON.stringify(newStructure));
  };

  // ─── EDIT MODE ACTIONS ────────────────────────────────────────────────────────
  const applyStructureChange = async (newStructure) => {
    // Merge task state into new structure
    const fresh = buildTasksFromStructure(newStructure);
    const merged = fresh.map((f) => {
      const existing = tasks.find((t) => t.id === f.id);
      return existing ? { ...f, ...existing, id: f.id, title: f.title, description: f.description, practicalGuide: f.practicalGuide } : f;
    });
    setStructure(newStructure);
    setTasks(merged);
    await saveStructureToSupabase(newStructure);
    // Auto-backup
    triggerBackupDownload(merged, newStructure);
    setBackupCount((c) => c + 1);
  };

  const handleSaveEditingTask = async () => {
    if (!editingTask) return;
    const newStructure = structure.map((section) => ({
      ...section,
      tasks: section.tasks.map((t) =>
        t.id === editingTask.id
          ? { ...t, title: editingTask.title, description: editingTask.description, practicalGuide: editingTask.practicalGuide }
          : t
      ),
    }));
    // Also update tasks state immediately for UI
    setTasks((prev) => prev.map((t) =>
      t.id === editingTask.id
        ? { ...t, title: editingTask.title, description: editingTask.description, practicalGuide: editingTask.practicalGuide }
        : t
    ));
    setEditingTask(null);
    await applyStructureChange(newStructure);
  };

  const handleAddTask = async (phaseIdx) => {
    const newId = `custom-${Date.now()}`;
    const newTask = {
      id: newId,
      title: "Nuovo task",
      description: "Descrizione del task...",
      practicalGuide: "Guida pratica...",
    };
    const newStructure = structure.map((section, si) =>
      si === phaseIdx
        ? { ...section, tasks: [...section.tasks, newTask] }
        : section
    );
    await applyStructureChange(newStructure);
    // Open it for editing immediately
    setEditingTask({ ...newTask });
    setExpandedTasks((p) => ({ ...p, [newId]: true }));
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Eliminare questo task?")) return;
    const newStructure = structure.map((section) => ({
      ...section,
      tasks: section.tasks.filter((t) => t.id !== taskId),
    }));
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    await applyStructureChange(newStructure);
  };

  const handleAddPhase = async () => {
    const newPhase = { phase: `NUOVA FASE ${structure.length + 1}`, tasks: [] };
    const newStructure = [...structure, newPhase];
    await applyStructureChange(newStructure);
  };

  const handleDeletePhase = async (phaseIdx) => {
    const section = structure[phaseIdx];
    if (!window.confirm(`Eliminare la fase "${section.phase}" e tutti i suoi task?`)) return;
    const newStructure = structure.filter((_, i) => i !== phaseIdx);
    setTasks((prev) => prev.filter((t) => t.phase !== section.phase));
    await applyStructureChange(newStructure);
  };

  const handleRenamePhase = async (phaseIdx, newName) => {
    const oldPhase = structure[phaseIdx].phase;
    const newStructure = structure.map((s, i) =>
      i === phaseIdx ? { ...s, phase: newName } : s
    );
    setTasks((prev) => prev.map((t) => t.phase === oldPhase ? { ...t, phase: newName } : t));
    setEditingPhase(null);
    await applyStructureChange(newStructure);
  };

  // ─── DRAG & DROP (ref-based, no re-render during drag) ───────────────────────
  const handleDragStart = (e, taskId, phaseIdx) => {
    dragRef.current = { taskId, phaseIdx };
    e.dataTransfer.effectAllowed = "move";
    // Store taskId in dataTransfer as fallback
    e.dataTransfer.setData("text/plain", taskId);
  };

  const handleDragOver = (e, overTaskId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    // Only update visual state if it changed (avoids unnecessary renders)
    setDragOverId((prev) => prev === overTaskId ? prev : overTaskId);
  };

  const handleDrop = async (e, overTaskId, phaseIdx) => {
    e.preventDefault();
    setDragOverId(null);
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag || drag.taskId === overTaskId) return;
    // Only allow reorder within the same phase
    if (drag.phaseIdx !== phaseIdx) return;
    const section = structure[phaseIdx];
    const taskIds = section.tasks.map((t) => t.id);
    const fromIdx = taskIds.indexOf(drag.taskId);
    const toIdx = taskIds.indexOf(overTaskId);
    if (fromIdx === -1 || toIdx === -1) return;
    const reordered = [...section.tasks];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    const newStructure = structure.map((s, i) =>
      i === phaseIdx ? { ...s, tasks: reordered } : s
    );
    await applyStructureChange(newStructure);
  };

  const handleDragEnd = () => {
    dragRef.current = null;
    setDragOverId(null);
  };

  // ─── BACKUP / IMPORT ─────────────────────────────────────────────────────────
  const handleManualBackup = () => {
    triggerBackupDownload(tasks, structure);
    setBackupCount((c) => c + 1);
  };

  const handleImport = async () => {
    setImportError("");
    try {
      const parsed = JSON.parse(importText);
      if (!parsed.structure || !Array.isArray(parsed.structure)) {
        setImportError("File non valido: manca il campo 'structure'.");
        return;
      }
      const newStructure = parsed.structure;
      const fresh = buildTasksFromStructure(newStructure);
      const stateMap = {};
      (parsed.taskState || []).forEach((s) => { stateMap[s.id] = s; });
      const merged = fresh.map((f) => {
        const s = stateMap[f.id];
        if (!s) return f;
        return { ...f, completed: s.completed ?? false, status: s.status ?? "Da fare", totalSeconds: s.totalSeconds ?? 0, notes: s.notes ?? "", suspended: s.suspended ?? false };
      });
      setStructure(newStructure);
      setTasks(merged);
      await saveStructureToSupabase(newStructure);
      localStorage.setItem("seo-checklist-local", JSON.stringify(
        merged.map((t) => ({ id: t.id, completed: t.completed, status: t.status, totalSeconds: t.totalSeconds, notes: t.notes, suspended: t.suspended }))
      ));
      setSyncStatus("ok");
      setShowImportModal(false);
      setImportText("");
    } catch (err) {
      setImportError("Errore nel parsing JSON: " + err.message);
    }
  };

  // ─── DERIVED STATE ────────────────────────────────────────────────────────────
  const phases = useMemo(() => structure.map((s) => s.phase), [structure]);

  const completedCount = useMemo(() => tasks.filter((t) => t.completed).length, [tasks]);
  const total = tasks.length;
  const progress = total ? Math.round((completedCount / total) * 100) : 0;
  const totalTime = tasks.reduce((a, t) => a + t.totalSeconds + t.sessionSeconds, 0);
  const suspended = tasks.filter((t) => t.suspended);
  const inProgress = tasks.filter((t) => t.status === "In corso");
  const daysLeft = deadline ? Math.ceil((new Date(deadline) - new Date()) / 86400000) : null;

  const grouped = useMemo(() =>
    structure.map((section, si) => ({
      ...section,
      colorIdx: si % PHASE_COLORS.length,
      items: tasks.filter((t) => t.phase === section.phase),
      phaseIdx: si,
    })), [structure, tasks]);

  const filteredGrouped = useMemo(() =>
    grouped.map((s) => ({
      ...s,
      items: s.items.filter((t) => {
        const q = search.toLowerCase();
        const match = !search ||
          t.title.toLowerCase().includes(q) ||
          (t.description || "").toLowerCase().includes(q) ||
          (t.practicalGuide || "").toLowerCase().includes(q);
        if (activeTab === "suspended") return match && t.suspended;
        if (activeTab === "inprogress") return match && t.status === "In corso";
        if (activeTab === "todo") return match && !t.completed;
        if (activeTab === "done") return match && t.completed;
        return match;
      }),
    })).filter((s) => s.items.length > 0 || (editMode && s.items.length === 0)),
    [grouped, search, activeTab, editMode]
  );

  const searchResultIds = useMemo(() => {
    if (!search) return [];
    return filteredGrouped.flatMap((s) => s.items.map((t) => t.id));
  }, [filteredGrouped, search]);

  useEffect(() => { setSearchResultIndex(0); }, [search]);
  const currentResultId = searchResultIds[searchResultIndex] ?? null;

  useEffect(() => {
    if (!currentResultId) return;
    const el = document.getElementById(`task-${currentResultId}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [currentResultId]);

  useEffect(() => {
    if (!currentResultId || !search) return;
    const task = tasks.find((t) => t.id === currentResultId);
    if (!task) return;
    setExpandedTasks((p) => ({ ...p, [currentResultId]: true }));
    if (task.practicalGuide && task.practicalGuide.toLowerCase().includes(search.toLowerCase())) {
      setExpandedGuides((p) => ({ ...p, [currentResultId]: true }));
    }
  }, [currentResultId, search]);

  const Highlight = useCallback(({ text }) => {
    if (!search || !text) return <>{text}</>;
    const q = search.toLowerCase();
    const parts = [];
    let last = 0;
    const str = text;
    const strLower = str.toLowerCase();
    let idx;
    while ((idx = strLower.indexOf(q, last)) !== -1) {
      if (idx > last) parts.push(<span key={`t${last}`}>{str.slice(last, idx)}</span>);
      parts.push(<mark key={`m${idx}`} style={{ background: "#fbbf24", color: "#000", borderRadius: 3, padding: "0 2px" }}>{str.slice(idx, idx + q.length)}</mark>);
      last = idx + q.length;
    }
    if (last < str.length) parts.push(<span key={`e${last}`}>{str.slice(last)}</span>);
    return <>{parts}</>;
  }, [search]);

  const SyncDot = () => {
    const map = {
      idle: ["#52525b", ""],
      syncing: ["#fbbf24", ""],
      ok: ["#34d399", "✓ Sincronizzato"],
      error: ["#ef4444", "⚠ Offline — dati salvati localmente"],
    };
    const [color, label] = map[syncStatus];
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: syncStatus === "ok" ? `0 0 6px ${color}` : "none" }} />
        {label && <span style={{ fontSize: 11, color }}>{label}</span>}
      </div>
    );
  };

  // ─── LOADING SCREEN ───────────────────────────────────────────────────────────
  if (!loaded) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0f", flexDirection: "column", gap: 16 }}>
        <div style={{ width: 40, height: 40, border: "3px solid #333", borderTop: "3px solid #a78bfa", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <p style={{ color: "#52525b", fontSize: 14 }}>Caricamento checklist...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ─── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        .task-card { transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .task-card:hover { transform: translateY(-1px); }
        .task-card.drag-over { border-color: #a78bfa !important; box-shadow: 0 0 0 2px rgba(167,139,250,0.3) !important; }
        .task-card.dragging { opacity: 0.4; }
        .timer-pulse { animation: tpulse 2s infinite; }
        @keyframes tpulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .pbar { transition: width 0.5s cubic-bezier(0.4,0,0.2,1); }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .edit-badge { animation: fadeIn 0.2s ease; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(1) opacity(0.4); }
        textarea, input, select { font-family: inherit; }
        .edit-input { background: rgba(167,139,250,0.08); border: 1px solid rgba(167,139,250,0.3); border-radius: 8px; padding: 7px 10px; font-size: 13px; color: #e4e4e7; outline: none; width: 100%; transition: border-color 0.15s; }
        .edit-input:focus { border-color: rgba(167,139,250,0.7); }
        .edit-textarea { background: rgba(167,139,250,0.08); border: 1px solid rgba(167,139,250,0.3); border-radius: 8px; padding: 9px 12px; font-size: 12px; color: #a1a1aa; outline: none; width: 100%; resize: vertical; line-height: 1.7; transition: border-color 0.15s; }
        .edit-textarea:focus { border-color: rgba(167,139,250,0.7); }
        .drag-handle { cursor: grab; color: #3f3f46; font-size: 14px; padding: 0 4px; user-select: none; }
        .drag-handle:hover { color: #a78bfa; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 16px; backdrop-filter: blur(4px); }
        .modal-box { background: #12121f; border: 1px solid rgba(167,139,250,0.2); border-radius: 20px; padding: 24px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; }
        .btn-edit { padding: 5px 10px; border-radius: 7px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.15s; border: 1px solid rgba(167,139,250,0.3); background: rgba(167,139,250,0.1); color: #c4b5fd; }
        .btn-edit:hover { background: rgba(167,139,250,0.2); }
        .btn-danger { padding: 5px 10px; border-radius: 7px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.15s; border: 1px solid rgba(239,68,68,0.3); background: rgba(239,68,68,0.1); color: #fca5a5; }
        .btn-danger:hover { background: rgba(239,68,68,0.2); }
        .btn-add { padding: 7px 14px; border-radius: 9px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s; border: 1px dashed rgba(52,211,153,0.3); background: rgba(52,211,153,0.05); color: #6ee7b7; width: 100%; }
        .btn-add:hover { background: rgba(52,211,153,0.12); border-color: rgba(52,211,153,0.5); }
      `}</style>

      {/* ── STICKY HEADER ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "#0d0d18", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "12px 16px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(1.3rem,4vw,1.8rem)", fontWeight: 800, letterSpacing: "-0.03em", margin: 0 }}>SEO Checklist</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                <span style={{ fontSize: 11, color: "#52525b" }}>WordPress · Elementor Pro · Rank Math</span>
                <SyncDot />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              {/* Edit Mode Toggle */}
              <button
                onClick={() => setEditMode((e) => !e)}
                title={editMode ? "Esci dalla modalità editing" : "Attiva modalità editing"}
                style={{
                  padding: "7px 14px", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer",
                  background: editMode ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.05)",
                  border: editMode ? "1px solid rgba(167,139,250,0.5)" : "1px solid rgba(255,255,255,0.1)",
                  color: editMode ? "#c4b5fd" : "#71717a",
                  display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
                  boxShadow: editMode ? "0 0 12px rgba(167,139,250,0.2)" : "none",
                }}>
                🔧 {editMode ? "Edit ON" : "Edit"}
              </button>

              {/* Backup button */}
              <button
                onClick={handleManualBackup}
                title="Scarica backup JSON"
                style={{
                  padding: "7px 12px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)", color: "#93c5fd",
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                💾 Backup
                {backupCount > 0 && <span style={{ fontSize: 10, background: "rgba(96,165,250,0.2)", borderRadius: 20, padding: "1px 6px" }}>{backupCount}</span>}
              </button>

              {/* Import */}
              <button
                onClick={() => setShowImportModal(true)}
                title="Importa da backup JSON"
                style={{
                  padding: "7px 12px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#71717a",
                }}>
                📥 Importa
              </button>

              {daysLeft !== null && (
                <div style={{ padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 600, background: daysLeft < 0 ? "rgba(239,68,68,0.15)" : daysLeft < 7 ? "rgba(251,191,36,0.15)" : "rgba(52,211,153,0.1)", border: `1px solid ${daysLeft < 0 ? "rgba(239,68,68,0.3)" : daysLeft < 7 ? "rgba(251,191,36,0.3)" : "rgba(52,211,153,0.2)"}`, color: daysLeft < 0 ? "#f87171" : daysLeft < 7 ? "#fbbf24" : "#34d399" }}>
                  {daysLeft < 0 ? `⚠️ Scaduto ${Math.abs(daysLeft)}g fa` : daysLeft === 0 ? "⚡ Scade oggi" : `📅 ${daysLeft}g rimasti`}
                </div>
              )}
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", padding: "6px 12px", borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontFamily: "Syne, sans-serif", fontSize: "1.1rem", fontWeight: 700 }}>{progress}%</div>
                <div style={{ fontSize: 10, color: "#52525b" }}>completato</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", padding: "6px 12px", borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontFamily: "Syne, sans-serif", fontSize: "1.1rem", fontWeight: 700 }}>{formatDuration(totalTime)}</div>
                <div style={{ fontSize: 10, color: "#52525b" }}>tempo totale</div>
              </div>
            </div>
          </div>

          {/* Edit mode banner */}
          {editMode && (
            <div className="edit-badge" style={{ marginTop: 8, padding: "8px 14px", borderRadius: 10, background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.25)", fontSize: 12, color: "#c4b5fd", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 700 }}>🔧 Modalità Editing attiva</span>
              <span style={{ color: "#71717a" }}>·</span>
              <span style={{ color: "#71717a" }}>✏️ modifica titoli e contenuti &nbsp;·&nbsp; ➕ aggiungi task &nbsp;·&nbsp; 🗑️ elimina &nbsp;·&nbsp; ↕️ trascina per riordinare</span>
              <span style={{ color: "#71717a" }}>·</span>
              <span style={{ color: "#6ee7b7", fontWeight: 600 }}>💾 ogni modifica salva su Supabase + backup locale automatico</span>
            </div>
          )}

          {/* Progress bar */}
          <div style={{ marginTop: 10, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <div className="pbar" style={{ height: "100%", borderRadius: 2, width: `${progress}%`, background: "linear-gradient(90deg,#6366f1,#a78bfa)" }} />
          </div>

          {/* Search + deadline */}
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 160, position: "relative", display: "flex", alignItems: "center" }}>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍  Cerca task, descrizione, guida..."
                style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "7px 12px", fontSize: 13, color: "#fff", outline: "none" }} />
              {search && (
                <button onClick={() => setSearch("")} style={{ position: "absolute", right: 8, background: "none", border: "none", color: "#52525b", cursor: "pointer", fontSize: 14, lineHeight: 1 }}>✕</button>
              )}
            </div>
            {search && searchResultIds.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "4px 8px" }}>
                <span style={{ fontSize: 11, color: "#a1a1aa", whiteSpace: "nowrap" }}>{searchResultIndex + 1}/{searchResultIds.length}</span>
                <button onClick={() => setSearchResultIndex((i) => (i - 1 + searchResultIds.length) % searchResultIds.length)} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 6, color: "#e4e4e7", cursor: "pointer", width: 24, height: 24, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>▲</button>
                <button onClick={() => setSearchResultIndex((i) => (i + 1) % searchResultIds.length)} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 6, color: "#e4e4e7", cursor: "pointer", width: 24, height: 24, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>▼</button>
              </div>
            )}
            {search && searchResultIds.length === 0 && (
              <div style={{ display: "flex", alignItems: "center", padding: "4px 10px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10 }}>
                <span style={{ fontSize: 11, color: "#f87171" }}>Nessun risultato</span>
              </div>
            )}
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "7px 10px", fontSize: 13, color: "#a1a1aa", outline: "none" }} />
          </div>

          {/* Tabs */}
          <div style={{ marginTop: 8, display: "flex", gap: 4, overflowX: "auto", paddingBottom: 2 }}>
            {[
              { key: "all", label: `Tutte (${total})` },
              { key: "todo", label: `Da fare (${tasks.filter((t) => !t.completed).length})` },
              { key: "inprogress", label: `In corso (${inProgress.length})` },
              { key: "suspended", label: `Sospese (${suspended.length})` },
              { key: "done", label: `Fatte (${completedCount})` },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                style={{ whiteSpace: "nowrap", padding: "4px 10px", borderRadius: 7, fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer", background: activeTab === key ? "rgba(255,255,255,0.1)" : "transparent", color: activeTab === key ? "#fff" : "#52525b", transition: "all 0.15s" }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Suspended quick links */}
      {suspended.length > 0 && activeTab !== "suspended" && (
        <div style={{ maxWidth: 860, margin: "12px auto 0", padding: "0 16px" }}>
          <div style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.2)", borderRadius: 12, padding: "8px 12px", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#fb923c" }}>⏸ Sospese:</span>
            {suspended.map((t) => (
              <button key={t.id} onClick={() => document.getElementById(`task-${t.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" })}
                style={{ background: "rgba(251,146,60,0.15)", border: "1px solid rgba(251,146,60,0.3)", borderRadius: 7, padding: "3px 8px", fontSize: 11, color: "#fdba74", cursor: "pointer" }}>
                {t.title.split("—")[0].trim()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "16px 16px 40px" }}>
        {filteredGrouped.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#3f3f46" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🔍</div>
            <p>Nessun task trovato</p>
          </div>
        )}

        {filteredGrouped.map((section) => {
          const c = PHASE_COLORS[section.colorIdx];
          const done = section.items.filter((t) => t.completed).length;
          const pct = section.items.length ? Math.round((done / section.items.length) * 100) : 0;

          return (
            <div key={section.phase} style={{ marginBottom: 20, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, overflow: "hidden" }}>
              {/* Section header */}
              <div style={{ background: `linear-gradient(90deg, ${c.accent}12 0%, transparent 100%)`, borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.accent, boxShadow: `0 0 8px ${c.accent}60`, flexShrink: 0 }} />
                  {editMode && editingPhase === section.phaseIdx ? (
                    <PhaseNameEditor
                      initialName={section.phase}
                      onSave={(name) => handleRenamePhase(section.phaseIdx, name)}
                      onCancel={() => setEditingPhase(null)}
                    />
                  ) : (
                    <h2
                      style={{ fontFamily: "Syne, sans-serif", fontSize: "0.95rem", fontWeight: 700, margin: 0, cursor: editMode ? "pointer" : "default" }}
                      onClick={() => editMode && setEditingPhase(section.phaseIdx)}
                      title={editMode ? "Clicca per rinominare la fase" : undefined}>
                      {section.phase}
                      {editMode && <span style={{ fontSize: 10, color: "#52525b", marginLeft: 6 }}>✏️</span>}
                    </h2>
                  )}
                  <span style={{ fontSize: 11, fontWeight: 600, background: c.badge, color: c.badgeText, padding: "2px 8px", borderRadius: 20 }}>{done}/{section.items.length}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {editMode && (
                    <button className="btn-danger" onClick={() => handleDeletePhase(section.phaseIdx)} title="Elimina fase">🗑️ Fase</button>
                  )}
                  <div style={{ width: 80, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                    <div className="pbar" style={{ height: "100%", borderRadius: 2, width: `${pct}%`, background: c.accent }} />
                  </div>
                  <span style={{ fontSize: 11, color: "#52525b" }}>{pct}%</span>
                </div>
              </div>

              {/* Tasks */}
              <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: 10 }}>
                {section.items.map((task) => {
                  const isExpanded = expandedTasks[task.id] !== false;
                  const isGuideOpen = expandedGuides[task.id];
                  const secs = task.totalSeconds + task.sessionSeconds;
                  const isDragging = dragRef.current?.taskId === task.id;
                  const isDragOver = dragOverId === task.id && dragRef.current?.taskId !== task.id;

                  return (
                    <div
                      id={`task-${task.id}`}
                      key={task.id}
                      className={`task-card${isDragging ? " dragging" : ""}${isDragOver && !isDragging ? " drag-over" : ""}`}
                      draggable={editMode}
                      onDragStart={editMode ? (e) => handleDragStart(e, task.id, section.phaseIdx) : undefined}
                      onDragOver={editMode ? (e) => handleDragOver(e, task.id) : undefined}
                      onDrop={editMode ? (e) => handleDrop(e, task.id, section.phaseIdx) : undefined}
                      onDragEnd={editMode ? handleDragEnd : undefined}
                      style={{
                        background: task.completed ? "rgba(52,211,153,0.04)" : task.suspended ? "rgba(251,146,60,0.06)" : "rgba(255,255,255,0.025)",
                        border: `1px solid ${currentResultId === task.id ? "#fbbf24" : task.completed ? "rgba(52,211,153,0.15)" : task.suspended ? "rgba(251,146,60,0.2)" : editMode ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.06)"}`,
                        borderRadius: 14,
                        boxShadow: currentResultId === task.id ? "0 0 0 2px rgba(251,191,36,0.25)" : "none",
                      }}>

                      {/* Task row */}
                      <div style={{ padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                        {/* Drag handle in edit mode */}
                        {editMode && (
                          <span className="drag-handle" title="Trascina per riordinare">⠿</span>
                        )}

                        {/* Checkbox */}
                        {!editMode && (
                          <button onClick={() => toggleDone(task.id)}
                            style={{ width: 22, height: 22, minWidth: 22, borderRadius: 6, border: task.completed ? "none" : "2px solid rgba(255,255,255,0.18)", background: task.completed ? "#34d399" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginTop: 1 }}>
                            {task.completed && <span style={{ color: "#000", fontSize: 12, fontWeight: 800 }}>✓</span>}
                          </button>
                        )}

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <span style={{ fontSize: "0.85rem", fontWeight: 600, textDecoration: task.completed ? "line-through" : "none", color: task.completed ? "#3f3f46" : "#e4e4e7" }}>
                              <Highlight text={task.title} />
                            </span>
                            {!editMode && (
                              <>
                                <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: { "Da fare": "rgba(255,255,255,0.06)", "In corso": "rgba(96,165,250,0.15)", "In pausa": "rgba(251,191,36,0.15)", "Completato": "rgba(52,211,153,0.15)" }[task.status], color: { "Da fare": "#71717a", "In corso": "#93c5fd", "In pausa": "#fcd34d", "Completato": "#6ee7b7" }[task.status] }}>{task.status}</span>
                                {task.suspended && <span style={{ fontSize: 10, fontWeight: 600, background: "rgba(251,146,60,0.15)", color: "#fdba74", padding: "2px 7px", borderRadius: 20 }}>⏸ Sospesa</span>}
                                {task.timerRunning && <span className="timer-pulse" style={{ fontSize: 10, fontWeight: 600, background: "rgba(96,165,250,0.15)", color: "#93c5fd", padding: "2px 7px", borderRadius: 20 }}>⏱ {formatDuration(secs)}</span>}
                                {secs > 0 && !task.timerRunning && <span style={{ fontSize: 10, color: "#3f3f46" }}>{formatDuration(secs)}</span>}
                              </>
                            )}
                          </div>
                        </div>

                        {/* Edit mode actions */}
                        {editMode ? (
                          <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                            <button className="btn-edit" onClick={() => setEditingTask({ id: task.id, title: task.title, description: task.description, practicalGuide: task.practicalGuide || "" })}>✏️ Modifica</button>
                            <button className="btn-danger" onClick={() => handleDeleteTask(task.id)}>🗑️</button>
                          </div>
                        ) : (
                          <button onClick={() => setExpandedTasks((p) => ({ ...p, [task.id]: !isExpanded }))}
                            style={{ fontSize: 16, color: "#52525b", background: "rgba(255,255,255,0.04)", border: "none", borderRadius: 6, width: 26, height: 26, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {isExpanded ? "−" : "+"}
                          </button>
                        )}
                      </div>

                      {/* Expanded (normal mode only) */}
                      {!editMode && isExpanded && (
                        <div style={{ padding: "0 14px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
                          <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "12px 14px" }}>
                            <p style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.7, whiteSpace: "pre-line", margin: 0 }}><Highlight text={task.description} /></p>
                          </div>
                          {task.practicalGuide && (
                            <div style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, overflow: "hidden" }}>
                              <button onClick={() => setExpandedGuides((p) => ({ ...p, [task.id]: !isGuideOpen }))}
                                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", color: "#d4d4d8", fontSize: 13, fontWeight: 600 }}>
                                <span>📋 Guida pratica passo passo</span>
                                <span style={{ color: "#52525b" }}>{isGuideOpen ? "▲" : "▼"}</span>
                              </button>
                              {isGuideOpen && (
                                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "10px 14px" }}>
                                  <p style={{ fontSize: 12, color: "#71717a", lineHeight: 1.7, whiteSpace: "pre-line", margin: 0 }}><Highlight text={task.practicalGuide} /></p>
                                </div>
                              )}
                            </div>
                          )}
                          {/* Timer */}
                          <div style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "10px 14px" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                              <div>
                                <div style={{ fontSize: 10, color: "#52525b", marginBottom: 2 }}>Cronometro</div>
                                <div style={{ fontFamily: "Syne, sans-serif", fontSize: "1.5rem", letterSpacing: "0.05em", color: task.timerRunning ? "#60a5fa" : "#e4e4e7" }}>{formatDuration(secs)}</div>
                              </div>
                              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                {[
                                  { l: "▶ Avvia", fn: () => startTimer(task.id), bg: "rgba(52,211,153,0.15)", c: "#6ee7b7", bo: "rgba(52,211,153,0.3)" },
                                  { l: "⏸ Pausa", fn: () => pauseTimer(task.id), bg: "rgba(251,191,36,0.15)", c: "#fcd34d", bo: "rgba(251,191,36,0.3)" },
                                  { l: "⏹ Stop", fn: () => stopTimer(task.id), bg: "rgba(251,113,133,0.15)", c: "#fda4af", bo: "rgba(251,113,133,0.3)" },
                                  { l: "↺", fn: () => resetTimer(task.id), bg: "rgba(255,255,255,0.05)", c: "#71717a", bo: "rgba(255,255,255,0.1)" },
                                ].map(({ l, fn, bg, c, bo }) => (
                                  <button key={l} onClick={fn} style={{ padding: "5px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600, border: `1px solid ${bo}`, background: bg, color: c, cursor: "pointer" }}>{l}</button>
                                ))}
                              </div>
                            </div>
                          </div>
                          {/* Status + Notes */}
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            <div>
                              <div style={{ fontSize: 10, color: "#52525b", marginBottom: 4 }}>Stato</div>
                              <select value={task.status} onChange={(e) => updateAndSave(task.id, { status: e.target.value })}
                                style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "7px 10px", fontSize: 12, color: "#d4d4d8", outline: "none" }}>
                                {["Da fare", "In corso", "In pausa", "Completato"].map((s) => <option key={s}>{s}</option>)}
                              </select>
                            </div>
                            <div>
                              <div style={{ fontSize: 10, color: "#52525b", marginBottom: 4 }}>Note operative</div>
                              <textarea value={task.notes} onChange={(e) => updateAndSave(task.id, { notes: e.target.value })}
                                placeholder="Aggiungi note..."
                                style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "7px 10px", fontSize: 12, color: "#d4d4d8", outline: "none", resize: "vertical", minHeight: 64, fontFamily: "inherit" }} />
                            </div>
                          </div>
                          <button onClick={() => updateAndSave(task.id, { suspended: !task.suspended })}
                            style={{ alignSelf: "flex-start", padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", background: task.suspended ? "rgba(251,146,60,0.2)" : "rgba(255,255,255,0.04)", border: `1px solid ${task.suspended ? "rgba(251,146,60,0.4)" : "rgba(255,255,255,0.08)"}`, color: task.suspended ? "#fb923c" : "#71717a" }}>
                            {task.suspended ? "⏸ Sospesa — clicca per riprendere" : "Sospendi task"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Add task button (edit mode) */}
                {editMode && (
                  <button className="btn-add" onClick={() => handleAddTask(section.phaseIdx)}>
                    ➕ Aggiungi task in "{section.phase}"
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Add phase (edit mode) */}
        {editMode && (
          <button
            onClick={handleAddPhase}
            style={{ width: "100%", padding: "14px", borderRadius: 16, fontSize: 13, fontWeight: 700, cursor: "pointer", background: "rgba(167,139,250,0.05)", border: "2px dashed rgba(167,139,250,0.25)", color: "#a78bfa", marginTop: 8 }}>
            ➕ Aggiungi nuova fase
          </button>
        )}
      </div>

      {/* ── EDIT TASK MODAL ── */}
      {editingTask && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setEditingTask(null)}>
          <div className="modal-box">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, margin: 0, fontSize: "1.1rem" }}>✏️ Modifica Task</h3>
              <button onClick={() => setEditingTask(null)} style={{ background: "none", border: "none", color: "#71717a", fontSize: 18, cursor: "pointer", lineHeight: 1 }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div style={{ fontSize: 11, color: "#71717a", marginBottom: 6, fontWeight: 600 }}>TITOLO</div>
                <input
                  className="edit-input"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask((t) => ({ ...t, title: e.target.value }))}
                  placeholder="Titolo del task..."
                />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#71717a", marginBottom: 6, fontWeight: 600 }}>DESCRIZIONE</div>
                <textarea
                  className="edit-textarea"
                  value={editingTask.description}
                  onChange={(e) => setEditingTask((t) => ({ ...t, description: e.target.value }))}
                  placeholder="Descrizione del task..."
                  style={{ minHeight: 120 }}
                />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#71717a", marginBottom: 6, fontWeight: 600 }}>GUIDA PRATICA</div>
                <textarea
                  className="edit-textarea"
                  value={editingTask.practicalGuide}
                  onChange={(e) => setEditingTask((t) => ({ ...t, practicalGuide: e.target.value }))}
                  placeholder="Guida passo passo..."
                  style={{ minHeight: 160 }}
                />
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
                <button onClick={() => setEditingTask(null)}
                  style={{ padding: "8px 18px", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#71717a" }}>
                  Annulla
                </button>
                <button onClick={handleSaveEditingTask}
                  style={{ padding: "8px 18px", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", background: "rgba(167,139,250,0.2)", border: "1px solid rgba(167,139,250,0.4)", color: "#c4b5fd" }}>
                  💾 Salva
                </button>
              </div>
              <div style={{ fontSize: 11, color: "#52525b", textAlign: "center", marginTop: 4 }}>
                Il salvataggio aggiornerà Supabase e scaricherà automaticamente un backup JSON
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── IMPORT MODAL ── */}
      {showImportModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowImportModal(false)}>
          <div className="modal-box">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, margin: 0, fontSize: "1.1rem" }}>📥 Importa da Backup</h3>
              <button onClick={() => setShowImportModal(false)} style={{ background: "none", border: "none", color: "#71717a", fontSize: 18, cursor: "pointer", lineHeight: 1 }}>✕</button>
            </div>
            <p style={{ fontSize: 13, color: "#71717a", marginBottom: 14 }}>
              Incolla il contenuto di un file JSON di backup. Questo sovrascriverà la struttura attuale ma manterrà lo stato dei task (completati, note, timer).
            </p>
            <textarea
              className="edit-textarea"
              value={importText}
              onChange={(e) => { setImportText(e.target.value); setImportError(""); }}
              placeholder='Incolla il JSON del backup qui...'
              style={{ minHeight: 200, fontFamily: "monospace", fontSize: 11 }}
            />
            {importError && <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", fontSize: 12, color: "#f87171" }}>{importError}</div>}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 14 }}>
              <button onClick={() => setShowImportModal(false)}
                style={{ padding: "8px 18px", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#71717a" }}>
                Annulla
              </button>
              <button onClick={handleImport}
                style={{ padding: "8px 18px", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", background: "rgba(96,165,250,0.2)", border: "1px solid rgba(96,165,250,0.4)", color: "#93c5fd" }}>
                📥 Importa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── INLINE PHASE NAME EDITOR ──────────────────────────────────────────────────
function PhaseNameEditor({ initialName, onSave, onCancel }) {
  const [val, setVal] = useState(initialName);
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); ref.current?.select(); }, []);
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", flex: 1 }}>
      <input
        ref={ref}
        className="edit-input"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") onSave(val); if (e.key === "Escape") onCancel(); }}
        style={{ flex: 1, fontSize: "0.95rem", fontWeight: 700, fontFamily: "Syne, sans-serif" }}
      />
      <button onClick={() => onSave(val)} style={{ padding: "4px 10px", borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: "pointer", background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)", color: "#6ee7b7" }}>✓</button>
      <button onClick={onCancel} style={{ padding: "4px 10px", borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: "pointer", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#71717a" }}>✕</button>
    </div>
  );
}
