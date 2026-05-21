import { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "./supabase.js";

function formatDuration(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

const checklistData = [{ phase: "FASE 0 — Pianificazione", tasks: [{ title: "0.1 — Definire l'architettura del sito", description: `Hai già concordato 3 keyword principali durante la vendita.\nLa struttura del sito sarà:\n/ → Home ottimizzata per la keyword principale più importante\n/servizi/ → Pagina servizi\n/keyword-2/ → Pagina SEO dedicata al secondo servizio\n/keyword-3/ → Pagina SEO dedicata al terzo servizio\n/chi-siamo/ → Chi siamo\n/contatti/ → Contatti\nLa Home sarà la pagina SEO principale del sito e sarà ottimizzata per il servizio/keyword più importante.\nLe altre 2 keyword avranno invece pagine SEO dedicate separate.\nOgni pagina SEO deve essere costruita per posizionarsi su una keyword specifica già concordata col cliente.\nGli URL vanno decisi subito prima della costruzione del sito. Non modificarli dopo l'indicizzazione.`, practicalGuide: `PASSO PASSO PRATICO:\n1. Apri Notion oppure crea un foglio Google Docs dedicato al progetto.\n2. Scrivi il nome del cliente e sotto crea la struttura delle pagine:\n• Home\n• Servizi\n• Pagina SEO keyword 2\n• Pagina SEO keyword 3\n• Chi siamo\n• Contatti\n3. Decidi subito gli URL finali.\nEsempio:\n/servizi/\n/videoispezioni-milano/\n/spurghi-milano/\n4. Associa ad ogni pagina:\n• keyword principale\n• CTA\n• obiettivo pagina\n5. NON iniziare Elementor o WordPress finché la struttura non è chiara.\n6. Controlla che:\n• gli URL siano corti\n• leggibili\n• senza caratteri strani\n• coerenti col servizio.` }, { title: "0.2 — Organizzare le keyword già concordate", description: `Le 3 keyword principali sono già state concordate durante la vendita.\nAdesso devi solo organizzare:\n• keyword principale della Home\n• keyword della seconda pagina SEO\n• keyword della terza pagina SEO\nPer ogni pagina annota:\n• keyword principale\n• keyword secondarie correlate\n• intento di ricerca\n• CTA principale\nL'obiettivo è costruire ogni pagina per un servizio specifico già venduto al cliente.` }, { title: "0.3 — Raccogliere tutti i materiali", description: `Prima di costruire:\n• testi definitivi (o bozze avanzate)\n• loghi in formato SVG o PNG trasparente\n• immagini già compresse e rinominate con keyword\n• numero di telefono\n• indirizzo\n• P.IVA\n• email professionale` }] }, { phase: "FASE 1 — Acquisto e configurazione iniziale", tasks: [{ title: "1.1 — Acquistare il dominio su Hostinger", description: `Registra il dominio direttamente su Hostinger così gestisci tutto da un pannello solo.\nScegli:\n• .it per business locale italiano\n• .com per brand più internazionale\nEvita:\n• domini troppo lunghi\n• trattini\n• numeri inutili\nSalva tutte le credenziali nel password manager.` }, { title: "1.2 — Acquistare il piano hosting", description: `Su Hostinger scegli almeno il piano Business (include LiteSpeed con cache object, CDN gratuita, backup giornalieri automatici e possibilità di creare il sito staging). Il piano Premium è sufficiente solo per siti piccoli senza staging.` }, { title: "1.3 — Attivare il dominio sul piano hosting", description: `Dall'hPanel di Hostinger, vai in Hosting → Gestisci → Domains e collega il dominio acquistato. Se dominio e hosting sono entrambi su Hostinger, i DNS si configurano automaticamente in pochi minuti.` }, { title: "1.4 — Attivare SSL", description: `Dall'hPanel vai in SSL → Gestisci e attiva il certificato SSL gratuito (Let's Encrypt) sul dominio. Attendere che lo stato diventi "Attivo" prima di installare WordPress.` }, { title: "1.5 — Installare WordPress", description: `Dall'hPanel vai in Siti Web → Aggiungi sito web e scegli WordPress.\nInserisci:\nNome sito\nEmail admin\nUsername admin (NON usare "admin" — scegli qualcosa di non ovvio)\nPassword forte (almeno 20 caratteri, generata da password manager)\nSalva username e password nel password manager.` }, { title: "1.6 — Forzare HTTPS da WordPress", description: `Vai su WordPress → Impostazioni → Generali e assicurati che entrambi gli indirizzi inizino con https://. Se non è già così, modificali e salva. Poi installa il plugin Really Simple SSL per gestire i redirect automatici da HTTP a HTTPS.` }, { title: "1.7 — Creare l'email professionale", description: `Dall'hPanel vai in Email → Gestisci e crea l'indirizzo (es. info@nomesito.it). Hostinger usa Titan Email: puoi accedere da webmail o configurare l'inoltro/accesso su Gmail. Crea almeno: info@, eventualmente noreply@ per i form.` }] }, { phase: "FASE 2 — Configurazione WordPress", tasks: [{ title: "2.1 — Accedere alla dashboard", description: `Vai su tuodominio.it/wp-admin e accedi. Prima cosa: controlla che la barra superiore mostri che sei su HTTPS.` }, { title: "2.2 — Pulizia iniziale", description: `Post → Elimina "Hello World"\nPagine → Elimina "Sample Page" e "Privacy Policy" di default (ne creerai una via Complianz)\nPlugin → Disattiva ed elimina tutto il preinstallato (Akismet, Hello Dolly, ecc.)\nAspetto → Temi → Elimina tutti i temi preinstallati. Ne installerai uno solo` }, { title: "2.3 — Impostare permalink", description: `Impostazioni → Permalink → seleziona "Nome articolo" → Salva. Fallo subito, prima di creare qualsiasi pagina.` }, { title: "2.4 — Impostare lingua, fuso orario e data", description: `Impostazioni → Generali:\nLingua: Italiano\nFuso orario: Europe/Rome\nFormato data: gg/mm/aaaa\nFormato ora: H:i` }, { title: "2.5 — Bloccare l'indicizzazione durante i lavori", description: `Impostazioni → Lettura → spunta "Scoraggia i motori di ricerca" → Salva. Da rimuovere solo al momento della pubblicazione.` }, { title: "2.6 — Hardening sicurezza base", description: `Vai in Utenti → Il tuo profilo e verifica che la email admin sia corretta\nVai in Impostazioni → Scrittura: rimuovi servizi di aggiornamento ping non necessari\nInstalla Limit Login Attempts Reloaded (gratuito): blocca i tentativi di brute force sul login\nOpzionale ma consigliato: installa WPS Hide Login per cambiare l'URL di accesso da /wp-admin a qualcosa di personalizzato (es. /accedi-admin)` }, { title: "2.7 — Disabilitare XML-RPC", description: `Installa il plugin "Disable XML-RPC".\nXML-RPC è un vettore di attacco comune e non serve per siti standard costruiti con Elementor Pro.` }] }, { phase: "FASE 3 — Tema e Plugin", tasks: [{ title: "3.1 — Installare Hello Elementor + template Envato Elements", description: `Aspetto → Temi → Aggiungi nuovo → cerca "Hello Elementor" → Installa e attiva.\nÈ il tema ufficiale Elementor: leggerissimo, zero stili propri, nessun conflitto.\nTu costruirai il sito usando Elementor Pro e importerai i kit/template grafici da Envato Elements.\nInstalla quindi anche il plugin Envato Elements:\nPlugin → Aggiungi nuovo → cerca "Envato Elements" → Installa → Attiva.\nCollega il tuo account Envato e importa i template/kits direttamente dentro Elementor.` }, { title: "3.2 — Importare template e kit da Envato Elements dentro Elementor", description: `Dopo aver installato il plugin Envato Elements:\nVai in Envato Elements → Kits Template\nCollega il tuo account Envato\nScegli un kit/template compatibile con Elementor\nClicca "Installa Kit"\nImporta:\n• Header\n• Footer\n• Homepage\n• Pagine interne\n• Popup (se presenti)\n⚠️ IMPORTANTISSIMO:\nQuando importi un kit da Envato NON lasciare il sito identico al template originale.\nDevi sempre:\n• cambiare colori con quelli del brand cliente\n• cambiare font\n• sostituire tutte le immagini stock\n• eliminare sezioni inutili\n• ottimizzare testi e struttura SEO\n• sistemare responsive mobile\nIl template serve SOLO come base grafica per velocizzare il lavoro.` }, { title: "3.3 — Installare Elementor Free", description: `Plugin → Aggiungi nuovo → cerca "Elementor" → Installa e attiva.\nElementor Free serve come base per Elementor Pro.` }, { title: "3.4 — Attivare Elementor Pro", description: `Plugin → Aggiungi nuovo → Carica plugin → carica il file ZIP di Elementor Pro → Attiva.\nVai poi in Elementor → Licenza e collega la licenza Elementor Pro.` }, { title: "3.5 — Configurare le impostazioni globali di Elementor", description: `Prima di costruire qualsiasi pagina, vai in Elementor → Impostazioni sito:\nGlobal Colors: imposta la palette colori del brand\nGlobal Fonts: imposta i font per titoli e corpo testo\nLayout: imposta la larghezza del contenuto (tipicamente 1140px o 1200px)` }, { title: "3.6 — Installare Rank Math SEO", description: `Plugin → Aggiungi nuovo → cerca "Rank Math SEO" → Installa e attiva.\nNelle impostazioni attiva:\nSchema markup (JSON-LD)\nBreadcrumbs\nSitemap XML\nAnalisi contenuto` }, { title: "3.7 — Installare LiteSpeed Cache", description: `Plugin → Aggiungi nuovo → cerca "LiteSpeed Cache" → Installa e attiva.\nConfigurazione consigliata:\nCache: attiva "Abilita Cache"\nCDN: attiva la CDN di Hostinger\nOttimizzazione pagina: attiva compressione CSS, JS, HTML\nMedia: attiva lazy load immagini, converti in WebP` }, { title: "3.8 — Installare Complianz GDPR", description: `Plugin → Aggiungi nuovo → cerca "Complianz GDPR" → Installa e attiva.\nSegui la configurazione guidata:\nInserisci dati aziendali\nDichiara i servizi che usi\nGenera Privacy Policy e Cookie Policy\nConfigura banner cookie secondo Garante italiano` }, { title: "3.9 — Configurare le pagine legali nel menu e footer", description: `Le pagine Privacy Policy e Cookie Policy generate da Complianz devono essere linkate nel footer.` }] }, { phase: "FASE 4 — Costruzione con Elementor Pro", tasks: [{ title: "4.1 — Creare header globale con Theme Builder", description: `Con Elementor Pro usi il Theme Builder per header, footer e template globali.\nVai in Elementor → Theme Builder → Aggiungi nuovo → Header.\nCostruisci con: logo, menu di navigazione, CTA.\nNella sezione "Condizioni di visualizzazione" seleziona "Intero sito". Pubblica.` }, { title: "4.2 — Creare footer globale con Theme Builder", description: `Vai in Elementor → Theme Builder → Aggiungi nuovo → Footer.\nIncludi: logo, link rapidi, contatti, Privacy Policy, Cookie Policy, P.IVA, copyright.\nAssegna a "Intero sito". Pubblica.` }, { title: "4.3 — Creare pagina 404 personalizzata", description: `Vai in Elementor → Theme Builder → Aggiungi nuovo → Pagina 404.\nUna 404 ben fatta ha: messaggio chiaro, barra di ricerca, link alle pagine principali.` }, { title: "4.4 — Creare le pagine principali", description: `Pagine → Aggiungi nuova per ogni pagina pianificata nella Fase 0.\nImposta subito lo slug URL definitivo.\nStruttura:\nHome, Pagina Servizi, Pagina SEO keyword 2, Pagina SEO keyword 3, Chi siamo, Contatti` }, { title: "4.5 — Costruire le pagine con Elementor Pro + Envato Elements", description: `Apri ogni pagina → "Modifica con Elementor".\nWorkflow:\n• Importa kit/template da Envato Elements\n• Personalizza colori e font con Global Styles\n• Adatta testi, immagini e sezioni al cliente\n• Ottimizza struttura SEO\n⚠️ Non lasciare mai testi placeholder o immagini stock.` }, { title: "4.6 — Usare il widget Form di Elementor Pro", description: `Non installare Contact Form 7. Elementor Pro include un widget Form nativo.\nConfigura:\nCampi: Nome, Email, Telefono, Messaggio\nAction dopo invio: email a info@\nIntegrazione Complianz: checkbox consenso privacy` }, { title: "4.7 — Impostare la homepage statica", description: `Impostazioni → Lettura → seleziona "Una pagina statica" → scegli la pagina Home. Salva.` }, { title: "4.8 — Impostare il menu di navigazione", description: `Aspetto → Menu → crea il menu principale con tutte le pagine nell'ordine corretto → assegna alla posizione "Menu principale".` }] }, { phase: "FASE 5 — Ottimizzazione SEO On-Page", tasks: [{ title: "5.1 — URL ottimizzati per ogni pagina", description: `Lo slug deve:\nContenere la keyword principale\nEssere breve (3-5 parole)\nUsare solo lettere minuscole e trattini\nEsempi: /posizionamento-google-milano/, /servizi-seo/, /chi-siamo/` }, { title: "5.2 — Struttura heading su ogni pagina", description: `H1: uno solo per pagina, contiene la keyword principale\nH2: sottosezioni (keyword secondarie)\nH3: sotto-punti degli H2\nIn Elementor controlla il "Tag HTML" del widget Titolo.` }, { title: "5.3 — Title SEO per ogni pagina (Rank Math)", description: `Formato: Keyword Principale | Nome Brand\nMassimo 60 caratteri\nUsa variabili: %title% | %sitename%` }, { title: "5.4 — Meta Description per ogni pagina", description: `Descrive cosa trova l'utente\nContiene la keyword principale\nInvito all'azione ("Scopri", "Contattaci")\nMassimo 155 caratteri` }, { title: "5.5 — Schema markup", description: `Home: schema Organization\nPagine servizio: schema Service\nPagina Contatti: schema LocalBusiness\nArticoli blog: schema Article` }, { title: "5.6 — Ottimizzazione immagini", description: `Rinomina il file con keyword prima di caricarlo\nComprimi su squoosh.app e converti in WebP\nCompila il campo alt text con descrizione keyword-rich` }, { title: "5.7 — Link interni", description: `Ogni pagina deve linkare almeno 2-3 altre pagine rilevanti.\nHome → Hub Servizi, Chi siamo, Contatti\nHub Servizi → ogni pagina servizio\nPagine servizio → linkano tra loro` }, { title: "5.8 — Breadcrumbs", description: `Rank Math genera il codice breadcrumbs.\nAggiungilo tramite widget Shortcode nelle pagine interne (non sulla Home).` }, { title: "5.9 — Verificare robots.txt", description: `Visita tuodominio.it/robots.txt\nIn Rank Math → Impostazioni Generali → Edit robots.txt\nAggiungi: Sitemap: https://tuodominio.it/sitemap_index.xml` }] }, { phase: "FASE 6 — Prima di Pubblicare", tasks: [{ title: "6.1 — Creare staging", description: `Prima di pubblicare fai sempre una copia staging.\nHostinger Business permette staging integrato.` }, { title: "6.2 — Test mobile completo", description: `Controlla da smartphone reale:\n• menu\n• CTA\n• form\n• spaziature\n• velocità\n• leggibilità\n⚠️ Non fidarti solo della preview Elementor.` }, { title: "6.3 — Test velocità PageSpeed", description: `Usa Google PageSpeed Insights.\nControlla LCP, CLS, INP.\nSe lento: comprimi immagini, riduci animazioni, ottimizza CSS/JS` }, { title: "6.4 — Controllo finale", description: `Verifica:\n• tutti i link\n• tutte le immagini\n• tutti i form\n• SEO base\n• responsive\n• privacy policy\n• cookie banner` }, { title: "6.5 — Configurare backup", description: `Assicurati che backup automatici siano attivi.\nFai anche un backup manuale completo.` }, { title: "6.6 — Rimuovere blocco indicizzazione", description: `Impostazioni → Lettura → togli "Scoraggia i motori di ricerca".` }, { title: "6.7 — Pubblicare sito", description: `Pubblica il sito solo quando tutto è realmente pronto.\nMai pubblicare "poi sistemiamo dopo".` }] }, { phase: "FASE 7 — Dopo la Pubblicazione", tasks: [{ title: "7.1 — Collegare Google Search Console", description: `Aggiungi il sito su Google Search Console e verifica proprietà tramite DNS o HTML tag.` }, { title: "7.2 — Inviare sitemap XML", description: `Invia la sitemap XML generata da Rank Math dentro Search Console.` }, { title: "7.3 — Configurare Google Analytics", description: `Installa GA4 rispettando GDPR tramite Complianz.` }, { title: "7.4 — Verificare tracciamenti", description: `Controlla che Analytics riceva dati reali.\nVerifica: visualizzazioni, eventi, conversioni` }, { title: "7.5 — Configurare Google Business Profile", description: `Ottimizza la scheda:\n• categoria corretta\n• descrizione\n• immagini\n• servizi\n• recensioni` }, { title: "7.6 — Richiedere recensioni", description: `Invia il link recensione ai clienti appena possibile.\nLe recensioni influenzano fortemente la Local SEO.` }, { title: "7.7 — Inserimento directory locali", description: `Inserisci azienda nelle directory locali con dati coerenti:\n• nome\n• indirizzo\n• telefono` }, { title: "7.8 — Monitor uptime", description: `Configura monitor uptime per notifiche se il sito va offline.` }, { title: "7.9 — Pianificazione contenuti blog", description: `Prepara un piano editoriale iniziale per aumentare traffico organico.` }] }, { phase: "MANUTENZIONE MENSILE", tasks: [{ title: "M.1 — Aggiornare WordPress", description: `Aggiorna:\n• core WordPress\n• plugin\n• tema\n⚠️ Prima fai backup.` }, { title: "M.2 — Controllare Search Console", description: `Verifica:\n• errori indicizzazione\n• pagine escluse\n• cali traffico\n• problemi mobile` }, { title: "M.3 — Analizzare Analytics", description: `Controlla andamento traffico e conversioni.` }, { title: "M.4 — Backup completi", description: `Verifica che i backup siano funzionanti.` }, { title: "M.5 — Verificare SSL", description: `Controlla che HTTPS sia valido e senza warning.` }, { title: "M.6 — Monitorare Core Web Vitals", description: `Controlla regolarmente performance e velocità del sito.` }] }];

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

function buildInitialTasks() {
  return checklistData.flatMap((section, si) =>
    section.tasks.map((task, ti) => ({
      id: `${si}-${ti}`,
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

export default function App() {
  const freshTasks = useMemo(() => buildInitialTasks(), []);
  const [tasks, setTasks] = useState(freshTasks);
  const [search, setSearch] = useState("");
  const [deadline, setDeadline] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [expandedTasks, setExpandedTasks] = useState(() =>
    Object.fromEntries(freshTasks.map((t) => [t.id, true]))
  );
  const [expandedGuides, setExpandedGuides] = useState({});
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState("idle"); // idle | syncing | ok | error
  const [loaded, setLoaded] = useState(false);

  // Load from Supabase on mount
  useEffect(() => {
    async function loadFromSupabase() {
      setSyncStatus("syncing");
      const { data, error } = await supabase.from("checklist_tasks").select("*");
      if (error) {
        console.error("Errore caricamento:", error);
        setSyncStatus("error");
        // fallback to localStorage
        const saved = localStorage.getItem("seo-checklist-local");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setTasks((prev) => prev.map((f) => {
              const s = parsed.find((t) => t.id === f.id);
              return s ? { ...f, completed: s.completed, status: s.status, totalSeconds: s.totalSeconds, notes: s.notes, suspended: s.suspended } : f;
            }));
          } catch {}
        }
        const dl = localStorage.getItem("seo-deadline-local");
        if (dl) setDeadline(dl);
        setLoaded(true);
        return;
      }
      if (data && data.length > 0) {
        setTasks((prev) => prev.map((f) => {
          const s = data.find((r) => r.id === f.id);
          return s ? { ...f, completed: s.completed, status: s.status, totalSeconds: s.total_seconds, notes: s.notes, suspended: s.suspended } : f;
        }));
      }
      const dl = localStorage.getItem("seo-deadline-local");
      if (dl) setDeadline(dl);
      setSyncStatus("ok");
      setLoaded(true);
    }
    loadFromSupabase();
  }, []);

  // Timer tick
  useEffect(() => {
    const iv = setInterval(() => {
      setTasks((p) => p.map((t) => t.timerRunning ? { ...t, sessionSeconds: t.sessionSeconds + 1 } : t));
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  // Save to Supabase + localStorage debounced
  const saveTask = useCallback(async (task) => {
    const row = {
      id: task.id,
      completed: task.completed,
      status: task.status,
      total_seconds: task.totalSeconds + task.sessionSeconds,
      notes: task.notes,
      suspended: task.suspended,
    };
    setSyncStatus("syncing");
    const { error } = await supabase.from("checklist_tasks").upsert(row);
    if (error) {
      console.error("Errore salvataggio:", error);
      setSyncStatus("error");
    } else {
      setSyncStatus("ok");
    }
    // always save locally too
    localStorage.setItem("seo-checklist-local", JSON.stringify(
      tasks.map((t) => ({ id: t.id, completed: t.completed, status: t.status, totalSeconds: t.totalSeconds, notes: t.notes, suspended: t.suspended }))
    ));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("seo-deadline-local", deadline);
  }, [deadline]);

  const updateAndSave = (id, updates) => {
    setTasks((prev) => {
      const next = prev.map((t) => t.id === id ? { ...t, ...updates } : t);
      const updated = next.find((t) => t.id === id);
      if (updated) {
        const row = { id: updated.id, completed: updated.completed, status: updated.status, total_seconds: updated.totalSeconds + updated.sessionSeconds, notes: updated.notes, suspended: updated.suspended };
        setSyncStatus("syncing");
        supabase.from("checklist_tasks").upsert(row).then(({ error }) => {
          setSyncStatus(error ? "error" : "ok");
        });
        localStorage.setItem("seo-checklist-local", JSON.stringify(
          next.map((t) => ({ id: t.id, completed: t.completed, status: t.status, totalSeconds: t.totalSeconds, notes: t.notes, suspended: t.suspended }))
        ));
      }
      return next;
    });
  };

  const toggleDone = (id) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === id);
      const newCompleted = !task.completed;
      const updates = { completed: newCompleted, status: newCompleted ? "Completato" : "Da fare" };
      const next = prev.map((t) => t.id === id ? { ...t, ...updates } : t);
      const updated = next.find((t) => t.id === id);
      const row = { id: updated.id, completed: updated.completed, status: updated.status, total_seconds: updated.totalSeconds, notes: updated.notes, suspended: updated.suspended };
      setSyncStatus("syncing");
      supabase.from("checklist_tasks").upsert(row).then(({ error }) => setSyncStatus(error ? "error" : "ok"));
      localStorage.setItem("seo-checklist-local", JSON.stringify(next.map((t) => ({ id: t.id, completed: t.completed, status: t.status, totalSeconds: t.totalSeconds, notes: t.notes, suspended: t.suspended }))));
      return next;
    });
  };

  const startTimer = (id) => updateAndSave(id, { timerRunning: true, status: "In corso" });
  const pauseTimer = (id) => {
    setTasks((prev) => {
      const t = prev.find((x) => x.id === id);
      const newTotal = t.totalSeconds + t.sessionSeconds;
      const next = prev.map((x) => x.id === id ? { ...x, timerRunning: false, totalSeconds: newTotal, sessionSeconds: 0 } : x);
      const updated = next.find((x) => x.id === id);
      supabase.from("checklist_tasks").upsert({ id: updated.id, completed: updated.completed, status: updated.status, total_seconds: newTotal, notes: updated.notes, suspended: updated.suspended }).then(({ error }) => setSyncStatus(error ? "error" : "ok"));
      return next;
    });
  };
  const stopTimer = pauseTimer;
  const resetTimer = (id) => {
    setTasks((prev) => {
      const next = prev.map((x) => x.id === id ? { ...x, timerRunning: false, totalSeconds: 0, sessionSeconds: 0 } : x);
      supabase.from("checklist_tasks").upsert({ id, completed: prev.find(x=>x.id===id).completed, status: prev.find(x=>x.id===id).status, total_seconds: 0, notes: prev.find(x=>x.id===id).notes, suspended: prev.find(x=>x.id===id).suspended });
      return next;
    });
  };

  const completedCount = useMemo(() => tasks.filter((t) => t.completed).length, [tasks]);
  const total = tasks.length;
  const progress = total ? Math.round((completedCount / total) * 100) : 0;
  const totalTime = tasks.reduce((a, t) => a + t.totalSeconds + t.sessionSeconds, 0);
  const suspended = tasks.filter((t) => t.suspended);
  const inProgress = tasks.filter((t) => t.status === "In corso");
  const daysLeft = deadline ? Math.ceil((new Date(deadline) - new Date()) / 86400000) : null;

  const grouped = useMemo(() =>
    checklistData.map((section, si) => ({
      ...section,
      colorIdx: si % PHASE_COLORS.length,
      items: tasks.filter((t) => t.phase === section.phase),
    })), [tasks]);

  const filteredGrouped = useMemo(() =>
    grouped.map((s) => ({
      ...s,
      items: s.items.filter((t) => {
        const q = t.title.toLowerCase().includes(search.toLowerCase());
        if (activeTab === "suspended") return q && t.suspended;
        if (activeTab === "inprogress") return q && t.status === "In corso";
        if (activeTab === "todo") return q && !t.completed;
        if (activeTab === "done") return q && t.completed;
        return q;
      }),
    })).filter((s) => s.items.length > 0),
    [grouped, search, activeTab]
  );

  const SyncDot = () => {
    const map = { idle: ["#52525b", ""], syncing: ["#fbbf24", ""], ok: ["#34d399", "✓ Sincronizzato"], error: ["#ef4444", "⚠ Offline — dati salvati localmente"] };
    const [color, label] = map[syncStatus];
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: syncStatus === "ok" ? `0 0 6px ${color}` : "none" }} />
        {label && <span style={{ fontSize: 11, color }}>{label}</span>}
      </div>
    );
  };

  if (!loaded) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0f", flexDirection: "column", gap: 16 }}>
        <div style={{ width: 40, height: 40, border: "3px solid #333", borderTop: "3px solid #a78bfa", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <p style={{ color: "#52525b", fontSize: 14 }}>Caricamento checklist...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        .task-card { transition: transform 0.15s ease; }
        .task-card:hover { transform: translateY(-1px); }
        .timer-pulse { animation: tpulse 2s infinite; }
        @keyframes tpulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .pbar { transition: width 0.5s cubic-bezier(0.4,0,0.2,1); }
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(1) opacity(0.4); }
      `}</style>

      {/* STICKY HEADER */}
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
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
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

          {/* Progress bar */}
          <div style={{ marginTop: 10, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <div className="pbar" style={{ height: "100%", borderRadius: 2, width: `${progress}%`, background: "linear-gradient(90deg,#6366f1,#a78bfa)" }} />
          </div>

          {/* Search + deadline */}
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍  Cerca task..."
              style={{ flex: 1, minWidth: 160, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "7px 12px", fontSize: 13, color: "#fff", outline: "none" }} />
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "7px 10px", fontSize: 13, color: "#a1a1aa", outline: "none" }} />
          </div>

          {/* Tabs */}
          <div style={{ marginTop: 8, display: "flex", gap: 4, overflowX: "auto", paddingBottom: 2 }}>
            {[
              { key: "all", label: `Tutte (${total})` },
              { key: "todo", label: `Da fare (${tasks.filter(t => !t.completed).length})` },
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

      {/* MAIN */}
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
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.accent, boxShadow: `0 0 8px ${c.accent}60` }} />
                  <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "0.95rem", fontWeight: 700, margin: 0 }}>{section.phase}</h2>
                  <span style={{ fontSize: 11, fontWeight: 600, background: c.badge, color: c.badgeText, padding: "2px 8px", borderRadius: 20 }}>{done}/{section.items.length}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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

                  return (
                    <div id={`task-${task.id}`} key={task.id} className="task-card"
                      style={{ background: task.completed ? "rgba(52,211,153,0.04)" : task.suspended ? "rgba(251,146,60,0.06)" : "rgba(255,255,255,0.025)", border: `1px solid ${task.completed ? "rgba(52,211,153,0.15)" : task.suspended ? "rgba(251,146,60,0.2)" : "rgba(255,255,255,0.06)"}`, borderRadius: 14 }}>

                      {/* Row */}
                      <div style={{ padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <button onClick={() => toggleDone(task.id)}
                          style={{ width: 22, height: 22, minWidth: 22, borderRadius: 6, border: task.completed ? "none" : "2px solid rgba(255,255,255,0.18)", background: task.completed ? "#34d399" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginTop: 1 }}>
                          {task.completed && <span style={{ color: "#000", fontSize: 12, fontWeight: 800 }}>✓</span>}
                        </button>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <span style={{ fontSize: "0.85rem", fontWeight: 600, textDecoration: task.completed ? "line-through" : "none", color: task.completed ? "#3f3f46" : "#e4e4e7" }}>{task.title}</span>
                            <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: { "Da fare": "rgba(255,255,255,0.06)", "In corso": "rgba(96,165,250,0.15)", "In pausa": "rgba(251,191,36,0.15)", "Completato": "rgba(52,211,153,0.15)" }[task.status], color: { "Da fare": "#71717a", "In corso": "#93c5fd", "In pausa": "#fcd34d", "Completato": "#6ee7b7" }[task.status] }}>{task.status}</span>
                            {task.suspended && <span style={{ fontSize: 10, fontWeight: 600, background: "rgba(251,146,60,0.15)", color: "#fdba74", padding: "2px 7px", borderRadius: 20 }}>⏸ Sospesa</span>}
                            {task.timerRunning && <span className="timer-pulse" style={{ fontSize: 10, fontWeight: 600, background: "rgba(96,165,250,0.15)", color: "#93c5fd", padding: "2px 7px", borderRadius: 20 }}>⏱ {formatDuration(secs)}</span>}
                            {secs > 0 && !task.timerRunning && <span style={{ fontSize: 10, color: "#3f3f46" }}>{formatDuration(secs)}</span>}
                          </div>
                        </div>

                        <button onClick={() => setExpandedTasks((p) => ({ ...p, [task.id]: !isExpanded }))}
                          style={{ fontSize: 16, color: "#52525b", background: "rgba(255,255,255,0.04)", border: "none", borderRadius: 6, width: 26, height: 26, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {isExpanded ? "−" : "+"}
                        </button>
                      </div>

                      {/* Expanded */}
                      {isExpanded && (
                        <div style={{ padding: "0 14px 14px", display: "flex", flexDirection: "column", gap: 10 }}>

                          {/* Description */}
                          <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "12px 14px" }}>
                            <p style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.7, whiteSpace: "pre-line", margin: 0 }}>{task.description}</p>
                          </div>

                          {/* Practical guide */}
                          {task.practicalGuide && (
                            <div style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, overflow: "hidden" }}>
                              <button onClick={() => setExpandedGuides((p) => ({ ...p, [task.id]: !isGuideOpen }))}
                                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", color: "#d4d4d8", fontSize: 13, fontWeight: 600 }}>
                                <span>📋 Guida pratica passo passo</span>
                                <span style={{ color: "#52525b" }}>{isGuideOpen ? "▲" : "▼"}</span>
                              </button>
                              {isGuideOpen && (
                                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "10px 14px" }}>
                                  <p style={{ fontSize: 12, color: "#71717a", lineHeight: 1.7, whiteSpace: "pre-line", margin: 0 }}>{task.practicalGuide}</p>
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

                          {/* Suspend */}
                          <button onClick={() => updateAndSave(task.id, { suspended: !task.suspended })}
                            style={{ alignSelf: "flex-start", padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", background: task.suspended ? "rgba(251,146,60,0.2)" : "rgba(255,255,255,0.04)", border: `1px solid ${task.suspended ? "rgba(251,146,60,0.4)" : "rgba(255,255,255,0.08)"}`, color: task.suspended ? "#fb923c" : "#71717a" }}>
                            {task.suspended ? "⏸ Sospesa — clicca per riprendere" : "Sospendi task"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
